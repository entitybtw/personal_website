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

/* ── pagering (page webring) theme sync ── */
function syncPageringTheme() {
  const el = document.getElementById('pageringLink');
  if (!el) return;
  const t = document.documentElement.dataset.theme;
  el.setAttribute('theme', t === 'light' ? 'light' : 'dark');
}
document.addEventListener('themeChanged', syncPageringTheme);
window.addEventListener('load', syncPageringTheme);

$('#themeBtn').onclick = () => setTheme(themes[(themes.indexOf(document.documentElement.dataset.theme) + 1) % themes.length]);

/* ── accent color ── */
const ACCENT_PRESETS = ['#d4a574', '#e6a23c', '#e15b64', '#b56576', '#7a9db8', '#5aa7a7', '#6ba76b', '#8a7ad4', '#c475d4', '#333333'];
const ACCENT_DEFAULT = '#5aa7a7';

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

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function contrastText(hex) {
  return luminance(hex) > 0.55 ? '#000' : '#fff';
}

function applyAccent(hex) {
  if (!isValidHex(hex)) return false;
  if (hex.length === 4) hex = '#' + hex.slice(1).split('').map(c => c + c).join('');
  const tc = contrastText(hex);
  document.documentElement.style.setProperty('--accent', hex);
  document.documentElement.style.setProperty('--accent-bright', lightenHex(hex, 0.08));
  document.documentElement.style.setProperty('--border-acc', hexAlpha(hex, 0.25));
  document.documentElement.style.setProperty('--accent-glow', hexAlpha(hex, 0.10));
  document.documentElement.style.setProperty('--accent-text', tc);
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
  initSpecs();
  initAlbum();
  initLightbox();
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

/* ── pc & laptop specs toggle ── */
function initSpecs() {
  const toggle = document.getElementById('specsToggle');
  if (!toggle) return;
  const blocks = document.querySelectorAll('.fetch-block');
  function select(host) {
    toggle.querySelectorAll('.shop-btn').forEach(b => b.classList.toggle('active', b.dataset.host === host));
    blocks.forEach(b => { b.style.display = (b.dataset.host === host) ? '' : 'none'; });
  }
  toggle.querySelectorAll('.shop-btn').forEach(btn => {
    btn.onclick = () => select(btn.dataset.host);
  });
  select((toggle.querySelector('.shop-btn') || {}).dataset?.host || 'laptop');
}

/* ── homelab album ── */
function initAlbum() {
  const album = document.getElementById('homelabAlbum');
  if (!album) return;
  const slides = Array.from(album.querySelectorAll('.album-slide'));
  if (!slides.length) return;
  const counter = document.getElementById('albumCounter');
  const prevBtn = document.getElementById('albumPrev');
  const nextBtn = document.getElementById('albumNext');
  let idx = 0;

  slides.forEach(s => {
    const img = s.querySelector('img');
    if (img) img.onerror = () => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='160'><rect width='100%' height='100%' fill='#222'/><text x='50%' y='50%' fill='#666' font-family='monospace' font-size='13' text-anchor='middle' dominant-baseline='middle'>нет фото / no image</text></svg>`;
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    };
  });

  function show(i) {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.style.display = (n === idx) ? 'block' : 'none');
    if (counter) counter.textContent = `${idx + 1} / ${slides.length}`;
  }
  if (prevBtn) prevBtn.onclick = () => show(idx - 1);
  if (nextBtn) nextBtn.onclick = () => show(idx + 1);
  show(0);
}

/* ── lightbox ── */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  const album = document.getElementById('homelabAlbum');
  if (!lb || !album) return;
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCaption');
  const slides = Array.from(album.querySelectorAll('.album-slide'));
  let items = slides;
  let cur = 0;

  function render() {
    const slide = items[cur];
    const im = slide.querySelector('img');
    const date = slide.querySelector('.album-date');
    const genNote = album.querySelector('.album-note');
    img.src = im.getAttribute('src');
    img.classList.remove('zoomed');
    cap.innerHTML = '';
    if (date) {
      const d = document.createElement('div');
      d.className = 'lb-date';
      d.textContent = date.textContent;
      cap.appendChild(d);
    }
    if (genNote) cap.appendChild(genNote.cloneNode(true));
  }
  function open(i) {
    cur = i;
    render();
    lb.classList.add('show');
  }
  function close() { lb.classList.remove('show'); }

  slides.forEach((s, i) => {
    const im = s.querySelector('img');
    if (im) im.addEventListener('click', () => open(i));
  });

  document.getElementById('lbClose').onclick = close;
  document.getElementById('lbPrev').onclick = e => { e.stopPropagation(); cur = (cur - 1 + items.length) % items.length; render(); };
  document.getElementById('lbNext').onclick = e => { e.stopPropagation(); cur = (cur + 1) % items.length; render(); };
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  img.addEventListener('click', e => { e.stopPropagation(); img.classList.toggle('zoomed'); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('show')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') { cur = (cur - 1 + items.length) % items.length; render(); }
    else if (e.key === 'ArrowRight') { cur = (cur + 1) % items.length; render(); }
  });
}

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

/* ── Hydra games ── */
class HydraIntegration {
  constructor() {
    this.base = 'https://hydra.entitybtw.ru';
    this.username = 'entbtw';
    this.shop = 'steam';
    this.games = [];
    this.cgTitle = document.getElementById('cgTitle');
    this.gameCount = document.getElementById('gameCount');
    this.gameHours = document.getElementById('gameHours');
    this.gamesList = document.getElementById('gamesList');
    this.currentGameEl = document.getElementById('gameStatus');
    this.updateInterval = null;
    this.shops = null;
  }

  isSteamGame(g) {
    return g.source === 'steam_sync';
  }

  formatTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h >= 100) return `${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${Math.floor(ms / 1000)}s`;
  }

  async fetchProfile() {
    const res = await fetch(`${this.base}/api/users/${this.username}`);
    if (!res.ok) throw new Error(`hydra ${res.status}`);
    return res.json();
  }

  async fetchLibrary() {
    const all = [];
    let skip = 0;
    while (true) {
      const res = await fetch(`${this.base}/api/users/${this.username}/library?take=100&skip=${skip}&sortBy=playedRecently`);
      if (!res.ok) throw new Error(`hydra ${res.status}`);
      const data = await res.json();
      all.push(...data.games);
      if (all.length >= data.total || data.games.length === 0) break;
      skip += data.games.length;
    }
    return all;
  }

  renderCurrentGame(profile) {
    const cg = profile.currentGame;
    const row = this.currentGameEl.querySelector('.current-game');
    if (cg) {
      row.style.display = '';
      this.cgTitle.textContent = cg.title;
    } else {
      row.style.display = 'none';
    }
  }

  renderGames() {
    const isSteam = this.shop === 'steam';
    const list = this.games.filter(g => isSteam === this.isSteamGame(g));
    list.sort((a, b) =>
      (Number(b.isPinned) - Number(a.isPinned)) ||
      (new Date(b.lastTimePlayed || 0) - new Date(a.lastTimePlayed || 0)) ||
      (b.playTimeInMilliseconds - a.playTimeInMilliseconds)
    );
    this.gamesList.innerHTML = list.map(g => `
      <div class="game-item${g.isPinned ? ' pinned' : ''}">
        <span class="gi-title">${g.title}</span>
        <span class="gi-time">${g.playTimeInMilliseconds ? this.formatTime(g.playTimeInMilliseconds) : ''}</span>
      </div>
    `).join('') || '<span class="muted">—</span>';
  }

  async update() {
    try {
      const [profile, library] = await Promise.all([this.fetchProfile(), this.fetchLibrary()]);
      this.profile = profile;
      this.games = library;
      this.renderCurrentGame(profile);

      const s = profile.stats || {};
      const shopCounts = {};
      for (const g of library) shopCounts[g.shop] = (shopCounts[g.shop] || 0) + 1;
      this.shops = Object.keys(shopCounts);

      this.renderShopButtons();
      this.updateStats();
      this.renderGames();
    } catch (e) {
      console.error('hydra error:', e);
      const l = localStorage.getItem('lang') || 'ru';
      this.cgTitle.textContent = l === 'ru' ? 'ошибка загрузки :/' : 'load error :/';
      this.gamesList.innerHTML = '<span class="muted">—</span>';
    }
  }

  renderShopButtons() {
    const box = document.getElementById('shopToggle');
    const allShops = ['steam', 'hydra'];
    box.innerHTML = allShops.map(s => {
      const isSteam = s === 'steam';
      const count = this.games.filter(g => isSteam === this.isSteamGame(g)).length;
      return `<button class="shop-btn${s === this.shop ? ' active' : ''}" data-shop="${s}">${s}${count ? ` (${count})` : ''}</button>`;
    }).join('');
    box.querySelectorAll('.shop-btn').forEach(btn => {
      btn.onclick = () => {
        this.shop = btn.dataset.shop;
        this.renderShopButtons();
        this.updateStats();
        this.renderGames();
      };
    });
  }

  updateStats() {
    const isSteam = this.shop === 'steam';
    const filtered = this.games.filter(g => isSteam === this.isSteamGame(g));
    this.gameCount.textContent = filtered.length;
    const totalMs = filtered.reduce((sum, g) => sum + (g.playTimeInMilliseconds || 0), 0);
    this.gameHours.textContent = Math.round(totalMs / 3600000) || '–';
  }

  start() {
    this.update();
    this.updateInterval = setInterval(() => this.update(), 60000);
    document.addEventListener('languageChanged', () => {
      if (this.profile) this.renderCurrentGame(this.profile);
      this.renderGames();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gamesList')) {
    const hydra = new HydraIntegration();
    hydra.start();
    window.hydraIntegration = hydra;
  }
});

/* ── Hackatime coding stats ── */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

class HackatimeIntegration {
  constructor() {
    this.api = 'https://hackatime.hackclub.com/api/v1/users/6278/stats';
    this.el = document.getElementById('codingStats');
    this.maxVisible = 12;
    this.lastData = null;
    this.updateInterval = null;
  }

  async update() {
    if (!this.el) return;
    try {
      const res = await fetch(this.api, { cache: 'no-store' });
      if (!res.ok) throw new Error('hackatime ' + res.status);
      const json = await res.json();
      const d = json && json.data;
      if (!d || d.status !== 'ok') throw new Error('bad payload');
      this.lastData = d;
      this.render(d);
    } catch (e) {
      console.error('hackatime error:', e);
      const l = localStorage.getItem('lang') || 'ru';
      if (this.el) this.el.innerHTML = `<div class="muted">${l === 'ru' ? 'не удалось загрузить стату :/' : 'failed to load stats :/'}</div>`;
    }
  }

  render(d) {
    const l = localStorage.getItem('lang') || 'ru';
    const total = d.human_readable_total || '–';
    const avg = d.human_readable_daily_average || '–';
    const streak = (d.streak != null) ? d.streak : '–';

    const summary = `
      <div class="cs-summary">
        <div class="cs-metric"><span class="cs-metric-val">${escapeHtml(total)}</span><span class="cs-metric-lbl">${l === 'ru' ? 'всего' : 'total'}</span></div>
        <div class="cs-metric"><span class="cs-metric-val">${escapeHtml(avg)}</span><span class="cs-metric-lbl">${l === 'ru' ? 'в день' : 'per day'}</span></div>
        <div class="cs-metric"><span class="cs-metric-val">🔥 ${escapeHtml(streak)}</span><span class="cs-metric-lbl">${l === 'ru' ? 'стрик' : 'streak'}</span></div>
      </div>`;

    const langs = (d.languages || []).slice().sort((a, b) => (b.total_seconds || 0) - (a.total_seconds || 0));
    const rows = langs.map((lang, i) => {
      const pct = Math.max(0, Math.min(100, Number(lang.percent) || 0));
      const hidden = i >= this.maxVisible ? ' style="display:none;"' : '';
      const color = lang.color || 'var(--accent)';
      return `
        <div class="cs-row"${hidden}>
          <div class="cs-row-top">
            <span class="cs-name">${escapeHtml(lang.name)}</span>
            <span class="cs-time">${escapeHtml(lang.text)} <span class="cs-pct">${pct.toFixed(1)}%</span></span>
          </div>
          <div class="cs-bar"><div class="cs-bar-fill" style="width:${pct}%;background:${color}"></div></div>
        </div>`;
    }).join('');

    const showAllBtn = langs.length > this.maxVisible
      ? `<button class="cs-more" id="csMore">${l === 'ru' ? 'показать все (' + langs.length + ')' : 'show all (' + langs.length + ')'}</button>`
      : '';

    this.el.innerHTML = summary + `<div class="cs-list">${rows}</div>` + showAllBtn;

    const more = document.getElementById('csMore');
    if (more) more.onclick = () => {
      this.el.querySelectorAll('.cs-row[style]').forEach(r => { r.style.display = ''; });
      more.remove();
    };
  }

  start() {
    this.update();
    this.updateInterval = setInterval(() => this.update(), 600000);
    document.addEventListener('languageChanged', () => { if (this.lastData) this.render(this.lastData); });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('codingStats')) {
    const hackatime = new HackatimeIntegration();
    hackatime.start();
    window.hackatimeIntegration = hackatime;
  }
  if (document.getElementById('ghStats')) {
    const github = new GitHubIntegration();
    github.start();
    window.githubIntegration = github;
  }
  if (document.getElementById('svcStats')) {
    const services = new ServicesStats();
    services.start();
    window.servicesStats = services;
  }
});

/* ── GitHub stats ── */
const GITHUB_LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', 'C++': '#f34b7d',
  C: '#555555', 'C#': '#178600', Go: '#00ADD8', Rust: '#dea584', Java: '#b07219',
  Lua: '#000080', Shell: '#89e051', HTML: '#e34c26', CSS: '#563d7c', PHP: '#4F5D95',
  Ruby: '#701516', Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Vue: '#41b883',
  Svelte: '#ff3e00', Dockerfile: '#384d54', Makefile: '#427819', Assembly: '#6E4C13',
  'Objective-C': '#438eff', Perl: '#0298c3', Scala: '#c22d40', Elixir: '#6e4a91',
  Haskell: '#5e5086', Nim: '#ffc200', Zig: '#ec915c', Nix: '#7e7eff', CMake: '#DA3434',
  Vim: '#199f4b', GLSL: '#5686a5', JSON: '#cbcb41', YAML: '#cb171e'
};

class GitHubIntegration {
  constructor() {
    this.user = 'entitybtw';
    this.el = document.getElementById('ghStats');
    this.maxVisible = 8;
    this.maxRepos = 6;
    this.lastData = null;
    this.updateInterval = null;
  }

  async update() {
    if (!this.el) return;
    try {
      const [profileRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${this.user}`, { cache: 'no-store' }),
        fetch(`https://api.github.com/users/${this.user}/repos?per_page=100&sort=updated`, { cache: 'no-store' })
      ]);
      if (!profileRes.ok) throw new Error('github profile ' + profileRes.status);
      if (!reposRes.ok) throw new Error('github repos ' + reposRes.status);
      const profile = await profileRes.json();
      const repos = await reposRes.json();
      if (!Array.isArray(repos)) throw new Error('bad repos payload');
      const d = { profile, repos };
      this.lastData = d;
      this.render(d);
    } catch (e) {
      console.error('github error:', e);
      const l = localStorage.getItem('lang') || 'ru';
      if (this.el) this.el.innerHTML = `<div class="muted">${l === 'ru' ? 'не удалось загрузить гитхаб :/' : 'failed to load github :/'}</div>`;
    }
  }

  render(d) {
    const l = localStorage.getItem('lang') || 'ru';
    const p = d.profile || {};
    const repos = (d.repos || []).filter(r => !r.fork);

    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

    const summary = `
      <div class="gh-summary">
        <a class="gh-metric" href="https://github.com/${this.user}?tab=repositories" target="_blank">
          <span class="gh-metric-val">${escapeHtml(p.public_repos != null ? p.public_repos : repos.length)}</span>
          <span class="gh-metric-lbl">${l === 'ru' ? 'репо' : 'repos'}</span>
        </a>
        <a class="gh-metric" href="https://github.com/${this.user}?tab=repositories" target="_blank">
          <span class="gh-metric-val">★ ${escapeHtml(totalStars)}</span>
          <span class="gh-metric-lbl">${l === 'ru' ? 'звёзд' : 'stars'}</span>
        </a>
        <a class="gh-metric" href="https://github.com/${this.user}?tab=followers" target="_blank">
          <span class="gh-metric-val">${escapeHtml(p.followers != null ? p.followers : '–')}</span>
          <span class="gh-metric-lbl">${l === 'ru' ? 'подписчики' : 'followers'}</span>
        </a>
        <a class="gh-metric" href="https://github.com/${this.user}?tab=following" target="_blank">
          <span class="gh-metric-val">${escapeHtml(p.following != null ? p.following : '–')}</span>
          <span class="gh-metric-lbl">${l === 'ru' ? 'подписки' : 'following'}</span>
        </a>
      </div>`;

    const langCount = {};
    repos.forEach(r => { if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1; });
    const langTotal = Object.values(langCount).reduce((s, v) => s + v, 0) || 1;
    const langs = Object.entries(langCount)
      .map(([name, count]) => ({ name, count, pct: (count / langTotal) * 100, color: GITHUB_LANG_COLORS[name] || 'var(--accent)' }))
      .sort((a, b) => b.count - a.count);

    const langRows = langs.slice(0, this.maxVisible).map((lang, i) => `
      <div class="gh-row">
        <div class="gh-row-top">
          <span class="gh-name">${escapeHtml(lang.name)}</span>
          <span class="gh-time">${lang.count} <span class="gh-pct">${lang.pct.toFixed(0)}%</span></span>
        </div>
        <div class="gh-bar"><div class="gh-bar-fill" style="width:${lang.pct}%;background:${lang.color}"></div></div>
      </div>`).join('');

    const langBlock = langs.length
      ? `<div class="gh-subhead">${l === 'ru' ? 'языки' : 'languages'}</div><div class="gh-list">${langRows}</div>`
      : '';

    const topRepos = repos.slice().sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)).slice(0, this.maxRepos);
    const repoRows = topRepos.map(r => `
      <a class="gh-repo" href="${escapeHtml(r.html_url)}" target="_blank">
        <span class="gh-repo-name">${escapeHtml(r.name)}</span>
        <span class="gh-repo-stars">★ ${escapeHtml(r.stargazers_count || 0)}</span>
      </a>`).join('');

    const repoBlock = topRepos.length
      ? `<div class="gh-subhead" style="margin-top:14px;">${l === 'ru' ? 'топ по звёздам' : 'top by stars'}</div><div class="gh-repos">${repoRows}</div>`
      : '';

    this.el.innerHTML = summary + langBlock + repoBlock;
  }

  start() {
    this.update();
    this.updateInterval = setInterval(() => this.update(), 600000);
    document.addEventListener('languageChanged', () => { if (this.lastData) this.render(this.lastData); });
  }
}

/* ── Services stats (systemd-like) ── */
class ServicesStats {
  constructor() {
    this.el = document.getElementById('svcStats');
    this.clockEl = document.getElementById('svcClock');
    this.timer = null;
  }

  get groups() {
    const head = lang === 'ru' ? '1. сервисы:' : '1. services:';
    return [
      {
        head,
        items: [
          { name: 'koito', url: 'https://koito.entitybtw.ru' },
          { name: 'hydra-selfhosted instance', url: 'https://hydra.entitybtw.ru' },
          { name: 'pocket id', url: 'https://id.entitybtw.ru' },
          { name: 'forgejo', url: 'https://git.entitybtw.ru' },
          { name: 'personal website', url: 'https://entitybtw.ru' },
          { name: 'opengist', url: 'https://gist.entitybtw.ru' },
          { name: 'copyparty', url: 'https://cloud.entitybtw.ru' }
        ]
      }
    ];
  }

  async probeHttp(url) {
    const t0 = performance.now();
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 6000);
      await fetch(url, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: ctrl.signal });
      clearTimeout(to);
      return { ok: true, ms: performance.now() - t0 };
    } catch (e) {
      return { ok: false, ms: performance.now() - t0 };
    }
  }

  probeTcp(host) {
    return new Promise(resolve => {
      let done = false;
      const t0 = performance.now();
      let ws;
      const finish = (ok) => {
        if (done) return; done = true;
        try { if (ws) ws.close(); } catch (e) {}
        resolve({ ok, ms: performance.now() - t0 });
      };
      try {
        ws = new WebSocket('wss://' + host);
        setTimeout(() => finish(false), 6000);
        ws.onopen = () => finish(true);
        ws.onerror = () => finish(false);
      } catch (e) {
        finish(false);
      }
    });
  }

  async probe(item) {
    if (!item.url) return { ok: true, ms: null, static: true };
    const host = item.url.replace(/^https?:\/\//, '').split('/')[0];
    let ok = false, ms = null;
    if (item.tcp) {
      const r = await this.probeTcp(host);
      ok = ok || r.ok; if (r.ms != null) ms = ms || r.ms;
    }
    const r2 = await this.probeHttp(item.url);
    ok = ok || r2.ok; if (r2.ms != null) ms = ms || r2.ms;
    return { ok, ms, static: false };
  }

  fmtTime(d) {
    const p = n => String(n).padStart(2, '0');
    return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  fmtMs(ms) {
    if (ms == null) return 'static';
    if (ms < 1) return 'took <1ms';
    if (ms < 1000) return 'took ' + ms.toFixed(0) + 'ms';
    return 'took ' + (ms / 1000).toFixed(2) + 's';
  }

  renderSkeleton(groups) {
    let idx = 0;
    const html = groups.map(g => {
      const items = g.items.map(it => {
        const id = 'svc-' + (idx++);
        it._id = id;
        return `
          <div class="svc-entry svc-pending" id="${id}">
            <div class="svc-row1"><span class="svc-status">[ .. ]</span></div>
            <div class="svc-row2">[ ---- ]</div>
            <div class="svc-row3">
              <span class="svc-name">${escapeHtml(it.name)}</span>
              <span class="svc-took">⏳</span>
            </div>
          </div>`;
      }).join('');
      return `<div class="svc-group"><div class="svc-group-head">${escapeHtml(g.head)}</div>${items}</div>`;
    }).join('');
    this.el.innerHTML = html;
  }

  updateEntry(it, res) {
    const node = document.getElementById(it._id);
    if (!node) return;
    const status = node.querySelector('.svc-status');
    const time = node.querySelector('.svc-row2');
    const took = node.querySelector('.svc-took');
    status.className = 'svc-status ' + (res.ok ? 'ok' : 'fail');
    status.textContent = res.ok ? '[ OK ]' : '[ FAIL ]';
    time.textContent = '[ ' + this.fmtTime(new Date()) + ' ]';
    took.textContent = this.fmtMs(res.ms);
    node.classList.remove('svc-pending');
  }

  async updateAll() {
    if (!this.el) return;
    const groups = this.groups;
    this.renderSkeleton(groups);
    if (this.clockEl) this.clockEl.textContent = this.fmtTime(new Date());
    const all = [];
    groups.forEach(g => g.items.forEach(it => all.push(it)));
    await Promise.all(all.map(async it => {
      const res = await this.probe(it);
      this.updateEntry(it, res);
    }));
    if (this.clockEl) this.clockEl.textContent = this.fmtTime(new Date());
  }

  start() {
    this.updateAll();
    this.timer = setInterval(() => this.updateAll(), 60000);
    const refresh = document.getElementById('svcRefresh');
    if (refresh) refresh.onclick = () => this.updateAll();
    document.addEventListener('languageChanged', () => this.updateAll());
  }
}

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

  window.playTick = function() {
    const buf = selectBuf;
    if (!buf) return;
    const c = getCtx();
    if (c.state === 'suspended') c.resume();
    const src = c.createBufferSource();
    src.buffer = buf;
    src.connect(masterGain || c.destination);
    src.start(0);
  };

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

  let lastTick = 0;
  slider.addEventListener('input', () => {
    const v = parseInt(slider.value);
    val.textContent = v + '%';
    icon.innerHTML = volIcon(v);
    if (v > 0) lastNonZero = v;
    localStorage.setItem('volume', v);
    if (window.setSoundVolume) window.setSoundVolume(v / 100);
    const now = Date.now();
    if (window.playTick && now - lastTick > 50) {
      lastTick = now;
      window.playTick();
    }
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
