'use client';

import { useState } from 'react';
import { PageHeader, Breadcrumb, ShareButton } from '@/components/agriculture';
import { soilTypes, soilTestingSchedule } from '@/lib/agriculture/data/soilHealth';

export default function SoilPage() {
  const [expandedSoil, setExpandedSoil] = useState<string | null>(null);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="Soil Health"
        titleHindi="मृदा स्वास्थ्य"
        icon="🌱"
        gradient="linear-gradient(135deg, #3E2723, #6D4C41)"
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agriculture', href: '/agriculture' }, { label: 'Soil Health' }]} />

      <div className="px-4 py-4">
        <div className="flex justify-end mb-3">
          <ShareButton title="Soil Health — GramSeva" text="Check out soil health information on GramSeva" />
        </div>
        {/* Info */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-4">
          <h3 className="font-bold text-green-800 text-sm mb-1">
            🌱 Know Your Soil / अपनी मिट्टी जानें
          </h3>
          <p className="text-xs text-green-700 leading-relaxed">
            Understanding your soil type is key to choosing the right crops and
            fertilizers. Get a Soil Health Card from your nearest agriculture
            center for detailed analysis.
          </p>
          <p className="text-xs text-green-600 mt-1">
            अपनी मिट्टी का प्रकार जानना सही फसल और उर्वरक चुनने की कुंजी है।
            विस्तृत विश्लेषण के लिए अपने निकटतम कृषि केंद्र से मृदा स्वास्थ्य
            कार्ड प्राप्त करें।
          </p>
        </div>

        {/* Soil Types */}
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          Soil Types in India / भारत की मिट्टी के प्रकार
        </h3>
        <div className="flex flex-col gap-3 mb-6">
          {soilTypes.map((soil) => {
            const isExpanded = expandedSoil === soil.type;
            return (
              <div
                key={soil.type}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedSoil(isExpanded ? null : soil.type)
                  }
                  aria-expanded={isExpanded}
                  className="w-full p-4 flex items-center gap-3 text-left"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: soil.color + '20' }}
                  >
                    {soil.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm">
                      {soil.type}
                    </h4>
                    <p className="text-xs text-gray-500">{soil.typeHindi}</p>
                  </div>
                  <span
                    className={`text-gray-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                      {soil.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {soil.descriptionHindi}
                    </p>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1.5">
                        Suitable Crops / उपयुक्त फसलें
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {soil.suitableCrops.map((crop, i) => (
                          <span
                            key={crop}
                            className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
                          >
                            {crop} ({soil.suitableCropsHindi[i] || ''})
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1.5">
                        Management Tips / प्रबंधन सुझाव
                      </p>
                      <div className="space-y-1">
                        {soil.tips.map((tip, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2"
                          >
                            <span className="text-gray-400 mt-0.5 text-xs">•</span>
                            <p className="text-xs text-gray-600">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Soil Testing Schedule */}
        <h3 className="text-sm font-semibold text-gray-500 mb-3">
          Soil Testing Parameters / मृदा परीक्षण मापदंड
        </h3>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">
                    Parameter
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    Ideal Range
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    Frequency
                  </th>
                </tr>
              </thead>
              <tbody>
                {soilTestingSchedule.map((param) => (
                  <tr
                    key={param.parameter}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-2.5">
                      <p className="font-medium text-gray-800">
                        {param.parameter}
                      </p>
                      <p className="text-gray-500">{param.parameterHindi}</p>
                    </td>
                    <td className="py-2.5 text-gray-700 font-medium">
                      {param.idealRange}
                    </td>
                    <td className="py-2.5 text-gray-500">
                      {param.frequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
