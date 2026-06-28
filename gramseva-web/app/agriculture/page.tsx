'use client';

import { useState } from 'react';
import Link from 'next/link';

const schemes = [
  { title: 'PM Kisan Samman Nidhi', titleHindi: 'पीएम किसान सम्मान निधि', desc: '₹6,000/year in 3 installments for small & marginal farmers', icon: '💰', color: '#2E7D32' },
  { title: 'PM Fasal Bima Yojana', titleHindi: 'फसल बीमा योजना', desc: 'Crop insurance for natural calamity losses at subsidized premiums', icon: '🛡️', color: '#1565C0' },
  { title: 'Kisan Credit Card', titleHindi: 'किसान क्रेडिट कार्ड', desc: 'Easy credit facility for farming needs with low interest rates', icon: '💳', color: '#6A1B9A' },
  { title: 'PM Krishi Sinchai Yojana', titleHindi: 'कृषि सिंचाई योजना', desc: 'Irrigation infrastructure & water efficiency for every field', icon: '💧', color: '#00695C' },
  { title: 'Soil Health Card', titleHindi: 'मृदा स्वास्थ्य कार्ड', desc: 'Free soil testing & crop-wise fertilizer recommendations', icon: '🌱', color: '#F57F17' },
  { title: 'e-NAM Portal', titleHindi: 'ई-नाम पोर्टल', desc: 'Online trading platform for agricultural commodities', icon: '📊', color: '#BF360C' },
];

const crops = [
  { name: 'Wheat / गेहूं', season: 'Rabi', sow: 'Oct-Nov', harvest: 'Mar-Apr', price: '₹2,015/quintal', icon: '🌾' },
  { name: 'Rice / धान', season: 'Kharif', sow: 'Jun-Jul', harvest: 'Oct-Nov', price: '₹2,183/quintal', icon: '🌾' },
  { name: 'Sugarcane / गन्ना', season: 'Annual', sow: 'Feb-Mar', harvest: 'Oct-Feb', price: '₹315/quintal', icon: '🎋' },
  { name: 'Mustard / सरसों', season: 'Rabi', sow: 'Sep-Oct', harvest: 'Feb-Mar', price: '₹5,450/quintal', icon: '🌻' },
  { name: 'Cotton / कपास', season: 'Kharif', sow: 'Apr-May', harvest: 'Oct-Jan', price: '₹6,620/quintal', icon: '☁️' },
  { name: 'Maize / मक्का', season: 'Kharif', sow: 'Jun-Jul', harvest: 'Sep-Oct', price: '₹1,962/quintal', icon: '🌽' },
];

const mandiRates = [
  { commodity: 'Wheat / गेहूं', rate: '₹2,200', change: '+15', market: 'Delhi' },
  { commodity: 'Rice / चावल', rate: '₹3,100', change: '-20', market: 'Lucknow' },
  { commodity: 'Tomato / टमाटर', rate: '₹1,800', change: '+200', market: 'Pune' },
  { commodity: 'Onion / प्याज', rate: '₹1,200', change: '-50', market: 'Nashik' },
  { commodity: 'Potato / आलू', rate: '₹900', change: '+30', market: 'Agra' },
  { commodity: 'Mustard / सरसों', rate: '₹5,600', change: '+120', market: 'Jaipur' },
];

const fertilizerGuide = [
  { crop: 'Wheat', n: '120 kg/ha', p: '60 kg/ha', k: '40 kg/ha', tip: 'Apply 50% N at sowing, rest in 2 splits' },
  { crop: 'Rice', n: '80 kg/ha', p: '40 kg/ha', k: '40 kg/ha', tip: 'Apply N in 3 splits for best results' },
  { crop: 'Maize', n: '150 kg/ha', p: '75 kg/ha', k: '50 kg/ha', tip: 'Side-dress with N at knee-high stage' },
  { crop: 'Sugarcane', n: '250 kg/ha', p: '100 kg/ha', k: '120 kg/ha', tip: 'Split N application every 30 days' },
];

const tabs = ['Schemes', 'Crops', 'Mandi Rates', 'Fertilizer'];

export default function AgriculturePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}>
        <h1 className="text-xl font-bold text-white">Agriculture</h1>
        <p className="text-green-100 text-sm">कृषि जानकारी</p>
        <div className="flex gap-3 mt-3">
          <Link href="/weather" className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
            ⛅ Check Weather
          </Link>
          <Link href="/ai-chat" className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
            🤖 Kisan AI
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors
                ${activeTab === i ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Schemes Tab */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {schemes.map((scheme) => (
              <div key={scheme.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: scheme.color + '20' }}>
                    {scheme.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{scheme.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{scheme.titleHindi}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{scheme.desc}</p>
                  </div>
                </div>
                <button className="mt-3 w-full py-2 rounded-xl text-sm font-semibold border transition-colors"
                  style={{ borderColor: scheme.color, color: scheme.color }}>
                  Apply / आवेदन करें
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Crops Tab */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-3">
            {crops.map((crop) => (
              <div key={crop.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{crop.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{crop.name}</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{crop.season}</span>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-green-700">MSP {crop.price}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500">Sowing / बुआई</p>
                    <p className="text-sm font-semibold text-gray-800">{crop.sow}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500">Harvest / कटाई</p>
                    <p className="text-sm font-semibold text-gray-800">{crop.harvest}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mandi Rates Tab */}
        {activeTab === 2 && (
          <div className="flex flex-col gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 items-start">
              <span className="text-lg">ℹ️</span>
              <p className="text-xs text-blue-700">मंडी भाव प्रतिदिन अपडेट होते हैं। Rates updated daily from AGMARKNET.</p>
            </div>
            {mandiRates.map((item) => (
              <div key={item.commodity} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.commodity}</p>
                  <p className="text-xs text-gray-500">{item.market} Mandi</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{item.rate}/quintal</p>
                  <p className={`text-xs font-semibold ${item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change.startsWith('+') ? '↑' : '↓'} ₹{item.change.replace(/[+-]/, '')}/qtl
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fertilizer Guide Tab */}
        {activeTab === 3 && (
          <div className="flex flex-col gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2 items-start">
              <span>⚠️</span>
              <p className="text-xs text-yellow-800">Doses based on soil test. Get your Soil Health Card for exact recommendations.</p>
            </div>
            {fertilizerGuide.map((item) => (
              <div key={item.crop} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3">🌱 {item.crop}</h3>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[['Nitrogen (N)', item.n, 'bg-blue-50 text-blue-800'], ['Phosphorus (P)', item.p, 'bg-orange-50 text-orange-800'], ['Potassium (K)', item.k, 'bg-purple-50 text-purple-800']].map(([label, val, cls]) => (
                    <div key={label} className={`rounded-xl p-2.5 text-center ${cls}`}>
                      <p className="text-xs font-medium">{label}</p>
                      <p className="text-sm font-bold mt-0.5">{val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-2.5">💡 {item.tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
