import openpyxl
from collections import defaultdict, Counter

wb = openpyxl.load_workbook('Attendee Dataset.xlsx', data_only=True)

# 1. Campaigns
print('=== CAMPAIGNS ===')
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
            'planned_start': str(row[6]),
            'planned_end': str(row[7])
        }
for cid, c in camps.items():
    print(f"{cid}: {c['name']} | Channel: {c['channel']} | Owner: {c['owner']}")

# 2. Daily Marketing
print('\n=== DAILY MARKETING AGGREGATES ===')
dm_sheet = wb['Daily Marketing']
dm_rows = list(dm_sheet.iter_rows(values_only=True))[1:]
camp_dm = defaultdict(lambda: {'spend': 0.0, 'impressions': 0.0, 'clicks': 0.0, 'reach': 0.0, 'sessions': 0.0, 'starts': 0.0, 'days': 0})
total_spend = 0.0
for r in dm_rows:
    if not r[0]: continue
    cid = r[11]
    spend = float(r[8] or 0)
    total_spend += spend
    camp_dm[cid]['spend'] += spend
    camp_dm[cid]['impressions'] += float(r[3] or 0)
    camp_dm[cid]['clicks'] += float(r[4] or 0)
    camp_dm[cid]['reach'] += float(r[5] or 0)
    camp_dm[cid]['sessions'] += float(r[6] or 0)
    camp_dm[cid]['starts'] += float(r[7] or 0)
    camp_dm[cid]['days'] += 1

for cid, d in camp_dm.items():
    cname = camps.get(cid, {}).get('name', cid)
    print(f"{cid} ({cname}): Spend=INR {d['spend']:,.2f}, Impressions={d['impressions']:,.0f}, Clicks={d['clicks']:,.0f}, Reach={d['reach']:,.0f}, Sessions={d['sessions']:,.0f}, Starts={d['starts']:,.0f}")
print(f"Total Spend: INR {total_spend:,.2f}")

# 3. Targets
print('\n=== TARGETS ===')
t_sheet = wb['Targets']
for r in list(t_sheet.iter_rows(values_only=True))[1:]:
    if r[0]:
        print(f"{r[5]}: Effective {r[0]} | Identified Goal: {r[1]} | Reg Goal: {r[2]} | Visitors Goal: {r[3]} | Budget: INR {r[4]:,.2f}")

# 4. People
print('\n=== PEOPLE ===')
p_sheet = wb['People']
p_rows = list(p_sheet.iter_rows(values_only=True))[1:]
valid_people = [r for r in p_rows if r[0]]
print(f"Total people records: {len(valid_people)}")
camp_people = Counter(r[7] for r in valid_people)
for cid, cnt in camp_people.items():
    cname = camps.get(cid, {}).get('name', cid)
    print(f"{cid} ({cname}): {cnt} people")

# 5. Registrations
print('\n=== REGISTRATIONS ===')
reg_sheet = wb['Registrations']
reg_rows = list(reg_sheet.iter_rows(values_only=True))[1:]
valid_regs = [r for r in reg_rows if r[0]]
print(f"Total registrations: {len(valid_regs)}")
camp_regs = Counter(r[6] for r in valid_regs)
for cid, cnt in camp_regs.items():
    cname = camps.get(cid, {}).get('name', cid)
    print(f"{cid} ({cname}): {cnt} registrations")

# 6. Registration History status breakdown
print('\n=== REGISTRATION HISTORY STATUSES ===')
rh_sheet = wb['Registration History']
rh_rows = list(rh_sheet.iter_rows(values_only=True))[1:]
statuses = Counter(r[4] for r in rh_rows if r[0])
print("Statuses in history:", statuses)

# 7. Check-ins
print('\n=== CHECK-INS ===')
chk_sheet = wb['Check-ins']
chk_rows = list(chk_sheet.iter_rows(values_only=True))[1:]
valid_chks = [r for r in chk_rows if r[0]]
print(f"Total check-in records: {len(valid_chks)}")
admitted_chks = [r for r in valid_chks if r[4] == 'admitted']
print(f"Total admitted check-ins: {len(admitted_chks)}")
unique_admitted_people = len(set(r[8] for r in admitted_chks))
print(f"Unique admitted people: {unique_admitted_people}")

camp_unique_admitted = defaultdict(set)
for r in admitted_chks:
    camp_unique_admitted[r[10]].add(r[8])

print("\n=== COMBINED CAMPAIGN FUNNEL & UNIT ECONOMICS ===")
for cid in sorted(camps.keys()):
    cname = camps[cid]['name']
    spend = camp_dm[cid]['spend']
    reach = camp_dm[cid]['reach']
    clicks = camp_dm[cid]['clicks']
    sessions = camp_dm[cid]['sessions']
    people = camp_people[cid]
    regs = camp_regs[cid]
    admitted = len(camp_unique_admitted[cid])
    cpr = (spend / regs) if regs else 0
    cpa = (spend / admitted) if admitted else 0
    conv_reach_to_reg = (regs / reach * 100) if reach else 0
    conv_reg_to_adm = (admitted / regs * 100) if regs else 0
    print(f"[{cid}] {cname}:")
    print(f"   Spend: INR {spend:,.2f} | Reach: {reach:,.0f} | Sessions: {sessions:,.0f} | Identified: {people}")
    print(f"   Registrations: {regs} | Admitted Attendees: {admitted}")
    print(f"   Cost per Reg (CPR): INR {cpr:.2f} | Cost per Attendee (CPA): INR {cpa:.2f}")
    print(f"   Reach->Reg Conv: {conv_reach_to_reg:.2f}% | Reg->Admitted Conv: {conv_reg_to_adm:.2f}%\n")
