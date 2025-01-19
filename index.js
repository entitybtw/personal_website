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
║                  Pavel V. Zhovner                  ║
╠════════════════════════════════════════════════════╣
║ Email:               pavel@zhovner.com             ║
║ Phone:               +1 510 972-83-59              ║
║ Telegram:            @zhovner                      ║
║ SSH key:             https://zhovner.com/pub.txt   ║
║ PGP key:             https://zhovner.com/pgpkey.txt║
╚════════════════════════════════════════════════════╝
            `,
        };
    } else {
        // Для всех остальных делаем редирект на блог
        return {
            statusCode: 301,
            headers: {
                Location: 'https://blog.zhovner.com',
            },
        };
    }
};
