'use client';

import { useState } from 'react';
import Link from 'next/link';

const scholarships = [
  { title: 'National Scholarship Portal', titleHindi: 'राष्ट्रीय छात्रवृत्ति पोर्टल', category: 'Central Govt', amount: '₹500–₹35,000/year', eligibility: 'SC/ST/OBC/Minority students', deadline: '31 Oct 2024', icon: '🎓', color: '#2E7D32' },
  { title: 'PM Scholarship Scheme', titleHindi: 'पीएम छात्रवृत्ति', category: 'Central Govt', amount: '₹2,500/month (boys), ₹3,000/month (girls)', eligibility: 'Ex-servicemen/paramilitary wards', deadline: '15 Nov 2024', icon: '🏅', color: '#1565C0' },
  { title: 'Mukhyamantri Medhavi Scholarship', titleHindi: 'मुख्यमंत्री मेधावी छात्रवृत्ति', category: 'State Govt', amount: 'Full tuition fee', eligibility: '85%+ in 12th, family income < ₹6 lakh', deadline: '30 Nov 2024', icon: '🏆', color: '#6A1B9A' },
  { title: 'Begum Hazrat Mahal Scholarship', titleHindi: 'बेगम हजरत महल', category: 'Minority', amount: '₹5,000–₹6,000/year', eligibility: 'Muslim/Christian/Sikh/Buddhist/Parsi girls 9th–12th', deadline: '30 Sep 2024', icon: '👩‍🎓', color: '#C62828' },
];

const govtExams = [
  { exam: 'UPSC Civil Services', examHindi: 'यूपीएससी', date: '26 May 2024', vacancies: '1056', level: 'Central', status: 'Open', icon: '🏛️' },
  { exam: 'SSC CGL', examHindi: 'एसएससी सीजीएल', date: 'Jul-Aug 2024', vacancies: '17,727', level: 'Central', status: 'Open', icon: '📋' },
  { exam: 'Railway NTPC', examHindi: 'रेलवे एनटीपीसी', date: 'Sep 2024', vacancies: '11,558', level: 'Central', status: 'Coming', icon: '🚂' },
  { exam: 'IBPS PO', examHindi: 'आईबीपीएस पीओ', date: 'Oct 2024', vacancies: '4,455', level: 'Banking', status: 'Open', icon: '🏦' },
  { exam: 'UP Police Constable', examHindi: 'यूपी पुलिस', date: 'Dec 2024', vacancies: '60,244', level: 'State', status: 'Coming', icon: '👮' },
  { exam: 'CTET', examHindi: 'सीटेट', date: 'Jul 2024', vacancies: '-', level: 'Teaching', status: 'Closed', icon: '📖' },
];

const courses = [
  { title: 'Digital Literacy / डिजिटल साक्षरता', provider: 'NIELIT', duration: '3 months', mode: 'Online/Offline', free: true },
  { title: 'Computer Basics / कंप्यूटर बेसिक्स', provider: 'PMGDISHA', duration: '20 days', mode: 'Offline', free: true },
  { title: 'Skill Development / कौशल विकास', provider: 'NSDC', duration: '6 months', mode: 'Offline', free: true },
  { title: 'English Speaking / अंग्रेज़ी', provider: 'Spoken Tutorial IIT Bombay', duration: 'Self-paced', mode: 'Online', free: true },
  { title: 'Financial Literacy / वित्तीय साक्षरता', provider: 'NCFE', duration: '1 month', mode: 'Online', free: true },
  { title: 'Agriculture Technology / कृषि तकनीक', provider: 'ICAR', duration: '3 months', mode: 'Online', free: true },
];

const studyMaterial = [
  { subject: 'General Knowledge / सामान्य ज्ञान', files: 12, icon: '🌍' },
  { subject: 'Mathematics / गणित', files: 8, icon: '🔢' },
  { subject: 'Hindi Literature / हिंदी साहित्य', files: 6, icon: '📝' },
  { subject: 'Science / विज्ञान', files: 10, icon: '🔬' },
  { subject: 'Current Affairs / करंट अफेयर्स', files: 15, icon: '📰' },
  { subject: 'Indian History / भारतीय इतिहास', files: 7, icon: '🏛️' },
];

const tabs = ['Scholarships', 'Govt Exams', 'Courses', 'Study Material'];

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #1565C0, #1976D2)' }}>
        <h1 className="text-xl font-bold text-white">Education</h1>
        <p className="text-blue-100 text-sm">शिक्षा - ज्ञान की ओर</p>
        <div className="flex gap-3 mt-3">
          <Link href="/ai-chat" className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-white text-xs font-medium hover:bg-white/30 transition-colors">
            🤖 Career Guidance AI
          </Link>
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
        {/* Scholarships */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-4">
            {scholarships.map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: s.color + '20' }}>
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-gray-800 text-sm leading-tight">{s.title}</h3>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex-shrink-0">{s.category}</span>
                    </div>
                    <p className="text-xs text-gray-500">{s.titleHindi}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-green-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-xs font-bold text-green-700">{s.amount}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500">Deadline</p>
                    <p className="text-xs font-bold text-red-700">{s.deadline}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 rounded-xl p-2 mb-3">👥 {s.eligibility}</p>
                <button className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-opacity" style={{ backgroundColor: s.color }}>
                  Apply Now / आवेदन करें
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Govt Exams */}
        {activeTab === 1 && (
          <div className="flex flex-col gap-3">
            {govtExams.map((exam) => (
              <div key={exam.exam} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{exam.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800 text-sm">{exam.exam}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                        ${exam.status === 'Open' ? 'bg-green-100 text-green-700' :
                          exam.status === 'Coming' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'}`}>
                        {exam.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{exam.examHindi} • {exam.level}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500">Exam Date</p>
                    <p className="text-sm font-semibold text-gray-800">{exam.date}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-xs text-gray-500">Vacancies</p>
                    <p className="text-sm font-semibold text-blue-700">{exam.vacancies}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses */}
        {activeTab === 2 && (
          <div className="flex flex-col gap-3">
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex gap-2 items-start">
              <span>🎉</span>
              <p className="text-xs text-green-700">सभी कोर्स मुफ़्त हैं! All courses are FREE for rural citizens.</p>
            </div>
            {courses.map((course) => (
              <div key={course.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{course.title}</h3>
                    <p className="text-xs text-gray-500">{course.provider}</p>
                  </div>
                  {course.free && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">FREE</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">⏱️ {course.duration}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">📡 {course.mode}</span>
                </div>
                <button className="mt-3 w-full py-2 rounded-xl text-sm font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors">
                  Enroll / नामांकन करें
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Study Material */}
        {activeTab === 3 && (
          <div className="grid grid-cols-2 gap-3">
            {studyMaterial.map((item) => (
              <div key={item.subject} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <p className="text-sm font-semibold text-gray-800 leading-tight">{item.subject}</p>
                <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">{item.files} PDFs</span>
                <button className="w-full py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
