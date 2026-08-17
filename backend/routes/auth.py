from flask import Blueprint, request, jsonify
from database import query_one, query_all, execute_modify
from auth_middleware import hash_password, check_password, generate_token, token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

DEFAULT_CATEGORIES = [
    ('Work', '#3b82f6'),
    ('Study', '#8b5cf6'),
    ('Personal', '#10b981'),
    ('Project', '#f59e0b'),
    ('Other', '#64748b')
]

def seed_default_categories(user_id):
    for cat_name, cat_color in DEFAULT_CATEGORIES:
        execute_modify(
            "INSERT INTO categories (name, color, user_id) VALUES (?, ?, ?)",
            (cat_name, cat_color, user_id)
        )

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Name, email, and password are required'}), 400

    if len(password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters long'}), 400

    # Check if user already exists
    existing = query_one("SELECT id FROM users WHERE email = ?", (email,))
    if existing:
        return jsonify({'success': False, 'message': 'An account with this email already exists'}), 409

    pwd_hash = hash_password(password)
    res = execute_modify(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        (name, email, pwd_hash)
    )
    user_id = res['last_id']

    # Seed initial categories for the user
    seed_default_categories(user_id)

    token = generate_token(user_id, email)
    user = {
        'id': user_id,
        'name': name,
        'email': email
    }

    return jsonify({
        'success': True,
        'message': 'Account created successfully',
        'token': token,
        'user': user
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Email and password are required'}), 400

    user_row = query_one(
        "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?",
        (email,)
    )

    if not user_row or not check_password(user_row['password_hash'], password):
        return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

    token = generate_token(user_row['id'], user_row['email'])
    user = {
        'id': user_row['id'],
        'name': user_row['name'],
        'email': user_row['email'],
        'created_at': str(user_row['created_at'])
    }

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'token': token,
        'user': user
    })

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    # Fetch task summary for profile
    stats = query_one(
        """
        SELECT 
            COUNT(*) as total_tasks,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
        FROM tasks 
        WHERE user_id = ?
        """,
        (current_user['id'],)
    )
    user_data = dict(current_user)
    user_data['total_tasks'] = stats['total_tasks'] if stats else 0
    user_data['completed_tasks'] = stats['completed_tasks'] if stats and stats['completed_tasks'] else 0
    
    return jsonify({
        'success': True,
        'user': user_data
    })

@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    name = data.get('name', '').strip()

    if not name:
        return jsonify({'success': False, 'message': 'Name cannot be empty'}), 400

    execute_modify("UPDATE users SET name = ? WHERE id = ?", (name, current_user['id']))

    return jsonify({
        'success': True,
        'message': 'Profile updated successfully',
        'user': {
            'id': current_user['id'],
            'name': name,
            'email': current_user['email']
        }
    })

@auth_bp.route('/password', methods=['PUT'])
@token_required
def change_password(current_user):
    data = request.get_json() or {}
    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')

    if not current_password or not new_password:
        return jsonify({'success': False, 'message': 'Both current and new password are required'}), 400

    if len(new_password) < 6:
        return jsonify({'success': False, 'message': 'New password must be at least 6 characters'}), 400

    user_row = query_one("SELECT password_hash FROM users WHERE id = ?", (current_user['id'],))
    if not check_password(user_row['password_hash'], current_password):
        return jsonify({'success': False, 'message': 'Current password is incorrect'}), 400

    new_hash = hash_password(new_password)
    execute_modify("UPDATE users SET password_hash = ? WHERE id = ?", (new_hash, current_user['id']))

    return jsonify({
        'success': True,
        'message': 'Password updated successfully'
    })
