import os
from playwright.sync_api import sync_playwright

def get_api_key():
    if os.path.exists('.env'):
        with open('.env') as f:
            for line in f:
                if line.startswith('VITE_GROQ_API_KEY='):
                    return line.strip().split('=', 1)[1]
    return os.environ.get('VITE_GROQ_API_KEY', '')

def test_browser_groq_cors():
    api_key = get_api_key()
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:3000')
        page.wait_for_timeout(2000)

        cors_result = page.evaluate("""
        async (key) => {
            try {
                const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'qwen/qwen3.8-27b',
                        messages: [{ role: 'user', content: 'hi' }],
                        max_tokens: 10
                    })
                });
                const data = await res.json();
                return { ok: res.ok, status: res.status, data };
            } catch (err) {
                return { error: err.toString(), message: err.message };
            }
        }
        """, api_key)
        print("Browser Fetch Result:", cors_result)
        browser.close()

if __name__ == '__main__':
    test_browser_groq_cors()
