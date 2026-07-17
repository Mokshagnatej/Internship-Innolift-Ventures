import os
import sys

# Add the parent directory to Python path to import app modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import User

def init_db():
    app = create_app()
    with app.app_context():
        # Create all tables
        db.create_all()
        print("Database tables created successfully.")

        # Check if the admin user already exists
        admin = User.query.filter_by(email="admin@example.com").first()
        if not admin:
            print("Creating default admin user...")
            admin = User(email="admin@example.com", role="admin", status="active")
            admin.set_password("password123")
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully.")
        else:
            print("Admin user already exists.")

if __name__ == "__main__":
    init_db()
