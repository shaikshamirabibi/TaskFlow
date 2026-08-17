import os
import datetime

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'taskflow-super-secret-key-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'taskflow-jwt-secret-token-key-2026')
    JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))

    # Database Configuration
    DB_TYPE = os.environ.get('DB_TYPE', 'sqlite')  # 'mysql' or 'sqlite'
    
    # MySQL Settings
    MYSQL_HOST = os.environ.get('MYSQL_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('MYSQL_PORT', 3306))
    MYSQL_USER = os.environ.get('MYSQL_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', 'root')
    MYSQL_DB = os.environ.get('MYSQL_DB', 'taskflow')

    # SQLite Settings
    SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'taskflow.db')
