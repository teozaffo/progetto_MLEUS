import time
from playwright.sync_api import sync_playwright

def test_predizione():
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    for i in range(12):
    
      page.goto("http://127.0.0.1:5000")
      
      page.click('button:has-text("Explainable")')
      
      page.select_option('#Arteries', 'True')
      page.select_option('#DuctRetrodilation', 'True')
      page.select_option('#Lymphadenopathy', 'True')

      start = time.time()

      page.click('button:has-text("Classify")')
      
      page.wait_for_selector(".result")
      
      end = time.time()
      
      duration = (end - start) * 1000
      
      print(f"Tempo di predizione per richiesta {i + 1}: {duration:.2f} ms")
      
    browser.close()
    
    
if __name__ == "__main__":
  test_predizione()