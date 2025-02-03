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

def get_card(page, card_number:str)->dict:
    website = "https://dokkan.wiki" + card_number
    print(f"Getting card {website}")
    page.goto(website)
    page.wait_for_selector('h1')
    h1_text = page.query_selector("h1").inner_text() if page.query_selector("h1") else "No <h1> found"
    h3_text = page.query_selector("h3").inner_text() if page.query_selector("h3") else "No <h3> found"
    soup = BeautifulSoup(page.content(), 'html.parser')
    table_data = []
    table = soup.find('table')
    if table:
        # Loop through table rows and cells
        for row in table.find_all('tr'):
            cells = [cell.get_text(strip=True) for cell in row.find_all(['th', 'td'])]
            table_data.append(cells)
    else:
        table_data = "No table found"
    div = soup.find('div', class_='card-body px-0 px-sm-2')
    if div:
        content = set(filter(lambda x: x != "", div.get_text(strip=True).split("1")))
    images = soup.find_all('img', alt=True)
    categories = set()
    for img in images:
        if not img.findParent().get('class'):
            categories.add(img['alt'])
    stats = [e[-1] for e in table_data[1:]]
    return {
        "name": h1_text,
        "title": h3_text,
        "hp" : stats[0],
        "atk" : stats[1],
        "def" : stats[2],
        "links" : list(filter(lambda x : "ondition" not in str(x),list(content))),
        "categories": list(categories)
    }

if __name__ == "__main__":
    card_list = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        for i in range(1,42):
            card_list += get_page(page, i)
            page.close()
            page = browser.new_page()
            time.sleep(5)
        browser.close()
    print(card_list)
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for i in card_list:
            page = browser.new_page()
            results.append(get_card(page, i))
            time.sleep(5)
            page.close()
        browser.close()
    print(results)
    with open("card_output_2.json", "w") as f:
        json.dump(results, f, indent=4)
