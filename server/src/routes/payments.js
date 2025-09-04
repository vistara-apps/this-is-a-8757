import express from 'express';
import { body } from 'express-validator';
import stripeService from '../services/stripeService.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', requireAuth, async (req, res, next) => {
  try {
    const user = req.user;
    const { metadata = {} } = req.body;

    const paymentIntent = await stripeService.createPaymentIntent(user, metadata);

    res.json({
      success: true,
      data: paymentIntent
    });
  } catch (error) {
    next(error);
  }
});

// Confirm payment
router.post('/confirm-payment', requireAuth, async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }

    const result = await stripeService.confirmPaymentIntent(paymentIntentId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing stripe signature'
      });
    }

    const result = await stripeService.handleWebhook(req.body, signature);

    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get customer payment methods
router.get('/payment-methods', requireAuth, async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.stripeCustomerId) {
      return res.json({
        success: true,
        data: []
      });
    }

    const paymentMethods = await stripeService.getCustomerPaymentMethods(user.stripeCustomerId);

    res.json({
      success: true,
      data: paymentMethods
    });
  } catch (error) {
    next(error);
  }
});

export default router;
