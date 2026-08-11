const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);

/* ── language ── */
let lang = localStorage.getItem('lang') || ((navigator.language || navigator.userLanguage).startsWith('ru') ? 'ru' : 'en');

function switchLang(l) {
  lang = l;
  localStorage.setItem('lang', l);
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = (el.getAttribute('data-lang') === l) ? '' : 'none';
  });
  document.documentElement.lang = l;
  document.title = l === 'ru' ? 'entitybtw — привет, я entitybtw' : 'entitybtw — hello, i\'m entitybtw';
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: l } }));
  if (window.lastfmIntegration) window.lastfmIntegration.updateTrack();
  $('#langBtn').textContent = l;
}

$('#langBtn').onclick = () => switchLang(lang === 'ru' ? 'en' : 'ru');

/* ── theme ── */
const themes = ['dark', 'light', 'black'];

function updateThemeImages(isDark) {
  document.querySelectorAll('.themechanging').forEach(img => {
    const lightSrc = img.getAttribute('data-src-light');
    const darkSrc = img.getAttribute('data-src-dark');
    img.src = isDark ? darkSrc : lightSrc;
  });
}

const ICON_SUN = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.9959.9959 0 0 0-1.41 0 .9959.9959 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.9959.9959 0 0 0-1.41 0 .9959.9959 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.9959.9959 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.9959.9959 0 0 0 0-1.41.9959.9959 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.9959.9959 0 0 0 0-1.41.9959.9959 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>';
const ICON_MOON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>';
const ICON_DARK = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><circle cx="12" cy="12" r="5"/></svg>';

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
  const isDark = t !== 'light';
  updateThemeImages(isDark);
  $('#themeBtn').innerHTML = t === 'light' ? ICON_MOON : t === 'black' ? ICON_DARK : ICON_SUN;
  const tc = $('#themeColor');
  if (tc) tc.content = t === 'light' ? '#fafafa' : t === 'black' ? '#000' : '#0f0f0f';
  document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
}

$('#themeBtn').onclick = () => setTheme(themes[(themes.indexOf(document.documentElement.dataset.theme) + 1) % themes.length]);

/* ── accent color ── */
const ACCENT_PRESETS = ['#d4a574', '#e6a23c', '#e15b64', '#b56576', '#7a9db8', '#5aa7a7', '#6ba76b', '#8a7ad4', '#c475d4', '#333333'];
const ACCENT_DEFAULT = '#d4a574';

function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function hexAlpha(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}
function lightenHex(hex, p) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * p, g + (255 - g) * p, b + (255 - b) * p);
}
function isValidHex(h) {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h);
}

function applyAccent(hex) {
  if (!isValidHex(hex)) return false;
  if (hex.length === 4) hex = '#' + hex.slice(1).split('').map(c => c + c).join('');
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-bright', lightenHex(hex, 0.08));
  document.documentElement.style.setProperty('--border-acc', hexAlpha(hex, 0.25));
  document.documentElement.style.setProperty('--accent-glow', hexAlpha(hex, 0.10));
  $('#accentHex').value = hex.toUpperCase();
  $('#accentColorPicker').value = hex;
  $('#accentCurrent').style.background = hex;
  $$('.accent-preset').forEach(p => p.classList.toggle('active', p.dataset.hex.toLowerCase() === hex.toLowerCase()));
  return true;
}

function currentAccent() {
  return localStorage.getItem('accent') || ACCENT_DEFAULT;
}

function saveAccent() {
  const v = $('#accentHex').value.trim();
  if (!applyAccent(v)) return;
  localStorage.setItem('accent', v);
}

function renderAccentPresets() {
  const box = $('#accentPresets');
  box.innerHTML = ACCENT_PRESETS.map(h => `<button class="accent-preset" data-hex="${h}" title="${h}" style="background:${h}"></button>`).join('');
  box.querySelectorAll('.accent-preset').forEach(p => {
    p.onclick = () => {
      applyAccent(p.dataset.hex);
      localStorage.setItem('accent', p.dataset.hex);
    };
  });
}

$('#accentApply').onclick = saveAccent;
$('#accentReset').onclick = () => {
  applyAccent(ACCENT_DEFAULT);
  localStorage.setItem('accent', ACCENT_DEFAULT);
};
$('#accentColorPicker').addEventListener('input', e => applyAccent(e.target.value));
$('#accentHex').addEventListener('keydown', e => { if (e.key === 'Enter') saveAccent(); });

/* ── settings panel ── */
$('#settingsBtn').onclick = () => $('#settingsOverlay').classList.add('show');
$('#settingsClose').onclick = () => $('#settingsOverlay').classList.remove('show');
$('#settingsOverlay').onclick = () => $('#settingsOverlay').classList.remove('show');

/* ── DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  switchLang(lang);
  renderAccentPresets();
  applyAccent(currentAccent());
  initAge();
  initBirthday();
  initSounds();
  initVolume();
  initSnowflakes();
});

/* ── dynamic age ── */
function calcAge() {
  const birth = new Date(2012, 2, 2);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) age--;
  return age;
}

function ageWord(n) {
  const last2 = n % 100;
  const last1 = n % 10;
  if (last2 >= 11 && last2 <= 19) return 'лет';
  if (last1 === 1) return 'год';
  if (last1 >= 2 && last1 <= 4) return 'года';
  return 'лет';
}

function initAge() {
  const age = calcAge();
  const ageEl = document.getElementById('age');
  const ageElEn = document.getElementById('ageEn');
  if (ageEl) ageEl.textContent = `${age} ${ageWord(age)}`;
  if (ageElEn) ageElEn.textContent = `${age} years old`;
}

/* ── birthday ── */
function initBirthday() {
  const now = new Date();
  const isBD = now.getMonth() === 2 && now.getDate() === 2;
  const banner = document.getElementById('birthdayBanner');
  if (isBD && banner) {
    banner.style.display = '';
  }
}

/* ── webring ── */
fetch('https://webring.otomir23.me/32/data')
  .then(res => res.json())
  .then(data => {
    document.getElementById('prev-link').href = data.prev.url;
    document.getElementById('prev-link').innerHTML = `< ${data.prev.name}`;
    document.getElementById('next-link').href = data.next.url;
    document.getElementById('next-link').innerHTML = `${data.next.name} >`;
  })
  .catch(err => console.error('webring fetch error:', err));

/* ── snowflakes ── */
function initSnowflakes() {
  const month = new Date().getMonth();
  if (month !== 11 && month !== 0 && month !== 1) return;

  const chars = ['❄', '❅', '❆', '✦', '•'];

  function createSnowflake() {
    const snow = document.createElement('div');
    snow.className = 'snowflake';
    snow.textContent = chars[Math.floor(Math.random() * chars.length)];
    const size = Math.random() * 12 + 6;
    const drift = (Math.random() - 0.5) * 150;
    const rot = Math.random() * 720 - 360;
    const dur = Math.random() * 6 + 6;
    const delay = Math.random() * 2;
    Object.assign(snow.style, {
      left: Math.random() * 100 + 'vw',
      fontSize: size + 'px',
      color: `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`,
      '--drift': drift + 'px',
      '--rot': rot + 'deg',
      animationDuration: dur + 's',
      animationDelay: delay + 's',
    });
    document.body.appendChild(snow);
    setTimeout(() => snow.remove(), (dur + delay) * 1000 + 500);
  }

  for (let i = 0; i < 3; i++) setTimeout(createSnowflake, i * 400);
  setInterval(createSnowflake, 450);
}

/* ── Last.fm ── */
class LastFmIntegration {
  constructor() {
    this.base = 'https://koito.entitybtw.ru/apis/web/v1';
    this.songElement = document.getElementById('song');
    this.updateInterval = null;
  }

  async fetchCurrentTrack() {
    const [npRes, listensRes] = await Promise.all([
      fetch(`${this.base}/now-playing`),
      fetch(`${this.base}/listens?limit=1&period=all_time`)
    ]);
    const np = await npRes.json();
    if (np.currently_playing && np.track?.title) {
      return { name: np.track.title, artist: np.track.artists?.[0]?.name || '', nowPlaying: true };
    }
    const listens = await listensRes.json();
    const last = listens.items?.[0];
    if (last?.track?.title) {
      return { name: last.track.title, artist: last.track.artists?.[0]?.name || '', nowPlaying: false };
    }
    return null;
  }

  formatTrackDisplay(track) {
    const l = localStorage.getItem('lang') || 'ru';
    if (!track) return l === 'ru' ? 'нет треков' : 'no tracks';
    if (track.nowPlaying) return `${track.name} — ${track.artist}`;
    return l === 'ru' ? `последний: ${track.name} — ${track.artist}` : `last: ${track.name} — ${track.artist}`;
  }

  async updateTrack() {
    try {
      const track = await this.fetchCurrentTrack();
      if (this.songElement) this.songElement.textContent = this.formatTrackDisplay(track);
    } catch {
      const l = localStorage.getItem('lang') || 'ru';
      if (this.songElement) this.songElement.textContent = l === 'ru' ? 'ошибка загрузки :/' : 'load error :/';
    }
  }

  start() {
    this.updateTrack();
    this.updateInterval = setInterval(() => this.updateTrack(), 30000);
    document.addEventListener('languageChanged', () => this.updateTrack());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('song')) {
    const lastfm = new LastFmIntegration();
    lastfm.start();
    window.lastfmIntegration = lastfm;
  }
});

/* ── sounds ── */
function initSounds() {
  if (matchMedia('(max-width: 768px)').matches) return;

  const CLICK_URL = '/sounds/click.mp3';
  const HOVER_URL = '/sounds/hover.mp3';
  const SELECT_URL = '/sounds/pop.mp3';
  const RIGHTCLICK_URL = '/sounds/rightclick.mp3';

  let ctx = null;
  let masterGain = null;
  let clickBuf = null, hoverBuf = null, selectBuf = null, rightClickBuf = null;
  let unlocked = false, lastHovered = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = (parseInt(localStorage.getItem('volume')) || 80) / 100;
      masterGain.connect(ctx.destination);
    }
    return ctx;
  }

  function setVolume(v) {
    if (masterGain) masterGain.gain.value = v;
  }

  window.setSoundVolume = setVolume;

  async function loadBuffer(url) {
    try {
      const c = getCtx();
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.arrayBuffer();
      return await c.decodeAudioData(data);
    } catch { return null; }
  }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
    loadBuffer(CLICK_URL).then(b => clickBuf = b);
    loadBuffer(HOVER_URL).then(b => hoverBuf = b);
    loadBuffer(SELECT_URL).then(b => selectBuf = b);
    loadBuffer(RIGHTCLICK_URL).then(b => rightClickBuf = b);
  }

  function play(buf) {
    if (!buf) return;
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(masterGain || c.destination);
    src.start(0);
  }

  document.addEventListener('click', e => {
    unlock();
    play(clickBuf);
  }, true);

  document.addEventListener('mouseover', e => {
    unlock();
    const el = e.target.closest('a, [data-hoversound]');
    if (el === lastHovered) return;
    lastHovered = el || null;
    if (el) play(hoverBuf);
  });

  let selecting = false, lastSelectTime = 0;
  document.addEventListener('mousedown', () => selecting = true);
  document.addEventListener('mouseup', () => selecting = false);
  document.addEventListener('selectionchange', () => {
    if (!selecting) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const now = Date.now();
    if (now - lastSelectTime < 45) return;
    lastSelectTime = now;
    play(selectBuf);
  });

  document.addEventListener('contextmenu', () => { unlock(); play(rightClickBuf); });
}

/* ── volume ── */
function initVolume() {
  const slider = document.getElementById('volumeSlider');
  const val = document.getElementById('volumeVal');
  const icon = document.getElementById('volumeIcon');
  if (!slider) return;

  const saved = parseInt(localStorage.getItem('volume')) || 80;
  let lastNonZero = saved || 80;
  slider.value = saved;
  val.textContent = saved + '%';

  const ICON_VOL_OFF = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
  const ICON_VOL_LOW = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 9v6h4l5 5V4l-5 5H7z"/></svg>';
  const ICON_VOL_MED = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>';
  const ICON_VOL_HIGH = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';

  function volIcon(v) {
    return v === 0 ? ICON_VOL_OFF : v < 33 ? ICON_VOL_LOW : v < 66 ? ICON_VOL_MED : ICON_VOL_HIGH;
  }

  icon.innerHTML = volIcon(saved);

  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    val.textContent = v + '%';
    icon.innerHTML = volIcon(v);
    if (v > 0) lastNonZero = v;
    localStorage.setItem('volume', v);
    if (window.setSoundVolume) window.setSoundVolume(v / 100);
  });

  icon.addEventListener('click', () => {
    if (parseInt(slider.value) > 0) {
      lastNonZero = parseInt(slider.value);
      slider.value = 0;
      val.textContent = '0%';
      icon.innerHTML = ICON_VOL_OFF;
      localStorage.setItem('volume', 0);
      if (window.setSoundVolume) window.setSoundVolume(0);
    } else {
      slider.value = lastNonZero;
      val.textContent = lastNonZero + '%';
      icon.innerHTML = volIcon(lastNonZero);
      localStorage.setItem('volume', lastNonZero);
      if (window.setSoundVolume) window.setSoundVolume(lastNonZero / 100);
    }
  });
}
