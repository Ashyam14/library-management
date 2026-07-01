import sqlite3

conn = sqlite3.connect("librarymanagement.db")
cursor = conn.cursor()

cursor.execute("ALTER TABLE Book_Management ADD COLUMN Description TEXT;")

conn.commit()
conn.close()