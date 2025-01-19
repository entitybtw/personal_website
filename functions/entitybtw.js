exports.handler = async (event) => {
    const userAgent = event.headers['user-agent'] || '';
    if (userAgent.toLowerCase().includes('curl') || userAgent.toLowerCase().includes('wget')) {
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
            ` + '\n',
        };
    } else {
        return {
            statusCode: 301,
            headers: {
                Location: 'https://slat.cc/entitybtw',
            },
        };
    }
};
