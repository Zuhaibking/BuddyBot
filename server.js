require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const PROVIDERS = {
    openai: {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini',
        keyEnv: ['OPENAI_API_KEY', 'OPEN_AI_API_KEY']
    },
    deepseek: {
        endpoint: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        keyEnv: ['DEEPSEEK_API_KEY']
    },
    nvidia: {
        endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
        model: 'meta/llama-3.1-70b-instruct',
        keyEnv: ['NVIDIA_API_KEY', 'NVIDIA_NIM_API_KEY']
    }
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

function getConfiguredProvider() {
    const providerName = (process.env.AI_PROVIDER || '').toLowerCase();
    const provider =
        PROVIDERS[providerName] ||
        Object.values(PROVIDERS).find((candidate) =>
            candidate.keyEnv.some((envName) => Boolean(process.env[envName]))
        );

    if (!provider) {
        return null;
    }

    const keyEnv = provider.keyEnv.find((envName) => Boolean(process.env[envName]));
    return {
        endpoint: process.env.AI_API_BASE_URL || provider.endpoint,
        model: process.env.AI_MODEL || provider.model,
        apiKey: keyEnv ? process.env[keyEnv] : undefined,
        keyEnv
    };
}

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body?.message?.trim();

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getConfiguredProvider();
    if (!ai?.apiKey) {
        return res.status(500).json({
            error: 'Missing API key. Add OPENAI_API_KEY, OPEN_AI_API_KEY, DEEPSEEK_API_KEY, or NVIDIA_API_KEY to .env.'
        });
    }

    try {
        const response = await axios.post(
            ai.endpoint,
            {
                model: ai.model,
                messages: [
                    { role: 'system', content: 'You are a helpful AI assistant.' },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    Authorization: `Bearer ${ai.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 30000
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(502).json({
                error: 'No valid reply from API',
                raw: response.data
            });
        }

        res.json({ reply });
    } catch (error) {
        const status = error.response?.status || 500;
        const apiError =
            error.response?.data?.error?.message ||
            error.response?.data?.message ||
            error.message;

        console.error('API error:', {
            status,
            keyEnv: ai.keyEnv,
            model: ai.model,
            endpoint: ai.endpoint,
            message: apiError
        });

        res.status(status).json({
            error: apiError || 'API request failed'
        });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
