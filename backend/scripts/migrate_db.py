import sqlite3
import os

db_path = 'datatrustx.db'
if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
else:
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Add request_type
    try:
        c.execute("ALTER TABLE dataset_requests ADD COLUMN request_type TEXT DEFAULT 'text'")
        print("Added column request_type")
    except sqlite3.OperationalError as e:
        print(f"Column request_type likely exists: {e}")

    # Add reference_dataset_path
    try:
        c.execute("ALTER TABLE dataset_requests ADD COLUMN reference_dataset_path TEXT")
        print("Added column reference_dataset_path")
    except sqlite3.OperationalError as e:
        print(f"Column reference_dataset_path likely exists: {e}")

    # Add budget
    try:
        c.execute("ALTER TABLE dataset_requests ADD COLUMN budget TEXT")
        print("Added column budget")
    except sqlite3.OperationalError as e:
        print(f"Column budget likely exists: {e}")

    conn.commit()
    conn.close()
    print("Migration finished.")
