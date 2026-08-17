from flask import Blueprint, request, jsonify
from database import query_one, query_all, execute_modify
from auth_middleware import token_required
import datetime

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

VALID_STATUSES = ['pending', 'in_progress', 'completed']
VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent']

@tasks_bp.route('', methods=['GET'])
@token_required
def get_tasks(current_user):
    status = request.args.get('status', '').strip().lower()
    priority = request.args.get('priority', '').strip().lower()
    category_id = request.args.get('category_id')
    search = request.args.get('search', '').strip()
    sort_by = request.args.get('sort_by', 'created_at').strip().lower()
    order = request.args.get('order', 'desc').strip().lower()

    query = """
        SELECT 
            t.id, t.title, t.description, t.status, t.priority, t.due_date,
            t.created_at, t.updated_at, t.category_id,
            c.name as category_name, c.color as category_color,
            COUNT(s.id) as subtask_count,
            SUM(CASE WHEN s.completed = 1 THEN 1 ELSE 0 END) as completed_subtasks
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN subtasks s ON t.id = s.task_id
        WHERE t.user_id = ?
    """
    params = [current_user['id']]

    if status and status != 'all':
        query += " AND t.status = ?"
        params.append(status)

    if priority and priority != 'all':
        query += " AND t.priority = ?"
        params.append(priority)

    if category_id and category_id != 'all':
        try:
            query += " AND t.category_id = ?"
            params.append(int(category_id))
        except ValueError:
            pass

    if search:
        query += " AND (LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ?)"
        search_pattern = f"%{search.lower()}%"
        params.extend([search_pattern, search_pattern])

    query += " GROUP BY t.id"

    # Sorting
    valid_sorts = {
        'created_at': 't.created_at',
        'due_date': 't.due_date IS NULL, t.due_date',
        'priority': """
            CASE t.priority 
                WHEN 'urgent' THEN 1 
                WHEN 'high' THEN 2 
                WHEN 'medium' THEN 3 
                WHEN 'low' THEN 4 
                ELSE 5 
            END
        """,
        'title': 't.title',
        'status': 't.status'
    }
    sort_col = valid_sorts.get(sort_by, 't.created_at')
    sort_dir = 'ASC' if order == 'asc' else 'DESC'

    query += f" ORDER BY {sort_col} {sort_dir}"

    tasks = query_all(query, tuple(params))
    return jsonify({
        'success': True,
        'count': len(tasks),
        'tasks': tasks
    })

@tasks_bp.route('/<int:task_id>', methods=['GET'])
@token_required
def get_task(current_user, task_id):
    task = query_one(
        """
        SELECT 
            t.id, t.title, t.description, t.status, t.priority, t.due_date,
            t.created_at, t.updated_at, t.category_id,
            c.name as category_name, c.color as category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ? AND t.user_id = ?
        """,
        (task_id, current_user['id'])
    )

    if not task:
        return jsonify({'success': False, 'message': 'Task not found'}), 404

    subtasks = query_all("SELECT * FROM subtasks WHERE task_id = ? ORDER BY id ASC", (task_id,))
    task_dict = dict(task)
    task_dict['subtasks'] = subtasks

    return jsonify({
        'success': True,
        'task': task_dict
    })

@tasks_bp.route('', methods=['POST'])
@token_required
def create_task(current_user):
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    status = data.get('status', 'pending').strip().lower()
    priority = data.get('priority', 'medium').strip().lower()
    due_date = data.get('due_date') or None
    category_id = data.get('category_id') or None
    subtasks = data.get('subtasks', [])

    if not title:
        return jsonify({'success': False, 'message': 'Task title is required'}), 400

    if status not in VALID_STATUSES:
        status = 'pending'

    if priority not in VALID_PRIORITIES:
        priority = 'medium'

    if category_id:
        # Validate category ownership
        cat = query_one("SELECT id FROM categories WHERE id = ? AND user_id = ?", (category_id, current_user['id']))
        if not cat:
            category_id = None

    res = execute_modify(
        """
        INSERT INTO tasks (title, description, status, priority, due_date, user_id, category_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (title, description, status, priority, due_date, current_user['id'], category_id)
    )
    task_id = res['last_id']

    # Insert subtasks if provided
    if isinstance(subtasks, list):
        for st in subtasks:
            st_title = st.get('title', '').strip() if isinstance(st, dict) else str(st).strip()
            if st_title:
                execute_modify(
                    "INSERT INTO subtasks (title, completed, task_id) VALUES (?, 0, ?)",
                    (st_title, task_id)
                )

    # Fetch created task
    created = query_one(
        """
        SELECT 
            t.id, t.title, t.description, t.status, t.priority, t.due_date,
            t.created_at, t.updated_at, t.category_id,
            c.name as category_name, c.color as category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
        """,
        (task_id,)
    )
    created_dict = dict(created)
    created_dict['subtasks'] = query_all("SELECT * FROM subtasks WHERE task_id = ?", (task_id,))
    created_dict['subtask_count'] = len(created_dict['subtasks'])
    created_dict['completed_subtasks'] = 0

    return jsonify({
        'success': True,
        'message': 'Task created successfully',
        'task': created_dict
    }), 201

@tasks_bp.route('/<int:task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    existing = query_one("SELECT id FROM tasks WHERE id = ? AND user_id = ?", (task_id, current_user['id']))
    if not existing:
        return jsonify({'success': False, 'message': 'Task not found'}), 404

    data = request.get_json() or {}
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()
    status = data.get('status')
    priority = data.get('priority')
    due_date = data.get('due_date')
    category_id = data.get('category_id')

    updates = []
    params = []

    if title:
        updates.append("title = ?")
        params.append(title)

    if 'description' in data:
        updates.append("description = ?")
        params.append(description)

    if status and status in VALID_STATUSES:
        updates.append("status = ?")
        params.append(status)

    if priority and priority in VALID_PRIORITIES:
        updates.append("priority = ?")
        params.append(priority)

    if 'due_date' in data:
        updates.append("due_date = ?")
        params.append(due_date if due_date else None)

    if 'category_id' in data:
        if category_id:
            cat = query_one("SELECT id FROM categories WHERE id = ? AND user_id = ?", (category_id, current_user['id']))
            if cat:
                updates.append("category_id = ?")
                params.append(category_id)
            else:
                updates.append("category_id = ?")
                params.append(None)
        else:
            updates.append("category_id = ?")
            params.append(None)

    now_str = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    updates.append("updated_at = ?")
    params.append(now_str)

    params.append(task_id)
    execute_modify(f"UPDATE tasks SET {', '.join(updates)} WHERE id = ?", tuple(params))

    # Fetch updated
    updated = query_one(
        """
        SELECT 
            t.id, t.title, t.description, t.status, t.priority, t.due_date,
            t.created_at, t.updated_at, t.category_id,
            c.name as category_name, c.color as category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
        """,
        (task_id,)
    )
    updated_dict = dict(updated)
    updated_dict['subtasks'] = query_all("SELECT * FROM subtasks WHERE task_id = ?", (task_id,))
    updated_dict['subtask_count'] = len(updated_dict['subtasks'])
    updated_dict['completed_subtasks'] = sum(1 for s in updated_dict['subtasks'] if s['completed'] == 1)

    return jsonify({
        'success': True,
        'message': 'Task updated successfully',
        'task': updated_dict
    })

@tasks_bp.route('/<int:task_id>/status', methods=['PATCH'])
@token_required
def patch_task_status(current_user, task_id):
    existing = query_one("SELECT id FROM tasks WHERE id = ? AND user_id = ?", (task_id, current_user['id']))
    if not existing:
        return jsonify({'success': False, 'message': 'Task not found'}), 404

    data = request.get_json() or {}
    status = data.get('status', '').strip().lower()

    if status not in VALID_STATUSES:
        return jsonify({'success': False, 'message': f'Invalid status. Must be one of {VALID_STATUSES}'}), 400

    now_str = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    execute_modify(
        "UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?",
        (status, now_str, task_id)
    )

    return jsonify({
        'success': True,
        'message': f'Task moved to {status}',
        'task_id': task_id,
        'status': status
    })

@tasks_bp.route('/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    existing = query_one("SELECT id FROM tasks WHERE id = ? AND user_id = ?", (task_id, current_user['id']))
    if not existing:
        return jsonify({'success': False, 'message': 'Task not found'}), 404

    execute_modify("DELETE FROM subtasks WHERE task_id = ?", (task_id,))
    execute_modify("DELETE FROM tasks WHERE id = ?", (task_id,))

    return jsonify({
        'success': True,
        'message': 'Task deleted successfully'
    })
