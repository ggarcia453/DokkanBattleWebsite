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
    start = int(sys.argv[2])
    with open(file, 'r') as file:
        cards = json.load(file)
    for index, card in enumerate(cards, start=start):
        print(card['name'])
        for link in card['links']:
            cursor.execute("SELECT * FROM linkskills WHERE link_name = %s ", (link,))
            try:
                link_skill_id = cursor.fetchone()[0]
            except TypeError:
                print(link)
                #If type error occurs it is likely scripts picks up link that is not real
                continue
            cursor.execute(
                "INSERT INTO CardLinkSkills (card_id, link_skill_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (index, link_skill_id)
            )
        for category in card['categories']:
            cursor.execute("SELECT * FROM categories WHERE category_name Like %s ", (category,))
            try:
                category_id = cursor.fetchone()[0]
            except TypeError:
                # If type error occurs it is likely scripts picks up category that is not real
                print(category)
                continue
            cursor.execute(
                "INSERT INTO CardCategories (card_id, category_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                (index, category_id)
            )
    conn.commit()
    cursor.close()
    conn.close()