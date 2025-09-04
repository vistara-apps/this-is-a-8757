import React, { useState } from 'react'
import { Check } from 'lucide-react'
import clsx from 'clsx'

const platforms = [
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Short-form vertical videos with trending effects',
    icon: '🎵',
    color: 'bg-pink-500',
    features: ['Vertical 9:16 format', 'Trending hashtags', 'Fast-paced content', 'Gen Z audience']
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Visual storytelling with multiple formats',
    icon: '📸',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    features: ['Feed posts', 'Stories', 'Reels', 'Shopping tags']
  }
]

interface PlatformSelectorProps {
  onPlatformSelection: (platforms: string[]) => void
  selectedPlatforms: string[]
}

export function PlatformSelector({ onPlatformSelection, selectedPlatforms }: PlatformSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedPlatforms)

  const togglePlatform = (platformId: string) => {
    const newSelected = selected.includes(platformId)
      ? selected.filter(id => id !== platformId)
      : [...selected, platformId]
    setSelected(newSelected)
  }

  const handleContinue = () => {
    if (selected.length > 0) {
      onPlatformSelection(selected)
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-surface mb-lg">
        Choose Target Platforms
      </h2>
      <p className="text-xl text-surface text-opacity-80 mb-xxl max-w-2xl mx-auto">
        Select the social media platforms where you want to test your ad variations. Each platform will get customized content.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl max-w-4xl mx-auto mb-xxl">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={clsx(
              'relative bg-surface rounded-xl p-xl cursor-pointer transition-all duration-base shadow-card',
              selected.includes(platform.id) 
                ? 'ring-4 ring-accent ring-opacity-50 bg-opacity-100' 
                : 'hover:bg-opacity-90 bg-opacity-80'
            )}
            onClick={() => togglePlatform(platform.id)}
          >
            {selected.includes(platform.id) && (
              <div className="absolute top-lg right-lg w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-surface" />
              </div>
            )}
            
            <div className="text-center">
              <div className={clsx('w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-lg', platform.color)}>
                <span className="text-2xl">{platform.icon}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-sm">
                {platform.name}
              </h3>
              <p className="text-text-secondary mb-lg">
                {platform.description}
              </p>
              
              <div className="space-y-sm">
                {platform.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center space-x-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selected.length > 0 && (
        <div className="bg-surface bg-opacity-90 rounded-xl p-xl max-w-md mx-auto">
          <p className="text-text-secondary mb-lg">
            Selected: {selected.map(id => platforms.find(p => p.id === id)?.name).join(', ')}
          </p>
          <button
            onClick={handleContinue}
            className="w-full bg-accent text-surface font-semibold py-md px-xl rounded-lg hover:bg-opacity-90 transition-all duration-base"
          >
            Continue to Generate Ads
          </button>
        </div>
      )}
    </div>
  )
}
