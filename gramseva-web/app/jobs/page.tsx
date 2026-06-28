'use client';

import { useState } from 'react';
import Link from 'next/link';

const jobAlerts = [
  {
    title: 'SSC CGL 2024',
    org: 'Staff Selection Commission',
    orgHindi: 'कर्मचारी चयन आयोग',
    vacancies: 17727,
    lastDate: '31 Jul 2024',
    salary: '₹47,600 – ₹1,51,100',
    qualification: 'Graduate',
    category: 'Central Govt',
    icon: '🏛️',
    status: 'Open',
    color: '#1565C0',
  },
  {
    title: 'Railway Group D 2024',
    org: 'Railway Recruitment Board',
    orgHindi: 'रेलवे भर्ती बोर्ड',
    vacancies: 32438,
    lastDate: '30 Aug 2024',
    salary: '₹18,000 – ₹56,900',
    qualification: '10th Pass + ITI',
    category: 'Railway',
    icon: '🚂',
    status: 'Open',
    color: '#2E7D32',
  },
  {
    title: 'UP Police SI 2024',
    org: 'Uttar Pradesh Police',
    orgHindi: 'उत्तर प्रदेश पुलिस',
    vacancies: 917,
    lastDate: '15 Aug 2024',
    salary: '₹35,400 – ₹1,12,400',
    qualification: 'Graduate',
    category: 'State Police',
    icon: '👮',
    status: 'Open',
    color: '#C62828',
  },
  {
    title: 'IBPS RRB 2024',
    org: 'Regional Rural Banks',
    orgHindi: 'क्षेत्रीय ग्रामीण बैंक',
    vacancies: 9000,
    lastDate: '28 Jul 2024',
    salary: '₹29,900 – ₹1,04,000',
    qualification: 'Graduate',
    category: 'Banking',
    icon: '🏦',
    status: 'Open',
    color: '#6A1B9A',
  },
  {
    title: 'MGNREGA Work',
    org: 'Gram Panchayat',
    orgHindi: 'ग्राम पंचायत',
    vacancies: 99999,
    lastDate: 'Ongoing',
    salary: '₹220 – ₹357/day',
    qualification: 'No qualification needed',
    category: 'Rural',
    icon: '💪',
    status: 'Always Open',
    color: '#00695C',
  },
  {
    title: 'Anganwadi Worker',
    org: 'Ministry of WCD',
    orgHindi: 'महिला बाल विकास',
    vacancies: 5000,
    lastDate: '20 Aug 2024',
    salary: '₹4,500 – ₹7,200/month',
    qualification: '10th Pass',
    category: 'Women',
    icon: '👩‍🏫',
    status: 'Open',
    color: '#E65100',
  },
  {
    title: 'PM Kaushal Vikas Yojana',
    org: 'NSDC / Skill India',
    orgHindi: 'कौशल भारत',
    vacancies: 0,
    lastDate: 'Ongoing',
    salary: 'Free Training + Job Placement',
    qualification: 'Class 8th+',
    category: 'Skill Training',
    icon: '🔧',
    status: 'Enrolling',
    color: '#F57F17',
  },
  {
    title: 'HAL Apprentice 2024',
    org: 'Hindustan Aeronautics Ltd',
    orgHindi: 'हिंदुस्तान एरोनॉटिक्स',
    vacancies: 350,
    lastDate: '05 Aug 2024',
    salary: '₹8,050 – ₹9,000/month',
    qualification: 'Diploma / ITI',
    category: 'PSU',
    icon: '✈️',
    status: 'Open',
    color: '#37474F',
  },
];

const categories = ['All', 'Central Govt', 'State Police', 'Railway', 'Banking', 'Rural', 'Women', 'Skill Training', 'PSU'];

const statusColors: Record<string, string> = {
  'Open': 'bg-green-100 text-green-700',
  'Always Open': 'bg-blue-100 text-blue-700',
  'Enrolling': 'bg-yellow-100 text-yellow-700',
  'Closed': 'bg-red-100 text-red-700',
};

export default function JobsPage() {
  const [selectedCat, setSelectedCat] = useState('All');

  const filtered = selectedCat === 'All' ? jobAlerts : jobAlerts.filter((j) => j.category === selectedCat);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #00695C, #00897B)' }}>
        <h1 className="text-xl font-bold text-white">Job Alerts</h1>
        <p className="text-teal-100 text-sm">नौकरी अलर्ट - सरकारी भर्ती</p>
        <div className="flex gap-3 mt-3">
          <Link href="/education" className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
            📚 Exam Prep
          </Link>
          <Link href="/ai-chat" className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
            🤖 Career AI
          </Link>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide px-3 py-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border
                ${selectedCat === cat
                  ? 'text-white border-teal-600'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              style={selectedCat === cat ? { backgroundColor: '#00695C', borderColor: '#00695C' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">
        <p className="text-xs text-gray-500">{filtered.length} opportunities found / {filtered.length} अवसर मिले</p>
        {filtered.map((job) => (
          <div key={job.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: job.color + '20' }}
              >
                {job.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-800 text-sm leading-tight">{job.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${statusColors[job.status] || 'bg-gray-100 text-gray-700'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{job.org}</p>
                <p className="text-xs text-gray-400">{job.orgHindi}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                ['Vacancies / पद', job.vacancies > 0 ? job.vacancies.toLocaleString() : '∞', '💼'],
                ['Last Date / अंतिम तिथि', job.lastDate, '📅'],
                ['Salary / वेतन', job.salary, '💰'],
                ['Qualification / योग्यता', job.qualification, '🎓'],
              ].map(([label, value, icon]) => (
                <div key={label as string} className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-xs text-gray-500">{label as string}</p>
                  <p className="text-xs font-semibold text-gray-800 mt-0.5">{icon as string} {value as string}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{job.category}</span>
              <button
                className="ml-auto px-4 py-1.5 rounded-xl text-white text-xs font-bold transition-opacity"
                style={{ backgroundColor: job.color }}
              >
                Apply / आवेदन
              </button>
              <button className="px-4 py-1.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
