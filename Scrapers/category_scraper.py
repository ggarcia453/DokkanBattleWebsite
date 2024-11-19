from urllib.request import urlopen, Request
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
def listprint(l):
    for i in l:
        print(i)

if __name__ == "__main__":
    website = "https://dokkan.wiki/categories"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(website)

        # Wait for images to load
        page.wait_for_selector('img[alt]', timeout=10000)  # Wait up to 10 seconds

        # Parse with BeautifulSoup
        soup = BeautifulSoup(page.content(), 'html.parser')
        images = soup.find_all('img', alt=True)
        s = ""
        for img in images:
            s +=  img['alt'].strip() + "\n"
        with open("category_output.txt", "w") as f:
            f.write(s)

        browser.close()
