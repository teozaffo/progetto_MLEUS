import time
from playwright.sync_api import sync_playwright

def test_feedback():
  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    for i in range(12):
    
      page.goto("http://127.0.0.1:5000")
      
      
      page.click('button:has-text("Explainable")')
      
      page.click('button:has-text("Classify")')
      
      page.wait_for_selector(".result")
      
      page.locator('input[name="reliability"][value="3"]').nth(0).check()
      page.locator('input[name="usefulness"][value="3"]').nth(0).check()
      page.locator('input[name="influence"][value="3"]').nth(0).check()
      
      start = time.time()
      
      page.click('button:has-text("Send")')
      
      page.wait_for_selector("button.home-btn", state="visible")
      
      end = time.time()
      
      duration = (end - start) * 1000
      
      print(f"Tempo di feedback per richiesta {i + 1}: {duration:.2f} ms")
      
    browser.close()
    

if __name__ == "__main__":
  test_feedback()