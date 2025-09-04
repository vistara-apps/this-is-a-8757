-- Ad Remix Database Schema
-- This file contains the complete database schema as specified in the PRD

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Campaigns table
CREATE TABLE IF NOT EXISTS ad_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ad Variations table
CREATE TABLE IF NOT EXISTS ad_variations (
    variation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES ad_campaigns(campaign_id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    generated_image_url TEXT,
    generated_copy TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('tiktok', 'instagram')),
    posted_to_test_account BOOLEAN DEFAULT FALSE,
    performance_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_user_id ON ad_campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_created_at ON ad_campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_ad_variations_campaign_id ON ad_variations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_variations_platform ON ad_variations(platform);
CREATE INDEX IF NOT EXISTS idx_ad_variations_posted ON ad_variations(posted_to_test_account);
CREATE INDEX IF NOT EXISTS idx_ad_variations_created_at ON ad_variations(created_at);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_campaigns_updated_at BEFORE UPDATE ON ad_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_variations_updated_at BEFORE UPDATE ON ad_variations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_variations ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can only access their own campaigns
CREATE POLICY "Users can view own campaigns" ON ad_campaigns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campaigns" ON ad_campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON ad_campaigns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON ad_campaigns
    FOR DELETE USING (auth.uid() = user_id);

-- Users can only access variations from their own campaigns
CREATE POLICY "Users can view own variations" ON ad_variations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM ad_campaigns 
            WHERE ad_campaigns.campaign_id = ad_variations.campaign_id 
            AND ad_campaigns.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create variations for own campaigns" ON ad_variations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM ad_campaigns 
            WHERE ad_campaigns.campaign_id = ad_variations.campaign_id 
            AND ad_campaigns.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own variations" ON ad_variations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM ad_campaigns 
            WHERE ad_campaigns.campaign_id = ad_variations.campaign_id 
            AND ad_campaigns.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own variations" ON ad_variations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM ad_campaigns 
            WHERE ad_campaigns.campaign_id = ad_variations.campaign_id 
            AND ad_campaigns.user_id = auth.uid()
        )
    );

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product images
CREATE POLICY "Users can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Users can update own product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
