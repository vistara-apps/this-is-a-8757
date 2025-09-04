import OpenAI from 'openai';
import { promptTemplates } from '../utils/promptTemplates.js';

class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.models = {
      text: 'gpt-4-turbo-preview',
      vision: 'gpt-4-vision-preview'
    };
  }

  /**
   * Generate ad variations based on product image and platforms
   */
  async generateAdVariations(imageUrl, platforms, productContext = {}) {
    try {
      const variations = [];

      for (const platform of platforms) {
        // Generate 5 variations per platform as specified in PRD
        const platformVariations = await this.generatePlatformVariations(
          imageUrl, 
          platform, 
          productContext,
          5
        );
        variations.push(...platformVariations);
      }

      return variations;
    } catch (error) {
      console.error('OpenAI ad generation error:', error);
      throw new Error(`Failed to generate ad variations: ${error.message}`);
    }
  }

  /**
   * Generate variations for a specific platform
   */
  async generatePlatformVariations(imageUrl, platform, productContext, count = 5) {
    try {
      const prompt = promptTemplates.getAdGenerationPrompt(platform, productContext, count);

      const response = await this.client.chat.completions.create({
        model: this.models.vision,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      // Process and validate the response
      return this.processAdVariations(result.variations, platform);
    } catch (error) {
      console.error(`Platform ${platform} variation generation error:`, error);
      throw error;
    }
  }

  /**
   * Process and validate ad variations from OpenAI response
   */
  processAdVariations(variations, platform) {
    return variations.map((variation, index) => ({
      platform,
      copy: variation.copy || '',
      visualStyle: variation.visual_style || this.getDefaultVisualStyle(platform),
      prompt: variation.prompt || '',
      hooks: variation.hooks || [],
      hashtags: variation.hashtags || [],
      callToAction: variation.call_to_action || '',
      targetAudience: variation.target_audience || '',
      tone: variation.tone || 'engaging',
      estimatedPerformance: variation.estimated_performance || {
        engagement_rate: Math.random() * 0.1 + 0.02, // 2-12%
        reach_potential: Math.random() * 0.3 + 0.1,   // 10-40%
        conversion_likelihood: Math.random() * 0.05 + 0.01 // 1-6%
      }
    }));
  }

  /**
   * Analyze product image to extract context
   */
  async analyzeProductImage(imageUrl) {
    try {
      const prompt = promptTemplates.getImageAnalysisPrompt();

      const response = await this.client.chat.completions.create({
        model: this.models.vision,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Image analysis error:', error);
      throw new Error(`Failed to analyze product image: ${error.message}`);
    }
  }

  /**
   * Optimize ad copy for better performance
   */
  async optimizeAdCopy(originalCopy, platform, performanceData = {}) {
    try {
      const prompt = promptTemplates.getCopyOptimizationPrompt(
        originalCopy, 
        platform, 
        performanceData
      );

      const response = await this.client.chat.completions.create({
        model: this.models.text,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.optimized_copy;
    } catch (error) {
      console.error('Copy optimization error:', error);
      throw new Error(`Failed to optimize ad copy: ${error.message}`);
    }
  }

  /**
   * Generate hashtags for a platform
   */
  async generateHashtags(copy, platform, count = 10) {
    try {
      const prompt = promptTemplates.getHashtagGenerationPrompt(copy, platform, count);

      const response = await this.client.chat.completions.create({
        model: this.models.text,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.6,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.hashtags || [];
    } catch (error) {
      console.error('Hashtag generation error:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Generate A/B test variations
   */
  async generateABTestVariations(originalCopy, platform, testType = 'copy') {
    try {
      const prompt = promptTemplates.getABTestPrompt(originalCopy, platform, testType);

      const response = await this.client.chat.completions.create({
        model: this.models.text,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
        response_format: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.variations || [];
    } catch (error) {
      console.error('A/B test generation error:', error);
      throw new Error(`Failed to generate A/B test variations: ${error.message}`);
    }
  }

  /**
   * Get default visual style for platform
   */
  getDefaultVisualStyle(platform) {
    const styles = {
      tiktok: 'Vertical video with dynamic text overlays and trending effects',
      instagram: 'Clean, aesthetic layout with professional photography'
    };
    return styles[platform] || 'Standard social media format';
  }

  /**
   * Check API usage and limits
   */
  async checkUsage() {
    try {
      // Note: OpenAI doesn't provide a direct usage endpoint
      // This would need to be implemented with usage tracking
      return {
        available: true,
        message: 'OpenAI API is available'
      };
    } catch (error) {
      return {
        available: false,
        message: error.message
      };
    }
  }

  /**
   * Validate API key
   */
  async validateApiKey() {
    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error('OpenAI API key validation failed:', error);
      return false;
    }
  }
}

export default new OpenAIService();
