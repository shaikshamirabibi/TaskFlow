import datetime
from database import init_db, query_one, execute_modify
from auth_middleware import hash_password

def seed_database():
    init_db()
    print("[Seed] Seeding sample data...")

    demo_email = "demo@taskflow.dev"
    demo_name = "Alex Morgan"
    demo_pass = "password123"

    user = query_one("SELECT id FROM users WHERE email = ?", (demo_email,))
    if user:
        print(f"[Seed] Demo user {demo_email} already exists (ID: {user['id']}).")
        user_id = user['id']
    else:
        pwd_hash = hash_password(demo_pass)
        res = execute_modify(
            "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
            (demo_name, demo_email, pwd_hash)
        )
        user_id = res['last_id']
        print(f"[Seed] Created demo user {demo_email} (ID: {user_id}).")

    # Categories
    categories = [
        ('Work', '#3b82f6'),
        ('Study', '#8b5cf6'),
        ('Personal', '#10b981'),
        ('Project', '#f59e0b'),
        ('Other', '#64748b')
    ]
    
    cat_ids = {}
    for name, color in categories:
        existing_cat = query_one("SELECT id FROM categories WHERE user_id = ? AND name = ?", (user_id, name))
        if existing_cat:
            cat_ids[name] = existing_cat['id']
        else:
            c_res = execute_modify(
                "INSERT INTO categories (name, color, user_id) VALUES (?, ?, ?)",
                (name, color, user_id)
            )
            cat_ids[name] = c_res['last_id']

    # Sample Tasks
    today = datetime.date.today()
    
    sample_tasks = [
        {
            'title': 'Learn React & Component Architecture',
            'description': 'Master hooks (useState, useEffect, useContext), props, virtual DOM and custom state management patterns.',
            'status': 'in_progress',
            'priority': 'high',
            'due_date': (today + datetime.timedelta(days=7)).isoformat(),
            'category': 'Study',
            'subtasks': [
                ('Understand JSX and Virtual DOM', 1),
                ('Master useState & useEffect Hooks', 1),
                ('Implement Context API for state', 0),
                ('Build custom hooks for API calls', 0)
            ]
        },
        {
            'title': 'Build RESTful API with Flask & JWT',
            'description': 'Implement authentication, token verification, role checks, and database CRUD endpoints.',
            'status': 'completed',
            'priority': 'high',
            'due_date': (today - datetime.timedelta(days=2)).isoformat(),
            'category': 'Work',
            'subtasks': [
                ('Design relational database schema', 1),
                ('Implement password hashing with Werkzeug', 1),
                ('Configure JWT token generation and expiry', 1),
                ('Write unit & integration tests', 1)
            ]
        },
        {
            'title': 'MySQL Database Optimization & Indexes',
            'description': 'Practice writing normalized schemas, composite indexes, and query profiling using EXPLAIN.',
            'status': 'pending',
            'priority': 'medium',
            'due_date': (today + datetime.timedelta(days=12)).isoformat(),
            'category': 'Study',
            'subtasks': [
                ('Set up MySQL Workbench connection', 1),
                ('Write DDL scripts for tables', 1),
                ('Add foreign keys with cascade constraints', 0),
                ('Test query indexing performance', 0)
            ]
        },
        {
            'title': 'Design Responsive TaskFlow UI in Figma',
            'description': 'Create intuitive wireframes for Kanban board, task creation drawer, and real-time dashboard analytics.',
            'status': 'completed',
            'priority': 'medium',
            'due_date': (today - datetime.timedelta(days=5)).isoformat(),
            'category': 'Project',
            'subtasks': [
                ('Color palette and typography scale', 1),
                ('Kanban card drag/drop states', 1),
                ('Mobile responsive navigation drawer', 1)
            ]
        },
        {
            'title': 'Deploy TaskFlow Web Application',
            'description': 'Prepare production build, configure reverse proxy with Nginx / Gunicorn, and set up SSL certificates.',
            'status': 'pending',
            'priority': 'urgent',
            'due_date': (today + datetime.timedelta(days=3)).isoformat(),
            'category': 'Project',
            'subtasks': [
                ('Build optimized React bundle', 0),
                ('Configure environment variables (.env)', 0),
                ('Set up automated smoke tests', 0)
            ]
        },
        {
            'title': 'Weekly Workout & Health Routine',
            'description': 'Cardio and strength training sessions 4 times a week, tracking daily water intake and recovery.',
            'status': 'in_progress',
            'priority': 'low',
            'due_date': (today + datetime.timedelta(days=1)).isoformat(),
            'category': 'Personal',
            'subtasks': [
                ('Monday morning 5k run', 1),
                ('Wednesday gym upper body', 1),
                ('Friday core and endurance', 0)
            ]
        },
        {
            'title': 'Review Full-Stack Development Resume',
            'description': 'Update resume with TaskFlow project details, technical skills (React, Flask, MySQL, JWT), and GitHub links.',
            'status': 'pending',
            'priority': 'urgent',
            'due_date': (today + datetime.timedelta(days=4)).isoformat(),
            'category': 'Other',
            'subtasks': [
                ('Draft bullet points highlighting REST APIs', 0),
                ('Add live project demo link and repository', 0)
            ]
        }
    ]

    # Insert sample tasks if no tasks exist for the user
    existing_tasks = query_one("SELECT COUNT(*) as count FROM tasks WHERE user_id = ?", (user_id,))
    if existing_tasks and existing_tasks['count'] == 0:
        for t in sample_tasks:
            cat_id = cat_ids.get(t['category'])
            t_res = execute_modify(
                """
                INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (t['title'], t['description'], t['status'], t['priority'], t['due_date'], user_id, cat_id)
            )
            task_id = t_res['last_id']
            for st_title, st_completed in t['subtasks']:
                execute_modify(
                    "INSERT INTO subtasks (title, completed, task_id) VALUES (?, ?, ?)",
                    (st_title, st_completed, task_id)
                )
        print(f"[Seed] Added {len(sample_tasks)} realistic demo tasks with subtasks.")
    else:
        print(f"[Seed] User already has {existing_tasks['count']} tasks.")

    print("[Seed] Seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
