# Prime Construction Ltd — Corporate Web Portal & Construction Cost Intelligence Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with HTML5/CSS3/Vanilla JS](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20JS-orange)](index.html)
[![Location: Abuja, Nigeria](https://img.shields.io/badge/HQ-Abuja%2C%20Nigeria-green)](#)

A modern, high-impact web portal for **Prime Construction Ltd** (established June 20, 2016 in Abuja, Nigeria). The platform showcases landmark civil and commercial infrastructure projects, in-house architectural BIM design studios, a heavy machinery arsenal, an empirical 2026 Nigerian house construction cost calculator, and a live engineering concierge with direct Telegram desk integration.

---

## 🏛️ Company Profile

- **Legal Entity:** Prime Construction Ltd
- **Date of Incorporation:** June 20, 2016
- **Headquarters:** Suite A20, Nkwegu Plaza, Area 1 Garki, FCT Abuja, Nigeria
- **Corporate Email:** primeconst@gmail.com
- **Official Telegram Desk:** [@primeconstruction_ng](https://t.me/primeconstruction_ng)
- **Workforce Strength:** 150+ In-House Professionals across 9 Specialized Divisions
- **Heavy Fleet Arsenal:** 40+ Direct-Owned Units (CAT Crawler Excavators, Liebherr Telescopic Mobile Cranes, Actros 30T Tippers)

---

## ✨ Core Portal Features

1. **High-Impact Entrance & Live Metric Trackers:**
   - Visual architectural showcase featuring Tier-1 corporate horizons.
   - Dynamic animated KPI counters (*10+ Years of Mastery, 150+ In-House Staff, 9 Specialized Divisions, 98.6% On-Schedule Delivery*).

2. **Multi-Stream Cinematic Slider ("Life at Prime"):**
   - Perspective filtering across Architects in Studio, Engineers Planning, Site Crew in Action, Fleet Arsenal, Luxury Estates, and Commercial Landmarks.
   - Touch-enabled swipe gestures (`touchstart`, `touchend`) with automatic progress tracking and pause-on-hover.

3. **Landmark Projects Showcase:**
   - Filterable portfolio: *The Guzape Hillside Enclave*, *The Capital Apex Commercial Plaza*, *FCT Expressway Dualization*, *Sterling Heights Corporate Tower*, and *Model Civic Police Station Reconstruction*.
   - Interactive project dossiers featuring a **touch-draggable Before/After comparison slider** illustrating the transformation from raw excavation to completed structural delivery.

4. **2026 Nigerian House Construction Cost & Pre-Construction Placement Fee Matrix:**
   - **Interactive BOQ & Budget Estimator:** Real-time pricing models for 3-Bed Bungalows, 4-Bed Duplexes, 5-Bed Luxury Smart Villas, and Multi-Unit Apartment Blocks across Nigerian zones (Abuja, Lagos, Port Harcourt, and Regional Metros).
   - **Pre-Construction Fee Placement Engine:** Selectable professional packages aligned with statutory councils (**ARCON / NIA** for Architecture, **COREN / NSE** for Structural/MEP Engineering, and **QSRBN / NIQS** for Quantity Surveying).
   - **Empirical Material Take-Off Sizing:** Instant estimates for cement bags, rebar steel tonnage, granite/sand haulage, and vibrated blocks.
   - Direct transfer to formal RFQ tender bids.

5. **Abuja Headquarters Spotlight ("The Nerve Center"):**
   - Architectural BIM studio, structural planning deck, executive boardroom, and real-time fleet telemetry dispatch.
   - Interactive virtual tour experience modal with categorized room walk-throughs.

6. **Live AI Concierge & Official Telegram Integration:**
   - Built-in floating chat concierge ("Prime Engineering AI") answering queries regarding project timelines, building costs, machinery availability, and pre-construction fees.
   - One-click routing to the official **Telegram Direct Desk** (`@primeconstruction_ng`) and WhatsApp channels.

7. **Fully Mobile-First Responsive Design:**
   - Fluid typography, touch-friendly tap targets (minimum 44–48px), swipeable horizontal pill ribbons, and adaptive full-screen mobile chat modes.

---

## 🛠️ Technology Stack

- **Structure:** Semantic HTML5 with accessibility attributes (`aria-labels`, role landmarks).
- **Styling:** Modular Vanilla CSS3 utilizing CSS Custom Properties (`variables.css`), responsive grid/flexbox layouts, glassmorphism, and micro-animations.
- **Color Palette:** Warm Milk Canvas (`#FAF8F5`), Structural Sky Blue (`#0284C7`), Prime Safety Red (`#DC2626`), and Architectural Gold (`#D97706`).
- **Logic:** Vanilla JavaScript (ES6+) modules:
  - `slider.js` — Touch swipe & auto-rotating cinematic slider.
  - `modals.js` — Dossier controller & touch-enabled transformation comparison slider.
  - `cost-calculator.js` — Dynamic Nigerian building cost and professional placement fee computation engine.
  - `chatbot.js` — Concierge messaging system and query parser.
  - `app.js` — Sticky navigation, mobile drawer toggle, and animated intersection counters.
- **Icons:** [Lucide Icons](https://lucide.dev/) via CDN.

---

## 🚀 Local Development & Preview

To run the portal locally without external dependencies:

```bash
# Clone the repository
git clone https://github.com/JosephOkyte/Prime_Construction_Ltd.git

# Navigate into project directory
cd Prime_Construction_Ltd

# Serve using any standard static file server (or Node.js)
node -e "const http=require('http'),fs=require('fs'),path=require('path');const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};http.createServer((req,res)=>{let p=path.join(process.cwd(),req.url==='/'?'index.html':req.url.split('?')[0]);fs.readFile(p,(e,d)=>{if(e){res.writeHead(404);res.end('Not found');}else{res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'text/plain'});res.end(d);}})}).listen(3000,()=>console.log('Server running at http://localhost:3000'));"
```

Open your browser and navigate to `http://localhost:3000`.

---

## 📄 License & Attribution

Copyright © 2016–2026 **Prime Construction Ltd**. All rights reserved.
Suite A20, Nkwegu Plaza, Area 1 Garki, FCT Abuja, Nigeria.
