import sqlite3
import os
import sys
from config import Config

try:
    import pymysql
    import pymysql.cursors
    HAS_PYMYSQL = True
except ImportError:
    HAS_PYMYSQL = False

_use_mysql = False

def get_connection():
    global _use_mysql
    if Config.DB_TYPE == 'mysql' and HAS_PYMYSQL:
        try:
            conn = pymysql.connect(
                host=Config.MYSQL_HOST,
                port=Config.MYSQL_PORT,
                user=Config.MYSQL_USER,
                password=Config.MYSQL_PASSWORD,
                database=Config.MYSQL_DB,
                cursorclass=pymysql.cursors.DictCursor,
                autocommit=True
            )
            _use_mysql = True
            return conn
        except Exception as e:
            print(f"[Database] MySQL connection failed ({e}), falling back to SQLite.", file=sys.stderr)
            _use_mysql = False

    # Default to SQLite
    conn = sqlite3.connect(Config.SQLITE_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def is_mysql():
    return _use_mysql

def format_query(sql):
    """Adjusts placeholder ? to %s if currently using MySQL."""
    if is_mysql():
        return sql.replace('?', '%s')
    return sql

def query_all(query, params=()):
    conn = get_connection()
    try:
        sql = format_query(query)
        cursor = conn.cursor()
        cursor.execute(sql, params)
        rows = cursor.fetchall()
        if not is_mysql():
            # Convert SQLite Row objects to standard python dicts
            return [dict(row) for row in rows]
        return list(rows)
    finally:
        conn.close()

def query_one(query, params=()):
    conn = get_connection()
    try:
        sql = format_query(query)
        cursor = conn.cursor()
        cursor.execute(sql, params)
        row = cursor.fetchone()
        if row is None:
            return None
        if not is_mysql():
            return dict(row)
        return dict(row)
    finally:
        conn.close()

def execute_modify(query, params=()):
    """Executes INSERT, UPDATE, DELETE queries and returns lastrowid or affected rows."""
    conn = get_connection()
    try:
        sql = format_query(query)
        cursor = conn.cursor()
        cursor.execute(sql, params)
        if not is_mysql():
            conn.commit()
            last_id = cursor.lastrowid
            row_count = cursor.rowcount
        else:
            last_id = cursor.lastrowid
            row_count = cursor.rowcount
        return {'last_id': last_id, 'row_count': row_count}
    finally:
        conn.close()

def init_db():
    """Initializes the database schema if tables do not exist."""
    conn = get_connection()
    try:
        cursor = conn.cursor()
        if is_mysql():
            print("[Database] Initializing MySQL tables...")
            with open(os.path.join(os.path.dirname(__file__), 'mysql_schema.sql'), 'r', encoding='utf-8') as f:
                schema_sql = f.read()
            for statement in schema_sql.split(';'):
                stmt = statement.strip()
                if stmt:
                    cursor.execute(stmt)
            print("[Database] MySQL tables verified.")
        else:
            print(f"[Database] Initializing SQLite database at {Config.SQLITE_PATH}...")
            with open(os.path.join(os.path.dirname(__file__), 'schema.sql'), 'r', encoding='utf-8') as f:
                schema_sql = f.read()
            cursor.executescript(schema_sql)
            conn.commit()
            print("[Database] SQLite database verified.")
    except Exception as e:
        print(f"[Database Error during init_db]: {e}", file=sys.stderr)
    finally:
        conn.close()
