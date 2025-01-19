exports.handler = async (event) => {
    // Получаем заголовок User-Agent
    const userAgent = event.headers['user-agent'] || '';

    // Проверяем, содержит ли User-Agent слово "curl"
    if (userAgent.toLowerCase().includes('curl')) {
        // Возвращаем ASCII-арт для клиентов вроде curl
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: `
╔════════════════════════════════════════════════════╗
║                  entitybtw                         ║
╠════════════════════════════════════════════════════╣
║             psp-dev, technofreak                   ║
╠════════════════════════════════════════════════════╣
║ Telegram:            @entitybtw                    ║
║ Github:              @entitybtw                    ║
║ Twitch:              @entitybtw_                   ║
║ Youtube:             @entitybtw                    ║
║ Last FM:             @entitybtw                    ║
║ Discord:             @entitybtw                    ║
║ Minecraft:           @entitybtw                    ║
║ Steam:               @entitybtw                    ║
║ Roblox:              @ejrjmjjj                     ║
║ Website:             entitybtw.ru                  ║
╚════════════════════════════════════════════════════╝
            `,
        };
    } else {
        // Для всех остальных делаем редирект на блог
        return {
            statusCode: 301,
            headers: {
                Location: 'https://slat.cc/entitybtw',
            },
        };
    }
};
