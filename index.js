const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const _ = require('lodash');
const { Webhook } = require("standardwebhooks");
const DodoPaymentWrapper = require('./dodopayments');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());

// enable cors
app.use(cors());

const pushContactToEmailer = async (name, email, group, status, link) => {
    fetch(`${process.env.EZ_EMAILER_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EZ_EMAILER_TOKEN}`
        },
        body: JSON.stringify({ name, email, group, status, link })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
} 

// Webhook for payment success
app.post('/dodopayment/webhook', async (req, res) => {
  try {
    const webhook = new Webhook(process.env.DODO_WEBHOOK_SECRET);

    const webhookHeaders = {
        "webhook-id": (req.headers["webhook-id"] || ""),
        "webhook-signature": (req.headers["webhook-signature"] || ""),
        "webhook-timestamp": (req.headers["webhook-timestamp"] || ""),
      };
      
    const raw = JSON.stringify(req.body);
    const samePayloadOutput = await webhook.verify(raw, webhookHeaders);

    if(_.isEqual(samePayloadOutput, req.body)) {
        let responseData = req.body;

        console.log('DODO Response', JSON.stringify(responseData));
        let email = responseData.customer.email;

        if (responseData.payment_id) {
            await pushContactToEmailer('Customer', email, 'customer', 'unsubscribed', '');
        } else {
            console.error('Invalid data in DODO Response');
            throw new ApiError(400, 'Invalid data')
        } 
    }

    res.send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing webhook');
  }
});

// Route to get total purchases count
app.get('/purchase/count', async (req, res) => {
  try {
    const dodoPay = new DodoPaymentWrapper();

    const count = await dodoPay.getAllPurchases();
    res.json({ totalPurchases: count });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching purchase count');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));