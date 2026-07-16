'use client';

/**
 * Education Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback } from 'react';

interface CheckerInput {
  age: number | '';
  gender: string;
  category: string;
  annualIncome: number | '';
  state: string;
  studentLevel: string;
}

interface CheckResult {
  status: 'eligible' | 'partial' | 'not_eligible';
  label: string;
  labelHindi: string;
  eligibleScholarships: string[];
  partiallyEligible: string[];
  reasons: string[];
}

const DEFAULT_INPUT: CheckerInput = {
  age: '',
  gender: '',
  category: '',
  annualIncome: '',
  state: '',
  studentLevel: '',
};

const SCHOLARSHIP_DATABASE: { id: string; name: string; check: (input: CheckerInput) => boolean }[] = [
  { id: 'nsp', name: 'National Scholarship Portal', check: (i) => i.category !== '' && (i.annualIncome === '' || i.annualIncome < 800000) },
  { id: 'pmss', name: 'PM Scholarship Scheme', check: (i) => i.studentLevel === 'college' || i.studentLevel === 'postgraduate' },
  { id: 'mms', name: 'Mukhyamantri Medhavi Scholarship', check: (i) => i.state === 'Madhya Pradesh' && i.studentLevel === 'college' && (i.annualIncome === '' || i.annualIncome < 600000) },
  { id: 'bhm', name: 'Begum Hazrat Mahal Scholarship', check: (i) => i.gender === 'female' && (i.category === 'minority' || i.category === '') && (i.studentLevel === 'school' || i.studentLevel === 'college') },
  { id: 'obc', name: 'OBC Post Matric Scholarship', check: (i) => i.category === 'obc' && (i.annualIncome === '' || i.annualIncome < 300000) && (i.studentLevel === 'college' || i.studentLevel === 'postgraduate') },
  { id: 'scst', name: 'SC/ST Post Matric Scholarship', check: (i) => (i.category === 'sc' || i.category === 'st') && (i.annualIncome === '' || i.annualIncome < 250000) && (i.studentLevel === 'college' || i.studentLevel === 'postgraduate') },
  { id: 'up_medhavi', name: 'UP Medhavi Scholarship', check: (i) => i.state === 'Uttar Pradesh' && (i.studentLevel === 'college' || i.studentLevel === 'postgraduate') },
  { id: 'aaple', name: 'Aaple Sarkar Scholarship', check: (i) => i.state === 'Maharashtra' && (i.studentLevel === 'college' || i.studentLevel === 'school') },
];

function generateResult(input: CheckerInput): CheckResult | null {
  if (input.age === '' || input.gender === '' || input.category === '' || input.annualIncome === '' || input.state === '' || input.studentLevel === '') {
    return null;
  }

  const eligibleScholarships: string[] = [];
  const partiallyEligible: string[] = [];
  const reasons: string[] = [];

  for (const s of SCHOLARSHIP_DATABASE) {
    if (s.check(input)) {
      eligibleScholarships.push(s.name);
    } else {
      partiallyEligible.push(s.name);
    }
  }

  if (input.studentLevel === 'school') reasons.push('You qualify for school-level scholarships (NSP, BHM)');
  if (input.studentLevel === 'college') reasons.push('You qualify for college-level scholarships (NSP, OBC, SC/ST, State)');
  if (input.studentLevel === 'postgraduate') reasons.push('You qualify for postgraduate scholarships (NSP, PMSS, OBC)');
  if (['sc', 'st'].includes(input.category)) reasons.push('SC/ST category eligible for reserved scholarships');
  if (input.category === 'obc') reasons.push('OBC category eligible for OBC-specific scholarships');
  if (input.state === 'Uttar Pradesh' || input.state === 'Madhya Pradesh' || input.state === 'Maharashtra') reasons.push(`State-specific scholarships available for ${input.state}`);
  if (input.gender === 'female') reasons.push('Women-specific scholarships available (BHM, others)');

  let status: CheckResult['status'];
  if (eligibleScholarships.length >= 3) {
    status = 'eligible';
  } else if (eligibleScholarships.length >= 1) {
    status = 'partial';
  } else {
    status = 'not_eligible';
  }

  const label = status === 'eligible' ? 'Eligible' : status === 'partial' ? 'Partially Eligible' : 'Not Eligible';
  const labelHindi = status === 'eligible' ? 'पात्र' : status === 'partial' ? 'आंशिक रूप से पात्र' : 'अपात्र';

  if (eligibleScholarships.length === 0 && partiallyEligible.length > 0) {
    reasons.push('Review the partially matching scholarships for specific criteria');
  }

  return { status, label, labelHindi, eligibleScholarships, partiallyEligible, reasons };
}

const STATUS_COLORS: Record<string, string> = {
  eligible: 'bg-green-50 border-green-200 text-green-700',
  partial: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  not_eligible: 'bg-red-50 border-red-200 text-red-700',
};

export default function ScholarshipEligibilityChecker() {
  const [input, setInput] = useState<CheckerInput>(DEFAULT_INPUT);
  const [showResult, setShowResult] = useState(false);

  const update = useCallback(<K extends keyof CheckerInput>(key: K, value: CheckerInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    setShowResult(false);
  }, []);

  const result = useMemo(() => generateResult(input), [input]);

  const handleCheck = useCallback(() => {
    if (result) setShowResult(true);
  }, [result]);

  const handleClear = useCallback(() => {
    setInput(DEFAULT_INPUT);
    setShowResult(false);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Scholarship Eligibility Checker</h3>
            <p className="text-[10px] text-gray-400">Check your eligibility for scholarships / छात्रवृत्ति पात्रता जांचें</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="sec-age" className="text-xs font-semibold text-gray-600 block mb-1">Age / आयु</label>
            <input
              id="sec-age"
              type="number"
              min={0}
              max={120}
              value={input.age}
              onChange={(e) => update('age', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 20"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Enter your age"
            />
          </div>
          <div>
            <label htmlFor="sec-gender" className="text-xs font-semibold text-gray-600 block mb-1">Gender / लिंग</label>
            <select
              id="sec-gender"
              value={input.gender}
              onChange={(e) => update('gender', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Select your gender"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>
          <div>
            <label htmlFor="sec-category" className="text-xs font-semibold text-gray-600 block mb-1">Category / श्रेणी</label>
            <select
              id="sec-category"
              value={input.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Select your category"
            >
              <option value="">Select</option>
              <option value="general">General</option>
              <option value="obc">OBC</option>
              <option value="sc">SC</option>
              <option value="st">ST</option>
              <option value="ews">EWS</option>
              <option value="minority">Minority</option>
            </select>
          </div>
          <div>
            <label htmlFor="sec-income" className="text-xs font-semibold text-gray-600 block mb-1">Annual Income (₹) / वार्षिक आय</label>
            <input
              id="sec-income"
              type="number"
              min={0}
              value={input.annualIncome}
              onChange={(e) => update('annualIncome', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 200000"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Enter your annual income"
            />
          </div>
          <div>
            <label htmlFor="sec-state" className="text-xs font-semibold text-gray-600 block mb-1">State / राज्य</label>
            <select
              id="sec-state"
              value={input.state}
              onChange={(e) => update('state', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Select your state"
            >
              <option value="">Select</option>
              <option value="All India">All India</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="sec-level" className="text-xs font-semibold text-gray-600 block mb-1">Student Level / स्तर</label>
            <select
              id="sec-level"
              value={input.studentLevel}
              onChange={(e) => update('studentLevel', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Select your student level"
            >
              <option value="">Select</option>
              <option value="school">School / स्कूल</option>
              <option value="college">College / कॉलेज</option>
              <option value="postgraduate">Postgraduate / स्नातकोत्तर</option>
              <option value="research">Research / शोध</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            disabled={!result}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Check scholarship eligibility"
          >
            Check Eligibility / पात्रता जांचें
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Clear all fields"
          >
            Clear
          </button>
        </div>

        {showResult && result && (
          <div className={`rounded-xl border p-4 ${STATUS_COLORS[result.status]}`} role="alert">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{result.status === 'eligible' ? '✅' : result.status === 'partial' ? '⚠️' : '❌'}</span>
              <div>
                <p className="text-sm font-bold">{result.label}</p>
                <p className="text-xs opacity-75">{result.labelHindi}</p>
              </div>
            </div>

            {result.eligibleScholarships.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-semibold mb-1">Eligible For / पात्र हैं:</p>
                <ul className="space-y-0.5">
                  {result.eligibleScholarships.map((name) => (
                    <li key={name} className="text-xs flex items-center gap-1">
                      <span>✓</span> {name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="space-y-1">
              {result.reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs">
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
