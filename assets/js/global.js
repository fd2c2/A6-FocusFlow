/**
 * ═══════════════════════════════════════════
 * STORAGE SCHEMA
 * ═══════════════════════════════════════════
 */
const STORAGE_SCHEMA = {
  'ff_score': 0,
  'ff_streak': 0,
  'ff_last_visit': '',
  'ff_tasks': [],
  'ff_sessions': [],
  'ff_theme': 'light',
  'ff_accent_color': '#FF6B6B',
  'ff_current_page': 'page-home',
  'ff_timer_work': 25,
  'ff_timer_break': 5,
  'ff_timer_long_break': 15,
  'ff_timer_sessions_long': 4,
  'ff_sound_enabled': true,
  'ff_custom_quotes': [],
  'ff_daily_goal_sessions': 4,
  'ff_daily_goal_tasks': 5,
  'ff_badges_earned': [],
  'ff_focus_bg': 'none',
  'ff_weekly_notes': ''
};

function initStorage() {
  Object.keys(STORAGE_SCHEMA).forEach(key => {
    if (localStorage.getItem(key) === null) {
      setItem(key, STORAGE_SCHEMA[key]);
    }
  });
  updateStreakCheck();
}

function getItem(key) {
  const data = localStorage.getItem(key);
  try { return JSON.parse(data); } catch (e) { return data; }
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function addPoints(pts) {
  let score = getItem('ff_score');
  score += pts;
  setItem('ff_score', score);
  window.dispatchEvent(new CustomEvent('scoreUpdated', { detail: { score } }));
}

function getScore() { return getItem('ff_score'); }
function getStreak() { return getItem('ff_streak'); }

function updateStreakCheck() {
  const today = getTodayString();
  const lastVisit = getItem('ff_last_visit');
  let streak = getItem('ff_streak');
  if (lastVisit === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  if (lastVisit === yesterdayStr) streak++;
  else streak = (lastVisit && lastVisit !== '') ? 1 : 1;
  setItem('ff_streak', streak);
  setItem('ff_last_visit', today);
  refreshNav();
}

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// ── PAGE META ──
const pageMeta = {
  'page-home':       { title: 'FocusFlow – Home', desc: 'Welcome to your joyful productivity dashboard.' },
  'page-dashboard':  { title: 'Dashboard – FocusFlow', desc: 'Your stats at a glance.' },
  'page-tasks':      { title: 'Tasks – FocusFlow', desc: 'Manage your daily tasks.' },
  'page-focus':      { title: 'Focus Lab – FocusFlow', desc: 'Pomodoro timer with deep work mode.' },
  'page-progress':   { title: 'Progress – FocusFlow', desc: 'Achievements and badges.' },
  'page-settings':   { title: 'Settings – FocusFlow', desc: 'Customise your experience.' },
  'page-contact':    { title: 'Contact – FocusFlow', desc: 'Get in touch with us.' },
  'page-faq':        { title: 'FAQ – FocusFlow', desc: 'Frequently asked questions.' },
  'page-about': { title: 'About – FocusFlow', desc: 'Learn more about FocusFlow and its features.' },
};

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Hide the welcome screen whenever a page is shown
const welcome = document.getElementById('welcome-screen');
if (welcome) welcome.style.display = 'none';
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    setItem('ff_current_page', pageId);
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-page') === pageId));

    if (pageMeta[pageId]) {
      document.title = pageMeta[pageId].title;
      const descEl = document.getElementById('meta-desc');
      if (descEl) descEl.setAttribute('content', pageMeta[pageId].desc);
      const keyEl = document.getElementById('meta-keywords');
      if (keyEl) keyEl.setAttribute('content', 'productivity, focus, tasks');
    }

    target.dispatchEvent(new CustomEvent('pageActivated'));
    window.scrollTo(0, 0);

    if (window.innerWidth <= 768) {
      document.getElementById('sidebar').classList.remove('expanded');
      document.getElementById('sidebar-backdrop').classList.remove('visible');
    }
  }
  refreshNav();
}

function refreshNav() {
  const streakEl = document.getElementById('nav-streak');
  if (streakEl) streakEl.textContent = getItem('ff_streak');
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  setItem('ff_theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('dark-mode-icon');
  const label = document.getElementById('dark-mode-label');
  if (icon) icon.className = isDark ? 'ph ph-sun btn-icon' : 'ph ph-moon btn-icon';
  if (label) label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

/* ── SOUND ENGINE ── */
let chimeCtx = null;
let chimeInterval = null;

function playChime() {
  if (getItem('ff_sound_enabled') === false) return;
  try {
    if (!chimeCtx) chimeCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (chimeCtx.state === 'suspended') chimeCtx.resume();

    const now = chimeCtx.currentTime;
    // Harmonious triad chime
    [[523, 0], [659, 0.15], [784, 0.3]].forEach(([freq, delay]) => {
      const osc = chimeCtx.createOscillator();
      const gain = chimeCtx.createGain();
      osc.connect(gain);
      gain.connect(chimeCtx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.3, now + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.9);
    });
  } catch (e) { }
}

function startChimeLoop() {
  if (chimeInterval) return;
  playChime();
  // Loop every 2 seconds for a more urgent feel until user returns
  chimeInterval = setInterval(playChime, 2500);
}

function stopChimeLoop() {
  if (chimeInterval) {
    clearInterval(chimeInterval);
    chimeInterval = null;
  }
}

/* ── CONFETTI ENGINE ── */
function launchConfetti() {
  const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#A78BFA', '#74C0FC', '#FF9F43'];
  const container = document.createElement('div');
  container.className = 'confetti-container';
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${1.5 + Math.random() * 1.5}s;
      animation-delay: ${Math.random() * 0.5}s;
      transform: rotate(${Math.random() * 360}deg);
      width: ${8 + Math.random() * 8}px;
      height: ${10 + Math.random() * 8}px;
    `;
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 3000);
}

/* ── MOTIVATIONAL POPUP ── */
const MOTIVATION_MESSAGES = {
  task: [
    { emoji: '🎉', text: "Task crushed! You're on a roll!" },
    { emoji: '⚡', text: "One down, unstoppable!" },
    { emoji: '🏆', text: "That's how champions work!" },
    { emoji: '🌟', text: "Nailed it! Keep the momentum!" },
    { emoji: '💪', text: "Look at you getting things done!" }
  ],
  session: [
    { emoji: '🔥', text: "Focus session complete! You earned it!" },
    { emoji: '🧠', text: "Deep work done. Your brain thanks you!" },
    { emoji: '🚀', text: "Another session in the books!" },
    { emoji: '✨', text: "That's focused energy right there!" },
    { emoji: '🎯', text: "Locked in and delivered. Brilliant!" }
  ]
};

function showMotivationPopup(context = 'task') {
  const msgs = MOTIVATION_MESSAGES[context];
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  let popup = document.getElementById('motivation-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'motivation-popup';
    popup.innerHTML = `
      <button class="popup-close" onclick="closeMotivationPopup()">✕</button>
      <span class="popup-emoji" id="popup-emoji"></span>
      <p class="popup-text" id="popup-text"></p>
    `;
    document.body.appendChild(popup);
  }
  document.getElementById('popup-emoji').textContent = msg.emoji;
  document.getElementById('popup-text').textContent = msg.text;
  popup.classList.add('show');
  clearTimeout(popup._timer);
  popup._timer = setTimeout(closeMotivationPopup, 4000);
}

function closeMotivationPopup() {
  const popup = document.getElementById('motivation-popup');
  if (popup) popup.classList.remove('show');
}

/* ── FORM VALIDATION HELPERS ── */
function validateField(inputEl, rules = {}) {
  const val = inputEl.value.trim();
  let error = '';
  if (rules.required && !val) error = 'This field is required.';
  else if (rules.minLength && val.length < rules.minLength) error = `Minimum ${rules.minLength} characters required.`;
  else if (rules.maxLength && val.length > rules.maxLength) error = `Maximum ${rules.maxLength} characters allowed.`;
  else if (rules.min && Number(val) < rules.min) error = `Minimum value is ${rules.min}.`;
  else if (rules.max && Number(val) > rules.max) error = `Maximum value is ${rules.max}.`;

  const errEl = inputEl.parentElement.querySelector('.error-msg');
  inputEl.classList.toggle('input-error', !!error);
  if (errEl) {
    errEl.textContent = error;
    errEl.classList.toggle('visible', !!error);
  }
  return !error;
}

/* ── BADGE FIRST-EARN CHECK ── */
function checkBadgeFirstEarn(badgeId) {
  const earned = getItem('ff_badges_earned') || [];
  if (earned.includes(badgeId)) return false;
  earned.push(badgeId);
  setItem('ff_badges_earned', earned);
  return true;
}

/* ── KEYBOARD SHORTCUTS ── */
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Alt + H -> Home
    if (e.altKey && e.key === 'h') { e.preventDefault(); showPage('page-home'); }
    // Alt + T -> Tasks
    if (e.altKey && e.key === 't') { e.preventDefault(); showPage('page-tasks'); }
    // Alt + F -> Focus Lab
    if (e.altKey && e.key === 'f') { e.preventDefault(); showPage('page-focus'); }
  });
}

function getActiveUser() { return getItem('ff_active_user'); }

initStorage();
initKeyboardShortcuts();
