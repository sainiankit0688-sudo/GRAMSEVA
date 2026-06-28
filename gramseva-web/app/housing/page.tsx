'use client';

import { useState } from 'react';

const housingSchemes = [
  { title: 'PM Awas Yojana - Gramin', titleHindi: 'पीएम आवास योजना - ग्रामीण', desc: 'Housing for homeless rural families. Assistance of ₹1.20 lakh (plain areas) & ₹1.30 lakh (hilly areas).', icon: '🏡', color: '#2E7D32', status: 'Active' },
  { title: 'PM Awas Yojana - Urban', titleHindi: 'पीएम आवास योजना - शहरी', desc: 'Affordable housing for urban poor. Subsidized home loans under Credit Linked Subsidy Scheme (CLSS).', icon: '🏙️', color: '#1565C0', status: 'Active' },
  { title: 'Indira Awas Yojana (IAY)', titleHindi: 'इंदिरा आवास योजना', desc: 'Free housing for BPL families in rural areas. Being migrated to PMAY-G.', icon: '🏘️', color: '#6A1B9A', status: 'Merged' },
  { title: 'Credit Linked Subsidy', titleHindi: 'क्रेडिट लिंक्ड सब्सिडी', desc: 'Home loan interest subsidy upto 6.5% for EWS/LIG/MIG categories under PMAY Urban.', icon: '💰', color: '#E65100', status: 'Active' },
];

const documents = [
  { doc: 'Aadhaar Card', docHindi: 'आधार कार्ड', required: true, purpose: 'Identity & address proof' },
  { doc: 'BPL Card / Ration Card', docHindi: 'बीपीएल / राशन कार्ड', required: true, purpose: 'Poverty certification' },
  { doc: 'Income Certificate', docHindi: 'आय प्रमाण पत्र', required: true, purpose: 'Income eligibility (family income < ₹3 lakh)' },
  { doc: 'Bank Account Passbook', docHindi: 'बैंक पासबुक', required: true, purpose: 'DBT subsidy transfer' },
  { doc: 'Caste Certificate', docHindi: 'जाति प्रमाण पत्र', required: false, purpose: 'SC/ST/OBC priority benefits' },
  { doc: 'Land Ownership Document', docHindi: 'भूमि स्वामित्व दस्तावेज', required: false, purpose: 'Proof of land for construction' },
  { doc: 'Passport Photo', docHindi: 'पासपोर्ट फोटो', required: true, purpose: 'Application form' },
  { doc: 'Mobile Number (Aadhaar linked)', docHindi: 'मोबाइल नंबर', required: true, purpose: 'OTP verification' },
];

const applySteps = [
  { step: 1, title: 'Check Eligibility', titleHindi: 'पात्रता जांचें', desc: 'Verify if your family is in SECC-2011 list or Awaas+ survey. Must not have pucca house.', icon: '✅' },
  { step: 2, title: 'Register on AwaasSoft', titleHindi: 'AwaasSoft पर पंजीकरण', desc: 'Register on pmayg.nic.in or visit local Gram Panchayat/DRDA office.', icon: '📝' },
  { step: 3, title: 'Fill Application Form', titleHindi: 'आवेदन फॉर्म भरें', desc: 'Fill complete details with family information, bank account, Aadhaar details.', icon: '📋' },
  { step: 4, title: 'Document Submission', titleHindi: 'दस्तावेज़ जमा करें', desc: 'Submit all required documents at Gram Panchayat or upload on portal.', icon: '📁' },
  { step: 5, title: 'Verification', titleHindi: 'सत्यापन', desc: 'Field verification by Gram Panchayat/Block officer. Physical survey of dwelling.', icon: '🔍' },
  { step: 6, title: 'Approval & Payment', titleHindi: 'स्वीकृति और भुगतान', desc: 'Subsidy released in 3–4 installments directly to bank via DBT as construction progresses.', icon: '💳' },
];

const tabs = ['Schemes', 'Documents', 'Apply Process'];

export default function HousingPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}>
        <h1 className="text-xl font-bold text-white">Housing Schemes</h1>
        <p className="text-blue-100 text-sm">प्रधानमंत्री आवास योजना</p>
        <div className="mt-3 flex gap-3">
          <a href="https://pmayg.nic.in" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
            🌐 PMAY Portal
          </a>
          <a href="https://awaassoft.nic.in" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
            🏠 AwaasSoft
          </a>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-14 z-10 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors
                ${activeTab === i ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Schemes */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-4">
            {housingSchemes.map((scheme) => (
              <div key={scheme.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: scheme.color + '20' }}>
                    {scheme.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-gray-800 text-sm">{scheme.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0
                        ${scheme.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {scheme.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{scheme.titleHindi}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{scheme.desc}</p>
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity" style={{ backgroundColor: scheme.color }}>
                  Check Eligibility / पात्रता जांचें
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Documents */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2">
              <span>📌</span>
              <p className="text-xs text-yellow-800">सभी दस्तावेज़ स्व-प्रमाणित प्रतियों में जमा करें। Submit self-attested copies.</p>
            </div>
            {documents.map((doc) => (
              <div key={doc.doc} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm
                    ${doc.required ? 'bg-red-100' : 'bg-gray-100'}`}>
                    {doc.required ? '🔴' : '🟡'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm">{doc.doc}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${doc.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        {doc.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{doc.docHindi}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{doc.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Apply Process */}
        {activeTab === 2 && (
          <div className="flex flex-col gap-4">
            {applySteps.map((step, i) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {step.icon}
                  </div>
                  {i < applySteps.length - 1 && (
                    <div className="w-0.5 flex-1 bg-blue-200 my-2"></div>
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-600">Step {step.step}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{step.title}</h3>
                  <p className="text-xs text-gray-500 mb-1">{step.titleHindi}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-2">
              <p className="text-sm font-semibold text-green-800 mb-1">Helpline Number</p>
              <a href="tel:1800116446" className="text-green-700 font-bold text-lg">📞 1800-11-6446</a>
              <p className="text-xs text-green-600 mt-0.5">Toll-Free • 24x7 • PMAY Helpline</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
