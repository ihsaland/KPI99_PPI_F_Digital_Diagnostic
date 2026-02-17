"""
Database initialization script to create all tables
"""
from app.database import engine, Base
from app import models

def init_database():
    """Create all database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
        return True
    except Exception as e:
        print(f"Error creating database tables: {e}")
        return False

if __name__ == "__main__":
    init_database()




