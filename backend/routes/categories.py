from flask import Blueprint, request, jsonify
from database import query_one, query_all, execute_modify
from auth_middleware import token_required

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@categories_bp.route('', methods=['GET'])
@token_required
def get_categories(current_user):
    categories = query_all(
        """
        SELECT 
            c.id, c.name, c.color,
            COUNT(t.id) as task_count,
            SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_count
        FROM categories c
        LEFT JOIN tasks t ON c.id = t.category_id AND t.user_id = c.user_id
        WHERE c.user_id = ?
        GROUP BY c.id
        ORDER BY c.name ASC
        """,
        (current_user['id'],)
    )
    return jsonify({
        'success': True,
        'categories': categories
    })

@categories_bp.route('', methods=['POST'])
@token_required
def create_category(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    color = data.get('color', '#6366f1').strip()

    if not name:
        return jsonify({'success': False, 'message': 'Category name is required'}), 400

    existing = query_one(
        "SELECT id FROM categories WHERE user_id = ? AND LOWER(name) = LOWER(?)",
        (current_user['id'], name)
    )
    if existing:
        return jsonify({'success': False, 'message': 'A category with this name already exists'}), 409

    res = execute_modify(
        "INSERT INTO categories (name, color, user_id) VALUES (?, ?, ?)",
        (name, color, current_user['id'])
    )

    new_cat = query_one("SELECT * FROM categories WHERE id = ?", (res['last_id'],))
    new_cat_dict = dict(new_cat)
    new_cat_dict['task_count'] = 0
    new_cat_dict['completed_count'] = 0

    return jsonify({
        'success': True,
        'message': 'Category created successfully',
        'category': new_cat_dict
    }), 201

@categories_bp.route('/<int:cat_id>', methods=['PUT'])
@token_required
def update_category(current_user, cat_id):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    color = data.get('color', '').strip()

    existing = query_one("SELECT id FROM categories WHERE id = ? AND user_id = ?", (cat_id, current_user['id']))
    if not existing:
        return jsonify({'success': False, 'message': 'Category not found'}), 404

    updates = []
    params = []
    if name:
        updates.append("name = ?")
        params.append(name)
    if color:
        updates.append("color = ?")
        params.append(color)

    if not updates:
        return jsonify({'success': False, 'message': 'Nothing to update'}), 400

    params.append(cat_id)
    execute_modify(f"UPDATE categories SET {', '.join(updates)} WHERE id = ?", tuple(params))

    updated = query_one("SELECT * FROM categories WHERE id = ?", (cat_id,))
    return jsonify({
        'success': True,
        'message': 'Category updated successfully',
        'category': updated
    })

@categories_bp.route('/<int:cat_id>', methods=['DELETE'])
@token_required
def delete_category(current_user, cat_id):
    existing = query_one("SELECT id FROM categories WHERE id = ? AND user_id = ?", (cat_id, current_user['id']))
    if not existing:
        return jsonify({'success': False, 'message': 'Category not found'}), 404

    # Remove category reference from tasks
    execute_modify("UPDATE tasks SET category_id = NULL WHERE category_id = ? AND user_id = ?", (cat_id, current_user['id']))
    execute_modify("DELETE FROM categories WHERE id = ?", (cat_id,))

    return jsonify({
        'success': True,
        'message': 'Category deleted successfully'
    })
