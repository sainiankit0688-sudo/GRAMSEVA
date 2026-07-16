'use client';

/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback } from 'react';

interface CheckerInput {
  age: number | '';
  gender: string;
  category: string;
  annualIncome: number | '';
  occupation: string;
  state: string;
}

interface CheckResult {
  status: 'eligible' | 'partial' | 'not_eligible';
  label: string;
  labelHindi: string;
  reasons: string[];
}

const DEFAULT_INPUT: CheckerInput = {
  age: '',
  gender: '',
  category: '',
  annualIncome: '',
  occupation: '',
  state: '',
};

function generateResult(input: CheckerInput): CheckResult | null {
  if (input.age === '' || input.gender === '' || input.category === '' ||
      input.annualIncome === '' || input.occupation === '' || input.state === '') {
    return null;
  }

  const reasons: string[] = [];
  let score = 0;

  if (input.occupation === 'farmer') {
    score += 2;
    reasons.push('Farmers are eligible for agriculture schemes like PM-KISAN, PMFBY, KCC');
  }
  if (input.occupation === 'student') {
    score += 2;
    reasons.push('Students are eligible for scholarship schemes (NSP, Pre/Post-Matric)');
  }
  if (['sc', 'st'].includes(input.category)) {
    score += 2;
    reasons.push('SC/ST category qualifies for reserved schemes and scholarships');
  }
  if (input.category === 'obc') {
    score += 1;
    reasons.push('OBC category qualifies for many reserved schemes');
  }
  if (input.category === 'general' && input.annualIncome < 800000) {
    score += 1;
    reasons.push('EWS/income-based schemes may apply');
  }
  if (input.age >= 60) {
    score += 2;
    reasons.push('Senior citizen eligible for Old Age Pension, Ayushman Bharat');
  }
  if (input.age >= 18 && input.age < 60) {
    score += 1;
    reasons.push('Working-age eligible for employment & skill schemes');
  }
  if (input.gender === 'female') {
    score += 1;
    reasons.push('Women-specific schemes like PM Matru Vandana, Sukanya Samriddhi');
  }
  if (input.annualIncome < 50000) {
    score += 2;
    reasons.push('Below poverty line qualifies for BPL-specific schemes');
  }
  if (input.annualIncome < 300000) {
    score += 1;
    reasons.push('Low-income eligible for subsidized schemes');
  }
  if (input.annualIncome > 1000000) {
    score -= 1;
    reasons.push('High income may limit some welfare scheme eligibility');
  }

  let status: CheckResult['status'];
  if (score >= 4) {
    status = 'eligible';
  } else if (score >= 2) {
    status = 'partial';
  } else {
    status = 'not_eligible';
  }

  const label = status === 'eligible' ? 'Eligible' : status === 'partial' ? 'Partially Eligible' : 'Not Eligible';
  const labelHindi = status === 'eligible' ? 'पात्र' : status === 'partial' ? 'आंशिक रूप से पात्र' : 'अपात्र';

  if (status === 'eligible') {
    reasons.push('You qualify for many government schemes based on your profile');
  } else if (status === 'partial') {
    reasons.push('You may qualify for some but not all schemes');
  } else {
    reasons.unshift('Based on provided information, you may not meet eligibility criteria');
  }

  return { status, label, labelHindi, reasons };
}

export default function EligibilityChecker() {
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

  const statusColors: Record<string, string> = {
    eligible: 'bg-green-50 border-green-200 text-green-700',
    partial: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    not_eligible: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔍</span>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Eligibility Checker</h3>
            <p className="text-[10px] text-gray-400">Check your eligibility for government schemes / पात्रता जांचें</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ec-age" className="text-xs font-semibold text-gray-600 block mb-1">Age / आयु</label>
            <input
              id="ec-age"
              type="number"
              min={0}
              max={120}
              value={input.age}
              onChange={(e) => update('age', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 35"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Enter your age"
            />
          </div>
          <div>
            <label htmlFor="ec-gender" className="text-xs font-semibold text-gray-600 block mb-1">Gender / लिंग</label>
            <select
              id="ec-gender"
              value={input.gender}
              onChange={(e) => update('gender', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Select your gender"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>
          <div>
            <label htmlFor="ec-category" className="text-xs font-semibold text-gray-600 block mb-1">Category / श्रेणी</label>
            <select
              id="ec-category"
              value={input.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            <label htmlFor="ec-income" className="text-xs font-semibold text-gray-600 block mb-1">Annual Income (Rs.) / वार्षिक आय</label>
            <input
              id="ec-income"
              type="number"
              min={0}
              value={input.annualIncome}
              onChange={(e) => update('annualIncome', e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 200000"
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Enter your annual income"
            />
          </div>
          <div>
            <label htmlFor="ec-occupation" className="text-xs font-semibold text-gray-600 block mb-1">Occupation / व्यवसाय</label>
            <select
              id="ec-occupation"
              value={input.occupation}
              onChange={(e) => update('occupation', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Select occupation"
            >
              <option value="">Select</option>
              <option value="farmer">Farmer</option>
              <option value="student">Student</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
              <option value="homemaker">Homemaker</option>
              <option value="daily_wage">Daily Wage</option>
            </select>
          </div>
          <div>
            <label htmlFor="ec-state" className="text-xs font-semibold text-gray-600 block mb-1">State / राज्य</label>
            <select
              id="ec-state"
              value={input.state}
              onChange={(e) => update('state', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Select your state"
            >
              <option value="">Select</option>
              <option value="andhra_pradesh">Andhra Pradesh</option>
              <option value="bihar">Bihar</option>
              <option value="gujarat">Gujarat</option>
              <option value="karnataka">Karnataka</option>
              <option value="madhya_pradesh">Madhya Pradesh</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="rajasthan">Rajasthan</option>
              <option value="tamil_nadu">Tamil Nadu</option>
              <option value="uttar_pradesh">Uttar Pradesh</option>
              <option value="west_bengal">West Bengal</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            disabled={!result}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Check eligibility"
          >
            Check Eligibility / पात्रता जांचें
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Clear all fields"
          >
            Clear
          </button>
        </div>

        {showResult && result && (
          <div
            className={`rounded-xl border p-4 ${statusColors[result.status]}`}
            role="alert"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">
                {result.status === 'eligible' ? '✅' : result.status === 'partial' ? '⚠️' : '❌'}
              </span>
              <div>
                <p className="text-sm font-bold">{result.label}</p>
                <p className="text-xs opacity-75">{result.labelHindi}</p>
              </div>
            </div>
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
