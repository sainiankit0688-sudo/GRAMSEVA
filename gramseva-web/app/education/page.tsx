'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import Link from 'next/link';

const CARDS = [
  { title: 'Scholarships', titleHindi: 'छात्रवृत्ति', href: '/education/scholarships', icon: '🎓', description: 'Apply for government scholarships & financial aid', descriptionHindi: 'सरकारी छात्रवृत्ति और वित्तीय सहायता के लिए आवेदन करें', color: '#2E7D32' },
  { title: 'Courses', titleHindi: 'पाठ्यक्रम', href: '/education/courses', icon: '📚', description: 'Free & paid courses from government providers', descriptionHindi: 'सरकारी प्रदाताओं से मुफ्त और भुगतान वाले पाठ्यक्रम', color: '#1565C0' },
  { title: 'Competitive Exams', titleHindi: 'प्रतियोगी परीक्षाएं', href: '/education/exams', icon: '📋', description: 'UPSC, SSC, Railway, Banking, NEET, JEE & more', descriptionHindi: 'यूपीएससी, एसएससी, रेलवे, बैंकिंग, नीट, जेईई और अधिक', color: '#6A1B9A' },
  { title: 'Study Material', titleHindi: 'अध्ययन सामग्री', href: '/education/study-material', icon: '📖', description: 'Free PDFs, notes & video tutorials', descriptionHindi: 'मुफ्त पीडीएफ, नोट्स और वीडियो ट्यूटोरियल', color: '#00838F' },
  { title: 'Career Guidance', titleHindi: 'करियर मार्गदर्शन', href: '/education/career-guidance', icon: '🚀', description: 'Govt jobs, private sector, higher studies & entrepreneurship', descriptionHindi: 'सरकारी नौकरियां, निजी क्षेत्र, उच्च शिक्षा और उद्यमिता', color: '#E65100' },
  { title: 'Skill Development', titleHindi: 'कौशल विकास', href: '/education/skills', icon: '🔧', description: 'Vocational training programs with certification', descriptionHindi: 'प्रमाणन के साथ व्यावसायिक प्रशिक्षण कार्यक्रम', color: '#AD1457' },
  { title: 'College Information', titleHindi: 'कॉलेज की जानकारी', href: '/education/colleges', icon: '🏛️', description: 'Find colleges, universities & courses near you', descriptionHindi: 'अपने नजदीकी कॉलेज, विश्वविद्यालय और पाठ्यक्रम खोजें', color: '#4527A0' },
  { title: 'Education FAQ', titleHindi: 'शिक्षा संबंधी प्रश्न', href: '/education/faq', icon: '❓', description: 'Answers to common education-related questions', descriptionHindi: 'शिक्षा से संबंधित सामान्य प्रश्नों के उत्तर', color: '#C62828' },
];

export default function EducationPage() {
  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}>
        <h1 className="text-xl font-bold text-white">Education / शिक्षा</h1>
        <p className="text-blue-100 text-sm">Knowledge, skills & opportunities for rural India</p>
      </div>

      {/* Cards Grid */}
      <div className="px-4 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`${card.title} - ${card.description}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: card.color + '15' }}
                >
                  <span aria-hidden="true">{card.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-800 text-sm">{card.title}</h2>
                  <p className="text-xs text-blue-600 font-medium">{card.titleHindi}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{card.descriptionHindi}</p>
                </div>
                <span className="text-gray-300 flex-shrink-0 mt-1" aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
