const axios = require('axios');

const OPENAI_API_KEY = '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'; // <<< Put your API key here
const GPT_MODEL = 'gpt-3.5-turbo';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Only POST requests are accepted',
    };
  }

  try {
    const { event: eventName, data } = JSON.parse(event.body);

    if (eventName !== 'message') {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Ignored event: ' + eventName }),
      };
    }

    const userMessage = data.content;

    const gptResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: GPT_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const gptReply = gptResponse.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: gptReply }),
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
