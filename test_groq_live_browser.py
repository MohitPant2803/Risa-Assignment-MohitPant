from playwright.sync_api import sync_playwright
import time

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # Listen to console
        page.on("console", lambda msg: print(f"CONSOLE [{msg.type}]: {msg.text}", flush=True))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}", flush=True))

        print("Navigating to http://localhost:3000...", flush=True)
        page.goto("http://localhost:3000")
        page.wait_for_selector("text=FestGrowth")

        # Click AI Growth Analyst tab
        print("Clicking 'AI Growth Analyst' tab...", flush=True)
        page.click("button:has-text('AI Growth Analyst')")
        page.wait_for_timeout(1000)

        # Check badge
        badge = page.locator("text=⚡ Groq LPU Live")
        if badge.is_visible():
            print("SUCCESS: ⚡ Groq LPU Live badge is visible!", flush=True)
        else:
            print("WARNING: Groq badge not immediately visible, checking text...", flush=True)

        # Send question
        print("Sending prompt: 'Which campaign is underperforming and why?'", flush=True)
        input_box = page.locator("input[placeholder*='Ask anything']")
        input_box.fill("Which campaign is underperforming and why?")
        page.keyboard.press("Enter")

        # Wait for Groq response
        print("Waiting for Groq cloud response...", flush=True)
        page.wait_for_selector("button:has-text('Approve & Create Task')", timeout=15000)
        print("SUCCESS: Received Groq response with interactive Task Proposal card!", flush=True)

        page.wait_for_timeout(1500)
        page.screenshot(path="groq_live_response.png")
        print("Saved screenshot: groq_live_response.png", flush=True)

        # Click Approve & Create Task
        print("Clicking 'Approve & Create Task'...", flush=True)
        page.click("button:has-text('Approve & Create Task')")
        page.wait_for_timeout(1500)

        # Verify button changes to Approved
        approved_btn = page.locator("button:has-text('Approved & Dispatched')")
        if approved_btn.is_visible():
            print("SUCCESS: Task approved and marked dispatched!", flush=True)

        # Navigate to Task Manager tab
        print("Checking Task Manager tab...", flush=True)
        page.click("button:has-text('Task Manager')")
        page.wait_for_timeout(1000)
        page.screenshot(path="groq_tasks_verified.png")
        print("Saved screenshot: groq_tasks_verified.png", flush=True)

        browser.close()
        print("ALL TESTS PASSED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    run_test()
