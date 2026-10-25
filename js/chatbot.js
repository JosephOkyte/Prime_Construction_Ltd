/* ==========================================================================
   PRIME CONSTRUCTION — LIVE CHATBOT & TELEGRAM CONCIERGE
   Live n8n Webhook Source, Official Telegram Bot & Knowledge Base
   ========================================================================== */

// Official Live Webhook & Telegram Integration Configuration
const CHATBOT_CONFIG = {
  webhookUrl: 'https://nextgenzauto.app.n8n.cloud/webhook/d3f23217-8418-4818-8f4f-78b5e96eccf1/chat',
  instanceId: '4f11dd0a204e748e8e5772d86c4f2c3893695ea47be62a45517df44c2dfabb49',
  timeoutMs: 16000
};

const TELEGRAM_CONFIG = {
  botUrl: 'https://t.me/PrImeConst_bot',
  botUsername: '@PrImeConst_bot',
  botToken: '8170233319:AAHGRBvzxHxkpPZJk419uGAZj9VGfxIMHVA'
};

// Expose Telegram API client globally for forms and lead transmission
window.PrimeTelegram = {
  ...TELEGRAM_CONFIG,
  async sendMessage(chatId, text) {
    try {
      const endpoint = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML'
        })
      });
      return await response.json();
    } catch (err) {
      console.error('[Prime Construction] Telegram API transmission error:', err);
      return null;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const launcher = document.getElementById('chatbotLauncher');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotCloseBtn');
  const chatInput = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSendBtn');
  const messagesContainer = document.getElementById('chatbotMessages');
  const suggestionPills = document.querySelectorAll('.suggestion-pill');

  if (!launcher || !chatWindow) return;

  // Session ID management (persists across user session for conversation memory)
  function getOrCreateSessionId() {
    let sid = sessionStorage.getItem('prime_n8n_chat_session');
    if (!sid) {
      sid = 'prime-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('prime_n8n_chat_session', sid);
    }
    return sid;
  }

  // Toggle Chat Window
  launcher.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
      if (chatInput) chatInput.focus();
      // Hide notification dot once opened
      const dot = launcher.querySelector('.chatbot-pulse-dot');
      if (dot) dot.style.display = 'none';
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  // Format Current Time
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Scroll Messages to Bottom
  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // Append a Chat Message
  function appendMessage(sender, text, isHtml = false) {
    if (!messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }

    const timeSpan = document.createElement('span');
    timeSpan.className = 'chat-time';
    timeSpan.textContent = getCurrentTime();

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(timeSpan);
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
  }

  // Show Typing Indicator
  function showTypingIndicator() {
    if (!messagesContainer) return null;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot typing-msg';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
    return typingDiv;
  }

  // Convert n8n Markdown & Linebreaks to Safe HTML
  function formatMarkdownToHtml(rawText) {
    if (!rawText) return '';

    // HTML escape for safety
    let text = String(rawText)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic *text*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert markdown links [text](url)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: var(--sky-blue); font-weight: 600; text-decoration: underline;">$1</a>');

    // Convert raw URLs (not already part of anchor)
    text = text.replace(/(^|[^"'>])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener" style="color: var(--sky-blue); font-weight: 600; text-decoration: underline;">$2</a>');

    // Line breaks
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');

    return text;
  }

  // Query Live n8n Chatbot Webhook
  async function queryN8nChatbot(userInput) {
    const sessionId = getOrCreateSessionId();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHATBOT_CONFIG.timeoutMs);

    try {
      const response = await fetch(CHATBOT_CONFIG.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Instance-Id': CHATBOT_CONFIG.instanceId
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: sessionId,
          chatInput: userInput
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`n8n webhook responded with status ${response.status}`);
      }

      const data = await response.json();
      const rawOutput = data.output || data.text || data.message || (typeof data === 'string' ? data : '');
      if (rawOutput) {
        return formatMarkdownToHtml(rawOutput);
      }
      return null;
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('[Prime Chatbot] Live webhook fallback engaged:', err.message);
      return null;
    }
  }

  // Offline / Domain-Specific Intelligent Fallback Responses
  function generateLocalBotResponse(userInput) {
    const query = userInput.toLowerCase();

    // 1. House Construction Costs & Building Rates in Nigeria
    if (query.includes('building cost') || query.includes('duplex') || query.includes('bungalow') || query.includes('villa') || query.includes('per square meter') || query.includes('per sqm') || query.includes('cost of building') || query.includes('how much to build') || query.includes('rates')) {
      return `
        📊 <strong>2026 Contemporary Nigerian Building Cost Benchmarks:</strong><br><br>
        • <strong>3-Bed Contemporary Bungalow:</strong> ₦38M – ₦55M (Standard) | ₦60M – ₦85M (Luxury)<br>
        • <strong>4-Bed Contemporary Duplex:</strong> ₦65M – ₦95M (Standard) | ₦100M – ₦145M+ (Luxury)<br>
        • <strong>5-Bed Smart Villa (with BQ):</strong> ₦95M – ₦135M (Standard) | ₦150M – ₦240M+ (Luxury)<br>
        • <strong>Average Rate/m²:</strong> ₦220,000 – ₦330,000/m² (Standard) | ₦330,000 – ₦460,000+/m² (Luxury)<br><br>
        <button class="btn-primary" onclick="document.getElementById('chatbotWindow').classList.remove('active'); window.location.hash = '#cost-estimator';" style="padding: 8px 16px; font-size: 0.8125rem;">
          Open Live Cost & Material Calculator
        </button>
      `;
    }

    // 2. Professional Placement Fees (Architect, Structural Engineer, QS, Soil Test)
    if (query.includes('architectural fee') || query.includes('architect') || query.includes('engineer') || query.includes('structural') || query.includes('qs') || query.includes('quantity surveyor') || query.includes('boq') || query.includes('soil test') || query.includes('coren') || query.includes('arcon') || query.includes('fee')) {
      return `
        📑 <strong>Pre-Construction Professional Fee Placement Guide:</strong><br><br>
        • <strong>Architectural & BIM Studio (ARCON):</strong> ₦800k – ₦1.8M (Bungalow) | ₦1.8M – ₦4.5M (Duplex)<br>
        • <strong>Structural Engineering & COREN Seal:</strong> ₦350k – ₦750k (Bungalow) | ₦750k – ₦1.8M (Duplex)<br>
        • <strong>Itemized BOQ & Material Take-Off (NIQS):</strong> ₦250k – ₦600k (Bungalow) | ₦500k – ₦1.5M (Duplex)<br>
        • <strong>MEP Engineering Design:</strong> ₦300k – ₦1.4M<br>
        • <strong>Geotechnical Soil Borehole Test:</strong> ₦450k – ₦950k<br><br>
        <button class="btn-secondary" onclick="document.getElementById('chatbotWindow').classList.remove('active'); window.location.hash = '#cost-estimator';" style="padding: 8px 16px; font-size: 0.8125rem;">
          View Full Placement Fee Schedule
        </button>
      `;
    }

    // 3. Telegram Desk
    if (query.includes('telegram') || query.includes('tg') || query.includes('channel') || query.includes('bot') || query.includes('primeconst_bot')) {
      return `
        <strong>Connect on Official Telegram:</strong><br>
        Our verified Telegram bot and executive desk is live 24/7 for instant consultations, drawings, and BOQ reviews:
        <br><br>
        <a href="${TELEGRAM_CONFIG.botUrl}" target="_blank" rel="noopener" class="btn-telegram" style="padding: 10px 18px; font-size: 0.875rem; width: 100%; justify-content: center;">
          <i data-lucide="send" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle;"></i> Chat on Telegram (${TELEGRAM_CONFIG.botUsername})
        </a>
      `;
    }

    // 4. General RFQ / Quote / Pricing / Estimate
    if (query.includes('quote') || query.includes('price') || query.includes('cost') || query.includes('estimate') || query.includes('rfq') || query.includes('tender')) {
      return `
        <strong>Looking for a formal project estimate?</strong><br>
        Our in-house Quantity Surveying and Engineering teams prepare comprehensive, unpriced and priced Bills of Quantities (BOQ):
        <br><br>
        <button class="btn-primary" onclick="openRfqModal(); document.getElementById('chatbotWindow').classList.remove('active');" style="padding: 8px 16px; font-size: 0.8125rem;">
          Open 3-Step Project Estimator
        </button>
      `;
    }

    // 5. WhatsApp Direct
    if (query.includes('whatsapp') || query.includes('wa') || query.includes('chat live')) {
      return `
        <strong>Connect via WhatsApp:</strong><br>
        Our technical team is available on WhatsApp 24/7 for urgent project consultations:
        <br><br>
        <a href="https://wa.me/2348000000000?text=Hello%20Prime%20Construction%20Team%2C%20I%20would%20like%20to%20discuss%20a%20construction%20project." target="_blank" rel="noopener" class="btn-whatsapp" style="padding: 8px 16px; font-size: 0.8125rem;">
          Open WhatsApp Direct
        </a>
      `;
    }

    // 6. Headquarters / Location / Address
    if (query.includes('location') || query.includes('address') || query.includes('office') || query.includes('where') || query.includes('garki') || query.includes('plaza')) {
      return `
        📍 <strong>Prime Construction Headquarters:</strong><br>
        Suite A20, Nkwegu Plaza, Area 1 Garki, FCT Abuja, Nigeria.<br><br>
        <strong>Hours:</strong> Mon – Fri: 8:00 AM – 6:00 PM<br>
        <strong>Email:</strong> <a href="mailto:primeconst@gmail.com" style="color: var(--sky-blue); text-decoration: underline;">primeconst@gmail.com</a><br>
        <strong>Telegram:</strong> <a href="${TELEGRAM_CONFIG.botUrl}" target="_blank" rel="noopener" style="color: #0088cc; font-weight: 700;">${TELEGRAM_CONFIG.botUsername}</a>
      `;
    }

    // 7. Heavy Plant & Machinery Fleet
    if (query.includes('fleet') || query.includes('machinery') || query.includes('excavator') || query.includes('crane') || query.includes('truck') || query.includes('equipment')) {
      return `
        🚜 <strong>Heavy Equipment Fleet ("The Arsenal"):</strong><br>
        Prime Construction directly owns and operates over 40 heavy plant units:
        <ul style="margin: 8px 0 0 16px; font-size: 0.8125rem;">
          <li>CAT 336 & Komatsu PC300 Crawler Excavators</li>
          <li>Liebherr 70T to 120T Mobile Telescopic Cranes</li>
          <li>Mercedes-Benz Actros 30-Tonne Tipper Haulage</li>
          <li>Dynapac Soil Compactors & Asphalt Pavers</li>
        </ul>
      `;
    }

    // 8. Projects (Guzape, Commercial, Roads, Police)
    if (query.includes('project') || query.includes('guzape') || query.includes('police') || query.includes('road') || query.includes('ongoing') || query.includes('completed')) {
      return `
        🏗️ <strong>Featured Landmark Projects:</strong><br>
        • <strong>The Guzape Hillcrest Enclave:</strong> 12 Cantilevered Luxury Villas.<br>
        • <strong>The Capital Apex Plaza:</strong> 5-Story CBD Commercial Complex.<br>
        • <strong>FCT Road Dualization:</strong> 14.8 km arterial highway.<br>
        • <strong>Model Police Station:</strong> Civic security headquarters reconstruction.
      `;
    }

    // Default Fallback
    return `
      Thank you for connecting with <strong>Prime Construction Ltd</strong> (Government Approved Tier-1 Contractor)!<br><br>
      Our Abuja engineering desk at Suite A20, Nkwegu Plaza, Area 1 Garki is ready to assist.<br><br>
      • <a href="${TELEGRAM_CONFIG.botUrl}" target="_blank" rel="noopener" style="color: #0088cc; font-weight: 700;">Telegram Desk: ${TELEGRAM_CONFIG.botUsername}</a><br>
      • <a href="mailto:primeconst@gmail.com" style="color: var(--sky-blue); font-weight: 700;">Email: primeconst@gmail.com</a>
    `;
  }

  // Handle Send Action
  async function handleSendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Append User Message
    appendMessage('user', trimmed);
    if (chatInput) chatInput.value = '';

    // Show Typing Indicator
    const typingIndicator = showTypingIndicator();

    try {
      // 1. First, attempt live response from the n8n webhook endpoint
      let replyHtml = await queryN8nChatbot(trimmed);

      // 2. If n8n did not return a response or errored, seamlessly fallback
      if (!replyHtml) {
        replyHtml = generateLocalBotResponse(trimmed);
      }

      // If user specifically asked about telegram or bot, enhance with Telegram CTA
      const lower = trimmed.toLowerCase();
      if ((lower.includes('telegram') || lower.includes('tg') || lower.includes('bot')) && !replyHtml.includes('btn-telegram')) {
        replyHtml += `
          <br><br>
          <a href="${TELEGRAM_CONFIG.botUrl}" target="_blank" rel="noopener" class="btn-telegram" style="padding: 8px 16px; font-size: 0.8125rem;">
            <i data-lucide="send" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i> Open ${TELEGRAM_CONFIG.botUsername}
          </a>
        `;
      }

      // Remove typing indicator and render bot message
      if (typingIndicator) typingIndicator.remove();
      appendMessage('bot', replyHtml, true);

      // Re-trigger Lucide icons in dynamically inserted message
      if (window.lucide) {
        window.lucide.createIcons();
      }
    } catch (err) {
      if (typingIndicator) typingIndicator.remove();
      const fallback = generateLocalBotResponse(trimmed);
      appendMessage('bot', fallback, true);
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (chatInput) handleSendMessage(chatInput.value);
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSendMessage(chatInput.value);
      }
    });
  }

  // Suggestion Pills Click
  suggestionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const promptText = pill.getAttribute('data-prompt');
      if (promptText) {
        handleSendMessage(promptText);
      }
    });
  });
});
