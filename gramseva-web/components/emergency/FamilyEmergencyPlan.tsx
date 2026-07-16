// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import { useState, useCallback } from 'react';

const PLAN_STORAGE_KEY = 'gs_emergency_family_plan';

interface FamilyPlan {
  emergencyContact: string;
  emergencyPhone: string;
  meetingPoint: string;
  bloodGroup: string;
  medicalNotes: string;
  medicines: string;
}

const DEFAULT_PLAN: FamilyPlan = {
  emergencyContact: '',
  emergencyPhone: '',
  meetingPoint: '',
  bloodGroup: '',
  medicalNotes: '',
  medicines: '',
};

function loadPlan(): FamilyPlan {
  if (typeof localStorage === 'undefined') return DEFAULT_PLAN;
  try {
    const stored = localStorage.getItem(PLAN_STORAGE_KEY);
    return stored ? { ...DEFAULT_PLAN, ...JSON.parse(stored) } : DEFAULT_PLAN;
  } catch { return DEFAULT_PLAN; }
}

function savePlan(plan: FamilyPlan): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}

export default function FamilyEmergencyPlan() {
  const [plan, setPlan] = useState<FamilyPlan>(() => loadPlan());
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const updateField = useCallback((field: keyof FamilyPlan, value: string) => {
    setPlan((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    savePlan(plan);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [plan]);

  const handleClear = useCallback(() => {
    setPlan(DEFAULT_PLAN);
    savePlan(DEFAULT_PLAN);
  }, []);

  const hasData = Object.values(plan).some((v) => v.trim().length > 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        aria-expanded={expanded}
        aria-controls="family-plan-content"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-red-100">
          <span aria-hidden="true">👨‍👩‍👧‍👦</span>
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-bold text-gray-800 text-sm">Family Emergency Plan</h3>
          <p className="text-xs text-gray-500">पारिवारिक आपातकालीन योजना</p>
          {hasData && <p className="text-[10px] text-green-600 mt-0.5">✓ Saved locally</p>}
        </div>
        <span className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true">▼</span>
      </button>

      {expanded && (
        <div id="family-plan-content" className="px-4 pb-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="fp-contact" className="text-xs font-medium text-gray-600 block mb-1">Emergency Contact / आपातकालीन संपर्क</label>
              <input
                id="fp-contact"
                type="text"
                value={plan.emergencyContact}
                onChange={(e) => updateField('emergencyContact', e.target.value)}
                placeholder="Name"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label htmlFor="fp-phone" className="text-xs font-medium text-gray-600 block mb-1">Phone Number / फ़ोन नंबर</label>
              <input
                id="fp-phone"
                type="tel"
                value={plan.emergencyPhone}
                onChange={(e) => updateField('emergencyPhone', e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label htmlFor="fp-meeting" className="text-xs font-medium text-gray-600 block mb-1">Meeting Point / मिलने का स्थान</label>
              <input
                id="fp-meeting"
                type="text"
                value={plan.meetingPoint}
                onChange={(e) => updateField('meetingPoint', e.target.value)}
                placeholder="e.g. Community Center"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label htmlFor="fp-blood" className="text-xs font-medium text-gray-600 block mb-1">Blood Group / रक्त समूह</label>
              <input
                id="fp-blood"
                type="text"
                value={plan.bloodGroup}
                onChange={(e) => updateField('bloodGroup', e.target.value)}
                placeholder="e.g. A+"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="fp-notes" className="text-xs font-medium text-gray-600 block mb-1">Medical Notes / चिकित्सा नोट्स</label>
            <textarea
              id="fp-notes"
              value={plan.medicalNotes}
              onChange={(e) => updateField('medicalNotes', e.target.value)}
              placeholder="Allergies, conditions, medications..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label htmlFor="fp-medicines" className="text-xs font-medium text-gray-600 block mb-1">Emergency Medicines / आपातकालीन दवाएं</label>
            <textarea
              id="fp-medicines"
              value={plan.medicines}
              onChange={(e) => updateField('medicines', e.target.value)}
              placeholder="List essential medicines..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {saved ? '✓ Saved!' : 'Save Plan / योजना सहेजें'}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Clear / साफ़ करें
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
