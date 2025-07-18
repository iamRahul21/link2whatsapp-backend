# Link2WhatsApp Backend

This project is a Node.js serverless backend for sending WhatsApp messages via the Twilio API. It is designed to be deployed on Vercel and used by a Chrome Extension to send links and notes directly to a WhatsApp number.

## Features
- Serverless API endpoint for sending WhatsApp messages
- CORS support for Chrome Extensions
- Secure handling of Twilio credentials via environment variables
- Simple integration with browser extensions or other clients

## Folder Structure

```
link2whatsapp-backend/
├── api/
│   └── sendToWhatsapp.js        # Main serverless function
├── .env                         # Local development only (not committed)
├── package.json                 # Project dependencies
├── vercel.json                  # Vercel deployment config
├── README.md                    # Project documentation
```

## Environment Variables
Set these in the Vercel dashboard (Project > Settings > Environment Variables):

- `TWILIO_ACCOUNT_SID` - Your Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio Auth Token
- `TWILIO_WHATSAPP_NUMBER` - Your Twilio WhatsApp-enabled number (e.g., whatsapp:+14155238886)

## API Endpoint

**POST** `/api/sendToWhatsapp`

**Request Body:**
```json
{
  "phone": "+1234567890",      // Recipient's WhatsApp number
  "url": "https://example.com", // Link to send
  "note": "Optional note"        // (optional) Note to include
}
```

**Response:**
- `200 OK` with `{ message: 'Message sent!', sid: <twilio_sid> }` on success
- `400 Bad Request` if required fields are missing
- `405 Method Not Allowed` for non-POST requests
- `500 Internal Server Error` for Twilio/API errors

## CORS
The backend sets permissive CORS headers (`*`) to allow requests from Chrome Extensions and web clients. No credentials are required.

## Local Development
1. Clone the repo and run `npm install`.
2. Create a `.env` file with your Twilio credentials (for local only):
   ```env
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```
3. Start a local server (e.g., with `vercel dev` or `node`).

## Deployment
1. Push your code to GitHub (do not commit `.env`).
2. Import the project into Vercel and set environment variables in the dashboard.
3. Deploy. Your API will be available at `https://<your-vercel-domain>/api/sendToWhatsapp`.

## Chrome Extension Integration
Add the following to your extension's `manifest.json`:
```json
"host_permissions": [
  "https://<your-vercel-domain>/*"
]
```
Then use `fetch` to POST to the API endpoint from your extension.