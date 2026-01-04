function chooseVKPage(event) {
    event.preventDefault();
    let choice = confirm("main account or second account (cancel)?");
    if(choice) {
        window.open("https://vk.com/entbtw", "_blank");
    } else {
        window.open("https://vk.com/entitybtw", "_blank");
    }
}

function switchLang(lang) {
    localStorage.setItem('lang', lang);
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = (el.getAttribute('data-lang') === lang) ? '' : 'none';
    });
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
