'use client';

/**
 * ==========================================================
 * COMPLAINTS MODULE — FROZEN
 * ----------------------------------------------------------
 * Production Complete.
 * No further feature development.
 * Bug fixes only.
 * ==========================================================
 */

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@/hooks/useMutation';
import { complaintService } from '@/lib/services/complaintService';
import { invalidateComplaints } from '@/lib/cache/invalidation';
import { useComplaintDraft } from '@/hooks/useComplaintDraft';
import { addComplaintNotification } from '@/components/complaints/ComplaintNotificationButton';
import AttachmentManager from '@/components/complaints/AttachmentManager';
import type { CreateComplaintInput, ComplaintPriority } from '@/lib/services/complaintService';
import type { DraftData } from '@/hooks/useComplaintDraft';

const CATEGORIES = [
  { value: 'road', label: 'Road Issue', labelHindi: 'सड़क समस्या', icon: '🛣️', color: '#795548' },
  { value: 'water', label: 'Water Supply', labelHindi: 'पानी की समस्या', icon: '💧', color: '#1565C0' },
  { value: 'electricity', label: 'Electricity', labelHindi: 'बिजली की समस्या', icon: '⚡', color: '#F57F17' },
  { value: 'sanitation', label: 'Sanitation', labelHindi: 'स्वच्छता', icon: '🚽', color: '#2E7D32' },
  { value: 'drainage', label: 'Drainage', labelHindi: 'जल निकासी', icon: '🌊', color: '#00838F' },
  { value: 'streetlight', label: 'Street Light', labelHindi: 'स्ट्रीट लाइट', icon: '💡', color: '#FF8F00' },
  { value: 'garbage', label: 'Garbage', labelHindi: 'कचरा', icon: '🗑️', color: '#4E342E' },
  { value: 'other', label: 'Other', labelHindi: 'अन्य', icon: '📋', color: '#6A1B9A' },
];

const PRIORITIES: { value: ComplaintPriority; label: string; labelHindi: string; color: string }[] = [
  { value: 'low', label: 'Low', labelHindi: 'कम', color: '#4CAF50' },
  { value: 'medium', label: 'Medium', labelHindi: 'मध्यम', color: '#FF9800' },
  { value: 'high', label: 'High', labelHindi: 'उच्च', color: '#F44336' },
  { value: 'urgent', label: 'Urgent', labelHindi: 'तत्काल', color: '#B71C1C' },
];

interface FormData {
  category: string;
  title: string;
  description: string;
  address: string;
  village: string;
  block: string;
  district: string;
  state: string;
  pincode: string;
  priority: ComplaintPriority;
}

interface FormErrors {
  category?: string;
  title?: string;
  description?: string;
  village?: string;
  district?: string;
  state?: string;
  pincode?: string;
  photo?: string;
  location?: string;
}

const INITIAL_FORM: FormData = {
  category: '',
  title: '',
  description: '',
  address: '',
  village: '',
  block: '',
  district: '',
  state: '',
  pincode: '',
  priority: 'medium',
};

export default function ComplaintForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showDraftBanner, setShowDraftBanner] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem('gs_complaint_draft');
        return raw !== null;
      } catch { return false; }
    }
    return false;
  });

  const draft = useComplaintDraft({
    onRestore: useCallback((d: DraftData) => {
      setForm({
        category: d.category || '',
        title: d.title || '',
        description: d.description || '',
        address: d.address || '',
        village: d.village || '',
        block: d.block || '',
        district: d.district || '',
        state: d.state || '',
        pincode: d.pincode || '',
        priority: (d.priority as ComplaintPriority) || 'medium',
      });
      setPhotoUrls(d.photoUrls || []);
      setStep(d.step || 1);
      setShowDraftBanner(false);
    }, []),
  });

  useEffect(() => {
    draft.updateData({
      ...form,
      photoUrls,
      step,
      savedAt: new Date().toISOString(),
    });
  }, [form, photoUrls, step, draft]);

  const { mutate: createComplaint, isLoading: isSubmitting } = useMutation(
    async (input: CreateComplaintInput) => {
      return complaintService.create(input);
    },
    {
      onSuccess: (data) => {
        invalidateComplaints();
        draft.discardDraft();
        addComplaintNotification({
          complaintId: data.id,
          title: 'Complaint Submitted',
          message: `Your complaint "${form.title}" has been submitted successfully.`,
          type: 'created',
        });
        router.push('/complaints');
      },
    },
  );

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const captureLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({ ...prev, location: 'Geolocation not supported' }));
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
        setErrors((prev) => ({ ...prev, location: undefined }));
      },
      () => {
        setGpsLoading(false);
        setErrors((prev) => ({ ...prev, location: 'Could not get location' }));
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  const validate = useCallback((): boolean => {
    const e: FormErrors = {};
    if (!form.category) e.category = 'Select a category';
    if (!form.title.trim()) e.title = 'Title required';
    else if (form.title.length > 200) e.title = 'Max 200 chars';
    if (!form.description.trim()) e.description = 'Description required';
    else if (form.description.length > 2000) e.description = 'Max 2000 chars';
    if (!form.village.trim()) e.village = 'Village required';
    if (!form.district.trim()) e.district = 'District required';
    if (!form.state.trim()) e.state = 'State required';
    if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = '6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const fullAddress = [form.address, form.village, form.block, form.district, form.state, form.pincode]
      .filter(Boolean).join(', ');

    await createComplaint({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      address: fullAddress,
      village: form.village.trim() || undefined,
      block: form.block.trim() || undefined,
      district: form.district.trim() || undefined,
      state: form.state.trim() || undefined,
      pincode: form.pincode.trim() || undefined,
      photo_url: photoUrls[0] || undefined,
      photo_urls: photoUrls.length > 0 ? photoUrls : undefined,
      priority: form.priority,
      latitude: gpsCoords?.lat,
      longitude: gpsCoords?.lng,
    });
  }, [form, photoUrls, gpsCoords, validate, createComplaint]);

  const inputClass = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all';
  const labelClass = 'text-sm font-medium text-gray-700 mb-1.5 block';
  const errorClass = 'text-xs text-red-500 mt-1';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Draft Banner */}
      {showDraftBanner && draft.savedDraft && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between" role="alert">
          <div>
            <p className="text-xs font-medium text-blue-700">Draft found</p>
            <p className="text-xs text-blue-500">Saved {new Date(draft.savedDraft.savedAt).toLocaleString('en-IN')}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { draft.restoreDraft(); setShowDraftBanner(false); }} className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Restore</button>
            <button type="button" onClick={() => { draft.discardDraft(); setShowDraftBanner(false); }} className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:underline">Discard</button>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2" role="group" aria-label="Form steps">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step >= s ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-500'
              }`}
              aria-current={step === s ? 'step' : undefined}
            >
              {s}
            </div>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-amber-700' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Category & Priority */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Category / श्रेणी *</h2>
            <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Category">
              {CATEGORIES.map((cat) => (
                <button key={cat.value} type="button" onClick={() => updateField('category', cat.value)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all ${form.category === cat.value ? 'shadow-md' : 'border-transparent bg-white'}`}
                  style={form.category === cat.value ? { borderColor: cat.color, backgroundColor: cat.color + '15' } : {}}
                  role="radio" aria-checked={form.category === cat.value}>
                  <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{cat.label}</span>
                  <span className="text-xs text-gray-400 text-center leading-tight">{cat.labelHindi}</span>
                </button>
              ))}
            </div>
            {errors.category && <p className={errorClass} role="alert">{errors.category}</p>}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Priority / प्राथमिकता</h2>
            <div className="flex gap-2" role="radiogroup" aria-label="Priority">
              {PRIORITIES.map((p) => (
                <button key={p.value} type="button" onClick={() => updateField('priority', p.value)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all ${form.priority === p.value ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  style={form.priority === p.value ? { backgroundColor: p.color, borderColor: p.color } : {}}
                  role="radio" aria-checked={form.priority === p.value}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={() => { if (!form.category) { setErrors({ category: 'Select a category' }); return; } setStep(2); }}
            className="w-full py-3.5 rounded-xl text-white font-bold text-base bg-amber-700 hover:bg-amber-800 transition-colors">
            Next / अगला →
          </button>
        </div>
      )}

      {/* Step 2: Details + Photos */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="complaint-title" className={labelClass}>Title / शीर्षक *</label>
            <input id="complaint-title" type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)}
              placeholder="Brief title" maxLength={200} className={inputClass}
              aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-err' : undefined} />
            <div className="flex justify-between">
              {errors.title && <p id="title-err" className={errorClass} role="alert">{errors.title}</p>}
              <span className="text-xs text-gray-400 ml-auto">{form.title.length}/200</span>
            </div>
          </div>

          <div>
            <label htmlFor="complaint-desc" className={labelClass}>Description / विवरण *</label>
            <textarea id="complaint-desc" value={form.description} onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the issue..." rows={4} maxLength={2000} className={`${inputClass} resize-none`}
              aria-invalid={!!errors.description} aria-describedby={errors.description ? 'desc-err' : undefined} />
            <div className="flex justify-between">
              {errors.description && <p id="desc-err" className={errorClass} role="alert">{errors.description}</p>}
              <span className="text-xs text-gray-400 ml-auto">{form.description.length}/2000</span>
            </div>
          </div>

          <div>
            <label className={labelClass}>Photos / फोटो</label>
            <AttachmentManager existingUrls={photoUrls} onChange={setPhotoUrls} />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              ← Back
            </button>
            <button type="button" onClick={() => { if (!form.title.trim()) { setErrors({ title: 'Title required' }); return; } if (!form.description.trim()) { setErrors({ description: 'Description required' }); return; } setStep(3); }}
              className="flex-1 py-3 rounded-xl text-white font-bold text-sm bg-amber-700 hover:bg-amber-800 transition-colors">
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="complaint-village" className={labelClass}>Village / गाँव *</label>
            <input id="complaint-village" type="text" value={form.village} onChange={(e) => updateField('village', e.target.value)}
              placeholder="Village name" className={inputClass} aria-invalid={!!errors.village} />
            {errors.village && <p className={errorClass} role="alert">{errors.village}</p>}
          </div>

          <div>
            <label htmlFor="complaint-block" className={labelClass}>Block / प्रखंड</label>
            <input id="complaint-block" type="text" value={form.block} onChange={(e) => updateField('block', e.target.value)}
              placeholder="Block (optional)" className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="complaint-district" className={labelClass}>District / जिला *</label>
              <input id="complaint-district" type="text" value={form.district} onChange={(e) => updateField('district', e.target.value)}
                className={inputClass} aria-invalid={!!errors.district} />
              {errors.district && <p className={errorClass} role="alert">{errors.district}</p>}
            </div>
            <div>
              <label htmlFor="complaint-state" className={labelClass}>State / राज्य *</label>
              <input id="complaint-state" type="text" value={form.state} onChange={(e) => updateField('state', e.target.value)}
                className={inputClass} aria-invalid={!!errors.state} />
              {errors.state && <p className={errorClass} role="alert">{errors.state}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="complaint-pincode" className={labelClass}>Pincode / पिनकोड</label>
              <input id="complaint-pincode" type="text" inputMode="numeric" value={form.pincode}
                onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit" maxLength={6} className={inputClass} aria-invalid={!!errors.pincode} />
              {errors.pincode && <p className={errorClass} role="alert">{errors.pincode}</p>}
            </div>
            <div>
              <label htmlFor="complaint-address" className={labelClass}>Address / पता</label>
              <input id="complaint-address" type="text" value={form.address} onChange={(e) => updateField('address', e.target.value)}
                placeholder="Street/House No." className={inputClass} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">GPS Location</span>
              <button type="button" onClick={captureLocation} disabled={gpsLoading}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50">
                {gpsLoading ? 'Getting...' : gpsCoords ? '✓ Captured' : '📍 Capture'}
              </button>
            </div>
            {gpsCoords && <p className="text-xs text-gray-500">Lat: {gpsCoords.lat.toFixed(6)}, Lng: {gpsCoords.lng.toFixed(6)}</p>}
            {errors.location && <p className={errorClass} role="alert">{errors.location}</p>}
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              ← Back
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl text-white font-bold text-sm bg-amber-700 hover:bg-amber-800 transition-colors disabled:opacity-70">
              {isSubmitting ? 'Submitting...' : 'Submit / दर्ज करें'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
