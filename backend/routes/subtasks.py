from flask import Blueprint, request, jsonify
from database import query_one, query_all, execute_modify
from auth_middleware import token_required

subtasks_bp = Blueprint('subtasks', __name__, url_prefix='/api')

@subtasks_bp.route('/tasks/<int:task_id>/subtasks', methods=['GET'])
@token_required
def get_task_subtasks(current_user, task_id):
    # Verify task ownership
    task = query_one("SELECT id FROM tasks WHERE id = ? AND user_id = ?", (task_id, current_user['id']))
    if not task:
        return jsonify({'success': False, 'message': 'Task not found'}), 404

    subtasks = query_all("SELECT * FROM subtasks WHERE task_id = ? ORDER BY id ASC", (task_id,))
    return jsonify({
        'success': True,
        'subtasks': subtasks
    })

@subtasks_bp.route('/tasks/<int:task_id>/subtasks', methods=['POST'])
@token_required
def add_subtask(current_user, task_id):
    task = query_one("SELECT id FROM tasks WHERE id = ? AND user_id = ?", (task_id, current_user['id']))
    if not task:
        return jsonify({'success': False, 'message': 'Task not found'}), 404

    data = request.get_json() or {}
    title = data.get('title', '').strip()

    if not title:
        return jsonify({'success': False, 'message': 'Subtask title cannot be empty'}), 400

    res = execute_modify(
        "INSERT INTO subtasks (title, completed, task_id) VALUES (?, 0, ?)",
        (title, task_id)
    )

    new_subtask = query_one("SELECT * FROM subtasks WHERE id = ?", (res['last_id'],))
    return jsonify({
        'success': True,
        'message': 'Subtask added successfully',
        'subtask': new_subtask
    }), 201

@subtasks_bp.route('/subtasks/<int:subtask_id>/toggle', methods=['PATCH'])
@token_required
def toggle_subtask(current_user, subtask_id):
    # Check ownership through task join
    subtask = query_one(
        """
        SELECT s.id, s.completed, s.task_id 
        FROM subtasks s
        JOIN tasks t ON s.task_id = t.id
        WHERE s.id = ? AND t.user_id = ?
        """,
        (subtask_id, current_user['id'])
    )

    if not subtask:
        return jsonify({'success': False, 'message': 'Subtask not found'}), 404

    new_status = 0 if subtask['completed'] == 1 else 1
    execute_modify("UPDATE subtasks SET completed = ? WHERE id = ?", (new_status, subtask_id))

    updated = query_one("SELECT * FROM subtasks WHERE id = ?", (subtask_id,))
    return jsonify({
        'success': True,
        'message': 'Subtask status toggled',
        'subtask': updated
    })

@subtasks_bp.route('/subtasks/<int:subtask_id>', methods=['PUT'])
@token_required
def update_subtask(current_user, subtask_id):
    data = request.get_json() or {}
    title = data.get('title', '').strip()
    completed = data.get('completed')

    subtask = query_one(
        """
        SELECT s.id, s.task_id 
        FROM subtasks s
        JOIN tasks t ON s.task_id = t.id
        WHERE s.id = ? AND t.user_id = ?
        """,
        (subtask_id, current_user['id'])
    )

    if not subtask:
        return jsonify({'success': False, 'message': 'Subtask not found'}), 404

    updates = []
    params = []
    if title:
        updates.append("title = ?")
        params.append(title)
    if completed is not None:
        updates.append("completed = ?")
        params.append(1 if completed else 0)

    if updates:
        params.append(subtask_id)
        execute_modify(f"UPDATE subtasks SET {', '.join(updates)} WHERE id = ?", tuple(params))

    updated = query_one("SELECT * FROM subtasks WHERE id = ?", (subtask_id,))
    return jsonify({
        'success': True,
        'message': 'Subtask updated',
        'subtask': updated
    })

@subtasks_bp.route('/subtasks/<int:subtask_id>', methods=['DELETE'])
@token_required
def delete_subtask(current_user, subtask_id):
    subtask = query_one(
        """
        SELECT s.id 
        FROM subtasks s
        JOIN tasks t ON s.task_id = t.id
        WHERE s.id = ? AND t.user_id = ?
        """,
        (subtask_id, current_user['id'])
    )

    if not subtask:
        return jsonify({'success': False, 'message': 'Subtask not found'}), 404

    execute_modify("DELETE FROM subtasks WHERE id = ?", (subtask_id,))
    return jsonify({
        'success': True,
        'message': 'Subtask deleted successfully'
    })
