/* ==========================================================================
   PRIME CONSTRUCTION — MODALS CONTROLLER & BEFORE/AFTER INTERACTIVE ENGINE
   Project Dossiers, HQ Virtual Tour, RFQ Estimator & Touch Handlers
   ========================================================================== */

// --- Project Data Store ---
const PROJECT_DATABASE = {
  'guzape-estate': {
    title: 'Guzape Luxury Hillside Residential Estate',
    category: 'Luxury Residential',
    location: 'Guzape District, FCT Abuja',
    status: 'Completed (Handed Over)',
    client: 'Private Sovereign Real Estate Fund',
    area: '34,500 m² (24 Bespoke Villas)',
    timeline: '22 Months (Delivered 18 Days Early)',
    structure: 'Reinforced Post-Tensioned Concrete & Structural Glazing',
    desc: 'An ultra-luxury gated enclave nestled into the topography of Guzape hills. Engineered with terraced retaining systems, private infinity pools, subterranean climate-controlled car vaults, and bespoke Nigerian teak timber accents paired with floor-to-ceiling insulated curtain walls.',
    heroImg: 'assets/images/luxury_residential_estate.jpg',
    beforeImg: 'assets/images/construction_site_crew.jpg',
    afterImg: 'assets/images/luxury_residential_estate.jpg'
  },
  'capital-plaza': {
    title: 'Capital Apex Commercial Plaza & Mall',
    category: 'Commercial Landmark',
    location: 'Central Business District, FCT Abuja',
    status: 'Completed (Active Commercial Hub)',
    client: 'Apex Commercial Consortium Ltd',
    area: '48,000 m² Gross Leasable Area',
    timeline: '26 Months Delivery',
    structure: 'Composite Steel Frame & High-Performance Solar Facade',
    desc: 'A Tier-1 commercial destination featuring a five-story cascading central atrium, high-speed panoramic elevator shafts, basement multi-tier parking for 450 vehicles, and redundant solar-diesel microgrid power generation designed for continuous 24/7 business continuity.',
    heroImg: 'assets/images/hero_corporate_landmark.jpg',
    beforeImg: 'assets/images/construction_site_crew.jpg',
    afterImg: 'assets/images/hero_corporate_landmark.jpg'
  },
  'fct-dualization': {
    title: 'FCT Arterial Dualization & Bridge Infrastructure',
    category: 'Civil & Infrastructure',
    location: 'Outer Northern Expressway Link, Abuja',
    status: 'Completed (Federal Ministry Approved)',
    client: 'Federal Capital Development Authority (FCDA)',
    area: '14.8 km Dual-Carriageway + 2 Pre-Stressed Overpasses',
    timeline: '18 Months Delivery',
    structure: 'High-Modulus Asphalt Concrete & Pre-Cast Girders',
    desc: 'Major urban civil transport intervention executing deep earth cuts, reinforced concrete box culverts, storm drainage canalization, and high-performance asphalt pavement engineered for heavy axle loads and zero flooding across peak monsoon periods.',
    heroImg: 'assets/images/machinery_fleet_arsenal.jpg',
    beforeImg: 'assets/images/construction_site_crew.jpg',
    afterImg: 'assets/images/machinery_fleet_arsenal.jpg'
  },
  'sterling-tower': {
    title: 'Sterling Heights Corporate Tower',
    category: 'Commercial Landmark',
    location: 'Central Business District, Abuja',
    status: 'Ongoing (Superstructure Phase)',
    client: 'Sterling Institutional Holdings',
    area: '28,000 m² (14 Stories + 2 Basements)',
    timeline: 'Delivery Projected Q4 2026',
    structure: 'Core-Tube Concrete with Double-Skin Energy Facade',
    desc: 'Next-generation intelligent corporate headquarters currently at Level 10 superstructure casting. Designed for LEED Silver certification with integrated rainwater harvesting, low-E ceramic frit glazing, and smart building management telemetry.',
    heroImg: 'assets/images/hero_corporate_landmark.jpg',
    beforeImg: 'assets/images/construction_site_crew.jpg',
    afterImg: 'assets/images/hero_corporate_landmark.jpg'
  },
  'police-station': {
    title: 'Model Civic Police Headquarters & Command Center',
    category: 'Civic & Security Reconstruction',
    location: 'Bwari Area Council, FCT Abuja',
    status: 'Completed (Civic Commissioning)',
    client: 'Nigeria Police Force & Ministry of Interior',
    area: '8,200 m² High-Security Administrative Compound',
    timeline: '11 Months Fast-Track Turnaround',
    structure: 'Reinforced Ballistic Concrete & Perimeter Security Ring',
    desc: 'Rapid complete structural overhaul and modern expansion of a historic civic station. Upgraded with modern interrogation suites, digital command telecommunications, ballistic-rated armory vaults, and reliable independent solar energy grid.',
    heroImg: 'assets/images/engineers_planning_room.jpg',
    beforeImg: 'assets/images/construction_site_crew.jpg',
    afterImg: 'assets/images/engineers_planning_room.jpg'
  }
};

// --- Modal Elements ---
let globalOverlay, projectModal, hqModal, rfqModal;

document.addEventListener('DOMContentLoaded', () => {
  globalOverlay = document.getElementById('globalModalOverlay');
  projectModal = document.getElementById('projectDetailModal');
  hqModal = document.getElementById('hqTourModal');
  rfqModal = document.getElementById('rfqModal');

  // Close buttons inside modals
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Close when clicking directly on overlay backdrop
  if (globalOverlay) {
    globalOverlay.addEventListener('click', (e) => {
      if (e.target === globalOverlay) {
        closeModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && globalOverlay && globalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Setup HQ Tour Tab Navigation
  setupHqTourTabs();

  // Setup RFQ Multi-step form flow
  setupRfqWizard();

  // Initialize Comparison Slider touch & mouse listeners
  setupComparisonSlider();
});

// --- Modal Open / Close Functions ---
function openModal(container) {
  if (!globalOverlay || !container) return;
  
  // Hide all modals first
  [projectModal, hqModal, rfqModal].forEach(m => {
    if (m) m.style.display = 'none';
  });

  // Show requested container and overlay
  container.style.display = 'block';
  globalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Re-run Lucide icons in case new elements rendered
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeModal() {
  if (!globalOverlay) return;
  globalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    [projectModal, hqModal, rfqModal].forEach(m => {
      if (m) m.style.display = 'none';
    });
  }, 300);
}

// Global functions attached to window for HTML onclick
window.closeModal = closeModal;

window.openProjectModal = function(projectId) {
  const data = PROJECT_DATABASE[projectId];
  if (!data || !projectModal) return;

  // Populate data
  document.getElementById('modalProjectTitle').textContent = data.title;
  document.getElementById('modalProjectCategory').textContent = data.category;
  document.getElementById('modalProjectLocation').innerHTML = `<i data-lucide="map-pin" style="width: 14px; height: 14px; display: inline;"></i> ${data.location}`;
  document.getElementById('modalProjectStatus').textContent = data.status;
  document.getElementById('modalProjectClient').textContent = data.client;
  document.getElementById('modalProjectArea').textContent = data.area;
  document.getElementById('modalProjectTimeline').textContent = data.timeline;
  document.getElementById('modalProjectStructure').textContent = data.structure;
  document.getElementById('modalProjectDesc').textContent = data.desc;

  const heroImg = document.getElementById('modalHeroImg');
  if (heroImg) heroImg.src = data.heroImg;

  const beforeImg = document.getElementById('compImgBefore');
  const afterImg = document.getElementById('compImgAfter');
  if (beforeImg) beforeImg.src = data.beforeImg;
  if (afterImg) afterImg.src = data.afterImg;

  // Reset comparison slider to 50%
  resetComparisonSlider();

  openModal(projectModal);
};

window.openHqModal = function() {
  if (hqModal) {
    openModal(hqModal);
  }
};

window.openRfqModal = function() {
  if (rfqModal) {
    // Reset RFQ form
    resetRfqWizard();
    openModal(rfqModal);
  }
};

// --- HQ Tour Tabs ---
function setupHqTourTabs() {
  const tabs = document.querySelectorAll('.hq-tour-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const paneId = tab.getAttribute('data-pane');
      document.querySelectorAll('.hq-tour-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === paneId) {
          pane.classList.add('active');
        }
      });
    });
  });
}

// --- Interactive Before & After Slider (Touch + Pointer) ---
function resetComparisonSlider() {
  const beforeWrap = document.getElementById('compBeforeWrap');
  const handle = document.getElementById('compHandle');
  if (beforeWrap) beforeWrap.style.width = '50%';
  if (handle) handle.style.left = '50%';
}

function setupComparisonSlider() {
  const container = document.getElementById('comparisonContainer');
  const beforeWrap = document.getElementById('compBeforeWrap');
  const handle = document.getElementById('compHandle');
  if (!container || !beforeWrap || !handle) return;

  let isSliding = false;

  function setSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let posX = clientX - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    beforeWrap.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Pointer Events (supports mouse, touch & stylus)
  container.addEventListener('pointerdown', (e) => {
    isSliding = true;
    container.setPointerCapture(e.pointerId);
    setSliderPosition(e.clientX);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isSliding) return;
    setSliderPosition(e.clientX);
  });

  const stopSliding = (e) => {
    if (isSliding) {
      isSliding = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  container.addEventListener('pointerup', stopSliding);
  container.addEventListener('pointercancel', stopSliding);

  // Fallback direct touchmove for iOS Safari webviews
  container.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      setSliderPosition(e.touches[0].clientX);
    }
  }, { passive: true });
}

// --- RFQ Multi-step Wizard ---
function resetRfqWizard() {
  const formContainer = document.getElementById('rfqFormContainer');
  const successBox = document.getElementById('rfqSuccessBox');
  if (formContainer) formContainer.style.display = 'block';
  if (successBox) successBox.style.display = 'none';

  setRfqStep(1);
}

function setRfqStep(step) {
  const step1 = document.getElementById('rfqStep1');
  const step2 = document.getElementById('rfqStep2');
  const step3 = document.getElementById('rfqStep3');
  const ind1 = document.getElementById('rfqInd1');
  const ind2 = document.getElementById('rfqInd2');
  const ind3 = document.getElementById('rfqInd3');
  const backBtn = document.getElementById('rfqBackBtn');
  const nextBtn = document.getElementById('rfqNextBtn');

  if (!step1 || !step2 || !step3) return;

  step1.style.display = step === 1 ? 'block' : 'none';
  step2.style.display = step === 2 ? 'block' : 'none';
  step3.style.display = step === 3 ? 'block' : 'none';

  // Indicator classes
  if (ind1) {
    ind1.className = 'rfq-step-circle ' + (step === 1 ? 'active' : 'completed');
  }
  if (ind2) {
    ind2.className = 'rfq-step-circle ' + (step === 2 ? 'active' : (step > 2 ? 'completed' : ''));
  }
  if (ind3) {
    ind3.className = 'rfq-step-circle ' + (step === 3 ? 'active' : '');
  }

  // Back button visibility
  if (backBtn) {
    backBtn.style.visibility = step > 1 ? 'visible' : 'hidden';
  }

  // Next / Submit button text
  if (nextBtn) {
    if (step === 3) {
      nextBtn.innerHTML = `Submit RFQ Tender <i data-lucide="send" style="width: 16px; height: 16px;"></i>`;
    } else {
      nextBtn.innerHTML = `Continue to Next Step <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>`;
    }
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setupRfqWizard() {
  let currentStep = 1;

  // Typology card click selection
  document.querySelectorAll('.rfq-option-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.rfq-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  const nextBtn = document.getElementById('rfqNextBtn');
  const backBtn = document.getElementById('rfqBackBtn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < 3) {
        currentStep++;
        setRfqStep(currentStep);
      } else {
        // Step 3 Submit
        const formContainer = document.getElementById('rfqFormContainer');
        const successBox = document.getElementById('rfqSuccessBox');
        if (formContainer && successBox) {
          formContainer.style.display = 'none';
          successBox.style.display = 'block';
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        setRfqStep(currentStep);
      }
    });
  }
}
