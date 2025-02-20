import json
import psycopg2
import os
from dotenv import load_dotenv
import sys
load_dotenv()

# Database connection
conn = psycopg2.connect(
    dbname="dokkan",
    user=os.getenv("NAME"),
    password=os.getenv("PASSWORD"),
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

if __name__ == "__main__":
    file = sys.argv[1]
    cat_id = sys.argv[2]
    with open(file, 'r') as file:
        cards = json.load(file)
    for card in cards:
        print(card['title'], card['name'])
        cursor.execute("SELECT * FROM cards WHERE name = %s AND title = %s", (card['name'], card['title'],))
        db_cards = cursor.fetchall()
        for c in db_cards:
            id = c[0]
            cursor.execute("INSERT INTO CardCategories(card_id, category_id) VALUES(%s, %s) ON CONFLICT DO NOTHING", (id, cat_id,))
    conn.commit()
    cursor.close()
    conn.close()