import os
from playwright.sync_api import sync_playwright

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #0f172a;
    background-color: #0b0f19;
    -webkit-print-color-adjust: exact;
  }

  .slide {
    width: 1920px;
    height: 1080px;
    position: relative;
    page-break-after: always;
    background: radial-gradient(circle at 10% 10%, #1e1b4b 0%, #0f172a 40%, #030712 100%);
    overflow: hidden;
    padding: 48px 56px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #f8fafc;
  }

  /* Slide Background Accents */
  .slide::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .slide::after {
    content: '';
    position: absolute;
    bottom: -150px;
    left: 20%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(14, 165, 233, 0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  /* Header */
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 20px;
    position: relative;
    z-index: 2;
  }

  .header-left h3 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #818cf8;
    font-weight: 700;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-left h3 span.badge {
    background: rgba(99, 102, 241, 0.2);
    border: 1px solid rgba(99, 102, 241, 0.4);
    padding: 2px 10px;
    border-radius: 12px;
    color: #a5b4fc;
    font-size: 11px;
  }

  .header-left h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #ffffff;
    display: flex;
    align-items: baseline;
    gap: 14px;
  }

  .header-left h1 span.subtitle {
    font-size: 20px;
    font-weight: 500;
    color: #94a3b8;
  }

  .header-right {
    text-align: right;
  }

  .author-box {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 8px 18px;
    border-radius: 10px;
    display: inline-block;
  }

  .author-name {
    font-size: 14px;
    font-weight: 700;
    color: #38bdf8;
  }

  .author-sub {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* Content Layouts */
  .content-grid {
    display: grid;
    gap: 24px;
    position: relative;
    z-index: 2;
    margin-top: 20px;
    margin-bottom: 16px;
  }

  .grid-3-col {
    grid-template-columns: 1.15fr 1.35fr 1fr;
    height: 800px;
  }

  .grid-slide2 {
    grid-template-columns: 2fr 1fr;
    height: 800px;
  }

  .grid-slide3 {
    grid-template-columns: 2.1fr 0.9fr;
    height: 800px;
  }

  /* Card Styles */
  .card {
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  }

  .card-highlight {
    border-color: rgba(99, 102, 241, 0.35);
    background: linear-gradient(180deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
  }

  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #e2e8f0;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-bottom: 10px;
  }

  .card-title .tag {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tag-purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
  .tag-cyan { background: rgba(6, 182, 212, 0.2); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); }
  .tag-emerald { background: rgba(16, 185, 129, 0.2); color: #34d178; border: 1px solid rgba(16, 185, 129, 0.3); }
  .tag-amber { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
  .tag-rose { background: rgba(244, 63, 94, 0.2); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); }

  /* Metrics Callouts */
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }

  .kpi-box {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    padding: 12px 14px;
  }

  .kpi-val {
    font-size: 24px;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    color: #38bdf8;
    line-height: 1.1;
  }

  .kpi-val.green { color: #34d399; }
  .kpi-val.purple { color: #c084fc; }
  .kpi-val.amber { color: #fbbf24; }

  .kpi-lbl {
    font-size: 11px;
    color: #94a3b8;
    font-weight: 600;
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .kpi-sub {
    font-size: 10px;
    color: #64748b;
    margin-top: 2px;
  }

  /* Funnel Table & Visualization */
  .funnel-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
    margin-top: 8px;
  }

  .funnel-table th {
    text-align: left;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.04);
    color: #94a3b8;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .funnel-table td {
    padding: 8px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    color: #cbd5e1;
  }

  .funnel-table tr:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  .funnel-stage {
    font-weight: 600;
    color: #f1f5f9;
  }

  .num {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
  }

  /* Audience segments */
  .audience-item {
    background: rgba(255, 255, 255, 0.03);
    border-left: 3px solid #6366f1;
    border-radius: 0 8px 8px 0;
    padding: 10px 14px;
    margin-bottom: 10px;
  }

  .audience-item:nth-child(2) { border-left-color: #06b6d4; }
  .audience-item:nth-child(3) { border-left-color: #10b981; }
  .audience-item:nth-child(4) { border-left-color: #f59e0b; }

  .audience-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .audience-title {
    font-size: 13px;
    font-weight: 700;
    color: #f8fafc;
  }

  .audience-size {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #38bdf8;
    font-weight: 600;
  }

  .audience-desc {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 3px;
    line-height: 1.35;
  }

  /* Strategy Table (Slide 2) */
  .strat-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .strat-table th {
    text-align: left;
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10.5px;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .strat-table td {
    padding: 11px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    vertical-align: top;
    line-height: 1.35;
  }

  .strat-name {
    font-weight: 700;
    color: #ffffff;
    font-size: 12.5px;
  }

  .strat-sub {
    font-size: 10.5px;
    color: #94a3b8;
    margin-top: 2px;
  }

  .badge-action {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .action-double { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
  .action-control { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
  .action-test { background: rgba(147, 51, 234, 0.2); color: #c084fc; border: 1px solid rgba(147, 51, 234, 0.4); }
  .action-reject { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }

  /* Priority box & Trade-offs */
  .decision-box {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 12px;
  }

  .decision-box h4 {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .decision-box.green { border-color: rgba(16, 185, 129, 0.3); background: rgba(16, 185, 129, 0.04); }
  .decision-box.green h4 { color: #34d399; }
  .decision-box.amber { border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.04); }
  .decision-box.amber h4 { color: #fbbf24; }
  .decision-box.red { border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.04); }
  .decision-box.red h4 { color: #f87171; }

  .decision-p {
    font-size: 11.5px;
    color: #cbd5e1;
    line-height: 1.4;
  }

  /* Slide 3 Experimentation Table */
  .exp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11.5px;
  }

  .exp-table th {
    text-align: left;
    padding: 8px 10px;
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  }

  .exp-table td {
    padding: 9px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #cbd5e1;
    vertical-align: top;
    line-height: 1.35;
  }

  /* Footer */
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 14px;
    font-size: 11px;
    color: #64748b;
    position: relative;
    z-index: 2;
  }

  .slide-footer .foot-left {
    display: flex;
    gap: 20px;
  }

  .slide-footer .foot-right {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 600;
    color: #94a3b8;
  }

  .callout-pill {
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    color: #c7d2fe;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 11.5px;
    line-height: 1.4;
    margin-top: 10px;
  }
</style>
</head>
<body>

<!-- SLIDE 1 -->
<div class="slide" id="slide1">
  <div class="slide-header">
    <div class="header-left">
      <h3>
        <span>RISA Growth APM Assignment</span>
        <span class="badge">Challenge A: Attendee Growth</span>
        <span class="badge" style="background: rgba(14, 165, 233, 0.2); color: #38bdf8; border-color: rgba(14, 165, 233, 0.4);">Target Market: Delhi NCR</span>
      </h3>
      <h1>Slide 1 — How High Can You Aim? <span class="subtitle">Target Ambition & Quantitative Growth Model</span></h1>
    </div>
    <div class="header-right">
      <div class="author-box">
        <div class="author-name">Prepared by: Mohit</div>
        <div class="author-sub">RISA Growth APM Candidate</div>
      </div>
    </div>
  </div>

  <div class="content-grid grid-3-col">
    <!-- COL 1: Market & Audience -->
    <div class="card">
      <div class="card-title">
        <span>1. Market Size & Delhi Selection</span>
        <span class="tag tag-purple">TAM / SAM / SOM</span>
      </div>
      
      <p style="font-size: 11.5px; color: #94a3b8; line-height: 1.4; margin-bottom: 12px;">
        <strong style="color: #f8fafc;">Why Delhi NCR?</strong> 2.51L regular DU students (91 colleges), DTU (14K), NSUT (12K), IPU (1.2L+), & private universities. High campus density enables peer-to-peer distribution without heavy paid media reliance.
      </p>

      <div class="audience-item">
        <div class="audience-header">
          <span class="audience-title">Tier 1: Core DU Undergrads (North/South)</span>
          <span class="audience-size">140,000 Reachable</span>
        </div>
        <div class="audience-desc">High cultural affinity, active college societies, heavy metro transit access. Primary source for ambassadors & viral referrals.</div>
      </div>

      <div class="audience-item">
        <div class="audience-header">
          <span class="audience-title">Tier 2: Tech & Engineering Hubs</span>
          <span class="audience-size">85,000 Reachable</span>
        </div>
        <div class="audience-desc">DTU, NSUT, MAIT, IIITD. Strong demand for inter-college hackathons, gaming arenas, & squad battle passes.</div>
      </div>

      <div class="audience-item">
        <div class="audience-header">
          <span class="audience-title">Tier 3: NCR Satellite Campuses</span>
          <span class="audience-size">95,000 Reachable</span>
        </div>
        <div class="audience-desc">Noida (Amity, Shiv Nadar), Gurugram, Greater Noida. Activated via chartered shuttle passes and inter-college team entries.</div>
      </div>

      <div class="audience-item">
        <div class="audience-header">
          <span class="audience-title">Tier 4: Young Alumni & Early Pros</span>
          <span class="audience-size">80,000 Reachable</span>
        </div>
        <div class="audience-desc">Recent grads (ages 21-24) in Gurgaon/Delhi tech hubs. Higher purchasing power; targeted for evening headline artist passes.</div>
      </div>

      <div class="callout-pill" style="margin-top: auto;">
        <strong>Total Addressable TAM:</strong> ~800K youth | <strong>Serviceable SAM:</strong> 400K students | <strong>Target SOM:</strong> 10K (Base) - 15K (Stretch)
      </div>
    </div>

    <!-- COL 2: Quantitative Funnel Model -->
    <div class="card card-highlight">
      <div class="card-title">
        <span>2. Grounded Funnel & Growth Economics</span>
        <span class="tag tag-cyan">Mathematical Model</span>
      </div>

      <div class="kpi-row">
        <div class="kpi-box">
          <div class="kpi-val">10,000</div>
          <div class="kpi-lbl">Base Case Attendees</div>
          <div class="kpi-sub">&#8377;12.0L Budget | &#8377;120 CPA</div>
        </div>
        <div class="kpi-box">
          <div class="kpi-val green">15,000</div>
          <div class="kpi-lbl">Stretch Case Attendees</div>
          <div class="kpi-sub">&#8377;14.25L Budget | &#8377;95 CPA</div>
        </div>
      </div>

      <table class="funnel-table">
        <thead>
          <tr>
            <th>Funnel Stage</th>
            <th>Base Target</th>
            <th>Base Conv.</th>
            <th>Stretch Target</th>
            <th>Stretch Conv.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="funnel-stage">1. Unique Student Reach</td>
            <td class="num">600,000</td>
            <td>-</td>
            <td class="num">900,000</td>
            <td>-</td>
          </tr>
          <tr>
            <td class="funnel-stage">2. Landing Page Sessions</td>
            <td class="num">90,000</td>
            <td class="num">15.0% CTR</td>
            <td class="num">135,000</td>
            <td class="num">15.0% CTR</td>
          </tr>
          <tr>
            <td class="funnel-stage">3. Registration Initiations</td>
            <td class="num">30,000</td>
            <td class="num">33.3%</td>
            <td class="num">45,000</td>
            <td class="num">33.3%</td>
          </tr>
          <tr>
            <td class="funnel-stage">4. Completed / Paid Passes</td>
            <td class="num">12,500</td>
            <td class="num">41.7%</td>
            <td class="num">18,000</td>
            <td class="num">40.0%</td>
          </tr>
          <tr style="background: rgba(99, 102, 241, 0.15); font-weight: 700;">
            <td class="funnel-stage" style="color: #38bdf8;">5. Verified Attendees</td>
            <td class="num" style="color: #38bdf8;">10,000</td>
            <td class="num">80.0% Show</td>
            <td class="num" style="color: #34d399;">15,000</td>
            <td class="num">83.3% Show</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 14px; background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px 14px; border: 1px solid rgba(255,255,255,0.06);">
        <div style="font-size: 11px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">REVENUE & CAC FEASIBILITY</div>
        <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: #94a3b8;">
          <span>Avg Realized Ticket Price: <strong style="color: #f8fafc;">&#8377;499</strong> (Early Bird &#8377;299 / Regular &#8377;499 / VIP &#8377;799)</span>
          <span>Base Gross Rev: <strong style="color: #38bdf8;">&#8377;49.9L</strong> (Marketing = 24.0% of Rev)</span>
        </div>
      </div>

      <div class="callout-pill" style="margin-top: auto; border-color: rgba(56, 189, 248, 0.4); background: rgba(56, 189, 248, 0.08);">
        <strong>Historical Dataset Validation:</strong> In CampusFest 2025 data, verified external visitors achieved was <strong>2,050</strong> (beating launch goal of 1,800) at &#8377;2.74L spend. Peer-led channels achieved <strong>75%-85.6% show-up rates</strong> at &#8377;69-&#8377;107 CPA. Scaling to 10K requires replicating high-intent peer mechanics.
      </div>
    </div>

    <!-- COL 3: Venue Capacity & Constraints -->
    <div class="card">
      <div class="card-title">
        <span>3. Constraints & Operating Reality</span>
        <span class="tag tag-amber">Hard Boundaries</span>
      </div>

      <div style="margin-bottom: 14px;">
        <div style="font-size: 12px; font-weight: 700; color: #fbbf24; margin-bottom: 4px;">VENUE CAPACITY (HARD CONSTRAINT)</div>
        <p style="font-size: 11.5px; color: #94a3b8; line-height: 1.4;">
          <strong>Target Venue:</strong> JLN Stadium Grounds / NSIC Exhibition Grounds Okhla.<br>
          &bull; <strong>Licensed Venue Capacity:</strong> 18,000 concurrent.<br>
          &bull; <strong>Base Target (10,000 unique):</strong> Peak concurrent on Day 2 evening estimated at 7,500 (~42% venue capacity utilization).<br>
          &bull; <strong>Stretch Target (15,000 unique):</strong> Peak concurrent estimated at 11,200 (~62% capacity utilization). Full compliance with Delhi Police crowd & fire safety regulations.
        </p>
      </div>

      <div style="margin-bottom: 14px;">
        <div style="font-size: 12px; font-weight: 700; color: #38bdf8; margin-bottom: 4px;">TIMING & ACADEMIC CALENDAR</div>
        <p style="font-size: 11.5px; color: #94a3b8; line-height: 1.4;">
          <strong>Chosen Window:</strong> 12–14 March 2027.<br>
          &bull; DU Semester II begins 1 Jan 2027; mid-sem break is 21–28 March.<br>
          &bull; Executing 1 week prior to break captures peak campus momentum before students disperse for vacations or practical exams (starting late April).
        </p>
      </div>

      <div style="margin-bottom: 10px;">
        <div style="font-size: 12px; font-weight: 700; color: #f43f5e; margin-bottom: 4px;">REGISTRATION NO-SHOW RISK</div>
        <p style="font-size: 11.5px; color: #94a3b8; line-height: 1.4;">
          Data proves registrations without payment/commitment have 50% drop-off. By requiring a nominal entry pass (&#8377;299-&#8377;499) + check-in incentives, we lift show-up from 50% to 80%.
        </p>
      </div>

      <div class="callout-pill" style="margin-top: auto;">
        <strong>North Star Metric:</strong> <em>Unique Verified Attendees Checked-In</em> (NOT registrations or ad impressions).
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="foot-left">
      <span>RISA Growth APM Assignment | DILLIVERSE 2027</span>
      <span>Base Target: 10,000 Attendees | Stretch: 15,000</span>
      <span>Blended CAC: &#8377;120 / attendee</span>
    </div>
    <div class="foot-right">Slide 1 of 3</div>
  </div>
</div>

<!-- SLIDE 2 -->
<div class="slide" id="slide2">
  <div class="slide-header">
    <div class="header-left">
      <h3>
        <span>RISA Growth APM Assignment</span>
        <span class="badge">Resource Allocation & Decisions</span>
        <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: rgba(16, 185, 129, 0.4);">&#8377;12 Lakh Budget</span>
      </h3>
      <h1>Slide 2 — Where Will You Place Your Bets? <span class="subtitle">Ranked Strategies, ICE Prioritization & Explicit Trade-offs</span></h1>
    </div>
    <div class="header-right">
      <div class="author-box">
        <div class="author-name">Prepared by: Mohit</div>
        <div class="author-sub">RISA Growth APM Candidate</div>
      </div>
    </div>
  </div>

  <div class="content-grid grid-slide2">
    <!-- COL 1: 5 Ranked Strategies Table -->
    <div class="card">
      <div class="card-title">
        <span>Portfolio of 5 Distinct Growth Strategies</span>
        <span class="tag tag-cyan">Ranked by ICE Score</span>
      </div>

      <table class="strat-table">
        <thead>
          <tr>
            <th style="width: 22%;">Strategy & Concept</th>
            <th style="width: 24%;">Strategic Rationale</th>
            <th style="width: 13%;">Incr. Attendees</th>
            <th style="width: 13%;">Budget & CPA</th>
            <th style="width: 14%;">Resources & Timeline</th>
            <th style="width: 14%;">Testing & Primary KPI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="strat-name">1. Campus Ambassador Guilds</div>
              <div class="strat-sub">Peer-to-peer campus reps</div>
              <span class="badge-action action-double" style="margin-top: 4px;">Double Down #1</span>
            </td>
            <td>120 reps across 50 DU/IPU colleges. Historical data proved C01 drove 390 attendees at &#8377;107 CPA with 75% show-up. Tiered incentives (cash + artist meet).</td>
            <td><strong style="color: #38bdf8;">3,200</strong><br><span style="font-size: 10px; color: #94a3b8;">(32% of total)</span></td>
            <td><strong class="num">&#8377;3,00,000</strong><br><span style="font-size: 10.5px; color: #34d399;">CPA: &#8377;93.75</span></td>
            <td>1 Lead, 2 Interns.<br>10 Weeks (W1-10).</td>
            <td>A/B test cash reward vs VIP passes. <strong>KPI:</strong> Verified attendees / active rep (&ge;27).</td>
          </tr>
          <tr>
            <td>
              <div class="strat-name">2. Inter-College Squad Battles</div>
              <div class="strat-sub">Competitions + squad tickets</div>
              <span class="badge-action action-double" style="margin-top: 4px;">Double Down #2</span>
            </td>
            <td>C04 proved college partnerships had <strong>85.6% show-up</strong> (highest). 40 college squads in dance, music, esports; each team brings 30+ cheering attendees.</td>
            <td><strong style="color: #38bdf8;">2,500</strong><br><span style="font-size: 10px; color: #94a3b8;">(25% of total)</span></td>
            <td><strong class="num">&#8377;2,40,000</strong><br><span style="font-size: 10.5px; color: #34d399;">CPA: &#8377;96.00</span></td>
            <td>1 Events Lead, College liaisons.<br>12 Weeks.</td>
            <td>Pilot 8 colleges early. <strong>KPI:</strong> Verified attendees per registered society (&ge;50).</td>
          </tr>
          <tr>
            <td>
              <div class="strat-name">3. Viral "Gang of 5" Pass & Referrals</div>
              <div class="strat-sub">Squad ticketing & viral loop</div>
              <span class="badge-action action-double" style="margin-top: 4px;">Double Down #3</span>
            </td>
            <td>C05 had lowest CPA (&#8377;69.1) & 78.6% show-up. "Buy 4 Get 1 Free" + &#8377;100 food coupon per referred peer. Inbuilt social accountability ensures high physical attendance.</td>
            <td><strong style="color: #38bdf8;">2,100</strong><br><span style="font-size: 10px; color: #94a3b8;">(21% of total)</span></td>
            <td><strong class="num">&#8377;2,10,000</strong><br><span style="font-size: 10.5px; color: #34d399;">CPA: &#8377;100.00</span></td>
            <td>Product/Tech dev (QR links).<br>8 Weeks.</td>
            <td>A/B test instant cash discount vs F&B vouchers. <strong>KPI:</strong> Viral K-factor (&ge;0.35).</td>
          </tr>
          <tr>
            <td>
              <div class="strat-name">4. Performance Retargeting</div>
              <div class="strat-sub">Meta / Search cart recovery</div>
              <span class="badge-action action-control" style="margin-top: 4px;">Constrain / Control</span>
            </td>
            <td>C02 burned &#8377;93K at &#8377;274 CPA due to 50% drop-off. We cut broad awareness and restrict ads strictly to landing-page retargeting and cart-abandonment drops.</td>
            <td><strong style="color: #38bdf8;">1,400</strong><br><span style="font-size: 10px; color: #94a3b8;">(14% of total)</span></td>
            <td><strong class="num">&#8377;2,10,000</strong><br><span style="font-size: 10.5px; color: #fbbf24;">CPA: &#8377;150.00</span></td>
            <td>1 Performance Marketer.<br>6 Weeks (W5-10).</td>
            <td>DCO lineup teaser vs urgency clock. <strong>KPI:</strong> Blended Retargeting CAC (&le;&#8377;150).</td>
          </tr>
          <tr>
            <td>
              <div class="strat-name">5. Campus Micro-Creator Guilds</div>
              <div class="strat-sub">Affiliate-only student creators</div>
              <span class="badge-action action-test" style="margin-top: 4px;">Strict Test Only</span>
            </td>
            <td>C03 had highest CPA (&#8377;337.1) from flat upfront fees. Pivot to 30 hyper-local student vloggers (5k-50k followers) paid strictly on verified ticket affiliate rev-share.</td>
            <td><strong style="color: #38bdf8;">800</strong><br><span style="font-size: 10px; color: #94a3b8;">(8% of total)</span></td>
            <td><strong class="num">&#8377;1,40,000</strong><br><span style="font-size: 10.5px; color: #c084fc;">CPA: &#8377;175.00</span></td>
            <td>1 Creator Coordinator.<br>6 Weeks (W5-10).</td>
            <td>Micro-influencer attribution links. <strong>KPI:</strong> Attributed ticket sales / creator (&ge;25).</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border-radius: 8px;">
        <span style="font-size: 11px; color: #94a3b8;">Total Portfolio Commitment:</span>
        <span style="font-size: 13px; font-weight: 700; color: #f8fafc;">10,000 Base Attendees | &#8377;12,00,000 Budget | Blended CPA: &#8377;120.00</span>
      </div>
    </div>

    <!-- COL 2: ICE Framework & Trade-off Decisions -->
    <div class="card">
      <div class="card-title">
        <span>ICE Prioritization & Trade-Offs</span>
        <span class="tag tag-emerald">Deliberate Choices</span>
      </div>

      <!-- ICE Table Mini -->
      <table class="funnel-table" style="font-size: 11px; margin-bottom: 14px;">
        <thead>
          <tr>
            <th>Strategy</th>
            <th style="text-align: center;">I</th>
            <th style="text-align: center;">C</th>
            <th style="text-align: center;">E</th>
            <th style="text-align: right;">ICE</th>
            <th style="text-align: right;">Decision</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1. Campus Ambassadors</td>
            <td style="text-align: center;" class="num">9</td>
            <td style="text-align: center;" class="num">9</td>
            <td style="text-align: center;" class="num">8</td>
            <td style="text-align: right;" class="num green">648</td>
            <td style="text-align: right;"><span class="badge-action action-double">Double Down</span></td>
          </tr>
          <tr>
            <td>2. Squad Battles</td>
            <td style="text-align: center;" class="num">9</td>
            <td style="text-align: center;" class="num">8</td>
            <td style="text-align: center;" class="num">7</td>
            <td style="text-align: right;" class="num green">504</td>
            <td style="text-align: right;"><span class="badge-action action-double">Double Down</span></td>
          </tr>
          <tr>
            <td>3. Viral Squad Passes</td>
            <td style="text-align: center;" class="num">8</td>
            <td style="text-align: center;" class="num">8</td>
            <td style="text-align: center;" class="num">8</td>
            <td style="text-align: right;" class="num green">512</td>
            <td style="text-align: right;"><span class="badge-action action-double">Double Down</span></td>
          </tr>
          <tr>
            <td>4. Perf. Retargeting</td>
            <td style="text-align: center;" class="num">7</td>
            <td style="text-align: center;" class="num">6</td>
            <td style="text-align: center;" class="num">7</td>
            <td style="text-align: right;" class="num amber">294</td>
            <td style="text-align: right;"><span class="badge-action action-control">Constrain</span></td>
          </tr>
          <tr>
            <td>5. Creator Guilds</td>
            <td style="text-align: center;" class="num">6</td>
            <td style="text-align: center;" class="num">5</td>
            <td style="text-align: center;" class="num">6</td>
            <td style="text-align: right;" class="num purple">180</td>
            <td style="text-align: right;"><span class="badge-action action-test">Test Only</span></td>
          </tr>
        </tbody>
      </table>

      <!-- Strategic Decisions Callouts -->
      <div class="decision-box green">
        <h4><span style="font-size: 13px;">&#10004;</span> Double Down: Peer & Institutional Growth</h4>
        <div class="decision-p">
          Allocate <strong>62.5% of total budget (&#8377;7.5L)</strong> to Ambassadors, Competitions, & Squad Passes. These 3 channels drive <strong>78% of attendees (7,800)</strong> at an unbeatable blended CPA of <strong>&#8377;96.15</strong> and &gt;80% show-up.
        </div>
      </div>

      <div class="decision-box amber">
        <h4><span style="font-size: 13px;">&#9888;</span> Constrain: Paid Social to Retargeting</h4>
        <div class="decision-p">
          Cut generic top-of-funnel ad spend by 50%. Paid ads are restricted strictly to warm audiences (site visitors, cart abandoners, engaged followers) to avoid historical 50% drop-off.
        </div>
      </div>

      <div class="decision-box red">
        <h4><span style="font-size: 13px;">&#10008;</span> Explicitly Deprioritized & Rejected</h4>
        <div class="decision-p">
          &bull; <strong>Celebrity Endorsements (&gt;&#8377;5L):</strong> Rejected due to zero conversion attribution and excessive fixed cost.<br>
          &bull; <strong>Offline Hoardings/Billboards:</strong> Deprioritized; unable to track unit economics.<br>
          &bull; <strong>Flat-Fee Influencers:</strong> Rejected after C03 yielded abysmal &#8377;337 CPA.
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="foot-left">
      <span>RISA Growth APM Assignment | DILLIVERSE 2027</span>
      <span>Prioritization: ICE Scoring Framework</span>
      <span>Key Trade-off: Institutional Distribution over Mass Media</span>
    </div>
    <div class="foot-right">Slide 2 of 3</div>
  </div>
</div>

<!-- SLIDE 3 -->
<div class="slide" id="slide3">
  <div class="slide-header">
    <div class="header-left">
      <h3>
        <span>RISA Growth APM Assignment</span>
        <span class="badge">Adaptive Execution & Risk Governance</span>
        <span class="badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.4);">Growth Command Center</span>
      </h3>
      <h1>Slide 3 — How Will You Know What's Working? <span class="subtitle">Leading Indicators, Threshold Playbooks & AI Diagnostic Copilot</span></h1>
    </div>
    <div class="header-right">
      <div class="author-box">
        <div class="author-name">Prepared by: Mohit</div>
        <div class="author-sub">RISA Growth APM Candidate</div>
      </div>
    </div>
  </div>

  <div class="content-grid grid-slide3">
    <!-- COL 1: Experimentation Matrix -->
    <div class="card">
      <div class="card-title">
        <span>Experimentation Matrix: Early Signals & Decision Thresholds</span>
        <span class="tag tag-purple">Scale / Change / Stop Playbook</span>
      </div>

      <table class="exp-table">
        <thead>
          <tr>
            <th style="width: 18%;">Strategy</th>
            <th style="width: 20%;">Critical Variables & Risks</th>
            <th style="width: 20%;">Early Signals (Leading)</th>
            <th style="width: 21%;">Measurable Thresholds</th>
            <th style="width: 21%;">Corrective Action / Response</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>1. Campus Ambassadors</strong></td>
            <td>Ambassador inactivity, campus friction, post-exam exam fatigue.</td>
            <td>
              <span style="color: #34d399;">&bull; Success:</span> &ge;15 sales/rep by W3.<br>
              <span style="color: #f87171;">&bull; Failure:</span> &le;4 sales/rep after 14 days.
            </td>
            <td>
              <strong style="color: #34d399;">SCALE:</strong> Reps avg &gt;25 sales.<br>
              <strong style="color: #f87171;">STOP/CHANGE:</strong> &lt;5 sales after 2 check-ins.
            </td>
            <td>Reallocate &#8377;50K from bottom 20% to top performers. Offer fast-track artist lounge passes to high-velocity ambassadors.</td>
          </tr>
          <tr>
            <td><strong>2. Squad Battles</strong></td>
            <td>College administration permission delays; clashing festival dates.</td>
            <td>
              <span style="color: #34d399;">&bull; Success:</span> &ge;25 college teams registered by W4.<br>
              <span style="color: #f87171;">&bull; Failure:</span> &le;10 teams by W4.
            </td>
            <td>
              <strong style="color: #34d399;">SCALE:</strong> &gt;35 teams -> add stage.<br>
              <strong style="color: #fbbf24;">CHANGE:</strong> &lt;15 teams -> waive fee.
            </td>
            <td>If college administration stalls permissions, pivot directly to independent student crews and unofficial collegiate squads.</td>
          </tr>
          <tr>
            <td><strong>3. Viral Squad Passes</strong></td>
            <td>Single ticket buyer fatigue; drop in peer sharing velocity.</td>
            <td>
              <span style="color: #34d399;">&bull; Success:</span> K-factor &ge;0.35; bundles &gt;35% share.<br>
              <span style="color: #f87171;">&bull; Failure:</span> K-factor &lt;0.20; solo tickets &gt;75%.
            </td>
            <td>
              <strong style="color: #34d399;">SCALE:</strong> K-factor &gt;0.40 -> add perk.<br>
              <strong style="color: #fbbf24;">CHANGE:</strong> K-factor &lt;0.25 -> "Duo Pass".
            </td>
            <td>Lower squad threshold from 5 to 3 students ("Trio Pass") to minimize group coordination friction among friend circles.</td>
          </tr>
          <tr>
            <td><strong>4. Performance Retargeting</strong></td>
            <td>Ad creative fatigue, rising CPMs, low checkout completion.</td>
            <td>
              <span style="color: #34d399;">&bull; Success:</span> CTR &gt;2.5%, CPR &le;&#8377;80.<br>
              <span style="color: #f87171;">&bull; Failure:</span> CTR &lt;1.0%, CPR &gt;&#8377;120.
            </td>
            <td>
              <strong style="color: #34d399;">SCALE:</strong> CPA &le;&#8377;130 -> +20% spend.<br>
              <strong style="color: #f87171;">STOP:</strong> CPA &gt;&#8377;180 for 3 days.
            </td>
            <td>Immediately pause broad audiences; enforce mandatory SMS/WhatsApp checkout verification to ensure verified attendance.</td>
          </tr>
          <tr>
            <td><strong>5. Micro-Creator Guilds</strong></td>
            <td>Fake follower counts, passive engagement, zero ticket buying.</td>
            <td>
              <span style="color: #34d399;">&bull; Success:</span> &ge;30 sales per creator link.<br>
              <span style="color: #f87171;">&bull; Failure:</span> &le;5 sales after 7 days.
            </td>
            <td>
              <strong style="color: #34d399;">SCALE:</strong> CPA &le;&#8377;150 -> 25% rev-share.<br>
              <strong style="color: #f87171;">STOP:</strong> CPA &gt;&#8377;220 -> terminate.
            </td>
            <td>Cut poor-performing creator contracts; divert unspent creator budget into Campus Ambassador leaderboards.</td>
          </tr>
        </tbody>
      </table>

      <div class="callout-pill" style="margin-top: auto;">
        <strong>Adaptive Review Cycle:</strong> Weekly Tuesday PM Growth Reviews evaluate trailing 7-day CPA and cohort check-in prediction. Budgets automatically rebalance based on strict thresholds above.
      </div>
    </div>

    <!-- COL 2: Growth Center & AI Diagnostic Copilot -->
    <div class="card">
      <div class="card-title">
        <span>Command Center & AI Copilot</span>
        <span class="tag tag-cyan">Product Integration</span>
      </div>

      <div style="font-size: 11.5px; color: #94a3b8; line-height: 1.4; margin-bottom: 12px;">
        <strong style="color: #f8fafc;">Why Software Matters:</strong> Growth strategy fails without rapid execution. Our working product (<strong>FestGrowth Command Center</strong>) bridges live telemetry to immediate operational tasks.
      </div>

      <!-- Feature 1 -->
      <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; border-left: 3px solid #38bdf8;">
        <div style="font-size: 11.5px; font-weight: 700; color: #f8fafc;">1. Real-Time Telemetry & Funnel Tracking</div>
        <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">
          Ingests spend, registrations, and verified check-in scanner data. Calculates real-time CPA and flags margin creep before budget exhaustion.
        </div>
      </div>

      <!-- Feature 2 -->
      <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; border-left: 3px solid #818cf8;">
        <div style="font-size: 11.5px; font-weight: 700; color: #f8fafc;">2. Embedded AI Growth Analyst</div>
        <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">
          Grounded directly in actual campaign data & historical benchmarks. Diagnoses <em>why</em> campaigns underperform (e.g., distinguishing low CTR vs low show-up).
        </div>
      </div>

      <!-- Feature 3 -->
      <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; border-left: 3px solid #34d399;">
        <div style="font-size: 11.5px; font-weight: 700; color: #f8fafc;">3. Insight-to-Execution Workflow</div>
        <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">
          AI copilot prepares actionable tasks (Owner, Deadline, Priority) upon detecting threshold breaches. User confirms &rarr; task instantly creates in Task Manager!
        </div>
      </div>

      <!-- Feature 4 -->
      <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px; margin-bottom: 10px; border-left: 3px solid #fbbf24;">
        <div style="font-size: 11.5px; font-weight: 700; color: #f8fafc;">4. Honest Uncertainty Handling</div>
        <div style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">
          Refuses to hallucinate when asked unsupported questions (e.g. demographic trends not in dataset). Distinguishes empirical facts from planning assumptions.
        </div>
      </div>

      <div class="callout-pill" style="margin-top: auto; border-color: rgba(52, 211, 153, 0.4); background: rgba(52, 211, 153, 0.08);">
        <strong>Demonstrated End-to-End:</strong> Live web application with full CRUD campaign management, persistent database, and AI copilot ready for evaluation.
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="foot-left">
      <span>RISA Growth APM Assignment | DILLIVERSE 2027</span>
      <span>Governance: Scale / Change / Stop Playbook</span>
      <span>Platform: FestGrowth Command Center & AI Copilot</span>
    </div>
    <div class="foot-right">Slide 3 of 3</div>
  </div>
</div>

</body>
</html>
"""

with open("slides.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("slides.html generated successfully.")

# Now compile to PDF using Playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    cwd = os.getcwd().replace("\\\\", "/")
    file_url = f"file:///{cwd}/slides.html"
    page.goto(file_url, wait_until="networkidle")
    
    # Take screenshot of each slide
    slides = page.locator(".slide").all()
    for idx, slide in enumerate(slides):
        slide.screenshot(path=f"slide_{idx+1}.png")
        print(f"Captured slide_{idx+1}.png")
    
    # Export full PDF in 16:9 landscape
    page.pdf(
        path="RISA_Growth_APM_Strategy_Mohit.pdf",
        width="1920px",
        height="1080px",
        print_background=True,
        margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"}
    )
    print("Exported RISA_Growth_APM_Strategy_Mohit.pdf successfully!")
    browser.close()
