'use client';

import { useState } from 'react';
import { PageHeader, Breadcrumb, ShareButton } from '@/components/agriculture';
import {
  fertilizerRecommendations,
  fertilizerTypes,
  micronutrients,
} from '@/lib/agriculture/data/fertilizerGuide';

type Tab = 'crops' | 'types' | 'micro';
const tabs: { key: Tab; label: string; labelHindi: string }[] = [
  { key: 'crops', label: 'By Crop', labelHindi: 'फसल अनुसार' },
  { key: 'types', label: 'Types', labelHindi: 'प्रकार' },
  { key: 'micro', label: 'Micronutrients', labelHindi: 'सूक्ष्म पोषक' },
];

export default function FertilizerPage() {
  const [activeTab, setActiveTab] = useState<Tab>('crops');

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="Fertilizer Guide"
        titleHindi="उर्वरक मार्गदर्शन"
        icon="🧪"
        gradient="linear-gradient(135deg, #E65100, #F57F17)"
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agriculture', href: '/agriculture' }, { label: 'Fertilizer' }]} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-orange-500 text-orange-700'
                  : 'border-transparent text-gray-500'
                }`}
            >
              {tab.label} / {tab.labelHindi}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex justify-end mb-3">
          <ShareButton title="Fertilizer Guide — GramSeva" text="Check out the fertilizer guide on GramSeva" />
        </div>
        {/* By Crop Tab */}
        {activeTab === 'crops' && (
          <div className="flex flex-col gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2 items-start">
              <span className="flex-shrink-0">⚠️</span>
              <p className="text-xs text-yellow-800">
                Doses based on soil test. Get your Soil Health Card for exact
                recommendations.
                <br />
                <span className="text-yellow-700">
                  मात्रा मिट्टी परीक्षण पर आधारित है। सटीक सिफारिशों के लिए अपना
                  मृदा स्वास्थ्य कार्ड प्राप्त करें।
                </span>
              </p>
            </div>
            {fertilizerRecommendations.map((item) => (
              <div
                key={item.crop}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <h3 className="font-bold text-gray-800 mb-1">
                  🌱 {item.crop}
                  <span className="text-gray-500 text-xs font-normal ml-1">
                    {item.cropHindi}
                  </span>
                </h3>
                <div className="grid grid-cols-3 gap-2 mb-3 mt-3">
                  <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-medium text-blue-800">
                      Nitrogen (N)
                    </p>
                    <p className="text-sm font-bold text-blue-900 mt-0.5">
                      {item.nitrogen}
                    </p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-medium text-orange-800">
                      Phosphorus (P)
                    </p>
                    <p className="text-sm font-bold text-orange-900 mt-0.5">
                      {item.phosphorus}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-2.5 text-center">
                    <p className="text-xs font-medium text-purple-800">
                      Potassium (K)
                    </p>
                    <p className="text-sm font-bold text-purple-900 mt-0.5">
                      {item.potassium}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-xs text-gray-600">💡 {item.tip}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.tipHindi}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div className="flex flex-col gap-3">
            {fertilizerTypes.map((type) => (
              <div
                key={type.name}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{type.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">
                      {type.name}
                    </h3>
                    <p className="text-xs text-gray-500">{type.nameHindi}</p>
                    <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                      {type.formula}
                    </span>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      {type.uses}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {type.usesHindi}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Micronutrients Tab */}
        {activeTab === 'micro' && (
          <div className="flex flex-col gap-3">
            {micronutrients.map((micro) => (
              <div
                key={micro.name}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{micro.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm">
                      {micro.name}
                      <span className="text-gray-500 font-normal text-xs ml-1">
                        {micro.nameHindi}
                      </span>
                    </h3>

                    <div className="mt-2 space-y-2">
                      <div className="bg-red-50 rounded-xl p-2.5">
                        <p className="text-xs font-medium text-red-800">
                          Deficiency Signs
                        </p>
                        <p className="text-xs text-red-700">
                          {micro.deficiency}
                        </p>
                        <p className="text-xs text-red-600">
                          {micro.deficiencyHindi}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-xl p-2.5">
                        <p className="text-xs font-medium text-green-800">
                          Solution / समाधान
                        </p>
                        <p className="text-xs text-green-700">
                          {micro.solution}
                        </p>
                        <p className="text-xs text-green-600">
                          {micro.solutionHindi}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {micro.affectedCrops.map((crop) => (
                          <span
                            key={crop}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
