// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { emergencyService, type DisasterStep } from '@/lib/services/emergencyService';
import { EMERGENCY_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, Breadcrumb } from '@/components/agriculture';
import NotificationButton from '@/components/emergency/NotificationButton';
import DisasterChecklist from '@/components/emergency/DisasterChecklist';
import ShareActions from '@/components/emergency/ShareActions';

const DISASTER_CHECKLISTS: Record<string, { id: string; text: string; textHindi: string }[]> = {
  flood: [
    { id: 'f1', text: 'Prepare emergency kit with food, water, medicines', textHindi: 'भोजन, पानी, दवाओं के साथ आपातकालीन किट तैयार करें' },
    { id: 'f2', text: 'Move valuable items to higher ground', textHindi: 'कीमती सामान ऊंचे स्थान पर ले जाएं' },
    { id: 'f3', text: 'Identify evacuation routes to higher ground', textHindi: 'ऊंचे स्थान के लिए निकासी मार्गों की पहचान करें' },
    { id: 'f4', text: 'Keep documents in waterproof bags', textHindi: 'दस्तावेजों को वाटरप्रूफ बैग में रखें' },
    { id: 'f5', text: 'Charge mobile phones and power banks', textHindi: 'मोबाइल फोन और पावर बैंक चार्ज करें' },
    { id: 'f6', text: 'Store drinking water for 3+ days', textHindi: '3+ दिनों के लिए पीने का पानी संग्रहित करें' },
    { id: 'f7', text: 'Turn off electricity and gas', textHindi: 'बिजली और गैस बंद करें' },
    { id: 'f8', text: 'Help elderly and disabled neighbors', textHindi: 'बुजुर्गों और विकलांग पड़ोसियों की मदद करें' },
  ],
  fire: [
    { id: 'fr1', text: 'Install smoke detectors on every floor', textHindi: 'हर मंजिल पर स्मोक डिटेक्टर लगाएं' },
    { id: 'fr2', text: 'Keep fire extinguisher accessible', textHindi: 'अग्निशामक यंत्र सुलभ रखें' },
    { id: 'fr3', text: 'Practice fire escape routes with family', textHindi: 'परिवार के साथ आग से बचने के मार्गों का अभ्यास करें' },
    { id: 'fr4', text: 'Know location of emergency exits', textHindi: 'आपातकालीन निकास द्वार का स्थान जानें' },
    { id: 'fr5', text: 'Keep matchboxes and lighters away from children', textHindi: 'माचिस और लाइटर बच्चों से दूर रखें' },
    { id: 'fr6', text: 'Check electrical wiring regularly', textHindi: 'बिजली के तारों की नियमित जांच करें' },
    { id: 'fr7', text: 'Store flammable materials safely', textHindi: 'ज्वलनशील पदार्थों को सुरक्षित रखें' },
    { id: 'fr8', text: 'Keep emergency numbers (101) visible', textHindi: 'आपातकालीन नंबर (101) दृश्य स्थान पर रखें' },
  ],
  earthquake: [
    { id: 'e1', text: 'Identify safe spots in each room', textHindi: 'हर कमरे में सुरक्षित स्थानों की पहचान करें' },
    { id: 'e2', text: 'Secure heavy furniture to walls', textHindi: 'भारी फर्नीचर को दीवारों से सुरक्षित करें' },
    { id: 'e3', text: 'Practice Drop, Cover, Hold On drill', textHindi: 'ड्रॉप, कवर, होल्ड ऑन का अभ्यास करें' },
    { id: 'e4', text: 'Prepare emergency kit near exit', textHindi: 'निकास द्वार के पास आपातकालीन किट रखें' },
    { id: 'e5', text: 'Know how to turn off gas and water', textHindi: 'गैस और पानी बंद करना जानें' },
    { id: 'e6', text: 'Keep shoes and flashlight near bed', textHindi: 'बिस्तर के पास जूते और टॉर्च रखें' },
    { id: 'e7', text: 'Identify safe outdoor assembly point', textHindi: 'सुरक्षित बाहरी सभा स्थल की पहचान करें' },
    { id: 'e8', text: 'Store heavy objects on lower shelves', textHindi: 'भारी वस्तुओं को निचली अलमारियों पर रखें' },
  ],
  heatwave: [
    { id: 'h1', text: 'Keep sufficient drinking water supply', textHindi: 'पर्याप्त पीने के पानी की आपूर्ति रखें' },
    { id: 'h2', text: 'Prepare ORS and electrolyte drinks', textHindi: 'ओआरएस और इलेक्ट्रोलाइट पेय तैयार करें' },
    { id: 'h3', text: 'Cover windows with curtains or shades', textHindi: 'खिड़कियों को पर्दे या शेड से ढकें' },
    { id: 'h4', text: 'Keep cool water spray bottle handy', textHindi: 'ठंडे पानी की स्प्रे बोतल रखें' },
    { id: 'h5', text: 'Plan outdoor work for early morning', textHindi: 'बाहरी काम सुबह जल्दी करें' },
    { id: 'h6', text: 'Check on elderly and sick neighbors', textHindi: 'बुजुर्गों और बीमार पड़ोसियों की जांच करें' },
    { id: 'h7', text: 'Keep battery-operated fan ready', textHindi: 'बैटरी संचालित पंखा तैयार रखें' },
    { id: 'h8', text: 'Stock light cotton clothing', textHindi: 'हल्के सूती कपड़े रखें' },
  ],
  lightning: [
    { id: 'l1', text: 'Install lightning arrester on building', textHindi: 'भवन पर तड़ित रोधक स्थापित करें' },
    { id: 'l2', text: 'Unplug electronic devices during storm', textHindi: 'तूफान के दौरान इलेक्ट्रॉनिक उपकरणों को अनप्लग करें' },
    { id: 'l3', text: 'Avoid open fields and tall trees', textHindi: 'खुले मैदानों और ऊंचे पेड़ों से बचें' },
    { id: 'l4', text: 'Know 30-30 rule for lightning safety', textHindi: 'बिजली सुरक्षा के 30-30 नियम को जानें' },
    { id: 'l5', text: 'Stay away from water and plumbing', textHindi: 'पानी और नलसाजी से दूर रहें' },
    { id: 'l6', text: 'Prepare indoor activities during storm season', textHindi: 'तूफान के मौसम में इनडोर गतिविधियों की योजना बनाएं' },
  ],
  cyclone: [
    { id: 'c1', text: 'Stock food and water for 5-7 days', textHindi: '5-7 दिनों के लिए भोजन और पानी का स्टॉक करें' },
    { id: 'c2', text: 'Board up windows with wooden planks', textHindi: 'खिड़कियों को लकड़ी के तख्तों से बंद करें' },
    { id: 'c3', text: 'Secure loose outdoor objects', textHindi: 'ढीली बाहरी वस्तुओं को सुरक्षित करें' },
    { id: 'c4', text: 'Keep documents in waterproof bags', textHindi: 'दस्तावेजों को वाटरप्रूफ बैग में रखें' },
    { id: 'c5', text: 'Know location of nearest cyclone shelter', textHindi: 'निकटतम चक्रवात आश्रय का स्थान जानें' },
    { id: 'c6', text: 'Charge power banks and phones', textHindi: 'पावर बैंक और फोन चार्ज करें' },
    { id: 'c7', text: 'Keep candles, matches, and flashlight', textHindi: 'मोमबत्ती, माचिस और टॉर्च रखें' },
    { id: 'c8', text: 'Trim tree branches near house', textHindi: 'घर के पास पेड़ की शाखाओं को काटें' },
  ],
};

export default function DisasterPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: steps, isLoading, error, refetch } = useQuery<DisasterStep[]>(
    queryKeys.emergency.disaster(),
    () => emergencyService.getDisasterSteps(),
    { staleTime: EMERGENCY_STALE_TIME },
  );

  const toggleExpanded = useCallback((id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader title="Disaster Management" titleHindi="आपदा प्रबंधन" icon="🌪️" gradient="linear-gradient(135deg, #00695C, #00897B)" />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Emergency', href: '/emergency' }, { label: 'Disaster Management' }]} />

      <div className="px-4 py-4 space-y-4">
        {isLoading && <LoadingSpinner message="Loading disaster information..." messageHindi="आपदा जानकारी लोड हो रही है..." />}
        {!isLoading && error && <ErrorAlert message={error.message || 'Failed to load'} messageHindi="लोड करने में विफल" onRetry={() => refetch()} />}

        {!isLoading && !error && steps && steps.length > 0 && (
          <div className="flex flex-col gap-3">
            {steps.map((d) => {
              const isOpen = expanded === d.id;
              const checklistItems = DISASTER_CHECKLISTS[d.id] ?? [];
              return (
                <div key={d.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleExpanded(d.id)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
                    aria-expanded={isOpen}
                    aria-controls={`disaster-content-${d.id}`}
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: d.color + '20' }}>
                      <span aria-hidden="true">{d.icon}</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-gray-800 text-sm">{d.title}</h3>
                      <p className="text-xs text-gray-500">{d.titleHindi}</p>
                    </div>
                    <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
                  </button>

                  {isOpen && (
                    <div id={`disaster-content-${d.id}`} className="px-4 pb-4 space-y-4">
                      <div className="flex gap-2">
                        <NotificationButton itemId={`disaster_${d.id}`} label={`${d.title} Alerts`} />
                      </div>

                      {/* Do's */}
                      <div>
                        <h4 className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">✅ Do / करें</h4>
                        <ul className="space-y-1">
                          {d.dos.map((item, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Don'ts */}
                      <div>
                        <h4 className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1">❌ Don&apos;t / न करें</h4>
                        <ul className="space-y-1">
                          {d.donts.map((item, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Emergency Kit */}
                      <div>
                        <h4 className="text-xs font-bold text-blue-700 mb-2 flex items-center gap-1">🎒 Emergency Kit / आपातकालीन किट</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {d.emergencyKit.map((item, i) => (
                            <span key={i} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{item}</span>
                          ))}
                        </div>
                      </div>

                      {/* Evacuation Steps */}
                      <div>
                        <h4 className="text-xs font-bold text-purple-700 mb-2 flex items-center gap-1">🚶 Evacuation Steps / निकासी कदम</h4>
                        <ol className="space-y-1">
                          {d.evacuationSteps.map((step, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Checklist */}
                      {checklistItems.length > 0 && (
                        <DisasterChecklist
                          disasterId={d.id}
                          title={d.title}
                          titleHindi={d.titleHindi}
                          items={checklistItems}
                        />
                      )}

                      {/* Share */}
                      <ShareActions title={`${d.title} Safety Guide`} number="1078" category="Disaster Management" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-2">
          <span aria-hidden="true">🆘</span>
          <p className="text-xs text-yellow-800">
            For disaster emergencies, call 1078 (NDRF) or 1070 (State Disaster Control). Stay calm and follow official instructions.
            / आपदा आपात स्थिति के लिए, 1078 (एनडीआरएफ) या 1070 (राज्य आपदा नियंत्रण) पर कॉल करें। शांत रहें और आधिकारिक निर्देशों का पालन करें।
          </p>
        </div>
      </div>
    </div>
  );
}
