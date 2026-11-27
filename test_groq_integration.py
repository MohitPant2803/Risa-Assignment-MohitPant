import os
import urllib.request
import json

def get_api_key():
    if os.path.exists('.env'):
        with open('.env') as f:
            for line in f:
                if line.startswith('VITE_GROQ_API_KEY='):
                    return line.strip().split('=', 1)[1]
    return os.environ.get('VITE_GROQ_API_KEY', '')

api_key = get_api_key()
url = 'https://api.groq.com/openai/v1/chat/completions'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

system_prompt = """You are the embedded AI Growth Analyst for FestGrowth, an APM command center managing DILLIVERSE 2027 in Delhi NCR (10,000 target).
Active campaigns:
- DIL-01: Campus Ambassador Guilds, Spend: ₹1,45,000, Registrations: 2,450, Attendees: 1,950, CPA: ₹74.36, Show-up: 79.6%
- DIL-04: Performance Retargeting, Spend: ₹1,30,000, Registrations: 1,250, Attendees: 810, CPA: ₹160.49, Show-up: 64.8%

Always format actionable task recommendations with:
<<<TASK_PROPOSAL
{
  "title": "Task title",
  "owner": "Owner name",
  "deadline": "2027-02-28",
  "priority": "High",
  "campaign_id": "DIL-01",
  "notes": "Action notes"
}
TASK_PROPOSAL>>>"""

for model in ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b']:
    print(f"\n--- Testing model: {model} ---")
    data = {
        'model': model,
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': 'Which campaign is underperforming and what actionable step should we take?'}
        ],
        'max_tokens': 500,
        'temperature': 0.2
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode('utf-8'))
            content = res['choices'][0]['message'].get('content', '')
            print(f"Success ({model}):")
            print(content)
    except Exception as e:
        print(f"Failed ({model}):", e)
