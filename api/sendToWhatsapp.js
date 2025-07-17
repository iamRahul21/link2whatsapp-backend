import { config } from 'dotenv';
import twilio from 'twilio';

// Load env vars for local dev (Vercel loads them automatically)
config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  // 🔒 Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // ❌ Block other non-POST methods
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { phone, url, note } = req.body;

  if (!phone || !url) {
    return res.status(400).json({ message: 'Phone and URL are required' });
  }

  const cleanedPhone = phone.replace(/\s+/g, '');
  const messageBody = `
📝 *Saved Link*
🔗 URL: ${url}
🗒️ Note: ${note || 'No note'}
  `;

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${cleanedPhone}`
    });

    return res.status(200).json({ message: 'Message sent!', sid: message.sid });
  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
}