import React, { useState } from 'react'
import { Header } from './components/Header'
import { UploadSection } from './components/UploadSection'
import { PlatformSelector } from './components/PlatformSelector'
import { AdVariations } from './components/AdVariations'
import { PaymentModal } from './components/PaymentModal'
import { AnalyticsDashboard } from './components/AnalyticsDashboard'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51234567890123456789012345678901234567890123456789012345678901234')

function App() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [productImage, setProductImage] = useState(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState([])
  const [adVariations, setAdVariations] = useState([])
  const [showPayment, setShowPayment] = useState(false)
  const [campaignId, setCampaignId] = useState(null)
  const [generatingAds, setGeneratingAds] = useState(false)

  const handleImageUpload = (file) => {
    setProductImage(file)
    setCurrentStep('platform')
  }

  const handlePlatformSelection = (platforms) => {
    setSelectedPlatforms(platforms)
    setCurrentStep('generate')
  }

  const handleGenerateAds = () => {
    setShowPayment(true)
  }

  const handlePaymentSuccess = async () => {
    setShowPayment(false)
    setGeneratingAds(true)
    
    // Generate campaign ID
    const newCampaignId = Date.now().toString()
    setCampaignId(newCampaignId)
    
    try {
      // Generate ad variations using OpenAI
      const variations = await generateAdVariations(productImage, selectedPlatforms)
      setAdVariations(variations)
      setCurrentStep('variations')
    } catch (error) {
      console.error('Error generating ads:', error)
      alert('Failed to generate ad variations. Please try again.')
    } finally {
      setGeneratingAds(false)
    }
  }

  const generateAdVariations = async (image, platforms) => {
    // Mock OpenAI integration - in real app, this would call OpenAI API
    // For demo purposes, we'll generate mock variations
    const variations = []
    
    for (let i = 0; i < 5; i++) {
      for (const platform of platforms) {
        variations.push({
          id: `var_${Date.now()}_${i}_${platform}`,
          platform,
          copy: generateMockCopy(platform, i),
          visualStyle: generateMockVisualStyle(platform),
          imageUrl: URL.createObjectURL(image),
          posted: false,
          engagement: {
            likes: Math.floor(Math.random() * 500),
            views: Math.floor(Math.random() * 10000),
            shares: Math.floor(Math.random() * 50)
          }
        })
      }
    }
    
    return variations.slice(0, 5) // Return top 5 variations
  }

  const generateMockCopy = (platform, index) => {
    const copies = {
      tiktok: [
        "🔥 This product is about to blow up your feed! Who else needs this in their life? #viral #musthave",
        "POV: You find the perfect product that solves all your problems ✨ #productreview #fyp",
        "Wait... this actually works?! 😱 Comment 'NEED' if you want the link #amazing #trending",
        "Tell me you need this without telling me you need this 👀 #relatable #shopwithme",
        "The way this changed my life... no going back now 💫 #gamechange #lifehack"
      ],
      instagram: [
        "Elevate your daily routine with this game-changing find ✨ What's your must-have product?",
        "Sometimes the best discoveries come when you least expect them 💎 #discover #lifestyle",
        "Quality meets innovation in the most beautiful way 🌟 #premium #design",
        "When functionality meets style, magic happens ✨ #aesthetic #functional",
        "This is what peak performance looks like 🚀 #excellence #innovation"
      ]
    }
    return copies[platform]?.[index] || "Amazing product that you'll love! Check it out now."
  }

  const generateMockVisualStyle = (platform) => {
    const styles = {
      tiktok: ["Vertical video with dynamic text overlays", "Split-screen before/after", "Fast-paced transitions", "Trending effects"],
      instagram: ["Clean minimal aesthetic", "Carousel format", "Story highlights", "Professional photography"]
    }
    return styles[platform]?.[Math.floor(Math.random() * styles[platform].length)] || "Standard layout"
  }

  const resetFlow = () => {
    setCurrentStep('upload')
    setProductImage(null)
    setSelectedPlatforms([])
    setAdVariations([])
    setCampaignId(null)
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400">
        <div className="min-h-screen bg-bg bg-opacity-10 backdrop-blur-sm">
          <Header onReset={resetFlow} />
          
          <main className="container mx-auto max-w-5xl px-5 py-xl">
            {generatingAds && (
              <div className="text-center py-xxl">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent mb-lg"></div>
                <p className="text-xl font-semibold text-surface">Generating your ad variations...</p>
              </div>
            )}
            
            {!generatingAds && (
              <>
                {currentStep === 'upload' && (
                  <UploadSection onImageUpload={handleImageUpload} />
                )}
                
                {currentStep === 'platform' && (
                  <PlatformSelector 
                    onPlatformSelection={handlePlatformSelection}
                    selectedPlatforms={selectedPlatforms}
                  />
                )}
                
                {currentStep === 'generate' && (
                  <div className="text-center py-xxl">
                    <div className="bg-surface rounded-xl p-xl shadow-card max-w-md mx-auto">
                      <h2 className="text-2xl font-bold text-text-primary mb-lg">Ready to Generate</h2>
                      <p className="text-text-secondary mb-xl">
                        Generate 5 AI-powered ad variations for {selectedPlatforms.join(' and ')}
                      </p>
                      <button
                        onClick={handleGenerateAds}
                        className="w-full bg-accent text-surface font-semibold py-md px-xl rounded-lg hover:bg-opacity-90 transition-all duration-base"
                      >
                        Generate Ads - $0.50
                      </button>
                    </div>
                  </div>
                )}
                
                {currentStep === 'variations' && (
                  <>
                    <AdVariations 
                      variations={adVariations}
                      campaignId={campaignId}
                    />
                    <AnalyticsDashboard variations={adVariations} />
                  </>
                )}
              </>
            )}
          </main>
          
          {showPayment && (
            <PaymentModal 
              onSuccess={handlePaymentSuccess}
              onClose={() => setShowPayment(false)}
            />
          )}
        </div>
      </div>
    </Elements>
  )
}

export default App