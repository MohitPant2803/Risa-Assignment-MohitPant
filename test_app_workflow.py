import os
import time
import subprocess
from playwright.sync_api import sync_playwright

def run_e2e_test():
    print("Starting static HTTP server for dist...")
    server = subprocess.Popen(["python", "-m", "http.server", "4173", "--directory", "dist"])
    time.sleep(1.5)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            
            print("Navigating to http://localhost:4173...")
            page.goto("http://localhost:4173", wait_until="networkidle")
            
            # 1. Capture Dashboard
            page.screenshot(path="app_screenshot_dashboard.png")
            print("Captured app_screenshot_dashboard.png")
            
            # 2. Check KPI text on page
            body_text = page.locator("body").inner_text()
            assert "FestGrowth" in body_text, "Brand not found"
            assert "Verified Attendees" in body_text, "Attendees card not found"
            print("Verified Dashboard KPI cards & Funnel!")

            # 3. Switch to Campaigns Tab
            page.locator("button", has_text="Campaigns").first.click()
            page.wait_for_timeout(500)
            page.screenshot(path="app_screenshot_campaigns.png")
            print("Captured app_screenshot_campaigns.png")

            # 4. Switch to Tasks Tab
            page.locator("button", has_text="Task Manager").first.click()
            page.wait_for_timeout(500)
            page.screenshot(path="app_screenshot_tasks.png")
            print("Captured app_screenshot_tasks.png")

            # 5. Switch to AI Growth Analyst Tab
            page.locator("button", has_text="AI Growth Analyst").first.click()
            page.wait_for_timeout(500)
            
            # Click quick prompt: "🔍 Which campaign is underperforming?"
            page.locator("button", has_text="Which campaign is underperforming?").first.click()
            page.wait_for_timeout(1000)
            
            # Verify AI responded
            chat_text = page.locator("body").inner_text()
            assert "Diagnosis of Underperformance" in chat_text or "Underperforming Channel" in chat_text, "AI response missing"
            print("Verified AI Underperformance Diagnosis!")

            # 6. Click Approve Task in chat
            approve_btn = page.locator("button", has_text="Approve & Create Task in Task Manager").first
            if approve_btn.is_visible():
                approve_btn.click()
                page.wait_for_timeout(1000)
                print("Clicked Approve & Create Task!")

            page.screenshot(path="app_screenshot_ai_approved.png")
            print("Captured app_screenshot_ai_approved.png")

            # 7. Check Task Manager to confirm task was added
            page.locator("button", has_text="Task Manager").first.click()
            page.wait_for_timeout(500)
            tasks_text = page.locator("body").inner_text()
            assert "AI Created" in tasks_text, "AI Created task not found in Task Manager!"
            print("Verified AI Created task persists in Task Manager!")
            page.screenshot(path="app_screenshot_task_added.png")

            # 8. Test Uncertainty Query
            page.locator("button", has_text="AI Growth Analyst").first.click()
            page.wait_for_timeout(500)
            page.locator("button", has_text="Test Uncertainty").first.click()
            page.wait_for_timeout(1000)
            chat_text_2 = page.locator("body").inner_text()
            assert "Data Limitation & Uncertainty Acknowledged" in chat_text_2, "Uncertainty refusal missing"
            print("Verified AI Uncertainty Handling!")
            page.screenshot(path="app_screenshot_ai_uncertainty.png")

            browser.close()
            print("\nALL 8 E2E TESTS PASSED SUCCESSFULLY!")
    finally:
        server.terminate()

if __name__ == "__main__":
    run_e2e_test()
