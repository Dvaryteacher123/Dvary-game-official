import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json());

// ============================================================
// API ROUTES
// ============================================================

// AI Chat API
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'mistralai/mistral-7b-instruct:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful gaming assistant for DVARY GAMES platform. You help users with game recommendations, gaming tips, and general gaming queries.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5173',
                    'X-Title': 'DVARY GAMES'
                }
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        res.json({ response: aiResponse });
        
    } catch (error) {
        console.error('AI Chat Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            details: error.response?.data || error.message
        });
    }
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
    console.log(`🚀 DVARY GAMES Server running on http://localhost:${PORT}`);
    console.log(`🤖 AI API: http://localhost:${PORT}/api/ai-chat`);
});
