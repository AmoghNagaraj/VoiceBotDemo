import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); 

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/ask', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-minni-2024-07-18',
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        const data = await response.json();

        // Validate response structure
        if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
            const botReply = data.choices[0].message.content;
            res.json({ reply: botReply });
        } else {
            console.error('Unexpected API response:', data);
            res.status(500).json({ reply: 'Sorry, there was an issue processing the API response.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ reply: 'Sorry, there was an error processing your request.' });
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
