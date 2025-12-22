const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/ai/generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid prompt' });
    }

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            },
            {
                params: { key: GEMINI_API_KEY },
                headers: { 'Content-Type': 'application/json' }
            }
        );

        const candidates = response.data.candidates;
        const text = candidates && candidates[0] && candidates[0].content && candidates[0].content.parts
            ? candidates[0].content.parts.map(p => p.text).join('')
            : '';

        res.json({ text });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate content', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
