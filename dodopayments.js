const DodoPayments = require('dodopayments');

class DodoPaymentWrapper {
    constructor() {
        this.client =  new DodoPayments({
            bearerToken: process.env.DODO_PAYMENTS_API_KEY, // This is the default and can be omitted
        });
    }

    async getAllPurchases() {
        try {
            const payment = await this.client.payments.list({ page_number: 100, status: 'succeeded' });
            return payment.items.length;
        } catch (error) {
            console.error('Error getting payment:', error);
            throw error;
        }
    }
}

module.exports = DodoPaymentWrapper;