"""
Migration script to add industry column to Organization for PPI industry normalization.
Run once: python -m app.migrate_add_industry
"""
from sqlalchemy import text, inspect
from app.database import engine, SessionLocal


def migrate():
    """Add industry column to organizations table if missing."""
    db = SessionLocal()
    try:
        inspector = inspect(engine)
        existing_columns = [col["name"] for col in inspector.get_columns("organizations")]
        if "industry" not in existing_columns:
            db.execute(text("ALTER TABLE organizations ADD COLUMN industry VARCHAR(100)"))
            db.execute(text("CREATE INDEX IF NOT EXISTS ix_organizations_industry ON organizations(industry)"))
            db.commit()
            print("✓ Added industry column to organizations")
        else:
            print("Industry column already exists")
    except Exception as e:
        db.rollback()
        print(f"Migration error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    migrate()
