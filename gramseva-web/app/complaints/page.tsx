'use client';

import { useState } from 'react';

type Category = 'Road' | 'Water' | 'Electricity' | 'Sanitation' | 'Other';

const categories: { value: Category; label: string; labelHindi: string; icon: string; color: string }[] = [
  { value: 'Road', label: 'Road', labelHindi: 'सड़क', icon: '🛣️', color: '#795548' },
  { value: 'Water', label: 'Water Supply', labelHindi: 'पानी', icon: '💧', color: '#1565C0' },
  { value: 'Electricity', label: 'Electricity', labelHindi: 'बिजली', icon: '⚡', color: '#F57F17' },
  { value: 'Sanitation', label: 'Sanitation', labelHindi: 'स्वच्छता', icon: '🚽', color: '#2E7D32' },
  { value: 'Other', label: 'Other', labelHindi: 'अन्य', icon: '📋', color: '#6A1B9A' },
];

interface Complaint {
  id: string;
  category: string;
  title: string;
  description: string;
  location: string;
  phone: string;
  date: string;
  status: 'Submitted' | 'Under Review' | 'Resolved';
}

export default function ComplaintsPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('');
  const [form, setForm] = useState({ title: '', description: '', location: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('gs_complaints') || '[]');
    }
    return [];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !form.title || !form.description || !form.location) {
      alert('कृपया सभी अनिवार्य फ़ील्ड भरें / Please fill all required fields');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const newId = 'GS-' + Date.now().toString(36).toUpperCase();
    const newComplaint: Complaint = {
      id: newId,
      category: selectedCategory,
      title: form.title,
      description: form.description,
      location: form.location,
      phone: form.phone,
      date: new Date().toLocaleDateString('en-IN'),
      status: 'Submitted',
    };
    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    localStorage.setItem('gs_complaints', JSON.stringify(updated));
    setComplaintId(newId);
    setSuccess(true);
    setLoading(false);
  };

  const resetForm = () => {
    setSuccess(false);
    setSelectedCategory('');
    setForm({ title: '', description: '', location: '', phone: '' });
    setComplaintId('');
  };

  const statusColors: Record<Complaint['status'], string> = {
    'Submitted': 'bg-blue-100 text-blue-700',
    'Under Review': 'bg-yellow-100 text-yellow-700',
    'Resolved': 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <div className="px-5 pt-6 pb-8" style={{ background: 'linear-gradient(135deg, #4E342E, #6D4C41)' }}>
        <h1 className="text-xl font-bold text-white">Complaints Portal</h1>
        <p className="text-amber-100 text-sm">शिकायत पोर्टल</p>
        <p className="text-amber-100 text-xs mt-1">Submit grievances about public services / सार्वजनिक सेवाओं की शिकायत</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-14 z-10 shadow-sm">
        <div className="flex">
          {[['submit', 'Submit Complaint', 'शिकायत करें'], ['track', 'Track Complaints', 'स्थिति देखें']].map(([val, label, hindi]) => (
            <button
              key={val}
              onClick={() => setActiveTab(val as 'submit' | 'track')}
              className={`flex-1 py-3.5 text-sm font-semibold border-b-2 transition-colors
                ${activeTab === val ? 'border-amber-700 text-amber-800' : 'border-transparent text-gray-500'}`}
            >
              {label}
              <span className="block text-xs font-normal text-gray-400">{hindi}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Submit Tab */}
        {activeTab === 'submit' && !success && (
          <div className="flex flex-col gap-5">
            {/* Category Selection */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Category / श्रेणी *</h2>
              <div className="grid grid-cols-5 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all
                      ${selectedCategory === cat.value ? 'shadow-md' : 'border-transparent bg-white'}`}
                    style={selectedCategory === cat.value ? { borderColor: cat.color, backgroundColor: cat.color + '15' } : {}}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.label}</span>
                    <span className="text-xs text-gray-400 text-center leading-tight">{cat.labelHindi}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Complaint Title / शीर्षक *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief title of your complaint"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description / विवरण *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue in detail / विस्तृत विवरण दें"
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-amber-500 resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Location / स्थान *</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Village, District, State"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number / फोन नंबर</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="For status updates (optional)"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-opacity disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #4E342E, #6D4C41)' }}
              >
                {loading ? 'Submitting...' : 'Submit Complaint / शिकायत दर्ज करें'}
              </button>
            </form>
          </div>
        )}

        {/* Success State */}
        {activeTab === 'submit' && success && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-green-800">Complaint Submitted!</h2>
            <p className="text-gray-600 text-center text-sm">शिकायत सफलतापूर्वक दर्ज की गई</p>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 w-full text-center">
              <p className="text-sm text-gray-600 mb-1">Complaint ID / शिकायत संख्या</p>
              <p className="text-2xl font-bold text-green-800">{complaintId}</p>
              <p className="text-xs text-gray-500 mt-1">Save this for tracking / इसे सुरक्षित रखें</p>
            </div>
            <button
              onClick={resetForm}
              className="w-full py-3 rounded-xl text-white font-bold" style={{ backgroundColor: '#4E342E' }}
            >
              Submit Another / नई शिकायत
            </button>
            <button
              onClick={() => { resetForm(); setActiveTab('track'); }}
              className="w-full py-3 rounded-xl font-bold text-amber-800 border border-amber-300"
            >
              Track Complaints →
            </button>
          </div>
        )}

        {/* Track Tab */}
        {activeTab === 'track' && (
          <div className="flex flex-col gap-3">
            {complaints.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-gray-400">
                <span className="text-5xl">📋</span>
                <p className="text-sm">No complaints submitted yet</p>
                <p className="text-xs">अभी तक कोई शिकायत नहीं</p>
                <button onClick={() => setActiveTab('submit')} className="text-sm text-amber-700 font-semibold underline mt-2">
                  Submit a Complaint →
                </button>
              </div>
            ) : (
              complaints.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-bold text-amber-700">{c.id}</span>
                      <h3 className="font-semibold text-gray-800 text-sm">{c.title}</h3>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${statusColors[c.status]}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{c.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>📍 {c.location}</span>
                    <span>•</span>
                    <span>{categories.find(cat => cat.value === c.category)?.icon} {c.category}</span>
                    <span>•</span>
                    <span>📅 {c.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
