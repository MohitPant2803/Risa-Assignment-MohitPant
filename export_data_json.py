import openpyxl
import json
from collections import defaultdict, Counter

wb = openpyxl.load_workbook('Attendee Dataset.xlsx', data_only=True)

# 1. Campaigns
camp_sheet = wb['Campaigns']
camps = {}
for row in list(camp_sheet.iter_rows(values_only=True))[1:]:
    if row[0]:
        camps[row[8]] = {
            'id': row[8],
            'name': row[0],
            'channel': row[1],
            'target_audience': row[2],
            'objective': row[3],
            'owner': row[4],
            'owner_id': row[9],
            'planned_start': str(row[6])[:10],
            'planned_end': str(row[7])[:10]
        }

# 2. Daily Marketing
dm_sheet = wb['Daily Marketing']
dm_rows = list(dm_sheet.iter_rows(values_only=True))[1:]
camp_dm = defaultdict(lambda: {'spend': 0.0, 'impressions': 0, 'clicks': 0, 'reach': 0, 'sessions': 0, 'starts': 0})
daily_trend = defaultdict(lambda: {'spend': 0.0, 'reach': 0, 'sessions': 0, 'starts': 0})

for r in dm_rows:
    if not r[0]: continue
    cid = r[11]
    spend = float(r[8] or 0)
    camp_dm[cid]['spend'] += spend
    camp_dm[cid]['impressions'] += int(r[3] or 0)
    camp_dm[cid]['clicks'] += int(r[4] or 0)
    camp_dm[cid]['reach'] += int(r[5] or 0)
    camp_dm[cid]['sessions'] += int(r[6] or 0)
    camp_dm[cid]['starts'] += int(r[7] or 0)
    
    dt = str(r[2])[:10]
    daily_trend[dt]['spend'] += spend
    daily_trend[dt]['reach'] += int(r[5] or 0)
    daily_trend[dt]['sessions'] += int(r[6] or 0)
    daily_trend[dt]['starts'] += int(r[7] or 0)

# 3. People
p_sheet = wb['People']
p_rows = list(p_sheet.iter_rows(values_only=True))[1:]
person_type = {r[6]: r[1] for r in p_rows if r[0]}
camp_people = Counter(r[7] for r in p_rows if r[0])

# 4. Registrations
reg_sheet = wb['Registrations']
reg_rows = list(reg_sheet.iter_rows(values_only=True))[1:]
valid_regs = [r for r in reg_rows if r[0]]
camp_regs = Counter(r[6] for r in valid_regs)

# Daily registrations
daily_regs = Counter(str(r[3])[:10] for r in valid_regs)
for dt, cnt in daily_regs.items():
    daily_trend[dt]['registrations'] = cnt

# 5. Check-ins
chk_sheet = wb['Check-ins']
chk_rows = list(chk_sheet.iter_rows(values_only=True))[1:]
verified_admitted = [r for r in chk_rows if r[0] and r[4] == 'admitted' and r[5] == 'verified']
camp_ext_attendees = defaultdict(set)
for r in verified_admitted:
    pid = r[8]
    cid = r[10]
    if person_type.get(pid) == 'external':
        camp_ext_attendees[cid].add(pid)

# Format Campaigns Data for App
app_campaigns = []
for cid in sorted(camps.keys()):
    c = camps[cid]
    dm = camp_dm[cid]
    regs = camp_regs[cid]
    attendees = len(camp_ext_attendees[cid])
    spend = dm['spend']
    cpr = round(spend / regs, 2) if regs else 0
    cpa = round(spend / attendees, 2) if attendees else 0
    show_up = round((attendees / regs * 100), 1) if regs else 0
    
    app_campaigns.append({
        'id': cid,
        'name': c['name'],
        'channel': c['channel'],
        'owner': c['owner'],
        'budget': 60000 if cid == 'C02' else (45000 if cid == 'C01' else 35000), # initial allocated
        'spend': spend,
        'target_registrations': 500 if cid in ['C01', 'C02', 'C04'] else 300,
        'target_attendees': 350 if cid in ['C01', 'C04'] else 200,
        'impressions': dm['impressions'],
        'clicks': dm['clicks'],
        'reach': dm['reach'],
        'sessions': dm['sessions'],
        'identified_people': camp_people[cid],
        'registrations': regs,
        'attendees': attendees,
        'cpr': cpr,
        'cpa': cpa,
        'show_up_rate': show_up,
        'status': 'completed',
        'start_date': c['planned_start'],
        'end_date': c['planned_end'],
        'objective': c['objective'],
        'target_audience': c['target_audience']
    })

# Format Time Series
time_series = []
for dt in sorted(daily_trend.keys()):
    item = daily_trend[dt]
    time_series.append({
        'date': dt,
        'spend': item['spend'],
        'reach': item['reach'],
        'sessions': item['sessions'],
        'starts': item['starts'],
        'registrations': item.get('registrations', 0)
    })

# Targets
targets = {
    'launch_plan': {
        'name': 'Attendee launch plan',
        'effective_at': '2025-01-15',
        'identified_goal': 3200,
        'registration_goal': 2800,
        'visitors_goal': 1800,
        'budget': 240000
    },
    'revised_plan': {
        'name': 'Attendee revised plan',
        'effective_at': '2025-03-15',
        'identified_goal': 3600,
        'registration_goal': 3200,
        'visitors_goal': 2200,
        'budget': 300000
    }
}

# Future DILLIVERSE 2027 Strategy Plan Campaigns (Delhi NCR)
dilliverse_campaigns = [
    {
        'id': 'DIL-01',
        'name': 'Campus Ambassador Guilds',
        'channel': 'Ambassadors',
        'owner': 'Meera Iyer (Campus Lead)',
        'budget': 300000,
        'spend': 145000,
        'target_registrations': 4000,
        'target_attendees': 3200,
        'impressions': 450000,
        'clicks': 28000,
        'reach': 180000,
        'sessions': 24000,
        'identified_people': 3800,
        'registrations': 2450,
        'attendees': 1950,
        'cpr': 59.18,
        'cpa': 74.36,
        'show_up_rate': 79.6,
        'status': 'active',
        'start_date': '2027-01-05',
        'end_date': '2027-03-14',
        'objective': 'Recruit 120 ambassadors across 50 DU/IPU colleges to drive verified ticket sales and student attendance.',
        'target_audience': 'North and South Campus DU undergraduate students'
    },
    {
        'id': 'DIL-02',
        'name': 'Inter-College Squad Battles',
        'channel': 'College Partnerships',
        'owner': 'Rohan Khanna (Events Lead)',
        'budget': 240000,
        'spend': 110000,
        'target_registrations': 3000,
        'target_attendees': 2500,
        'impressions': 380000,
        'clicks': 22000,
        'reach': 150000,
        'sessions': 20000,
        'identified_people': 2900,
        'registrations': 1880,
        'attendees': 1610,
        'cpr': 58.51,
        'cpa': 68.32,
        'show_up_rate': 85.6,
        'status': 'active',
        'start_date': '2027-01-10',
        'end_date': '2027-03-14',
        'objective': 'Host inter-college competitive circuits in music, dance, esports; each team brings 30+ cheer supporters.',
        'target_audience': 'College society heads, cultural clubs, and student competitors'
    },
    {
        'id': 'DIL-03',
        'name': 'Viral "Gang of 5" Passes & Referrals',
        'channel': 'Referrals',
        'owner': 'Dev Malhotra (Growth APM)',
        'budget': 210000,
        'spend': 85000,
        'target_registrations': 2600,
        'target_attendees': 2100,
        'impressions': 280000,
        'clicks': 19000,
        'reach': 120000,
        'sessions': 18000,
        'identified_people': 2400,
        'registrations': 1620,
        'attendees': 1280,
        'cpr': 52.47,
        'cpa': 66.41,
        'show_up_rate': 79.0,
        'status': 'active',
        'start_date': '2027-01-15',
        'end_date': '2027-03-14',
        'objective': 'Group ticketing (Buy 4 Get 1 Free) + ₹100 post-check-in food coupons to incentivize viral squad attendance.',
        'target_audience': 'Friend groups and student circles across Delhi NCR'
    },
    {
        'id': 'DIL-04',
        'name': 'Performance Retargeting (Meta & Search)',
        'channel': 'Paid Media',
        'owner': 'Arjun Verma (Performance Lead)',
        'budget': 210000,
        'spend': 130000,
        'target_registrations': 1800,
        'target_attendees': 1400,
        'impressions': 650000,
        'clicks': 31000,
        'reach': 220000,
        'sessions': 26000,
        'identified_people': 2100,
        'registrations': 1250,
        'attendees': 810,
        'cpr': 104.00,
        'cpa': 160.49,
        'show_up_rate': 64.8,
        'status': 'active',
        'start_date': '2027-02-01',
        'end_date': '2027-03-14',
        'objective': 'High-intent retargeting on Instagram & Google for landing page visitors and cart abandoners.',
        'target_audience': 'Students who visited festival portal or engaged with ambassador posts'
    },
    {
        'id': 'DIL-05',
        'name': 'Campus Micro-Creator Guilds',
        'channel': 'Creator Affiliates',
        'owner': 'Nisha Rao (Creator Lead)',
        'budget': 140000,
        'spend': 65000,
        'target_registrations': 1100,
        'target_attendees': 800,
        'impressions': 310000,
        'clicks': 14000,
        'reach': 110000,
        'sessions': 12000,
        'identified_people': 1200,
        'registrations': 620,
        'attendees': 410,
        'cpr': 104.84,
        'cpa': 158.54,
        'show_up_rate': 66.1,
        'status': 'active',
        'start_date': '2027-02-01',
        'end_date': '2027-03-14',
        'objective': '30 Delhi college student vloggers & meme pages on affiliate revenue-share for verified ticket conversions.',
        'target_audience': 'Delhi college students following local campus content creators'
    }
]

# Initial Seed Tasks
seed_tasks = [
    {
        'id': 'TASK-101',
        'title': 'Recruit 30 additional North Campus ambassadors',
        'owner': 'Meera Iyer',
        'deadline': '2027-02-15',
        'priority': 'High',
        'status': 'In Progress',
        'campaign_id': 'DIL-01',
        'campaign_name': 'Campus Ambassador Guilds',
        'notes': 'Focus on Hindu, Hansraj, Kirori Mal, and Ramjas to reach ambassador quota.'
    },
    {
        'id': 'TASK-102',
        'title': 'Confirm 15 dance and music society slots for Squad Battles',
        'owner': 'Rohan Khanna',
        'deadline': '2027-02-20',
        'priority': 'High',
        'status': 'Pending',
        'campaign_id': 'DIL-02',
        'campaign_name': 'Inter-College Squad Battles',
        'notes': 'Finalize participation contracts requiring 30 supporter squad check-ins.'
    },
    {
        'id': 'TASK-103',
        'title': 'Launch "Buy 4 Get 1 Free" Gang of 5 Pass portal integration',
        'owner': 'Dev Malhotra',
        'deadline': '2027-02-10',
        'priority': 'Medium',
        'status': 'Completed',
        'campaign_id': 'DIL-03',
        'campaign_name': 'Viral "Gang of 5" Passes & Referrals',
        'notes': 'Generate unique squad referral links and integrate post-check-in food coupons.'
    },
    {
        'id': 'TASK-104',
        'title': 'Pause non-retargeting broad Meta ad sets',
        'owner': 'Arjun Verma',
        'deadline': '2027-02-08',
        'priority': 'High',
        'status': 'Completed',
        'campaign_id': 'DIL-04',
        'campaign_name': 'Performance Retargeting',
        'notes': 'Eliminate broad interest targeting; restrict ad budget strictly to website visitors.'
    },
    {
        'id': 'TASK-105',
        'title': 'Audit micro-creator affiliate link conversion rates',
        'owner': 'Nisha Rao',
        'deadline': '2027-02-25',
        'priority': 'Medium',
        'status': 'In Progress',
        'campaign_id': 'DIL-05',
        'campaign_name': 'Campus Micro-Creator Guilds',
        'notes': 'Cut creators with fewer than 5 attributed conversions and reallocate spend.'
    }
]

output_payload = {
    'metadata': {
        'project': 'FestGrowth - Festival Growth Command Center',
        'candidate': 'Mohit',
        'city': 'Delhi NCR',
        'historical_event': 'CampusFest 2025',
        'target_festival': 'DILLIVERSE 2027',
        'targets_summary': {
            'historical': targets,
            'dilliverse_base': {'attendees': 10000, 'budget': 1200000, 'cpa': 120.0},
            'dilliverse_stretch': {'attendees': 15000, 'budget': 1425000, 'cpa': 95.0}
        }
    },
    'historical_campaigns': app_campaigns,
    'historical_time_series': time_series,
    'dilliverse_campaigns': dilliverse_campaigns,
    'tasks': seed_tasks
}

import os
os.makedirs('src/data', exist_ok=True)
with open('src/data/festivalData.json', 'w', encoding='utf-8') as f:
    json.dump(output_payload, f, indent=2)

print('Exported festivalData.json successfully!')
