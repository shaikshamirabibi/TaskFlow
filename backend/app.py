import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.categories import categories_bp
from routes.subtasks import subtasks_bp
from routes.analytics import analytics_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes (frontend dev server & production)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Initialize Database Schema
    with app.app_context():
        init_db()

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(tasks_bp)
    app.register_blueprint(categories_bp)
    app.register_blueprint(subtasks_bp)
    app.register_blueprint(analytics_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'TaskFlow API',
            'version': '1.0.0'
        })

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'message': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print(f"==================================================")
    print(f"  TaskFlow Backend Server running on port {port}")
    print(f"  API Health: http://localhost:{port}/api/health")
    print(f"==================================================")
    app.run(host='0.0.0.0', port=port, debug=True)
