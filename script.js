function switchLang(lang) {
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
    });
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
    if (window.lastfmIntegration) {
        window.lastfmIntegration.updateTrack();
    }
}

function updateThemeImages(isDark) {
    document.querySelectorAll('.themechanging').forEach(img => {
        const lightSrc = img.getAttribute('data-src-light');
        const darkSrc = img.getAttribute('data-src-dark');
        img.src = isDark ? darkSrc : lightSrc;
    });
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeImages(isDark);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark: isDark } }));
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang');
    const savedTheme = localStorage.getItem('theme');
    const lang = savedLang || ((navigator.language || navigator.userLanguage).startsWith('ru') ? 'ru' : 'en');
    const theme = savedTheme || 'light';
    const isDark = theme === 'dark';
    
    if (isDark) document.body.classList.add('dark');
    switchLang(lang);
    updateThemeImages(isDark);
});

fetch(`https://webring.otomir23.me/32/data`)
    .then(res => res.json())
    .then(data => {
        document.getElementById('prev-link').href = data.prev.url;
        document.getElementById('prev-link').innerHTML = `< ${data.prev.name}`;
        document.getElementById('next-link').href = data.next.url;
        document.getElementById('next-link').innerHTML = `${data.next.name} >`;
    })
    .catch(err => console.error('webring fetch error:', err));

const month = new Date().getMonth();
if (month === 11 || month === 0 || month === 1) {
    function createSnowflake() {
        const snow = document.createElement("div");
        snow.className = "snowflake";
        snow.textContent = "❄";
        snow.style.left = Math.random() * 100 + "vw";
        snow.style.fontSize = Math.random() * 10 + 10 + "px";
        snow.style.animationDuration = Math.random() * 5 + 5 + "s";
        snow.style.opacity = Math.random();
        document.body.appendChild(snow);
        setTimeout(() => snow.remove(), 10000);
    }
    setInterval(createSnowflake, 200);
}

class LastFmIntegration {
    constructor() {
        this.base = 'https://koito.entitybtw.ru/apis/web/v1';
        this.songElement = document.getElementById('song');
        this.updateInterval = null;
    }

    async fetchCurrentTrack() {
        const [npRes, listensRes] = await Promise.all([
            fetch(`${this.base}/now-playing`),
            fetch(`${this.base}/listens?limit=1`)
        ]);
        const np = await npRes.json();
        if (np.currently_playing && np.track?.title) {
            const artist = np.track.artists?.[0]?.name || '';
            return { name: np.track.title, artist, nowPlaying: true };
        }
        const listens = await listensRes.json();
        const last = listens.items?.[0];
        if (last?.track?.title) {
            return { name: last.track.title, artist: last.track.artists?.[0]?.name || '', nowPlaying: false };
        }
        // fallback: top track of all time
        const topRes = await fetch(`${this.base}/top/tracks?period=overall&limit=1`);
        const top = await topRes.json();
        const topTrack = top.items?.[0]?.item;
        if (topTrack?.title) {
            return { name: topTrack.title, artist: topTrack.artists?.[0]?.name || '', nowPlaying: false };
        }
        return null;
    }

    formatTrackDisplay(track) {
        const lang = localStorage.getItem('lang') || 'ru';
        if (!track) return lang === 'ru' ? 'нет треков' : 'no tracks';
        if (track.nowPlaying) return `${track.name} — ${track.artist}`;
        return lang === 'ru'
            ? `последний: ${track.name} — ${track.artist}`
            : `last: ${track.name} — ${track.artist}`;
    }

    async updateTrack() {
        try {
            const track = await this.fetchCurrentTrack();
            if (this.songElement) this.songElement.textContent = this.formatTrackDisplay(track);
        } catch {
            const lang = localStorage.getItem('lang') || 'ru';
            if (this.songElement) this.songElement.textContent = lang === 'ru' ? 'ошибка загрузки :/' : 'load error :/';
        }
    }

    start() {
        this.updateTrack();
        this.updateInterval = setInterval(() => this.updateTrack(), 30000);
        document.addEventListener('languageChanged', () => this.updateTrack());
    }

    stop() {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('song')) {
        const lastfm = new LastFmIntegration();
        lastfm.start();
        window.lastfmIntegration = lastfm;
    }
});

