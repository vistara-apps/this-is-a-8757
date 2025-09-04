import React from 'react'
import { Sparkles, RotateCcw } from 'lucide-react'

export function Header({ onReset }) {
  return (
    <header className="bg-surface bg-opacity-20 backdrop-blur-md border-b border-surface border-opacity-20">
      <div className="container mx-auto max-w-5xl px-5 py-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-md">
            <div className="p-sm bg-accent rounded-lg">
              <Sparkles className="w-6 h-6 text-surface" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-surface">Ad Remix</h1>
              <p className="text-sm text-surface text-opacity-80">AI-Powered Ad Variations</p>
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-sm bg-surface bg-opacity-20 hover:bg-opacity-30 text-surface px-lg py-sm rounded-lg transition-all duration-base"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>
    </header>
  )
}