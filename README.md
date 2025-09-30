DodoPayments Webhook → EZ Emailer Integration

This repository contains an implementation example for handling DodoPayments webhooks and pushing customer contact details into EZ Emailer CRM for marketing/automation purposes.

It’s a simple Node.js + Express service that:

Verifies and listens for payment.succeeded events from DodoPayments.

Automatically pushes customer email into EZ Emailer as a contact.

Provides a route to fetch the total purchase count from DodoPayments.

🚀 Features

✅ Secure webhook verification with standardwebhooks

✅ Integration with EZ Emailer via REST API

✅ Purchase count endpoint for analytics/reporting

✅ Ready-to-use Express server with CORS enabled

🛠️ Setup & Installation

Clone the repository

git clone https://github.com/yourusername/dodopayments-webhook-emailer.git
cd dodopayments-webhook-emailer


Install dependencies

npm install


Create .env file in the project root:

PORT=3000

# DodoPayments Webhook Secret (from Dodo dashboard)
DODO_WEBHOOK_SECRET=your_dodo_secret_here

# EZ Emailer API configuration
EZ_EMAILER_URL=https://your-ezemailer-instance.com
EZ_EMAILER_TOKEN=your_ezemailer_api_token


Start the server

node index.js


The server will start on http://localhost:3000

📩 Webhook Handling
Endpoint:

POST /dodopayment/webhook

Verifies incoming webhook with DodoPayments signature headers

On payment.succeeded, pushes customer email to EZ Emailer

🧪 Testing the Webhook with cURL

You can simulate a webhook payload to test your integration without waiting for DodoPayments to send one.

curl -X POST http://localhost:3000/dodopayment/webhook \
  -H "Content-Type: application/json" \
  -H "webhook-id: test-id-123" \
  -H "webhook-timestamp: $(date +%s)" \
  -H "webhook-signature: test-signature" \
  -d '{
    "type": "payment.succeeded",
    "data": {
      "payment_id": "pay_12345",
      "status": "succeeded",
      "customer": {
        "email": "customer@example.com"
      }
    }
  }'


👉 Note: Since the payload is signed, this mock won’t pass real signature verification unless you disable it or generate a valid one. You can temporarily skip verification during testing, or mock the verify call.

📊 Additional Routes
Get Total Purchases

GET /purchase/count

Returns the total number of purchases from DodoPayments.

Example Response:

{
  "totalPurchases": 42
}

📦 Folder Structure
.
├── dodopayments.js   # Wrapper for DodoPayments API
├── index.js          # Express server with webhook + routes
├── package.json
└── README.md

🤝 Contributing

Feel free to fork, open issues, or submit PRs if you’d like to extend this example.

⚠️ Disclaimer

This is a reference implementation. Please ensure you:

Secure your webhook endpoint (IP whitelisting, authentication, etc.)

Handle retries, errors, and logging as per your production needs
