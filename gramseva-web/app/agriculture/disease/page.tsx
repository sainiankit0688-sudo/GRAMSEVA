'use client';

import { useState } from 'react';
import { PageHeader, Breadcrumb, ShareButton, EmptyState } from '@/components/agriculture';
import { cropDiseases } from '@/lib/agriculture/data/cropDiseases';

type SeverityFilter = 'all' | 'high' | 'medium' | 'low';

const severityColors: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-red-100', text: 'text-red-700', label: 'High / गंभीर' },
  medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium / मध्यम' },
  low: { bg: 'bg-green-100', text: 'text-green-700', label: 'Low / कम' },
};

export default function DiseasePage() {
  const [expandedDisease, setExpandedDisease] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [cropFilter, setCropFilter] = useState('all');

  const crops = ['all', ...new Set(cropDiseases.map((d) => d.crop))];

  const filteredDiseases = cropDiseases.filter((d) => {
    const matchesSeverity =
      severityFilter === 'all' || d.severity === severityFilter;
    const matchesCrop = cropFilter === 'all' || d.crop === cropFilter;
    return matchesSeverity && matchesCrop;
  });

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="Crop Disease Guide"
        titleHindi="फसल रोग मार्गदर्शन"
        icon="🪲"
        gradient="linear-gradient(135deg, #B71C1C, #C62828)"
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agriculture', href: '/agriculture' }, { label: 'Crop Disease' }]} />

      <div className="px-4 py-4">
        <div className="flex justify-end mb-3">
          <ShareButton title="Crop Disease Guide — GramSeva" text="Check out the crop disease guide on GramSeva" />
        </div>
        {/* Severity Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-3">
          {(['all', 'high', 'medium', 'low'] as SeverityFilter[]).map(
            (sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                  ${severityFilter === sev
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50'
                  }`}
              >
                {sev === 'all'
                  ? 'All / सभी'
                  : severityColors[sev]?.label || sev}
              </button>
            ),
          )}
        </div>

        {/* Crop Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setCropFilter(crop)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${cropFilter === crop
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-red-50'
                }`}
            >
              {crop === 'all' ? 'All Crops / सभी फसलें' : crop}
            </button>
          ))}
        </div>

        {/* Diseases List */}
        <div className="flex flex-col gap-3">
          {filteredDiseases.map((disease) => {
            const isExpanded = expandedDisease === `${disease.name}-${disease.crop}`;
            const sev = severityColors[disease.severity];

            return (
              <div
                key={`${disease.name}-${disease.crop}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedDisease(
                      isExpanded ? null : `${disease.name}-${disease.crop}`,
                    )
                  }
                  aria-expanded={isExpanded}
                  className="w-full p-4 flex items-center gap-3 text-left"
                >
                  <span className="text-2xl flex-shrink-0">{disease.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {disease.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${sev?.bg} ${sev?.text}`}
                      >
                        {disease.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{disease.nameHindi}</p>
                    <p className="text-xs text-gray-400">
                      Crop: {disease.crop} ({disease.cropHindi})
                    </p>
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
                    <div className="mt-3 space-y-2">
                      <div className="bg-red-50 rounded-xl p-2.5">
                        <p className="text-xs font-semibold text-red-800 mb-1">
                          Symptoms / लक्षण
                        </p>
                        {disease.symptoms.map((s, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-0.5">
                            <span className="text-red-400 text-xs mt-0.5">•</span>
                            <p className="text-xs text-red-700">{s}</p>
                          </div>
                        ))}
                        {disease.symptomsHindi.map((s, i) => (
                          <div key={`hi-${i}`} className="flex items-start gap-1.5 mb-0.5">
                            <span className="text-red-300 text-xs mt-0.5">•</span>
                            <p className="text-xs text-red-600">{s}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-50 rounded-xl p-2.5">
                        <p className="text-xs font-semibold text-blue-800 mb-1">
                          Prevention / रोकथाम
                        </p>
                        {disease.prevention.map((p, i) => (
                          <div key={i} className="flex items-start gap-1.5 mb-0.5">
                            <span className="text-blue-400 text-xs mt-0.5">•</span>
                            <p className="text-xs text-blue-700">{p}</p>
                          </div>
                        ))}
                        {disease.preventionHindi.map((p, i) => (
                          <div key={`hi-${i}`} className="flex items-start gap-1.5 mb-0.5">
                            <span className="text-blue-300 text-xs mt-0.5">•</span>
                            <p className="text-xs text-blue-600">{p}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-green-50 rounded-xl p-2.5">
                        <p className="text-xs font-semibold text-green-800 mb-1">
                          Treatment / उपचार
                        </p>
                        <p className="text-xs text-green-700">
                          {disease.treatment}
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                          {disease.treatmentHindi}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredDiseases.length === 0 && (
          <EmptyState
            icon="🪲"
            title="No diseases match the filter"
            titleHindi="फ़िल्टर से कोई रोग मेल नहीं खाता"
          />
        )}
      </div>
    </div>
  );
}
