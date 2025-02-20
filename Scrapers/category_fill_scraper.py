import time
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import re,json, sys

def get_page(page, cat_id, number:int) -> list:
    # Category 96 = Successors
    # Category 95 = EarthBred Fighters
    website = f"https://dokkan.wiki/categories/{cat_id}#!(p:{number})"
    print(f"Getting Page {website}")
    page.goto(website)
    page.wait_for_selector('img[alt]', timeout=10000)
    soup = BeautifulSoup(page.content(), 'html.parser')
    card_links = []
    pattern = re.compile(r"^/cards/\d+$")
    for link in soup.find_all('a', href=True):
        string = str(link['href'])
        if pattern.match(string):
            card_links.append(string)
    return card_links

def verify_card(page, card_number):
    while True:
        try:
            website = "https://dokkan.wiki" + card_number
            print(f"Getting card {website}")
            page.goto(website, wait_until='networkidle')
            page.wait_for_selector('h1', timeout=15000)
            h1_text = page.query_selector("h1").inner_text() if page.query_selector("h1") else "No title found"
            h3_text = page.query_selector("h3").inner_text() if page.query_selector("h3") else "No subtitle found"
            return {
                "name": h1_text,
                "title": h3_text,
            }
        except Exception as e:
            print(f"Error processing card {card_number}: {str(e)}")
        time.sleep(60)

if __name__ == "__main__":
    cat_id = sys.argv[1]
    card_list = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()
        for i in range(1,5):
            card_list += get_page(page,cat_id, i)
            page.close()
            page = context.new_page()
            time.sleep(5)
        browser.close()
    print(card_list)
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        for i in card_list:
            page = context.new_page()
            page.set_default_timeout(60000)
            results.append(verify_card(page, i))
            page.close()
        browser.close()
    with open("card_output_5.json", "w") as f:
        json.dump(results, f, indent=4)