'use client';

import { useState } from 'react';
import WorldClassLoader from './WorldClassLoader';

export default function LoaderDemo() {
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'pulse' | 'wave' | 'orbit'>('default');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [customMessage, setCustomMessage] = useState('Loading...');

  const variants = [
    { key: 'default', name: 'Default', description: 'Multi-ring rotating loader with center dot' },
    { key: 'pulse', name: 'Pulse', description: 'Pulsing rings with rotating center core' },
    { key: 'wave', name: 'Wave', description: 'Animated wave bars with staggered timing' },
    { key: 'orbit', name: 'Orbit', description: 'Orbiting particles around central sphere' }
  ];

  const sizes = [
    { key: 'sm', name: 'Small', description: '32px x 32px' },
    { key: 'md', name: 'Medium', description: '64px x 64px' },
    { key: 'lg', name: 'Large', description: '96px x 96px' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            🌟 World-Class Loader Showcase
          </h1>
          <p className="text-gray-300 text-lg">
            Experience the next generation of loading animations
          </p>
        </div>

        {/* Controls */}
        <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Variant Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Loader Variant</label>
              <div className="space-y-2">
                {variants.map((variant) => (
                  <label key={variant.key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="variant"
                      value={variant.key}
                      checked={selectedVariant === variant.key}
                      onChange={(e) => setSelectedVariant(e.target.value as 'pulse' | 'spin' | 'bounce' | 'wave')}
                      className="w-4 h-4 text-cyan-400 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                    />
                    <div>
                      <div className="text-white font-medium">{variant.name}</div>
                      <div className="text-gray-400 text-sm">{variant.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Loader Size</label>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <label key={size.key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={size.key}
                      checked={selectedSize === size.key}
                      onChange={(e) => setSelectedSize(e.target.value as 'small' | 'medium' | 'large')}
                      className="w-4 h-4 text-cyan-400 bg-gray-700 border-gray-600 focus:ring-cyan-500"
                    />
                    <div>
                      <div className="text-white font-medium">{size.name}</div>
                      <div className="text-gray-400 text-sm">{size.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Custom Message</label>
              <input
                type="text"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-[#0a0f1f]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50"
                placeholder="Enter custom message..."
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Live Preview</h2>
          <div className="flex justify-center">
            <WorldClassLoader
              message={customMessage}
              variant={selectedVariant}
              size={selectedSize}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multiple Variants</h3>
            <p className="text-gray-400">Choose from 4 different animation styles, each with unique visual effects and timing.</p>
          </div>

          <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Responsive Sizes</h3>
            <p className="text-gray-400">Three size options (small, medium, large) perfect for any UI context.</p>
          </div>

          <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Framer Motion</h3>
            <p className="text-gray-400">Built with Framer Motion for smooth, performant animations and transitions.</p>
          </div>

          <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Custom Messages</h3>
            <p className="text-gray-400">Personalize loading messages for different contexts and user experiences.</p>
          </div>

          <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌈</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Brand Colors</h3>
            <p className="text-gray-400">Uses your portfolio&apos;s cyan and blue color scheme for brand consistency.</p>
          </div>

          <div className="bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Performance</h3>
            <p className="text-gray-400">Optimized animations that don&apos;t impact performance or user experience.</p>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-[#1a2332]/80 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Usage Examples</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Authentication Loading</h3>
              <div className="bg-[#0a0f1f]/80 rounded-xl p-4 border border-[#2a3342]">
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`<WorldClassLoader 
  message="Checking Authentication..." 
  variant="orbit"
  size="md"
/>`}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Dashboard Loading</h3>
              <div className="bg-[#0a0f1f]/80 rounded-xl p-4 border border-[#2a3342]">
                <pre className="text-sm text-gray-300 overflow-x-auto">
{`<WorldClassLoader 
  message="Loading Admin Dashboard..." 
  variant="pulse"
  size="lg"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
