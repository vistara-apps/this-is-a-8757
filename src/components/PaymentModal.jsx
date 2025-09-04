import React, { useState } from 'react'
import { X, CreditCard } from 'lucide-react'

export function PaymentModal({ onSuccess, onClose }) {
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    setProcessing(true)
    
    // Mock payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real app, this would integrate with Stripe
    setProcessing(false)
    onSuccess()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-lg">
      <div className="bg-surface rounded-xl max-w-md w-full p-xl relative">
        <button
          onClick={onClose}
          className="absolute top-lg right-lg p-sm hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-accent bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-lg">
            <CreditCard className="w-8 h-8 text-accent" />
          </div>
          
          <h2 className="text-2xl font-bold text-text-primary mb-sm">
            Generate Ad Variations
          </h2>
          <p className="text-text-secondary mb-xl">
            Create 5 AI-powered ad variations for your selected platforms
          </p>
          
          <div className="bg-gray-50 rounded-lg p-lg mb-xl">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Ad Variation Batch</span>
              <span className="font-semibold text-text-primary">$0.50</span>
            </div>
          </div>
          
          {/* Mock Payment Form */}
          <div className="space-y-lg mb-xl">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-sm">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                className="w-full p-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                defaultValue="4242 4242 4242 4242"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-md">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-sm">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="12/25"
                  className="w-full p-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  defaultValue="12/25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-sm">
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full p-md border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  defaultValue="123"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={processing}
            className="w-full bg-accent text-surface font-semibold py-md px-xl rounded-lg hover:bg-opacity-90 transition-all duration-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-surface"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Pay $0.50 & Generate Ads'
            )}
          </button>
          
          <p className="text-xs text-text-secondary mt-lg">
            Secure payment powered by Stripe. This is a demo using test card numbers.
          </p>
        </div>
      </div>
    </div>
  )
}