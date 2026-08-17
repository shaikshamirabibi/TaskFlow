from flask import Blueprint, jsonify
from database import query_one, query_all
from auth_middleware import token_required
import datetime

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@analytics_bp.route('/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    user_id = current_user['id']
    today_str = datetime.date.today().isoformat()

    # High-level counters
    summary = query_one(
        """
        SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
            SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
            SUM(CASE WHEN due_date IS NOT NULL AND due_date < ? AND status != 'completed' THEN 1 ELSE 0 END) as overdue_tasks,
            SUM(CASE WHEN due_date = ? AND status != 'completed' THEN 1 ELSE 0 END) as due_today_tasks
        FROM tasks
        WHERE user_id = ?
        """,
        (today_str, today_str, user_id)
    )

    total = summary['total_tasks'] or 0
    completed = summary['completed_tasks'] or 0
    pending = summary['pending_tasks'] or 0
    in_progress = summary['in_progress_tasks'] or 0
    overdue = summary['overdue_tasks'] or 0
    due_today = summary['due_today_tasks'] or 0

    completion_rate = round((completed / total * 100), 1) if total > 0 else 0

    # Subtask stats
    subtask_stats = query_one(
        """
        SELECT 
            COUNT(s.id) as total_subtasks,
            SUM(CASE WHEN s.completed = 1 THEN 1 ELSE 0 END) as completed_subtasks
        FROM subtasks s
        JOIN tasks t ON s.task_id = t.id
        WHERE t.user_id = ?
        """,
        (user_id,)
    )

    # Breakdown by Priority
    priority_rows = query_all(
        """
        SELECT 
            priority,
            COUNT(*) as count,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM tasks
        WHERE user_id = ?
        GROUP BY priority
        """,
        (user_id,)
    )
    priority_map = {row['priority']: {'count': row['count'], 'completed': row['completed'] or 0} for row in priority_rows}
    priority_breakdown = {
        'urgent': priority_map.get('urgent', {'count': 0, 'completed': 0}),
        'high': priority_map.get('high', {'count': 0, 'completed': 0}),
        'medium': priority_map.get('medium', {'count': 0, 'completed': 0}),
        'low': priority_map.get('low', {'count': 0, 'completed': 0}),
    }

    # Breakdown by Category
    category_breakdown = query_all(
        """
        SELECT 
            c.id, c.name, c.color,
            COUNT(t.id) as total,
            SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed
        FROM categories c
        LEFT JOIN tasks t ON c.id = t.category_id AND t.user_id = c.user_id
        WHERE c.user_id = ?
        GROUP BY c.id
        ORDER BY total DESC
        """,
        (user_id,)
    )

    # Recent tasks (last 5)
    recent_tasks = query_all(
        """
        SELECT 
            t.id, t.title, t.status, t.priority, t.due_date, t.created_at,
            c.name as category_name, c.color as category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
        ORDER BY t.created_at DESC
        LIMIT 5
        """,
        (user_id,)
    )

    return jsonify({
        'success': True,
        'stats': {
            'total_tasks': total,
            'completed_tasks': completed,
            'pending_tasks': pending,
            'in_progress_tasks': in_progress,
            'overdue_tasks': overdue,
            'due_today_tasks': due_today,
            'completion_rate': completion_rate,
            'subtasks': {
                'total': subtask_stats['total_subtasks'] or 0,
                'completed': subtask_stats['completed_subtasks'] or 0
            },
            'priority_breakdown': priority_breakdown,
            'category_breakdown': category_breakdown,
            'recent_tasks': recent_tasks
        }
    })
