/* ==========================================================================
   PRIME CONSTRUCTION — 2026 NIGERIAN CONTEMPORARY HOUSE COST & PLACEMENT FEE ENGINE
   Empirical Building Cost Models, Material Sizing & Pre-Construction Fee Scale
   ========================================================================== */

// --- Data Models for Nigerian Contemporary Housing ---
const NIGERIAN_BUILDING_MODELS = {
  'bungalow-3bed': {
    name: '3-Bedroom Contemporary Bungalow (Minimalist Parapet / Hidden Roof)',
    grossArea: 200, // m²
    timeline: '4 – 6 Months',
    standardRatePerSqm: 220000, // ₦220k/m²
    luxuryRatePerSqm: 310000,   // ₦310k/m²
    materials: {
      cementBags: 1100,
      rebarTonnes: 7.5,
      graniteTrucks: 11,
      sandTrucks: 14,
      blocks: 6500
    },
    baseProfFees: {
      arch: 1200000,
      structural: 450000,
      mep: 350000,
      qs: 350000,
      soil: 450000,
      permits: 550000,
      pm: 1200000
    }
  },
  'duplex-4bed': {
    name: '4-Bedroom Contemporary Terrace / Semi-Detached Duplex',
    grossArea: 280, // m²
    timeline: '6 – 8 Months',
    standardRatePerSqm: 270000, // ₦270k/m²
    luxuryRatePerSqm: 390000,   // ₦390k/m²
    materials: {
      cementBags: 1850,
      rebarTonnes: 14.5,
      graniteTrucks: 18,
      sandTrucks: 22,
      blocks: 9200
    },
    baseProfFees: {
      arch: 2400000,
      structural: 950000,
      mep: 750000,
      qs: 650000,
      soil: 500000,
      permits: 850000,
      pm: 2200000
    }
  },
  'duplex-5bed': {
    name: '5-Bedroom Contemporary Fully-Detached Smart Villa with Penthouse & BQ',
    grossArea: 380, // m²
    timeline: '8 – 11 Months',
    standardRatePerSqm: 295000, // ₦295k/m²
    luxuryRatePerSqm: 460000,   // ₦460k/m²
    materials: {
      cementBags: 2600,
      rebarTonnes: 21,
      graniteTrucks: 26,
      sandTrucks: 32,
      blocks: 12800
    },
    baseProfFees: {
      arch: 3800000,
      structural: 1450000,
      mep: 1100000,
      qs: 950000,
      soil: 550000,
      permits: 1350000,
      pm: 3200000
    }
  },
  'flats-block': {
    name: 'Block of 6 Units Contemporary 2-Bedroom Luxury Apartments (G+2 Floors)',
    grossArea: 780, // m²
    timeline: '10 – 14 Months',
    standardRatePerSqm: 265000, // ₦265k/m²
    luxuryRatePerSqm: 395000,   // ₦395k/m²
    materials: {
      cementBags: 4900,
      rebarTonnes: 42,
      graniteTrucks: 52,
      sandTrucks: 64,
      blocks: 24500
    },
    baseProfFees: {
      arch: 6500000,
      structural: 2800000,
      mep: 1950000,
      qs: 1800000,
      soil: 750000,
      permits: 2200000,
      pm: 5500000
    }
  }
};

// Location Multipliers across Nigeria
const LOCATION_MULTIPLIERS = {
  'abuja-prime': { name: 'Abuja FCT (Maitama, Guzape, Asokoro, Wuse, CBD)', factor: 1.08 },
  'abuja-suburban': { name: 'Abuja FCT (Gwarinpa, Lugbe, Kubwa, Jahi, Lokogoma)', factor: 1.00 },
  'lagos-island': { name: 'Lagos Island (Ikoyi, Victoria Island, Lekki Phase 1)', factor: 1.15 },
  'lagos-mainland': { name: 'Lagos Mainland (Ikeja GRA, Magodo, Surulere, Yaba)', factor: 1.04 },
  'ph-oil': { name: 'Rivers State (Port Harcourt / GRA / Trans-Amadi)', factor: 1.07 },
  'regional-metro': { name: 'Other Nigerian Metros (Ibadan, Enugu, Kano, Benin, Asaba)', factor: 0.94 }
};

// Number formatter for Nigerian Naira (₦)
function formatNaira(amount) {
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

// Format millions for quick badges
function formatMillionShort(amount) {
  return '₦' + (amount / 1000000).toFixed(1) + 'M';
}

document.addEventListener('DOMContentLoaded', () => {
  initCostCalculator();
  initCostTabs();
});

function initCostTabs() {
  const tabBtns = document.querySelectorAll('.cost-view-tab');
  const viewPanes = document.querySelectorAll('.cost-view-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetView = btn.getAttribute('data-view');
      viewPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetView) {
          pane.classList.add('active');
        }
      });
    });
  });
}

function initCostCalculator() {
  const typologySelect = document.getElementById('calcTypologySelect');
  const finishSelect = document.getElementById('calcFinishSelect');
  const locationSelect = document.getElementById('calcLocationSelect');
  const profCheckboxes = document.querySelectorAll('.calc-prof-check');

  if (!typologySelect || !finishSelect || !locationSelect) return;

  function calculateAndRender() {
    const typologyKey = typologySelect.value;
    const finishKey = finishSelect.value;
    const locationKey = locationSelect.value;

    const model = NIGERIAN_BUILDING_MODELS[typologyKey];
    const location = LOCATION_MULTIPLIERS[locationKey];
    if (!model || !location) return;

    // 1. Calculate Construction Cost
    const ratePerSqm = finishKey === 'luxury' ? model.luxuryRatePerSqm : model.standardRatePerSqm;
    const baseConstructionCost = model.grossArea * ratePerSqm * location.factor;

    // Construction range (-5% to +8%)
    const costLow = baseConstructionCost * 0.95;
    const costHigh = baseConstructionCost * 1.08;

    // 2. Calculate Professional Placement Fees
    let totalProfFees = 0;
    const activeProfServices = [];

    profCheckboxes.forEach(cb => {
      if (cb.checked) {
        const feeKey = cb.getAttribute('data-fee');
        const feeVal = (model.baseProfFees[feeKey] || 0) * (finishKey === 'luxury' ? 1.2 : 1.0);
        totalProfFees += feeVal;
        activeProfServices.push({
          key: feeKey,
          label: cb.getAttribute('data-label'),
          amount: feeVal
        });

        const feeBadge = document.getElementById(`feeBadge_${feeKey}`);
        if (feeBadge) {
          feeBadge.textContent = formatNaira(feeVal);
        }
      }
    });

    // 3. Update DOM Displays
    const costRangeEl = document.getElementById('calcCostRange');
    const costPerSqmEl = document.getElementById('calcCostPerSqm');
    const profFeeTotalEl = document.getElementById('calcProfFeeTotal');
    const totalProjectBudgetEl = document.getElementById('calcTotalProjectBudget');
    const timelineEl = document.getElementById('calcTimeline');
    const grossAreaEl = document.getElementById('calcGrossArea');

    if (costRangeEl) costRangeEl.textContent = `${formatMillionShort(costLow)} – ${formatMillionShort(costHigh)}`;
    if (costPerSqmEl) costPerSqmEl.textContent = `${formatNaira(ratePerSqm * location.factor)} / m²`;
    if (profFeeTotalEl) profFeeTotalEl.textContent = formatNaira(totalProfFees);
    if (totalProjectBudgetEl) totalProjectBudgetEl.textContent = `${formatMillionShort(costLow + totalProfFees)} – ${formatMillionShort(costHigh + totalProfFees)}`;
    if (timelineEl) timelineEl.textContent = model.timeline;
    if (grossAreaEl) grossAreaEl.textContent = `${model.grossArea} m² Gross Footprint`;

    // 4. Update Material Take-Off Estimates
    const cementEl = document.getElementById('matEstCement');
    const rebarEl = document.getElementById('matEstRebar');
    const graniteEl = document.getElementById('matEstGranite');
    const sandEl = document.getElementById('matEstSand');
    const blocksEl = document.getElementById('matEstBlocks');

    if (cementEl) cementEl.textContent = `~${model.materials.cementBags.toLocaleString()} Bags`;
    if (rebarEl) rebarEl.textContent = `~${model.materials.rebarTonnes} Tonnes`;
    if (graniteEl) graniteEl.textContent = `~${model.materials.graniteTrucks} Trips (30T)`;
    if (sandEl) sandEl.textContent = `~${model.materials.sandTrucks} Trips (20T)`;
    if (blocksEl) blocksEl.textContent = `~${model.materials.blocks.toLocaleString()} Vibrated Blocks`;

    // 5. Store current state for Transfer to RFQ Modal
    window.currentCalculatedEstimate = {
      typology: model.name,
      typologyKey: typologyKey,
      finish: finishKey === 'luxury' ? 'Ultra-Luxury Contemporary Smart' : 'Tier-1 Contemporary Standard',
      location: location.name,
      costRange: `${formatMillionShort(costLow)} – ${formatMillionShort(costHigh)}`,
      totalWithFees: `${formatMillionShort(costLow + totalProfFees)} – ${formatMillionShort(costHigh + totalProfFees)}`,
      profFees: formatNaira(totalProfFees),
      timeline: model.timeline,
      grossArea: `${model.grossArea} m²`
    };
  }

  // Bind change events
  typologySelect.addEventListener('change', calculateAndRender);
  finishSelect.addEventListener('change', calculateAndRender);
  locationSelect.addEventListener('change', calculateAndRender);
  profCheckboxes.forEach(cb => cb.addEventListener('change', calculateAndRender));

  // Initial calculation
  calculateAndRender();
}

// Function to transfer calculator results directly into RFQ Tender modal
window.transferEstimateToRfq = function() {
  if (typeof openRfqModal !== 'function') return;
  openRfqModal();

  const est = window.currentCalculatedEstimate;
  if (!est) return;

  // Pre-select RFQ typology
  let rfqTargetVal = 'luxury';
  if (est.typologyKey === 'bungalow-3bed') rfqTargetVal = 'luxury';
  else if (est.typologyKey === 'duplex-4bed' || est.typologyKey === 'duplex-5bed') rfqTargetVal = 'luxury';
  else if (est.typologyKey === 'flats-block') rfqTargetVal = 'commercial';

  const cards = document.querySelectorAll('.rfq-option-card');
  cards.forEach(c => {
    if (c.getAttribute('data-value') === rfqTargetVal) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });

  // Pre-fill brief notes textarea if available
  const notesField = document.querySelector('#rfqStep3 textarea');
  if (notesField) {
    notesField.value = `[Generated from Prime Construction 2026 Cost Estimator]\nProject: ${est.typology}\nFinishing Grade: ${est.finish}\nTarget Location: ${est.location}\nGross Footprint: ${est.grossArea}\nEstimated Construction Range: ${est.costRange}\nTotal Budget incl. Professional Fees: ${est.totalWithFees}\nTarget Timeline: ${est.timeline}`;
  }
};
