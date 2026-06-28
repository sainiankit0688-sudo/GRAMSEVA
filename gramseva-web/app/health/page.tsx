'use client';

import { useState } from 'react';

const benefits = [
  { title: '₹5 Lakh Cover', desc: 'Annual health coverage per family for secondary & tertiary hospitalisation', icon: '💰' },
  { title: '25,000+ Hospitals', desc: 'Empanelled hospitals across India including private hospitals', icon: '🏥' },
  { title: 'Cashless Treatment', desc: 'No money needed at hospital – completely cashless and paperless', icon: '🤝' },
  { title: 'Pre-existing Diseases', desc: 'All pre-existing conditions covered from day one of enrollment', icon: '💊' },
  { title: 'Family Coverage', desc: 'Entire family covered with no cap on family size or age', icon: '👨‍👩‍👧‍👦' },
  { title: '1,949 Procedures', desc: 'Covers 1,949 medical and surgical procedures across 27 specialties', icon: '🩺' },
];

const eligibilityGroups = [
  { group: 'Rural Families', criteria: 'SECC-2011 rural beneficiaries – those in deprivation categories', icon: '🌾', color: '#2E7D32' },
  { group: 'SC/ST Families', criteria: 'Scheduled Caste & Scheduled Tribe households with or without housing', icon: '👥', color: '#6A1B9A' },
  { group: 'Manual Scavengers', criteria: 'Families engaged in manual scavenging', icon: '🔧', color: '#E65100' },
  { group: 'Urban Poor', criteria: 'Urban workers in select occupational categories (street vendors, etc.)', icon: '🏙️', color: '#1565C0' },
];

const documents = [
  'Aadhaar Card (all family members)',
  'Ration Card / BPL Card',
  'Income Certificate',
  'Caste Certificate (if applicable)',
  'Mobile Number linked to Aadhaar',
];

const activationSteps = [
  { step: 1, title: 'Check Eligibility', icon: '🔍', desc: 'Visit pmjay.gov.in or call 14555 to check if your family is eligible based on SECC-2011 data.' },
  { step: 2, title: 'Get eCard / Golden Card', icon: '💳', desc: 'Visit nearby Common Service Centre (CSC) or empanelled hospital with Aadhaar for e-KYC.' },
  { step: 3, title: 'Biometric Verification', icon: '🤚', desc: 'Complete fingerprint/iris biometric verification through Aadhaar at CSC or hospital.' },
  { step: 4, title: 'Receive Ayushman Card', icon: '🎫', desc: 'Get your Ayushman Bharat Golden Card printed or digital. It is valid for life.' },
  { step: 5, title: 'Hospital Visit', icon: '🏥', desc: 'Show card at empanelled hospital for cashless treatment. No deposit needed.' },
];

const specialities = [
  'Oncology (Cancer)', 'Cardiology (Heart)', 'Neurology (Brain)', 'Orthopedics (Bone)',
  'Ophthalmology (Eye)', 'ENT (Ear-Nose-Throat)', 'Pediatric Surgery', 'Nephrology (Kidney)',
  'Burns & Trauma', 'Pulmonology (Lung)', 'Reproductive Medicine', 'Gastroenterology',
];

const tabs = ['Overview', 'Eligibility', 'Activation', 'Specialities'];

export default function HealthPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #C62828, #E53935)' }}>
        <h1 className="text-xl font-bold text-white">Ayushman Bharat</h1>
        <p className="text-red-100 text-sm">PM Jan Arogya Yojana (PMJAY)</p>
        <div className="flex items-center gap-2 mt-3 bg-white/20 rounded-xl px-3 py-2">
          <span className="text-lg">📞</span>
          <div>
            <p className="text-white text-xs font-semibold">Helpline: 14555 / 1800-111-565</p>
            <p className="text-red-100 text-xs">Toll-Free • 24x7</p>
          </div>
          <a href="tel:14555" className="ml-auto bg-white text-red-700 text-xs font-bold px-3 py-1.5 rounded-full">Call</a>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-14 z-10 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors
                ${activeTab === i ? 'border-red-600 text-red-700' : 'border-transparent text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Overview */}
        {activeTab === 0 && (
          <>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
              <p className="text-sm text-red-800 font-semibold mb-1">World&apos;s largest health insurance scheme</p>
              <p className="text-xs text-red-700 leading-relaxed">
                Ayushman Bharat PMJAY provides ₹5 lakh health coverage to over 50 crore poor and vulnerable families (approx. 10.74 crore households).
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div key={b.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="font-bold text-gray-800 text-sm mt-2">{b.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Eligibility */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-4">
            {eligibilityGroups.map((g) => (
              <div key={g.group} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: g.color + '20' }}>
                    {g.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{g.group}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{g.criteria}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">📄 Required Documents</h3>
              {documents.map((doc) => (
                <div key={doc} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
            <a href="https://pmjay.gov.in" target="_blank" rel="noopener noreferrer"
              className="block w-full py-3 rounded-xl text-center text-white font-bold text-sm" style={{ backgroundColor: '#C62828' }}>
              🔍 Check Eligibility Online
            </a>
          </div>
        )}

        {/* Activation */}
        {activeTab === 2 && (
          <div className="flex flex-col gap-4">
            {activationSteps.map((step, i) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {step.icon}
                  </div>
                  {i < activationSteps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-red-200 my-2 min-h-[24px]"></div>
                  )}
                </div>
                <div className="pb-4">
                  <span className="text-xs font-bold text-red-600">Step {step.step}</span>
                  <h3 className="font-bold text-gray-800 text-sm">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Specialities */}
        {activeTab === 3 && (
          <div>
            <p className="text-sm text-gray-600 mb-4">These are covered under PMJAY across 27 specialties:</p>
            <div className="grid grid-cols-2 gap-2">
              {specialities.map((sp) => (
                <div key={sp} className="bg-white rounded-xl px-3 py-2.5 shadow-sm border border-gray-100 flex items-center gap-2">
                  <span className="text-red-500 text-sm">🏥</span>
                  <span className="text-xs text-gray-700 font-medium">{sp}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-xs text-red-700">Total 1,949 procedures & 27 specialties covered. Includes pre & post hospitalization expenses of 3 days and 15 days respectively.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
