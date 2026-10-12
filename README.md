# CallFlow — Support Command Hub

> **Mission Control + CRM for High-Velocity Call Centre Operations**

**Important Notice:**
*This project is frontend-only and uses mock data. No backend or external database is required.*

---

## 1. Project Overview

**CallFlow** is a modern, high-density **Live Customer Support Command Centre** crafted for frontline call-centre agents, support leads, and customer experience specialists.

Rather than looking like an ordinary administrative CRUD dashboard, CallFlow is designed from the ground up as an interactive mission-control cockpit. It unifies inbound queue handling, live call telemetry, DTMF dialing, customer 360 dossiers, vertical interaction timelines, task management, follow-up scheduling, and standard operational runbooks into a responsive, single-pane workspace.

---

## 2. Features

### Live Queue Pulse & Telemetry
- **Queue Pulse Indicator**: Real-time workload demand indicator (`Low`, `Moderate`, `High`) derived dynamically from queue depth and priority thresholds.
- **Live Running Wait-Timer**: Increments wait times in real-time (`MM:SS`) for all queued incoming callers.
- **Priority Badging**: Distinguishes `Critical`, `High`, `Medium`, and `Low` urgency inbound interactions.

### Active Call Experience & Workspace
- **Dynamic Call Session**: Accepting a call or initiating a dial immediately establishes an interactive call session.
- **Real-Time Duration Timer**: React state-driven session stopwatch running in seconds.
- **Call Health & Telemetry Metrics**:
  - Connection Quality (`Excellent`, `Good`, `Fair` with latency & jitter display).
  - Caller Sentiment (`Positive`, `Neutral`, `Frustrated` with direct agent override).
- **Intuitive Audio & Call Controls**:
  - **Mute / Unmute** with reactive status badges.
  - **Hold / Resume** with customer on-hold ribbon alert.
  - **Warm Transfer Modal** with destination department selection.
  - **Add Participant** bridge conference modal.
  - **DTMF Keypad** overlay for automated phone tree navigation.
  - **End Call Action** triggering the wrap-up summary flow.
- **Live In-Call Notes & Scratchpad**: Auto-attaches live agent notes to the final call record.
- **Audio Waveform Visualizer**: CSS-animated audio amplitude bars during connected calls.

### Smart Next Action Engine
- After concluding a call, CallFlow recommends intelligent follow-up actions based on the selected outcome:
  - `Resolved` ➔ Triggers automated CSAT survey dispatch and adjusted invoice delivery.
  - `Follow-up required` ➔ Automatically prompts callback scheduling within 24 hours.
  - `Escalated` ➔ Formulates Tier 3 engineering ticket and logs lead dispatch.
  - `Customer unavailable` ➔ Sends automated callback links and schedules voicemail reminders.

### Customer 360 View & Interaction Timeline
- **Customer Dossier**: High-fidelity view displaying tier (`Enterprise`, `Premium`, `Standard`), status (`VIP`, `Active`, `At Risk`, `New`), client tenure, and contact channels.
- **Recent Customer Memory**: Direct display of *Last Interaction* timestamp and *Open Commitments / SLA Deadlines*.
- **Vertical Interaction Timeline**: Chronological log of phone calls, emails, chat sessions, and system notes, complete with sentiment markers, durations, and handling agents.
- **Direct Action Triggers**: Quick "Call Customer", "Assign Task", and "Schedule Follow-up" directly from the customer dossier.

### Global Search & Command Palette (`Ctrl + K`)
- High-speed command palette supporting fuzzy search across:
  - Customers by Name, ID, Phone, Company, or Email.
  - Navigation pages (`Command Centre`, `Calls`, `Customers`, `Tasks`, `Follow-ups`, `KB`, `Reports`, `Settings`).
  - Fast status changes (`Available`, `Busy`, `On Break`).
  - Quick action modal triggers (Keypad dialer, new customer, create task).

### Task & Follow-Up Management
- **Task Board**: Filterable by `My Tasks`, `Due Today`, `Upcoming`, and `Completed` with checkbox toggles and priority chips.
- **Follow-up Calendar**: Segmented by `Today` and `Upcoming` with interactive rescheduling modals.

### Certified Knowledge Base
- Searchable directory of runbooks categorized by `Billing`, `Account`, `Technical Support`, `Refunds`, `Products`, and `Policies`.
- Interactive reader modal with **"Was this article helpful?"** voting and **"Copy to Call Notes"** clipboard integration.

### Agent Quality Scorecard & Performance Reports
- Evaluates **Calls Handled**, **Resolution Rate**, **Average Handle Time (AHT)**, **CSAT (94%)**, and **First-Call Resolution (FCR: 89%)**.
- Clean, non-overloaded SVG charts showing hourly call volume distribution and case outcome percentages.
- Verified customer feedback quotes from post-call surveys.

### Operator Customization & Dark Mode
- Full support for **Light** and **Dark Command Hub** themes.
- Configurable desktop notifications, priority alert mode, and compact display density.
- State persistence powered by `localStorage` with a 1-click factory reset button.

---

## 3. Design Concept: "Mission Control + CRM"

CallFlow departs from generic template dashboards by combining the high-density efficiency of an operations command centre with the elegance of modern customer relationship tools:
- **Color Palette**: Deep slate foundations (`slate-900` / `slate-950`) accented with crisp technical cyan/indigo (`command-600`), live emerald (`emerald-500`), waiting amber (`amber-500`), and alert rose (`rose-500`).
- **Typography**: Clean, geometric typography powered by **Inter** alongside **JetBrains Mono** for timers, customer IDs, and telemetry.
- **Subtle Micro-Animations**: Live radar sweep, audio wave pulsing, and smooth dialog transitions designed for high usability without visual distraction.
- **High Information Density**: Structured card matrices that prioritize actionable buttons and reduce scroll fatigue.

---

## 4. Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite
- **Routing**: React Router DOM (`BrowserRouter`)
- **Styling**: Tailwind CSS + Custom Design System Tokens
- **Icons**: Lucide React
- **State Management**: React Context (`AppContext`) with `localStorage` persistence
- **Architecture**: Modular functional components with custom hooks

---

## 5. Project Structure

```text
CallCentre/
├── index.html                   # HTML entry point with Google Fonts & metadata
├── package.json                 # Project dependencies & npm scripts
├── postcss.config.js            # PostCSS configuration for Tailwind CSS
├── tailwind.config.js           # Custom command hub color tokens & animations
├── tsconfig.json                # TypeScript root configuration
├── tsconfig.app.json            # Vite client TypeScript compilation rules
├── src/
│   ├── App.tsx                  # Main router and layout shell
│   ├── main.tsx                 # React DOM mount point
│   ├── index.css                # Tailwind directives & audio wave animations
│   ├── types/
│   │   └── index.ts             # Shared TypeScript definitions
│   ├── context/
│   │   └── AppContext.tsx       # State store, queue timer, and local storage sync
│   ├── data/
│   │   └── mockData.ts          # Realistic mock datasets (Customers, Queue, Calls, etc.)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Top bar with status dropdown, search, & notifications
│   │   │   └── Sidebar.tsx      # Collapsible navigation drawer
│   │   ├── active-call/
│   │   │   └── ActiveCallWorkspace.tsx  # Telemetry, timer, mute/hold/transfer controls
│   │   ├── modals/
│   │   │   ├── CallSummaryModal.tsx     # Wrap-up summary & Smart Next Action engine
│   │   │   └── QuickModals.tsx          # New Customer, Task, Follow-Up, & Dialer modals
│   │   └── common/
│   │       ├── CommandPalette.tsx       # Ctrl+K global search & action palette
│   │       └── ToastContainer.tsx       # Floating reactive toast notifications
│   └── pages/
│       ├── Dashboard.tsx        # Command Centre with KPI snapshot & Live Queue
│       ├── Calls.tsx            # Historical call logs & simulated playback
│       ├── Customers.tsx        # Customer directory with tiered badges
│       ├── CustomerDetails.tsx  # Customer 360 view with vertical interaction timeline
│       ├── Tasks.tsx            # Task management by urgency and category
│       ├── FollowUps.tsx        # Calendar appointments and callback reschedule
│       ├── KnowledgeBase.tsx    # Certified runbooks with reader modal & feedback
│       ├── Reports.tsx          # Performance metrics, FCR, CSAT, & hourly volume
│       └── Settings.tsx         # Theme toggle, notification rules, & data reset
└── README.md
```

---

## 6. How to Run

### Prerequisites
- Node.js version 18 or newer
- npm version 9 or newer

### Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173/`.

### Production Build
To validate TypeScript types and generate production-ready bundles:
```bash
npm run build
```
Preview the built production output:
```bash
npm run preview
```

---

## 7. Available Pages & Routes

| Path | Screen | Purpose |
|---|---|---|
| `/` | **Command Centre** | Overview of queue pulse, snapshot KPIs, live queue, and workload. |
| `/calls` | **Calls & Telemetry** | Historical call logs, audio playback simulator, and wrap-up notes. |
| `/customers` | **Customers Directory** | Searchable grid of accounts with tier & risk indicators. |
| `/customers/:id` | **Customer 360 View** | Vertical timeline, recent customer memory, dossier notes, & tasks. |
| `/tasks` | **Task Queue** | Operational items with completion toggling and urgency filtering. |
| `/follow-ups` | **Follow-ups Calendar** | Scheduled callbacks with interactive reschedule modals. |
| `/knowledge-base` | **Knowledge Base** | Indexed runbooks, copyable instructions, and voting. |
| `/reports` | **Performance Reports** | Quality scorecard, FCR, CSAT ratings, and hourly volume chart. |
| `/settings` | **Operator Settings** | Dark mode toggle, audio alert triggers, and local reset. |

---

## 8. Key UX Decisions

1. **Persistent Active Call Banner**: When a call is answered, the Active Call workspace remains prominent so the agent can take notes, view live customer dossier details, and adjust audio without navigating away.
2. **Keyboard Accessibility**: Global shortcut `Ctrl + K` (or `Cmd + K`) provides immediate access to navigation, search, and action triggers without requiring mouse travel.
3. **Smart Next Action Engine**: Frontend rule-based logic suggests the next action (e.g. scheduling a follow-up or triggering a satisfaction survey) based on the call outcome.
4. **Recent Customer Memory**: The Customer 360 view spotlights *Last Interaction* and *Open Commitments* so the agent never has to dig through history while talking to a customer.
5. **Simulated Real-World Telemetry**: Running wait timers and call duration timers recreate the realistic pace of a busy contact center.

---

## 9. Mock Data Details

The application includes rich, fictional mock data:
- **11 Customers**: Spanning Enterprise, Premium, and Standard tiers across healthcare, fintech, media, and logistics industries.
- **5 Live Queue Inbounds**: Covering billing disputes, SAML SSO certificate renewal, GPU render queues, and POS terminal issues.
- **10 Call Records**: Complete with duration timestamps, agent notes, outcomes, and customer sentiment ratings.
- **8 Tasks**: With realistic deadlines and departmental categories.
- **6 Follow-ups**: Including scheduled callback times and reason details.
- **10 Knowledge Base Articles**: Step-by-step troubleshooting runbooks with helpfulness ratings.
- **10 Notifications**: Priority alerts, SLA deadlines, and survey results.

---

## 10. AI Tools Used

During the architecture and development of this frontend project, the following AI tools and models were used:
- **Antigravity / Advanced Agentic Coding**: Autonomous pair programming, workspace initialization, and tool execution.
- **Google Gemini 3.6 Flash**: Architecture planning, TypeScript data modeling, component design, responsive styling, and automated build verification.

---

## 11. Future Improvements

- WebAudio API integration for synthesized DTMF dual-tone multi-frequency sounds and incoming ringtone simulation.
- Real-time WebRTC audio bridging for live microphone loopback testing.
- Export to PDF/CSV for call reports and compliance logs.
- Multi-agent collaboration simulation with incoming mock chat messages.
