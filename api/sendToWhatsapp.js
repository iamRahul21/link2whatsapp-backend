import { config } from 'dotenv';
import twilio from 'twilio';

// Load local env vars
config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Custom CORS handling removed
export default async function handler(req, res) {
  console.log('Incoming request:', req.method);
  console.log('Request body:', req.body);
  // Always set CORS headers for every response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Optionally allow credentials if needed
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    // Respond with 200 and all CORS headers
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('Rejected non-POST method:', req.method);
    res.status(405).json({ message: 'Only POST allowed' });
    return;
  }

  const { phone, url, note } = req.body;
  console.log('Parsed body:', { phone, url, note });

  if (!phone || !url) {
    console.log('Validation failed: missing phone or url');
    res.status(400).json({ message: 'Phone and URL are required' });
    return;
  }

  const cleanedPhone = phone.replace(/\s+/g, '');
  console.log('Cleaned phone:', cleanedPhone);
  const messageBody = `
📝 *Saved Link*
🔗 URL: ${url}
🗒️ Note: ${note || 'No note'}
  `;
  console.log('Message body:', messageBody);

  try {
    console.log('Sending WhatsApp message...');
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${cleanedPhone}`
    });
    console.log('Twilio response:', message);
    res.status(200).json({ message: 'Message sent!', sid: message.sid });
  } catch (error) {
    console.error('Twilio error:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
}