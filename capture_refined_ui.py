from playwright.sync_api import sync_playwright

def capture_refined_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("Navigating to http://localhost:3000...")
        page.goto("http://localhost:3000")
        page.wait_for_timeout(1500)
        page.screenshot(path="refined_ui_dashboard.png")
        print("Captured: refined_ui_dashboard.png")

        print("Navigating to AI Growth Analyst...")
        page.click("button:has-text('AI Growth Analyst')")
        page.wait_for_timeout(1500)
        page.screenshot(path="refined_ui_ai_analyst.png")
        print("Captured: refined_ui_ai_analyst.png")

        browser.close()

if __name__ == "__main__":
    capture_refined_ui()
