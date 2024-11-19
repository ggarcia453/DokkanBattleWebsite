from urllib.request import urlopen, Request
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
def listprint(l):
    for i in l:
        print(i)

if __name__ == "__main__":
    website = "https://dokkan.wiki/links"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(website)

        # Parse with BeautifulSoup
        soup = BeautifulSoup(page.content(), 'html.parser')
        images = soup.find_all('div',class_="text")
        s = ""
        for img in images:
            s +=  img.get_text().strip() + "\n"
        with open("link_output.txt", "w") as f:
            f.write(s)

        browser.close()
