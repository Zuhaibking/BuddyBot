require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: 'Message is required' });
    }

    try {
        const payload = {
            model: "meta/llama-3.1-70b-instruct",
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 500
        };

        const response = await axios.post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("RAW API RESPONSE:", response.data);

        const reply =
            response.data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.json({
                reply: "⚠️ No valid reply from API",
                raw: response.data
            });
        }

        res.json({ reply });

    } catch (error) {
        console.log("FULL ERROR:", error.response?.data || error.message);

        res.json({
            reply: "API ERROR: " + JSON.stringify(error.response?.data || error.message)
        });
    }
}); // ✅ THIS WAS MISSING

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});