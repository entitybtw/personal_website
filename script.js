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
    constructor(user = 'entitybtw') {
        this.user = user;
        this.url = `https://lastfm-last-played.biancarosa.com.br/${user}/latest-song`;
        this.songElement = document.getElementById('song');
        this.updateInterval = null;
    }

    async fetchCurrentTrack() {
        try {
            const response = await fetch(this.url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data?.track) {
                return {
                    name: data.track.name,
                    artist: data.track.artist['#text'],
                    nowPlaying: data.track['@attr']?.nowplaying === "true" || false
                };
            }
            
            return null;
        } catch (error) {
            console.error('Last.fm fetch error:', error);
            throw error;
        }
    }

    formatTrackDisplay(track) {
        const currentLang = localStorage.getItem('lang') || 'ru';
        
        if (!track) {
            return currentLang === 'ru' ? 'нет треков' : 'no tracks';
        }
        
        if (track.nowPlaying) {
            return ` (^_^) ${track.name} — ${track.artist}`;
        } else {
            return ` (^_^) ${track.name} — ${track.artist}`;
        }
    }

    updateSongDisplay(text) {
        if (this.songElement) {
            this.songElement.textContent = text;
        }
    }

    async updateTrack() {
        try {
            const track = await this.fetchCurrentTrack();
            const displayText = this.formatTrackDisplay(track);
            this.updateSongDisplay(displayText);
            
        } catch (error) {
            const currentLang = localStorage.getItem('lang') || 'ru';
            const errorMsg = currentLang === 'ru' ? 'ошибка загрузки :/' : 'load error :/';
            this.updateSongDisplay(errorMsg);
        }
    }

    scheduleUpdate(interval = 30000) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.updateInterval = setInterval(() => this.updateTrack(), interval);
    }

    start() {
        this.updateTrack();
        this.scheduleUpdate();
        
        document.addEventListener('languageChanged', () => {
            this.updateTrack();
        });
    }

    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('song')) {
        const lastfm = new LastFmIntegration('entitybtw');
        lastfm.start();
        window.lastfmIntegration = lastfm;
    }
});

document.addEventListener('themeChanged', () => {
    if (window.lastfmIntegration) {
        window.lastfmIntegration.updateTrack();
    }
});