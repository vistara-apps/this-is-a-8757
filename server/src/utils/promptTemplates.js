/**
 * Prompt templates for OpenAI API calls
 */
export const promptTemplates = {
  /**
   * Generate ad variations prompt
   */
  getAdGenerationPrompt(platform, productContext = {}, count = 5) {
    const platformSpecs = {
      tiktok: {
        format: 'vertical video (9:16)',
        audience: 'Gen Z and younger millennials',
        style: 'casual, trendy, authentic',
        features: 'trending sounds, effects, hashtags',
        copyLength: '50-100 characters',
        tone: 'fun, energetic, relatable'
      },
      instagram: {
        format: 'square or vertical (1:1 or 4:5)',
        audience: 'millennials and Gen Z',
        style: 'aesthetic, polished, aspirational',
        features: 'stories, reels, shopping tags',
        copyLength: '100-200 characters',
        tone: 'inspiring, lifestyle-focused'
      }
    };

    const spec = platformSpecs[platform] || platformSpecs.instagram;

    return `You are an expert social media marketer specializing in ${platform} advertising. 

Analyze the product image and generate ${count} distinct ad variations optimized for ${platform}.

Platform specifications:
- Format: ${spec.format}
- Target audience: ${spec.audience}
- Style: ${spec.style}
- Key features: ${spec.features}
- Copy length: ${spec.copyLength}
- Tone: ${spec.tone}

Product context: ${JSON.stringify(productContext)}

For each variation, provide:
1. Compelling ad copy that hooks the audience
2. Visual style description for the creative
3. Specific prompt for content creation
4. Relevant hashtags (5-10)
5. Clear call-to-action
6. Target audience segment
7. Estimated performance metrics

Return the response as a JSON object with this structure:
{
  "variations": [
    {
      "copy": "engaging ad copy text",
      "visual_style": "description of visual approach",
      "prompt": "detailed prompt for content creation",
      "hashtags": ["#hashtag1", "#hashtag2"],
      "call_to_action": "specific CTA",
      "target_audience": "audience description",
      "tone": "content tone",
      "estimated_performance": {
        "engagement_rate": 0.05,
        "reach_potential": 0.25,
        "conversion_likelihood": 0.03
      }
    }
  ]
}

Make each variation unique with different angles, hooks, and approaches. Focus on what would actually perform well on ${platform}.`;
  },

  /**
   * Image analysis prompt
   */
  getImageAnalysisPrompt() {
    return `Analyze this product image and extract key information for advertising purposes.

Identify:
1. Product type and category
2. Key features and benefits visible
3. Target demographic
4. Price point indication (budget/mid-range/premium)
5. Use cases and scenarios
6. Emotional appeal factors
7. Unique selling points
8. Brand positioning
9. Color scheme and aesthetic
10. Lifestyle associations

Return as JSON:
{
  "product_type": "category",
  "key_features": ["feature1", "feature2"],
  "target_demographic": "description",
  "price_point": "budget|mid-range|premium",
  "use_cases": ["use1", "use2"],
  "emotional_appeal": ["appeal1", "appeal2"],
  "unique_selling_points": ["usp1", "usp2"],
  "brand_positioning": "description",
  "color_scheme": ["color1", "color2"],
  "lifestyle": "lifestyle description",
  "marketing_angles": ["angle1", "angle2"]
}`;
  },

  /**
   * Copy optimization prompt
   */
  getCopyOptimizationPrompt(originalCopy, platform, performanceData) {
    return `Optimize this ad copy for better performance on ${platform}.

Original copy: "${originalCopy}"

Performance data: ${JSON.stringify(performanceData)}

Platform: ${platform}

Optimization goals:
- Increase engagement rate
- Improve click-through rate
- Enhance conversion potential
- Maintain brand voice
- Follow platform best practices

Provide 3 optimized versions with explanations:

{
  "optimized_versions": [
    {
      "copy": "optimized copy text",
      "improvements": ["improvement1", "improvement2"],
      "reasoning": "why this version should perform better"
    }
  ],
  "key_changes": ["change1", "change2"],
  "expected_improvements": "performance expectations"
}`;
  },

  /**
   * Hashtag generation prompt
   */
  getHashtagGenerationPrompt(copy, platform, count) {
    return `Generate ${count} relevant hashtags for this ${platform} post:

Copy: "${copy}"

Requirements:
- Mix of popular and niche hashtags
- Platform-appropriate
- Relevant to content
- Good reach potential
- Include trending tags when relevant

Return as JSON:
{
  "hashtags": ["#hashtag1", "#hashtag2"],
  "categories": {
    "trending": ["#trend1"],
    "niche": ["#niche1"],
    "branded": ["#brand1"],
    "community": ["#community1"]
  }
}`;
  },

  /**
   * A/B test variations prompt
   */
  getABTestPrompt(originalCopy, platform, testType) {
    return `Create A/B test variations for this ${platform} ad copy.

Original: "${originalCopy}"
Test type: ${testType}

Generate 3 variations testing different elements:
1. Hook/opening line
2. Call-to-action
3. Emotional appeal

Each variation should change only the test element while keeping other aspects similar.

Return as JSON:
{
  "variations": [
    {
      "copy": "variation text",
      "test_element": "what's being tested",
      "hypothesis": "why this might perform better",
      "target_metric": "engagement|clicks|conversions"
    }
  ]
}`;
  }
};
