import { supabase, supabaseAdmin } from '../config/database.js';

export class User {
  constructor(data) {
    this.userId = data.user_id;
    this.email = data.email;
    this.stripeCustomerId = data.stripe_customer_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  /**
   * Create a new user
   */
  static async create(userData) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([{
        user_id: userData.userId,
        email: userData.email,
        stripe_customer_id: userData.stripeCustomerId
      }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return new User(data);
  }

  /**
   * Find user by ID
   */
  static async findById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return new User(data);
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return new User(data);
  }

  /**
   * Find user by Stripe customer ID
   */
  static async findByStripeCustomerId(stripeCustomerId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', stripeCustomerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw new Error(`Failed to find user: ${error.message}`);
    }

    return new User(data);
  }

  /**
   * Update user
   */
  async update(updateData) {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', this.userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    // Update instance properties
    Object.assign(this, new User(data));
    return this;
  }

  /**
   * Delete user
   */
  async delete() {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', this.userId);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }

    return true;
  }

  /**
   * Get user's campaigns
   */
  async getCampaigns(limit = 10, offset = 0) {
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to get campaigns: ${error.message}`);
    }

    return data;
  }

  /**
   * Get user's campaign count
   */
  async getCampaignCount() {
    const { count, error } = await supabase
      .from('ad_campaigns')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId);

    if (error) {
      throw new Error(`Failed to get campaign count: ${error.message}`);
    }

    return count;
  }

  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      userId: this.userId,
      email: this.email,
      stripeCustomerId: this.stripeCustomerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
