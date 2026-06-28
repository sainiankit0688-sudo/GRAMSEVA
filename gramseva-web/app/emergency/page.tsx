'use client';

import Link from 'next/link';

const emergencyContacts = [
  {
    title: 'Ambulance',
    titleHindi: 'एम्बुलेंस',
    number: '108',
    desc: 'Free emergency ambulance service. Available 24x7 across India.',
    descHindi: '24 घंटे मुफ़्त एम्बुलेंस सेवा',
    icon: '🚑',
    color: '#C62828',
    bgColor: '#FFEBEE',
  },
  {
    title: 'Police',
    titleHindi: 'पुलिस',
    number: '112',
    desc: 'National emergency number for police, fire & medical emergencies.',
    descHindi: 'राष्ट्रीय आपातकालीन नंबर',
    icon: '👮',
    color: '#1565C0',
    bgColor: '#E3F2FD',
  },
  {
    title: 'Women Helpline',
    titleHindi: 'महिला हेल्पलाइन',
    number: '1091',
    desc: '24x7 helpline for women in distress. Immediate police assistance.',
    descHindi: 'महिला सुरक्षा हेल्पलाइन',
    icon: '👩',
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
  },
  {
    title: 'Fire Brigade',
    titleHindi: 'दमकल',
    number: '101',
    desc: 'Fire emergency, rescue operations and hazardous material incidents.',
    descHindi: 'आग और बचाव सेवा',
    icon: '🔥',
    color: '#E65100',
    bgColor: '#FFF3E0',
  },
  {
    title: 'Disaster Management',
    titleHindi: 'आपदा प्रबंधन',
    number: '1078',
    desc: 'NDRF helpline for natural disasters like floods, earthquakes, cyclones.',
    descHindi: 'प्राकृतिक आपदा हेल्पलाइन',
    icon: '⛈️',
    color: '#00695C',
    bgColor: '#E0F2F1',
  },
  {
    title: 'Child Helpline',
    titleHindi: 'बाल हेल्पलाइन',
    number: '1098',
    desc: 'Emergency assistance for children in need of care and protection.',
    descHindi: 'बच्चों की सुरक्षा हेल्पलाइन',
    icon: '👶',
    color: '#F57F17',
    bgColor: '#FFFDE7',
  },
];

const healthHelplines = [
  { title: 'Ayushman Bharat PMJAY', number: '14555', desc: 'Health insurance & hospital enquiry' },
  { title: 'Suicide Prevention', number: 'iCall: 9152987821', desc: 'Mental health crisis support' },
  { title: 'Drug Abuse Helpline', number: '1800-11-0031', desc: 'De-addiction & counselling' },
  { title: 'COVID-19 Helpline', number: '1075', desc: 'Central government COVID helpline' },
];

const otherHelplines = [
  { title: 'PM Kisan Helpline', number: '155261', desc: 'Farmer scheme queries' },
  { title: 'Ration Card Helpline', number: '1967', desc: 'PDS & food department' },
  { title: 'Electricity Complaint', number: '1912', desc: 'Power outage & billing' },
  { title: 'Water Supply', number: '1800-180-5678', desc: 'Water supply issues' },
  { title: 'Cyber Crime', number: '1930', desc: 'Online fraud & cybercrime' },
  { title: 'Missing Persons', number: '1094', desc: 'Track missing persons' },
];

export default function EmergencyPage() {
  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #B71C1C, #C62828)' }}>
        <h1 className="text-xl font-bold text-white">Emergency Services</h1>
        <p className="text-red-100 text-sm">आपातकालीन सेवाएं</p>
        <p className="text-red-100 text-xs mt-1">Tap any number to call immediately / नंबर दबाएं और कॉल करें</p>
      </div>

      {/* Main Emergency Contacts */}
      <div className="px-4 mt-4">
        <h2 className="text-base font-bold text-gray-800 mb-3">Emergency Numbers / आपातकालीन नंबर</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className="block rounded-2xl p-4 shadow-sm border transition-transform hover:scale-[1.01] active:scale-[0.98]"
              style={{ backgroundColor: contact.bgColor, borderColor: contact.color + '30' }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: contact.color + '20' }}
                >
                  {contact.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-800">{contact.title}</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/60" style={{ color: contact.color }}>
                      CALL
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{contact.titleHindi}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">{contact.desc}</p>
                  <p className="text-xs text-gray-500">{contact.descHindi}</p>
                </div>
                <span
                  className="flex-shrink-0 ml-3 px-4 py-2 rounded-xl font-bold text-white text-lg shadow-sm"
                  style={{ backgroundColor: contact.color }}
                >
                  {contact.number}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Health Helplines */}
      <div className="px-4 mt-6">
        <h2 className="text-base font-bold text-gray-800 mb-3">Health Helplines / स्वास्थ्य हेल्पलाइन</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {healthHelplines.map((h, i) => (
            <a
              key={h.number}
              href={`tel:${h.number.replace(/\D/g, '').replace(/^0+/, '')}`}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${i < healthHelplines.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-xl">🏥</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{h.title}</p>
                <p className="text-xs text-gray-500">{h.desc}</p>
              </div>
              <span className="text-sm font-bold text-red-700">{h.number}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Other Helplines */}
      <div className="px-4 mt-6 pb-8">
        <h2 className="text-base font-bold text-gray-800 mb-3">Other Helplines / अन्य हेल्पलाइन</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {otherHelplines.map((h, i) => (
            <a
              key={h.title}
              href={`tel:${h.number.replace(/[^0-9]/g, '')}`}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${i < otherHelplines.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-xl">📞</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{h.title}</p>
                <p className="text-xs text-gray-500">{h.desc}</p>
              </div>
              <span className="text-sm font-bold text-green-700">{h.number}</span>
            </a>
          ))}
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2">
          <span>⚠️</span>
          <p className="text-xs text-yellow-800">
            All helpline calls are free from any mobile/landline. In emergency, call 112 for immediate assistance from police, fire, or ambulance.
          </p>
        </div>
      </div>
    </div>
  );
}
