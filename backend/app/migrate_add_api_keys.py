"""
Migration script to add API key fields to Organization model
Run this once to update existing database
"""
from sqlalchemy import text
from app.database import engine, SessionLocal
import sys

def migrate():
    """Add API key and subdomain fields to organizations table"""
    db = SessionLocal()
    try:
        # Check if columns already exist
        inspector = engine.dialect.get_columns(engine, "organizations")
        existing_columns = [col['name'] for col in inspector]
        
        migrations = []
        
        if 'subdomain' not in existing_columns:
            migrations.append("ALTER TABLE organizations ADD COLUMN subdomain VARCHAR(255)")
            migrations.append("CREATE INDEX IF NOT EXISTS ix_organizations_subdomain ON organizations(subdomain)")
        
        if 'api_key' not in existing_columns:
            migrations.append("ALTER TABLE organizations ADD COLUMN api_key VARCHAR(255)")
            migrations.append("CREATE INDEX IF NOT EXISTS ix_organizations_api_key ON organizations(api_key)")
        
        if 'api_key_created_at' not in existing_columns:
            migrations.append("ALTER TABLE organizations ADD COLUMN api_key_created_at DATETIME")
        
        if 'is_active' not in existing_columns:
            migrations.append("ALTER TABLE organizations ADD COLUMN is_active BOOLEAN DEFAULT 1")
        
        if migrations:
            print("Running migrations...")
            for migration in migrations:
                try:
                    db.execute(text(migration))
                    print(f"✓ {migration}")
                except Exception as e:
                    print(f"✗ Error: {migration}")
                    print(f"  {str(e)}")
            
            db.commit()
            print("\nMigration completed successfully!")
        else:
            print("No migrations needed - all columns already exist.")
            
    except Exception as e:
        print(f"Migration failed: {str(e)}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    migrate()



