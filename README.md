# FestGrowth — College Festival Growth Command Center

FestGrowth is an interactive Growth Product Management web application built for optimizing attendee acquisition for large-scale college festivals (**DILLIVERSE 2027** in Delhi NCR with a 10,000 verified attendee target, and historical baseline **CampusFest 2025**).

The platform combines real-time funnel telemetry, dynamic campaign management, team execution boards, and an embedded AI Growth Copilot powered by **Groq Cloud LPUs** (Language Processing Units).

---

## 🚀 Quick Start

### Prerequisites
* **Node.js** v18+ (tested on Node v20 & v22)
* **npm** v9+

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser:
# http://localhost:3000
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 💻 Core Product Capabilities

FestGrowth is built on **React 19 + Vite 8 + Tailwind CSS 4 + Lucide Icons + Recharts**. It operates as a unified, reactive single-page SaaS dashboard:

### 1. Real-Time Analytics Dashboard (`AnalyticsDashboard.jsx`)
* **Multi-Stage Conversion Funnel:** Real-time visualization of drop-off across all acquisition stages: `Target Reach → Portal Sessions → Form Initiations → Issued Passes → Verified Physical Admissions`.
* **Live KPI Telemetry:** 4 high-priority metrics with tabular numerals:
  * Verified Physical Admissions vs 10,000 Target.
  * Total Passes Issued & Goal Progress.
  * Marketing Capital Deployed vs Budget.
  * Blended Cost Per Attendee (CPA) & Cost Per Registration (CPR).
* **Show-Up Arbitrage Simulator:** Interactive slider allowing growth leads to simulate shifting capital from high-CPA digital channels to high-efficiency peer channels, showing live net attendee gain without increasing budget.
* **Dual Telemetry Mode:** Toggle instantly between live **DILLIVERSE 2027** targets and the **CampusFest 2025** historical baseline.

### 2. Campaign Manager with Reactive Recalculation (`CampaignManager.jsx`)
* Full CRUD capabilities: Create, Edit, Audit, and Delete campaigns.
* **Instant State Reactivity:** Modifying any campaign's budget, spend, registrations, or verified attendance instantly recalculates the entire dashboard, unit economics, and AI copilot context.
* Performance tracking across channels: Ambassadors, Society Battles, Referral Squads, Micro-Creators, and Performance Retargeting.

### 3. Task Management Execution Board (`TaskManager.jsx`)
* Operational task board tracking team directives by status (`Pending`, `In Progress`, `Completed`), priority (`High`, `Medium`, `Low`), owner, deadline, and linked campaign.
* **Closed-Loop AI Dispatch:** Recommendations from the AI Copilot can be approved with 1-click, instantly injecting structured tasks into this board with an `[AI Created]` badge.

### 4. Embedded AI Growth Analyst & Copilot (`AiAnalyst.jsx` & `aiAnalystEngine.js`)
* **Live Groq Cloud LPU Inference:** Connects directly to Groq's high-speed Language Processing Units (`qwen/qwen3.8-27b` and `openai/gpt-oss-120b`) delivering sub-second (~150ms) inference with live event context.
* **Grounded Intelligence:** Dynamically evaluates live campaign data, team assignments, historical baseline numbers, and stadium capacities in every query.
* **Insight-to-Execution:** Diagnoses bottlenecks (e.g. Paid Social drop-off) and proposes structured actionable tasks with interactive `[Approve & Create Task]` confirmation cards.
* **Disciplined Uncertainty Handling:** Explicitly cites data boundaries and refuses to hallucinate when asked unsupported questions (e.g. attendees from cities outside Delhi NCR, demographic age/gender split, or unverified multi-year forecasts).
* **Multi-Engine Flexibility:** Supports Groq Cloud (default), Google Gemini 2.5 Flash, or a deterministic client-side telemetry engine.

### 5. Evaluator Walkthrough Tour (`EvaluatorWalkthroughModal.jsx`)
* An interactive 8-step guided tour demonstrating every key growth requirement:
  1. North Star metric & stadium capacity alignment.
  2. The "Show-Up Divide" historical diagnosis.
  3. Live campaign editing and state reactivity.
  4. Team lead comparison audit (Meera vs Arjun).
  5. Mathematical what-if scenario simulations.
  6. Closed-loop task creation and execution.
  7. Data persistence verification across page refreshes.
  8. PM uncertainty boundary handling.

---

## 📊 Growth Strategy & Mathematical Foundations

### The "Show-Up Divide" (Empirical Finding)
Analysis of the historical dataset revealed a stark contrast between channel types:
* **Non-Peer Paid Channels (Paid Social & Broad Influencers):** Consumed **55.4%** of budget (₹1.52L) with only a **50.0%** show-up rate, resulting in an inflated CPA of **₹295.15**.
* **Peer & Society Channels (Ambassadors, Society Battles, Referrals):** Consumed **44.6%** of budget (₹1.08L) with an average **79.9%** show-up rate and a blended CPA of **₹88.89** (over **3.3x more capital efficient**).
* **Strategic Implication:** Scaling DILLIVERSE 2027 to 10,000 attendees requires constraining broad digital ad spend strictly to cart-retargeting, while allocating 75%+ of budget to campus rep networks and squad ticketing.

### Target Market & Venue Sizing (Delhi NCR)
* **Target Audience:** University of DU (North & South Campus), DTU, NSUT, IP University colleges, and NCR satellite campuses.
* **Market Funnel:**
  $$\text{Target Student Reach (600,000)} \xrightarrow{15\%} \text{Sessions (90,000)} \xrightarrow{33.3\%} \text{Form Starts (30,000)} \xrightarrow{41.7\%} \text{Passes (12,500)} \xrightarrow{80\%} \text{\textbf{10,000 Verified Attendees}}$$
* **Economics:** Marketing budget of ₹12,00,000 yields a target blended CPA of **₹120.00** across 10,000 verified admissions.
* **Venue Capacity:** Jawaharlal Nehru (JLN) Stadium grounds (18,000 capacity). A 10,000 total attendance across 2 days represents ~7,500 concurrent peak attendance (~42% venue capacity utilization), complying safely with Delhi Police crowd safety guidelines.

---

## 📁 Repository Structure

```
Risa-Assignment-MohitPant/
├── src/
│   ├── main.jsx                       # React entry point
│   ├── App.jsx                        # Main state container & tab routing
│   ├── index.css                      # Tailwind CSS v4 design tokens
│   ├── data/
│   │   └── festivalData.json          # Historical & DILLIVERSE dataset
│   ├── utils/
│   │   └── aiAnalystEngine.js         # Groq LPU, Gemini & telemetry engine
│   └── components/
│       ├── Header.jsx                 # Navbar, live status & walkthrough trigger
│       ├── AnalyticsDashboard.jsx     # Funnel charts, KPIs & campaign tables
│       ├── CampaignManager.jsx        # Campaign CRUD & live metric updates
│       ├── TaskManager.jsx            # Task management & status tracking
│       ├── AiAnalyst.jsx              # AI chat copilot & task approval card
│       └── EvaluatorWalkthroughModal.jsx # 8-step guided evaluator tour
├── index.html                         # Entry HTML with Inter & IBM Plex Mono fonts
├── package.json                       # Node dependencies and build scripts
├── package-lock.json                  # Locked dependency tree
├── vite.config.js                     # Vite build configuration
├── .env.example                       # Environment template for optional LLM keys
├── .gitignore                         # Standard git ignore rules
└── README.md                          # Documentation
```

---

## ⚙️ Environment Variables (Optional)

You can run the application with zero configuration. To connect a live Groq API key:
1. Create a `.env` file in the root directory:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```
2. Or open the **AI Growth Analyst** tab inside the application, click **Configure LLM (⚙️)**, and paste your API key directly in the browser settings drawer.
