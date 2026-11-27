from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto('http://localhost:3000/')
    page.wait_for_timeout(1000)
    
    # Click AI tab
    page.locator('button', has_text='AI Growth Analyst').first.click()
    page.wait_for_timeout(500)
    
    # Type custom question 1: Compare Meera and Arjun
    input_box = page.locator('input[placeholder*="Ask anything"]').first
    input_box.fill('Compare the campaigns managed by Meera versus Arjun')
    page.locator('form button[type="submit"]').first.click()
    page.wait_for_timeout(1500)
    
    # Get last response text
    messages = page.locator('.max-w-2xl').all()
    print('--- AI Response 1: Compare Meera vs Arjun ---')
    if messages:
        print(messages[-1].inner_text())
    
    # Type custom question 2: What tasks are pending?
    input_box.fill('What tasks are currently pending?')
    page.locator('form button[type="submit"]').first.click()
    page.wait_for_timeout(1500)
    
    messages = page.locator('.max-w-2xl').all()
    print('\n--- AI Response 2: Tasks Pending ---')
    if messages:
        print(messages[-1].inner_text())

    # Type custom question 3: Uncertainty query
    input_box.fill('How many attendees will come from Mumbai next year?')
    page.locator('form button[type="submit"]').first.click()
    page.wait_for_timeout(1500)
    
    messages = page.locator('.max-w-2xl').all()
    print('\n--- AI Response 3: Uncertainty Query ---')
    if messages:
        print(messages[-1].inner_text())

    page.screenshot(path='ai_live_chat_verified.png')
    print('\nCaptured ai_live_chat_verified.png')

    browser.close()
