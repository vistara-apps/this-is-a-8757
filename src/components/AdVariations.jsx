import React, { useState } from 'react'
import { Share2, Heart, Eye, Users, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

export function AdVariations({ variations, campaignId }) {
  const [postedVariations, setPostedVariations] = useState(new Set())

  const handlePost = async (variationId) => {
    // Simulate posting to social media
    setPostedVariations(prev => new Set([...prev, variationId]))
    
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In real app, this would call social media APIs
    console.log(`Posted variation ${variationId} to test account`)
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'tiktok': return '🎵'
      case 'instagram': return '📸'
      default: return '📱'
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'tiktok': return 'bg-pink-500'
      case 'instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div>
      <div className="text-center mb-xxl">
        <h2 className="text-4xl font-bold text-surface mb-lg">
          Your Ad Variations
        </h2>
        <p className="text-xl text-surface text-opacity-80 max-w-2xl mx-auto">
          Here are your AI-generated ad variations optimized for each platform. Post them to your test accounts to see which performs best.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-xl">
        {variations.map((variation) => (
          <div key={variation.id} className="bg-surface rounded-xl overflow-hidden shadow-card">
            {/* Platform Header */}
            <div className={clsx('p-lg flex items-center space-x-md text-surface', getPlatformColor(variation.platform))}>
              <span className="text-xl">{getPlatformIcon(variation.platform)}</span>
              <div>
                <h3 className="font-semibold capitalize">{variation.platform}</h3>
                <p className="text-sm opacity-80">{variation.visualStyle}</p>
              </div>
            </div>
            
            {/* Image */}
            <div className="aspect-square bg-gray-100">
              <img 
                src={variation.imageUrl} 
                alt="Ad variation" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Copy */}
            <div className="p-lg">
              <p className="text-text-primary text-sm leading-relaxed mb-lg">
                {variation.copy}
              </p>
              
              {/* Engagement Stats */}
              <div className="flex items-center justify-between text-text-secondary text-sm mb-lg">
                <div className="flex items-center space-x-xs">
                  <Heart className="w-4 h-4" />
                  <span>{variation.engagement.likes}</span>
                </div>
                <div className="flex items-center space-x-xs">
                  <Eye className="w-4 h-4" />
                  <span>{variation.engagement.views}</span>
                </div>
                <div className="flex items-center space-x-xs">
                  <Share2 className="w-4 h-4" />
                  <span>{variation.engagement.shares}</span>
                </div>
              </div>
              
              {/* Post Button */}
              <button
                onClick={() => handlePost(variation.id)}
                disabled={postedVariations.has(variation.id)}
                className={clsx(
                  'w-full py-sm px-lg rounded-lg font-medium transition-all duration-base flex items-center justify-center space-x-sm',
                  postedVariations.has(variation.id)
                    ? 'bg-green-500 text-surface cursor-not-allowed'
                    : 'bg-accent text-surface hover:bg-opacity-90'
                )}
              >
                {postedVariations.has(variation.id) ? (
                  <>
                    <span>✓ Posted to Test Account</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Post to Test Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}