import json
import psycopg2
import os
from dotenv import load_dotenv
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
    with open(r'C:\Users\gg311\PycharmProjects\pythonProject6\Scrapers\card_output.json', 'r') as file:
        cards = json.load(file)
    for index, card in enumerate(cards, start=1):
        for link in card['links']:
            cursor.execute("SELECT * FROM linkskills WHERE link_name = %s ", (link,))
            link_skill_id = cursor.fetchone()[0]
            cursor.execute(
                "INSERT INTO CardLinkSkills (card_id, link_skill_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (index, link_skill_id)
            )
        for category in card['categories']:
            cursor.execute("SELECT * FROM categories WHERE category_name Like %s ", (category,))
            category_id = cursor.fetchone()[0]
            cursor.execute(
                "INSERT INTO CardCategories (card_id, category_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (index, category_id)
            )
    conn.commit()
    cursor.close()
    conn.close()