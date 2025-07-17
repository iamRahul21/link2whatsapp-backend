const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const twilio = require("twilio");
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.use(cors());
app.use(bodyParser.json());

app.post("/sendToWhatsapp", async (req, res) => {
  const { phone, url, note } = req.body;

  if (!phone || !url) {
    return res.status(400).json({ message: "Phone number and URL are required." });
  }

  const messageBody = `
📝 *Saved Link*
🔗 URL: ${url}
🗒️ Note: ${note || "No note"}
  `;

  try {
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phone}`
    });

    res.status(200).json({ message: "Message sent!", sid: message.sid });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Failed to send message", error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});