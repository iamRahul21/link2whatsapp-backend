import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Custom CORS handling removed
export default async function handler(req, res) {
  // Always set CORS headers for every response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST allowed' });
    return;
  }

  const { phone, url, note } = req.body;

  if (!phone || !url) {
    res.status(400).json({ message: 'Phone and URL are required' });
    return;
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
    res.status(200).json({ message: 'Message sent!', sid: message.sid });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
}