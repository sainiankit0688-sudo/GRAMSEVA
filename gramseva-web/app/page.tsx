import SchemeCard from '@/components/SchemeCard';
import Link from 'next/link';

const schemes = [
  {
    title: 'PM Kisan Samman Nidhi',
    titleHindi: 'पीएम किसान सम्मान निधि',
    description: 'Small & marginal farmers get ₹6,000/year in 3 equal installments directly to their bank account.',
    icon: '🌾',
    color: '#2E7D32',
    link: '/agriculture',
    badge: 'Active',
  },
  {
    title: 'Ayushman Bharat PMJAY',
    titleHindi: 'आयुष्मान भारत',
    description: 'Health coverage up to ₹5 lakh per year for secondary & tertiary hospitalization for eligible families.',
    icon: '🏥',
    color: '#C62828',
    link: '/health',
    badge: 'Active',
  },
  {
    title: 'PM Awas Yojana',
    titleHindi: 'प्रधानमंत्री आवास योजना',
    description: 'Housing assistance for rural & urban poor. Subsidized housing for eligible BPL families.',
    icon: '🏘️',
    color: '#1565C0',
    link: '/housing',
    badge: 'Active',
  },
  {
    title: 'PM Fasal Bima Yojana',
    titleHindi: 'फसल बीमा योजना',
    description: 'Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities.',
    icon: '🌱',
    color: '#6A1B9A',
    link: '/agriculture',
  },
  {
    title: 'Scholarship Schemes',
    titleHindi: 'छात्रवृत्ति योजनाएं',
    description: 'Government scholarships for SC/ST/OBC & minority students for higher education.',
    icon: '🎓',
    color: '#E65100',
    link: '/education',
  },
  {
    title: 'MGNREGA',
    titleHindi: 'मनरेगा',
    description: 'Guaranteed 100 days of wage employment in a financial year to rural households.',
    icon: '💪',
    color: '#00695C',
    link: '/jobs',
  },
];

const quickActions = [
  { label: 'Agriculture', labelHindi: 'कृषि', icon: '🌾', href: '/agriculture', color: '#2E7D32' },
  { label: 'Education', labelHindi: 'शिक्षा', icon: '📚', href: '/education', color: '#1565C0' },
  { label: 'Health', labelHindi: 'स्वास्थ्य', icon: '🏥', href: '/health', color: '#C62828' },
  { label: 'Housing', labelHindi: 'आवास', icon: '🏘️', href: '/housing', color: '#6A1B9A' },
  { label: 'Emergency', labelHindi: 'आपातकाल', icon: '🚨', href: '/emergency', color: '#BF360C' },
  { label: 'Complaints', labelHindi: 'शिकायत', icon: '📋', href: '/complaints', color: '#4E342E' },
  { label: 'Jobs', labelHindi: 'नौकरी', icon: '💼', href: '/jobs', color: '#00695C' },
  { label: 'AI Chat', labelHindi: 'AI चैट', icon: '🤖', href: '/ai-chat', color: '#1A237E' },
];

export default function HomePage() {
  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Hero Banner */}
      <div
        className="px-5 pt-6 pb-8 text-white"
        style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
      >
        <p className="text-green-100 text-sm mb-1">नमस्ते! Welcome to</p>
        <h1 className="text-2xl font-bold">GramSeva Portal</h1>
        <p className="text-green-100 text-sm mt-1">सरकारी योजनाओं की जानकारी एक जगह</p>
        <p className="text-green-100 text-xs">All government schemes in one place</p>
        <div className="flex gap-3 mt-4">
          <Link
            href="/ai-chat"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full text-sm font-medium"
          >
            🤖 AI से पूछें
          </Link>
          <Link
            href="/emergency"
            className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 transition-colors px-4 py-2 rounded-full text-sm font-medium"
          >
            🚨 Emergency
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 -mt-3">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">Quick Access / त्वरित पहुँच</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-105"
                  style={{ backgroundColor: action.color + '15', border: `1px solid ${action.color}30` }}
                >
                  {action.icon}
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight font-medium">{action.label}</span>
                <span className="text-xs text-gray-400 text-center leading-tight">{action.labelHindi}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Government Schemes */}
      <div className="px-4 mt-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Govt. Schemes</h2>
            <p className="text-xs text-gray-500">सरकारी योजनाएं</p>
          </div>
          <span className="text-xs text-green-700 font-medium bg-green-50 px-2 py-1 rounded-full">{schemes.length} Active</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.title} {...scheme} />
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-4 pb-8">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">Need Help?</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Use our AI Chat for instant help with government schemes, documents, and eligibility queries.
              हमारे AI चैट से योजनाओं की जानकारी पाएं।
            </p>
            <Link href="/ai-chat" className="text-xs text-blue-700 font-semibold mt-1 inline-block underline">
              Chat with AI →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
