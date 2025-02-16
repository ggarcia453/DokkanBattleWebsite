import time
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import re,json

def listprint(l):
    for j in l:
        print(j)

def dict_print(d):
    print(f"{d['h3']} - {d['h1']} - ", end = "")
    for x in d['stats'][1:]:
        print(x[-1], end = " ")
    print("-", end = " ")
    for x in d['links']:
        print(x, end = ", ")
    print("-", end= " ")
    for x in d['categories']:
        print(x, end = ", ")
    print()


def get_page(page, number:int )-> list:
    website = f"https://dokkan.wiki/cards#!(p:{number})"
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


def get_card(page, card_number: str) -> dict:
    try:
        website = "https://dokkan.wiki" + card_number
        print(f"Getting card {website}")
        page.goto(website, wait_until='networkidle')
        page.wait_for_selector('h1', timeout=15000)
        h1_text = page.query_selector("h1").inner_text() if page.query_selector("h1") else "No title found"
        h3_text = page.query_selector("h3").inner_text() if page.query_selector("h3") else "No subtitle found"
        soup = BeautifulSoup(page.content(), 'html.parser')
        table_data = []
        table = soup.find('table')
        if table:
            for row in table.find_all('tr'):
                cells = [cell.get_text(strip=True) for cell in row.find_all(['th', 'td'])]
                if cells:  # Only add non-empty rows
                    table_data.append(cells)
        div = soup.find('div', class_='card-body px-0 px-sm-2')
        content = set()
        if div:
            raw_text = div.get_text(strip=True)
            content = set(filter(lambda x: x.strip(), raw_text.split("1")))
        images = soup.find_all('img', alt=True)
        categories = set()
        for img in images:
            parent = img.findParent()
            if parent and not parent.get('class'):
                alt_text = img['alt'].strip()
                if alt_text:
                    categories.add(alt_text)
        stats = ["0", "0", "0"]  # Default values
        if len(table_data) > 1 and len(table_data[1]) >= 3:
            stats = table_data[1][-3:]
        return {
            "name": h1_text,
            "title": h3_text,
            "hp": stats[0],
            "atk": stats[1],
            "def": stats[2],
            "links": [link.strip() for link in list(content) if "ondition" not in link and link.strip()],
            "categories": sorted(list(categories))  # Sort for consistent output
        }

    except Exception as e:
        print(f"Error processing card {card_number}: {str(e)}")
        return {
            "name": "Error",
            "title": "Error",
            "hp": "0",
            "atk": "0",
            "def": "0",
            "links": [],
            "categories": [],
            "error": str(e)
        }

if __name__ == "__main__":
    card_list = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()
        for i in range(1,42):
            card_list += get_page(page, i)
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
            page.set_default_timeout(30000)
            results.append(get_card(page, i))
            time.sleep(5)
            page.close()
        browser.close()
    print(results)
    with open("card_output_2.json", "w") as f:
        json.dump(results, f, indent=4)
