'use client'

import React, { useState } from 'react'
import { Header } from '../components/Header'
import { UploadSection } from '../components/UploadSection'
import { PlatformSelector } from '../components/PlatformSelector'
import { AdVariations } from '../components/AdVariations'
import { PaymentModal } from '../components/PaymentModal'
import { AnalyticsDashboard } from '../components/AnalyticsDashboard'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { ConnectWallet, Wallet, WalletDropdown, WalletDropdownLink, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet'
import { Avatar, Name } from '@coinbase/onchainkit/identity'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890123456789012345678901234567890123456789012345678901234')

export default function Home() {
  const [currentStep, setCurrentStep] = useState('upload')
  const [productImage, setProductImage] = useState<File | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [adVariations, setAdVariations] = useState<any[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [generatingAds, setGeneratingAds] = useState(false)

  const handleImageUpload = (file: File) => {
    setProductImage(file)
    setCurrentStep('platform')
  }

  const handlePlatformSelection = (platforms: string[]) => {
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
    } finally {
      setGeneratingAds(false)
    }
  }

  const generateAdVariations = async (image: File | null, platforms: string[]) => {
    // Mock implementation - replace with actual API call
    return [
      {
        id: '1',
        platform: 'TikTok',
        content: 'Check out this amazing product! 🔥',
        image: '/api/placeholder/400/600',
        performance: { views: 1250, likes: 89, shares: 12 }
      },
      {
        id: '2',
        platform: 'Instagram',
        content: 'Transform your routine with this game-changer ✨',
        image: '/api/placeholder/400/400',
        performance: { views: 890, likes: 67, shares: 8 }
      }
    ]
  }

  const handleReset = () => {
    setCurrentStep('upload')
    setProductImage(null)
    setSelectedPlatforms([])
    setAdVariations([])
    setCampaignId(null)
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        
        {/* Wallet Connection */}
        <div className="flex justify-end p-4">
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>

        <main className="container mx-auto px-4 py-8">
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
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-8">Ready to Generate Ad Variations?</h2>
              <p className="text-gray-300 mb-8">
                We'll create 5 unique ad variations optimized for {selectedPlatforms.join(' and ')}
              </p>
              <button
                onClick={handleGenerateAds}
                className="bg-accent text-surface font-semibold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Generate Ads ($0.50)
              </button>
            </div>
          )}
          
          {currentStep === 'variations' && (
            <AdVariations 
              variations={adVariations}
              campaignId={campaignId}
              onReset={handleReset}
              loading={generatingAds}
            />
          )}
          
          {currentStep === 'analytics' && campaignId && (
            <AnalyticsDashboard variations={adVariations} />
          )}
        </main>
        
        {showPayment && (
          <PaymentModal
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
            amount={50} // $0.50 in cents
          />
        )}
      </div>
    </Elements>
  )
}
