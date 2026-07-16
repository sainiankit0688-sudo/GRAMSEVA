'use client';

import Link from 'next/link';

const agricultureCards = [
  {
    title: 'Crop Information',
    titleHindi: 'फसल की जानकारी',
    icon: '🌾',
    href: '/agriculture/crops',
    color: '#2E7D32',
    description: 'Complete guide for all crops',
    descriptionHindi: 'सभी फसलों की पूरी जानकारी',
  },
  {
    title: 'Fertilizer Guide',
    titleHindi: 'उर्वरक मार्गदर्शन',
    icon: '🧪',
    href: '/agriculture/fertilizer',
    color: '#F57F17',
    description: 'NPK dosages & types',
    descriptionHindi: 'एनपीके मात्रा और प्रकार',
  },
  {
    title: 'Weather',
    titleHindi: 'मौसम',
    icon: '⛅',
    href: '/agriculture/weather',
    color: '#0277BD',
    description: 'Farm-specific weather',
    descriptionHindi: 'कृषि मौसम जानकारी',
  },
  {
    title: 'Mandi Prices',
    titleHindi: 'मंडी भाव',
    icon: '📊',
    href: '/agriculture/mandi',
    color: '#BF360C',
    description: 'Current market rates',
    descriptionHindi: 'वर्तमान बाजार भाव',
  },
  {
    title: 'Govt Schemes',
    titleHindi: 'सरकारी योजनाएं',
    icon: '🏛️',
    href: '/agriculture/schemes',
    color: '#6A1B9A',
    description: 'Agriculture schemes for farmers',
    descriptionHindi: 'किसानों के लिए कृषि योजनाएं',
  },
  {
    title: 'Soil Health',
    titleHindi: 'मृदा स्वास्थ्य',
    icon: '🌱',
    href: '/agriculture/soil',
    color: '#4E342E',
    description: 'Soil types & management',
    descriptionHindi: 'मिट्टी के प्रकार और प्रबंधन',
  },
  {
    title: 'Crop Disease',
    titleHindi: 'फसल रोग',
    icon: '🪲',
    href: '/agriculture/disease',
    color: '#C62828',
    description: 'Identify & prevent diseases',
    descriptionHindi: 'रोग पहचानें और रोकें',
  },
  {
    title: 'AI Assistant',
    titleHindi: 'AI सहायक',
    icon: '🤖',
    href: '/agriculture/ai',
    color: '#1A237E',
    description: 'Ask Kisan AI anything',
    descriptionHindi: 'AI से कुछ भी पूछें',
  },
];

export default function AgricultureDashboard() {
  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div
        className="px-5 pt-6 pb-8"
        style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
      >
        <h1 className="text-xl font-bold text-white">Agriculture</h1>
        <p className="text-green-100 text-sm">कृषि सेवाएं</p>
        <div className="flex gap-3 mt-3">
          <Link
            href="/weather"
            className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors"
          >
            ⛅ Weather
          </Link>
          <Link
            href="/ai-chat"
            className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors"
          >
            🤖 Kisan AI
          </Link>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-1">
            Agriculture Hub / कृषि केंद्र
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Everything you need for farming
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agricultureCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="flex flex-col items-center gap-2 group p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: card.color + '12',
                    border: `1px solid ${card.color}25`,
                  }}
                >
                  {card.icon}
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold text-gray-800 block leading-tight">
                    {card.title}
                  </span>
                  <span className="text-xs text-gray-500 block leading-tight">
                    {card.titleHindi}
                  </span>
                  <span className="text-xs text-gray-400 block mt-1">
                    {card.description}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-4 py-5 pb-8">
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-2xl flex-shrink-0">🌾</span>
          <div>
            <p className="text-sm font-semibold text-green-800">
              Welcome to Agriculture Services
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              कृषि सेवाओं में आपका स्वागत है। फसल की जानकारी, मौसम, मंडी भाव, और
              सरकारी योजनाएं — सब एक जगह।
            </p>
            <p className="text-xs text-green-600 mt-1">
              Browse crops, check weather, view market rates, and explore
              government schemes for farmers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
