"""
Migration script to add notes, tags, and custom_fields columns to assessments table
"""
from app.database import engine
from sqlalchemy import text

def migrate_assessments_table():
    """Add missing columns to assessments table if they don't exist"""
    with engine.connect() as conn:
        try:
            # Check if notes column exists
            result = conn.execute(text("PRAGMA table_info(assessments)"))
            columns = [row[1] for row in result]
            
            if 'notes' not in columns:
                print("Adding 'notes' column to assessments table...")
                conn.execute(text("ALTER TABLE assessments ADD COLUMN notes TEXT"))
                conn.commit()
                print("✓ Added 'notes' column")
            else:
                print("✓ 'notes' column already exists")
            
            if 'tags' not in columns:
                print("Adding 'tags' column to assessments table...")
                conn.execute(text("ALTER TABLE assessments ADD COLUMN tags JSON"))
                conn.commit()
                print("✓ Added 'tags' column")
            else:
                print("✓ 'tags' column already exists")
            
            if 'custom_fields' not in columns:
                print("Adding 'custom_fields' column to assessments table...")
                conn.execute(text("ALTER TABLE assessments ADD COLUMN custom_fields JSON"))
                conn.commit()
                print("✓ Added 'custom_fields' column")
            else:
                print("✓ 'custom_fields' column already exists")
            
            print("\nMigration completed successfully!")
            return True
        except Exception as e:
            print(f"Error during migration: {e}")
            conn.rollback()
            return False

if __name__ == "__main__":
    migrate_assessments_table()


