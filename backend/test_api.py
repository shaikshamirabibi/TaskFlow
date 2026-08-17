import json
import unittest
import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import get_connection, execute_modify, query_one
from seed import seed_database

class TaskFlowApiTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.client = self.app.test_client()

    def test_01_health_check(self):
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['status'], 'healthy')

    def test_02_register_and_login(self):
        # Register new user
        test_email = "testuser_unit@taskflow.dev"
        # Clean up if existed
        execute_modify("DELETE FROM users WHERE email = ?", (test_email,))

        reg_res = self.client.post('/api/auth/register', json={
            'name': 'Test Unit User',
            'email': test_email,
            'password': 'secretpassword'
        })
        self.assertEqual(reg_res.status_code, 201)
        reg_data = json.loads(reg_res.data)
        self.assertTrue(reg_data['success'])
        self.assertIn('token', reg_data)

        # Login with registered user
        login_res = self.client.post('/api/auth/login', json={
            'email': test_email,
            'password': 'secretpassword'
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = json.loads(login_res.data)
        self.assertTrue(login_data['success'])
        token = login_data['token']

        # Get profile with Bearer token
        headers = {'Authorization': f'Bearer {token}'}
        me_res = self.client.get('/api/auth/me', headers=headers)
        self.assertEqual(me_res.status_code, 200)
        me_data = json.loads(me_res.data)
        self.assertEqual(me_data['user']['email'], test_email)

    def test_03_task_and_subtask_lifecycle(self):
        # Login demo user
        seed_database()
        login_res = self.client.post('/api/auth/login', json={
            'email': 'demo@taskflow.dev',
            'password': 'password123'
        })
        token = json.loads(login_res.data)['token']
        headers = {'Authorization': f'Bearer {token}'}

        # 1. Fetch categories
        cat_res = self.client.get('/api/categories', headers=headers)
        self.assertEqual(cat_res.status_code, 200)
        categories = json.loads(cat_res.data)['categories']
        self.assertTrue(len(categories) > 0)
        work_cat_id = categories[0]['id']

        # 2. Create a new task
        create_task_res = self.client.post('/api/tasks', headers=headers, json={
            'title': 'Automated Integration Task',
            'description': 'Testing full task creation flow with subtasks',
            'status': 'pending',
            'priority': 'high',
            'due_date': '2026-08-25',
            'category_id': work_cat_id,
            'subtasks': [
                {'title': 'Step 1: Write code'},
                {'title': 'Step 2: Run tests'}
            ]
        })
        self.assertEqual(create_task_res.status_code, 201)
        created_task = json.loads(create_task_res.data)['task']
        task_id = created_task['id']
        self.assertEqual(created_task['title'], 'Automated Integration Task')
        self.assertEqual(len(created_task['subtasks']), 2)

        # 3. Add an extra subtask
        subtask_res = self.client.post(f'/api/tasks/{task_id}/subtasks', headers=headers, json={
            'title': 'Step 3: Deploy'
        })
        self.assertEqual(subtask_res.status_code, 201)
        subtask_id = json.loads(subtask_res.data)['subtask']['id']

        # 4. Toggle subtask
        toggle_res = self.client.patch(f'/api/subtasks/{subtask_id}/toggle', headers=headers)
        self.assertEqual(toggle_res.status_code, 200)
        toggled = json.loads(toggle_res.data)['subtask']
        self.assertEqual(toggled['completed'], 1)

        # 5. Patch task status to in_progress
        status_res = self.client.patch(f'/api/tasks/{task_id}/status', headers=headers, json={
            'status': 'in_progress'
        })
        self.assertEqual(status_res.status_code, 200)

        # 6. Fetch task details
        get_res = self.client.get(f'/api/tasks/{task_id}', headers=headers)
        self.assertEqual(get_res.status_code, 200)
        fetched = json.loads(get_res.data)['task']
        self.assertEqual(fetched['status'], 'in_progress')

        # 7. Check analytics stats
        stats_res = self.client.get('/api/analytics/stats', headers=headers)
        self.assertEqual(stats_res.status_code, 200)
        stats = json.loads(stats_res.data)['stats']
        self.assertTrue(stats['total_tasks'] > 0)

        # 8. Delete task
        del_res = self.client.delete(f'/api/tasks/{task_id}', headers=headers)
        self.assertEqual(del_res.status_code, 200)

        # Verify task is deleted
        get_deleted = self.client.get(f'/api/tasks/{task_id}', headers=headers)
        self.assertEqual(get_deleted.status_code, 404)

if __name__ == '__main__':
    unittest.main()
