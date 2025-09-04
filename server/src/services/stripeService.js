import Stripe from 'stripe';
import { User } from '../models/User.js';

class StripeService {
  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    // Pricing as specified in PRD: $0.50 per batch of 5 ad variations
    this.pricing = {
      adVariationBatch: {
        amount: 50, // $0.50 in cents
        currency: 'usd',
        description: 'Ad Variation Batch (5 variations)'
      }
    };
  }

  /**
   * Create or get Stripe customer
   */
  async createOrGetCustomer(user) {
    try {
      // Check if user already has a Stripe customer ID
      if (user.stripeCustomerId) {
        try {
          const customer = await this.stripe.customers.retrieve(user.stripeCustomerId);
          return customer;
        } catch (error) {
          // Customer doesn't exist, create new one
          console.log('Stripe customer not found, creating new one');
        }
      }

      // Create new customer
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.userId
        }
      });

      // Update user with Stripe customer ID
      await user.update({ stripe_customer_id: customer.id });

      return customer;
    } catch (error) {
      console.error('Create/get customer error:', error);
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  /**
   * Create payment intent for ad variation batch
   */
  async createPaymentIntent(user, metadata = {}) {
    try {
      const customer = await this.createOrGetCustomer(user);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: this.pricing.adVariationBatch.amount,
        currency: this.pricing.adVariationBatch.currency,
        customer: customer.id,
        description: this.pricing.adVariationBatch.description,
        metadata: {
          userId: user.userId,
          productType: 'ad_variation_batch',
          ...metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      };
    } catch (error) {
      console.error('Create payment intent error:', error);
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  /**
   * Confirm payment intent
   */
  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntent,
          metadata: paymentIntent.metadata
        };
      }

      return {
        success: false,
        status: paymentIntent.status,
        paymentIntent
      };
    } catch (error) {
      console.error('Confirm payment intent error:', error);
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(body, signature) {
    try {
      if (!this.webhookSecret) {
        throw new Error('Stripe webhook secret not configured');
      }

      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.webhookSecret
      );

      console.log('Stripe webhook event:', event.type);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        
        case 'customer.created':
          await this.handleCustomerCreated(event.data.object);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object);
          break;
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSucceeded(paymentIntent) {
    try {
      console.log('Payment succeeded:', paymentIntent.id);
      
      const userId = paymentIntent.metadata.userId;
      if (userId) {
        // Here you could trigger ad generation or update user credits
        console.log(`Payment successful for user ${userId}`);
        
        // You might want to emit an event or call a service to start ad generation
        // EventEmitter.emit('payment_succeeded', { userId, paymentIntentId: paymentIntent.id });
      }
    } catch (error) {
      console.error('Handle payment succeeded error:', error);
    }
  }

  /**
   * Handle failed payment
   */
  async handlePaymentFailed(paymentIntent) {
    try {
      console.log('Payment failed:', paymentIntent.id);
      
      const userId = paymentIntent.metadata.userId;
      if (userId) {
        console.log(`Payment failed for user ${userId}`);
        // Handle payment failure (notify user, log for retry, etc.)
      }
    } catch (error) {
      console.error('Handle payment failed error:', error);
    }
  }

  /**
   * Handle customer created
   */
  async handleCustomerCreated(customer) {
    try {
      console.log('Customer created:', customer.id);
      // Additional customer setup if needed
    } catch (error) {
      console.error('Handle customer created error:', error);
    }
  }

  /**
   * Handle invoice payment succeeded (for subscriptions if implemented later)
   */
  async handleInvoicePaymentSucceeded(invoice) {
    try {
      console.log('Invoice payment succeeded:', invoice.id);
      // Handle subscription payments if implemented
    } catch (error) {
      console.error('Handle invoice payment succeeded error:', error);
    }
  }

  /**
   * Get customer payment methods
   */
  async getCustomerPaymentMethods(customerId) {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data;
    } catch (error) {
      console.error('Get payment methods error:', error);
      throw new Error(`Failed to get payment methods: ${error.message}`);
    }
  }

  /**
   * Create setup intent for saving payment method
   */
  async createSetupIntent(customerId) {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });

      return {
        clientSecret: setupIntent.client_secret,
        setupIntentId: setupIntent.id
      };
    } catch (error) {
      console.error('Create setup intent error:', error);
      throw new Error(`Failed to create setup intent: ${error.message}`);
    }
  }

  /**
   * Get customer invoices
   */
  async getCustomerInvoices(customerId, limit = 10) {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit
      });

      return invoices.data;
    } catch (error) {
      console.error('Get customer invoices error:', error);
      throw new Error(`Failed to get invoices: ${error.message}`);
    }
  }

  /**
   * Refund payment
   */
  async refundPayment(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount, // If null, refunds the full amount
        reason
      });

      return refund;
    } catch (error) {
      console.error('Refund payment error:', error);
      throw new Error(`Failed to refund payment: ${error.message}`);
    }
  }

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(startDate, endDate) {
    try {
      const charges = await this.stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000)
        },
        limit: 100
      });

      const analytics = {
        totalRevenue: 0,
        totalTransactions: charges.data.length,
        successfulPayments: 0,
        failedPayments: 0,
        averageOrderValue: 0
      };

      charges.data.forEach(charge => {
        if (charge.status === 'succeeded') {
          analytics.totalRevenue += charge.amount;
          analytics.successfulPayments++;
        } else {
          analytics.failedPayments++;
        }
      });

      analytics.averageOrderValue = analytics.successfulPayments > 0 
        ? analytics.totalRevenue / analytics.successfulPayments 
        : 0;

      return analytics;
    } catch (error) {
      console.error('Get payment analytics error:', error);
      throw new Error(`Failed to get analytics: ${error.message}`);
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(body, signature) {
    try {
      return this.stripe.webhooks.constructEvent(body, signature, this.webhookSecret);
    } catch (error) {
      throw new Error(`Webhook signature validation failed: ${error.message}`);
    }
  }
}

export default new StripeService();
