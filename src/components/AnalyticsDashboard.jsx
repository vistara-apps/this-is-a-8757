import React from 'react'
import { TrendingUp, Users, Eye, Heart } from 'lucide-react'

export function AnalyticsDashboard({ variations }) {
  if (!variations.length) return null

  // Calculate aggregated stats
  const totalEngagement = variations.reduce((sum, v) => sum + v.engagement.likes + v.engagement.shares, 0)
  const totalViews = variations.reduce((sum, v) => sum + v.engagement.views, 0)
  const avgEngagementRate = ((totalEngagement / totalViews) * 100).toFixed(2)

  // Find best performing variation
  const bestPerforming = variations.reduce((best, current) => {
    const currentScore = current.engagement.likes + current.engagement.shares
    const bestScore = best.engagement.likes + best.engagement.shares
    return currentScore > bestScore ? current : best
  })

  const platformStats = variations.reduce((acc, variation) => {
    if (!acc[variation.platform]) {
      acc[variation.platform] = {
        variations: 0,
        totalLikes: 0,
        totalViews: 0,
        totalShares: 0
      }
    }
    acc[variation.platform].variations += 1
    acc[variation.platform].totalLikes += variation.engagement.likes
    acc[variation.platform].totalViews += variation.engagement.views
    acc[variation.platform].totalShares += variation.engagement.shares
    return acc
  }, {})

  return (
    <div className="mt-xxl">
      <div className="text-center mb-xl">
        <h2 className="text-3xl font-bold text-surface mb-sm">
          Performance Analytics
        </h2>
        <p className="text-surface text-opacity-80">
          Track how your ad variations are performing across platforms
        </p>
      </div>
      
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
        <div className="bg-surface bg-opacity-90 rounded-xl p-lg text-center">
          <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-md">
            <Eye className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{totalViews.toLocaleString()}</div>
          <div className="text-sm text-text-secondary">Total Views</div>
        </div>
        
        <div className="bg-surface bg-opacity-90 rounded-xl p-lg text-center">
          <div className="w-12 h-12 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-md">
            <Heart className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {variations.reduce((sum, v) => sum + v.engagement.likes, 0).toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">Total Likes</div>
        </div>
        
        <div className="bg-surface bg-opacity-90 rounded-xl p-lg text-center">
          <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-md">
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{avgEngagementRate}%</div>
          <div className="text-sm text-text-secondary">Engagement Rate</div>
        </div>
        
        <div className="bg-surface bg-opacity-90 rounded-xl p-lg text-center">
          <div className="w-12 h-12 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-md">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-text-primary">{variations.length}</div>
          <div className="text-sm text-text-secondary">Ad Variations</div>
        </div>
      </div>
      
      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <div className="bg-surface bg-opacity-90 rounded-xl p-xl">
          <h3 className="text-xl font-bold text-text-primary mb-lg">Platform Performance</h3>
          <div className="space-y-lg">
            {Object.entries(platformStats).map(([platform, stats]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-md">
                  <span className="text-2xl">
                    {platform === 'tiktok' ? '🎵' : '📸'}
                  </span>
                  <div>
                    <div className="font-semibold text-text-primary capitalize">{platform}</div>
                    <div className="text-sm text-text-secondary">{stats.variations} variations</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-text-primary">{stats.totalLikes}</div>
                  <div className="text-sm text-text-secondary">likes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-surface bg-opacity-90 rounded-xl p-xl">
          <h3 className="text-xl font-bold text-text-primary mb-lg">Top Performer</h3>
          <div className="flex items-start space-x-md">
            <img 
              src={bestPerforming.imageUrl} 
              alt="Best performing ad" 
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="font-semibold text-text-primary capitalize mb-sm">
                {bestPerforming.platform}
              </div>
              <div className="text-sm text-text-secondary mb-md line-clamp-2">
                {bestPerforming.copy.substring(0, 100)}...
              </div>
              <div className="flex space-x-lg text-sm">
                <span className="text-red-500">{bestPerforming.engagement.likes} likes</span>
                <span className="text-blue-500">{bestPerforming.engagement.views} views</span>
                <span className="text-green-500">{bestPerforming.engagement.shares} shares</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}