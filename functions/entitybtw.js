const fetch = require('node-fetch');

exports.handler = async (event) => {
    const userAgent = event.headers['user-agent'] || '';
    if (userAgent.toLowerCase().includes('curl') || userAgent.toLowerCase().includes('wget')) {
        const response = await fetch('https://entitybtw.github.io/Curl/');
        const body = await response.text();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            body: body,
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
