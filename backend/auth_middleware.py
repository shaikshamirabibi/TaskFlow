import jwt
import datetime
from functools import wraps
from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from config import Config
from database import query_one

def hash_password(password: str) -> str:
    return generate_password_hash(password)

def check_password(password_hash: str, password: str) -> bool:
    return check_password_hash(password_hash, password)

def generate_token(user_id: int, email: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=Config.JWT_EXPIRATION_HOURS),
        'iat': datetime.datetime.utcnow()
    }
    # Compatible with PyJWT 1.x and 2.x
    token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm='HS256')
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def decode_token(token: str):
    try:
        payload = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')

        if auth_header:
            parts = auth_header.split(' ')
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                token = parts[1]

        if not token:
            return jsonify({'success': False, 'message': 'Authentication token is missing'}), 401

        payload = decode_token(token)
        if not payload:
            return jsonify({'success': False, 'message': 'Token is invalid or has expired'}), 401

        current_user = query_one(
            "SELECT id, name, email, created_at FROM users WHERE id = ?",
            (payload['user_id'],)
        )

        if not current_user:
            return jsonify({'success': False, 'message': 'User associated with this token not found'}), 401

        return f(current_user, *args, **kwargs)
    return decorated
