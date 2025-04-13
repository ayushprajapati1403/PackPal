const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chatbot', async (req, res) => {
	const userMessage = req.body.message;

	try {
		const response = await axios.post(
			'https://openrouter.ai/api/v1/chat/completions',
			{
				model: 'meta-llama/llama-3-8b-instruct',
				messages: [
					{
						role: 'system',
						content: 'You are PackPal AI, a helpful travel assistant. Help users plan group travel, suggest destinations, create itineraries, and provide travel tips. Be friendly, informative, and specific in your responses.',
					},
					{
						role: 'user',
						content: userMessage,
					},
				],
			},
			{
				headers: {
					'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const botReply = response.data.choices[0].message.content;
		res.json({ response: botReply });
	} catch (error) {
		console.error('LLaMA API error:', error.response?.data || error.message);
		res.status(500).json({ response: 'Sorry, I encountered an error. Please try again later.' });
	}
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log(`✅ PackPal AI server running at http://localhost:${PORT}`);
}); 