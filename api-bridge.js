const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { type, city, prompt } = JSON.parse(event.body);
        const GEMINI_KEY = process.env.GEMINI_API_KEY;
        const WEATHER_KEY = process.env.WEATHER_API_KEY;

        if (type === 'weather') {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            return { statusCode: 200, body: JSON.stringify(data) };
        } 

        if (type === 'ai') {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            return { statusCode: 200, body: JSON.stringify(data) };
        }
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};