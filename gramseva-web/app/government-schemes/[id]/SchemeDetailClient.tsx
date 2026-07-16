'use client';

/**
 * Government Schemes Module — FROZEN
 * No further feature development. Bug fixes only.
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@/hooks/useQuery';
import { schemeService, type Scheme } from '@/lib/services/schemeService';
import { queryKeys } from '@/lib/queryKeys';
import { SCHEME_STALE_TIME } from '@/lib/constants/api';
import { schemeDisplayMeta } from '@/lib/scheme-display';
import {
  BackButton,
  Breadcrumb,
  ErrorAlert,
  LoadingSpinner,
} from '@/components/agriculture';
import BookmarkButton from '@/components/government-schemes/BookmarkButton';
import NotificationButton from '@/components/government-schemes/NotificationButton';
import SmartBadges from '@/components/government-schemes/SmartBadges';
import EligibilityChecker from '@/components/government-schemes/EligibilityChecker';

function enrichScheme(record: Scheme) {
  const meta = schemeDisplayMeta[record.id];
  return {
    ...record,
    title: meta?.title || record.id.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    titleHindi: meta?.titleHindi || '',
    icon: meta?.icon || '📄',
    color: meta?.color || '#1565C0',
    isFeatured: meta?.featured || false,
  };
}

interface DetailSectionProps {
  icon: string;
  title: string;
  titleHindi: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

function DetailSection({ icon, title, titleHindi, children, defaultExpanded = true }: DetailSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" role="region" aria-label={title}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400"
        aria-expanded={expanded}
        aria-controls={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">{icon}</span>
          <div>
            <h3 className="text-sm font-bold text-gray-800">{title}</h3>
            <p className="text-[10px] text-gray-400">{titleHindi}</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`} className="px-4 pb-4 border-t border-gray-50 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

function JsonList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className="text-xs text-gray-400 italic" aria-label="Not specified">Not specified</p>;
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
          <span className="text-blue-500 mt-0.5 flex-shrink-0" aria-hidden="true">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ShareActions({ title, schemeId }: { title: string; schemeId: string }) {
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/government-schemes/${schemeId}`;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* clipboard not available */ }
    }
  }, [title, schemeId]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/government-schemes/${schemeId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }, [schemeId]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={handleShare}
        className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={`Share ${title}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share
      </button>
      <button
        onClick={handleCopyLink}
        className="flex-1 min-w-[80px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Copy Link
          </>
        )}
      </button>
      <button
        onClick={handlePrint}
        className="flex-1 min-w-[60px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Print this page"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print
      </button>
      <button
        onClick={async () => {
          setPdfLoading(true);
          try {
            const { default: jsPDF } = await import('jspdf');
            const doc = new jsPDF('p', 'mm', 'a4');
            doc.setFontSize(18);
            doc.text(title, 20, 20);
            doc.setFontSize(10);
            doc.text('Generated by GramSeva Portal', 20, 28);
            doc.setFontSize(12);
            let y = 40;
            doc.setFontSize(14);
            doc.text('This PDF generation requires a server-side solution for full content.', 20, y);
            y += 10;
            doc.text('Use the Print button for a complete formatted view.', 20, y);
            doc.save(`${title.replace(/\s+/g, '_')}_GramSeva.pdf`);
          } catch (e) {
            console.error('PDF generation failed', e);
          } finally {
            setPdfLoading(false);
          }
        }}
        disabled={pdfLoading}
        className="flex-1 min-w-[60px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Download PDF"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {pdfLoading ? 'Loading...' : 'PDF'}
      </button>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(targetDate).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return <span className="text-xs font-semibold text-red-600">Closed</span>;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);

  let status: string;
  let color: string;
  if (days <= 0) {
    status = 'Closing Soon';
    color = 'text-red-600';
  } else if (days < 30) {
    status = 'Closing Soon';
    color = 'text-orange-600';
  } else if (days < 90) {
    status = 'Open';
    color = 'text-green-600';
  } else {
    status = 'Open';
    color = 'text-green-600';
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold ${color}`}>{status}</span>
      <span className="text-xs text-gray-500">
        {days}d {hours}h remaining
      </span>
    </div>
  );
}

function DeadlineSection({ start, end }: { start?: string; end?: string }) {
  const [now] = useState(() => Date.now());

  if (!start && !end) return null;

  let status: { label: string; labelHindi: string; color: string; icon: string };

  if (start && end) {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    if (now < startTime) {
      status = { label: 'Opens Soon', labelHindi: 'जल्द शुरू', color: 'text-blue-600', icon: '🔜' };
    } else if (now <= endTime) {
      const daysLeft = (endTime - now) / 86400000;
      if (daysLeft <= 30) {
        status = { label: 'Closing Soon', labelHindi: 'जल्द बंद', color: 'text-red-600', icon: '🔥' };
      } else {
        status = { label: 'Open', labelHindi: 'खुला', color: 'text-green-600', icon: '✅' };
      }
    } else {
      status = { label: 'Closed', labelHindi: 'बंद', color: 'text-gray-500', icon: '🔒' };
    }
  } else if (end && now > new Date(end).getTime()) {
    status = { label: 'Closed', labelHindi: 'बंद', color: 'text-gray-500', icon: '🔒' };
  } else if (end) {
    status = { label: 'Open', labelHindi: 'खुला', color: 'text-green-600', icon: '✅' };
  } else {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{status.icon}</span>
        <div className="flex-1">
          <p className={`text-sm font-bold ${status.color}`}>{status.label}</p>
          <p className="text-[10px] text-gray-400">{status.labelHindi}</p>
        </div>
        {start && (
          <div className="text-right">
            <p className="text-[10px] text-gray-500">Start</p>
            <p className="text-xs font-semibold">{new Date(start).toLocaleDateString('en-IN')}</p>
          </div>
        )}
        {end && (
          <div className="text-right">
            <p className="text-[10px] text-gray-500">End</p>
            <p className="text-xs font-semibold">{new Date(end).toLocaleDateString('en-IN')}</p>
          </div>
        )}
        {end && now < new Date(end).getTime() && (
          <CountdownTimer targetDate={end} />
        )}
      </div>
    </div>
  );
}

function RelatedDocs({ scheme }: { scheme: Scheme }) {
  const docs: { label: string; url: string; type: string }[] = [];

  if (scheme.official_website_url) {
    docs.push({ label: 'Official Website', url: scheme.official_website_url, type: 'link' });
  }
  if (scheme.apply_online_url) {
    docs.push({ label: 'Apply Online', url: scheme.apply_online_url, type: 'link' });
  }

  if (docs.length === 0) {
    return (
      <DetailSection icon="📁" title="Related Documents" titleHindi="संबंधित दस्तावेज़" defaultExpanded={false}>
        <div className="text-center py-4">
          <span className="text-3xl">📭</span>
          <p className="text-xs text-gray-400 mt-2">No documents available</p>
          <p className="text-[10px] text-gray-400">कोई दस्तावेज़ उपलब्ध नहीं</p>
        </div>
      </DetailSection>
    );
  }

  return (
    <DetailSection icon="📁" title="Related Documents" titleHindi="संबंधित दस्तावेज़">
      <div className="space-y-2">
        {docs.map((doc, i) => (
          <a
            key={i}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <span className="text-lg" aria-hidden="true">
              {doc.type === 'link' ? '🔗' : '📄'}
            </span>
            <div>
              <p className="text-xs font-semibold text-gray-800">{doc.label}</p>
              <p className="text-[10px] text-blue-600 truncate max-w-[200px] sm:max-w-sm">{doc.url}</p>
            </div>
          </a>
        ))}
      </div>
    </DetailSection>
  );
}

interface SchemeDetailClientProps {
  schemeId: string;
}

export default function SchemeDetailClient({ schemeId }: SchemeDetailClientProps) {
  const router = useRouter();

  const {
    data: scheme,
    isLoading,
    error,
    refetch,
  } = useQuery<Scheme>(
    queryKeys.schemes.detail(schemeId),
    () => schemeService.getById(schemeId, ['*']),
    { staleTime: SCHEME_STALE_TIME },
  );

  const {
    data: allSchemes,
  } = useQuery<Scheme[]>(
    queryKeys.schemes.list(),
    () => schemeService.list(),
    { staleTime: SCHEME_STALE_TIME, enabled: !!scheme?.related_schemes },
  );

  const enriched = useMemo(() => scheme ? enrichScheme(scheme) : null, [scheme]);

  const relatedSchemes = useMemo(() => {
    if (!scheme?.related_schemes || !allSchemes) return [];
    return allSchemes
      .filter((s) => scheme.related_schemes?.includes(s.id))
      .map(enrichScheme);
  }, [scheme, allSchemes]);

  if (isLoading) return <div className="min-h-full bg-[#F5F5F5] flex items-center justify-center"><LoadingSpinner message="Loading scheme..." messageHindi="योजना लोड हो रही है..." /></div>;
  if (error) {
    return (
      <div className="min-h-full bg-[#F5F5F5] px-4 py-20">
        <ErrorAlert message={error.message} messageHindi="योजना लोड करने में विफल" onRetry={refetch} />
      </div>
    );
  }
  if (!enriched) {
    return (
      <div className="min-h-full bg-[#F5F5F5] flex items-center justify-center px-4">
        <div className="text-center" role="alert">
          <span className="text-6xl" aria-hidden="true">📭</span>
          <p className="text-sm font-semibold text-gray-700 mt-4">Scheme not found</p>
          <p className="text-xs text-gray-500 mt-1">योजना नहीं मिली</p>
          <button
            onClick={() => router.push('/government-schemes')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            ← Back to Schemes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="px-5 pt-6 pb-8 text-white" style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
        <div className="flex items-center gap-3 mb-0.5">
          <BackButton className="!text-white !bg-white/20 hover:!bg-white/30 !border-0" />
          <span className="text-3xl" aria-hidden="true">{enriched.icon}</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">{enriched.title}</h1>
            {enriched.titleHindi && (
              <p className="text-blue-100 text-sm mt-0.5">{enriched.titleHindi}</p>
            )}
          </div>
        </div>
        {enriched.category && (
          <div className="mt-2 ml-14 flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-medium capitalize inline-block">
              {enriched.category}
            </span>
            <SmartBadges scheme={{
              id: enriched.id,
              created_at: enriched.created_at,
              updated_at: enriched.updated_at,
              last_date: enriched.last_date,
              isFeatured: enriched.isFeatured,
            }} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 ml-14 flex-wrap">
          <BookmarkButton schemeId={schemeId} />
          <NotificationButton schemeId={schemeId} />
        </div>

        {/* Share + PDF Row */}
        <div className="mt-3 ml-14">
          <ShareActions title={enriched.title} schemeId={schemeId} />
        </div>

        {/* Last Updated */}
        {enriched.updated_at && (
          <p className="text-[10px] text-blue-200 mt-2 ml-14">
            Last updated: {new Date(enriched.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'GovernmentService',
            name: enriched.title,
            description: enriched.about || '',
            serviceType: enriched.category || 'Government Scheme',
            provider: {
              '@type': 'GovernmentOrganization',
              name: 'Government of India',
            },
            audience: enriched.eligibility || undefined,
            areaServed: { '@type': 'Country', name: 'India' },
            ...(enriched.official_website_url && { url: enriched.official_website_url }),
            ...(enriched.helpline && { contactPoint: { '@type': 'ContactPoint', telephone: enriched.helpline } }),
          }),
        }}
      />

      {/* FAQ Schema */}
      {enriched.faqs && enriched.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: enriched.faqs.map((faq) => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
              })),
            }),
          }}
        />
      )}

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
              { '@type': 'ListItem', position: 2, name: 'Government Schemes', item: '/government-schemes' },
              { '@type': 'ListItem', position: 3, name: enriched.title, item: `/government-schemes/${schemeId}` },
            ],
          }),
        }}
      />

      <Breadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Government Schemes', href: '/government-schemes' },
        { label: enriched.title },
      ]} />

      <div className="px-4 py-4 space-y-4 print:px-0">
        {/* Deadline Section */}
        {(enriched.last_date) && (
          <DeadlineSection start={enriched.last_date} end={enriched.last_date} />
        )}

        {/* Eligibility Checker */}
        <EligibilityChecker />

        {/* About */}
        {enriched.about && (
          <DetailSection icon="📖" title="Description" titleHindi="विवरण">
            <p className="text-sm text-gray-700 leading-relaxed">{enriched.about}</p>
          </DetailSection>
        )}

        {/* Objective */}
        {enriched.objective && (
          <DetailSection icon="🎯" title="Objective" titleHindi="उद्देश्य">
            <p className="text-sm text-gray-700 leading-relaxed">{enriched.objective}</p>
          </DetailSection>
        )}

        {/* Who Can Apply */}
        {enriched.who_can_apply && enriched.who_can_apply.length > 0 && (
          <DetailSection icon="👤" title="Who Can Apply" titleHindi="कौन आवेदन कर सकता है">
            <JsonList items={enriched.who_can_apply} />
          </DetailSection>
        )}

        {/* Eligibility */}
        {enriched.eligibility && enriched.eligibility.length > 0 && (
          <DetailSection icon="✅" title="Eligibility" titleHindi="पात्रता">
            <JsonList items={enriched.eligibility} />
          </DetailSection>
        )}

        {/* Not Eligible */}
        {enriched.not_eligible && enriched.not_eligible.length > 0 && (
          <DetailSection icon="❌" title="Not Eligible" titleHindi="अपात्र">
            <JsonList items={enriched.not_eligible} />
          </DetailSection>
        )}

        {/* Documents */}
        {enriched.documents && enriched.documents.length > 0 && (
          <DetailSection icon="📄" title="Required Documents" titleHindi="आवश्यक दस्तावेज़">
            <JsonList items={enriched.documents} />
          </DetailSection>
        )}

        {/* Benefits */}
        {enriched.benefits && enriched.benefits.length > 0 && (
          <DetailSection icon="🎁" title="Benefits" titleHindi="लाभ" defaultExpanded={true}>
            <JsonList items={enriched.benefits} />
          </DetailSection>
        )}

        {/* Application Process */}
        {enriched.apply_process && enriched.apply_process.length > 0 && (
          <DetailSection icon="📝" title="Application Process" titleHindi="आवेदन प्रक्रिया">
            <ol className="space-y-2">
              {enriched.apply_process.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </DetailSection>
        )}

        {/* Apply Online */}
        {enriched.apply_online_url && (
          <DetailSection icon="🌐" title="Apply Online" titleHindi="ऑनलाइन आवेदन">
            <a
              href={enriched.apply_online_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Apply Now / अभी आवेदन करें
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </DetailSection>
        )}

        {/* Apply Offline */}
        {enriched.apply_offline && enriched.apply_offline.length > 0 && (
          <DetailSection icon="🏢" title="Apply Offline" titleHindi="ऑफलाइन आवेदन">
            <JsonList items={enriched.apply_offline} />
          </DetailSection>
        )}

        {/* Last Date */}
        {enriched.last_date && (
          <DetailSection icon="📅" title="Last Date" titleHindi="अंतिम तिथि">
            <p className="text-sm font-semibold text-orange-600">{enriched.last_date}</p>
          </DetailSection>
        )}

        {/* Helpline */}
        {enriched.helpline && (
          <DetailSection icon="📞" title="Helpline" titleHindi="हेल्पलाइन">
            <a
              href={`tel:${enriched.helpline.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {enriched.helpline}
            </a>
          </DetailSection>
        )}

        {/* Official Website */}
        {enriched.official_website_url && (
          <DetailSection icon="🔗" title="Official Website" titleHindi="आधिकारिक वेबसाइट">
            <a
              href={enriched.official_website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 underline break-all focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
            >
              {enriched.official_website_url}
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </DetailSection>
        )}

        {/* FAQs */}
        {enriched.faqs && enriched.faqs.length > 0 && (
          <DetailSection icon="❓" title="FAQs" titleHindi="सामान्य प्रश्न">
            <div className="space-y-3" role="list">
              {enriched.faqs.map((faq, i) => (
                <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0" role="listitem">
                  <p className="text-xs font-semibold text-gray-800 mb-1">Q{i + 1}: {faq.q}</p>
                  <p className="text-xs text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {/* Related Documents */}
        <RelatedDocs scheme={enriched as Scheme} />

        {/* Related Schemes */}
        {relatedSchemes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" role="region" aria-label="Related Schemes">
            <div className="p-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">🔗</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Related Schemes</h3>
                  <p className="text-[10px] text-gray-400">संबंधित योजनाएं</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedSchemes.map((rs) => (
                  <Link
                    key={rs.id}
                    href={`/government-schemes/${rs.id}`}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                      style={{ backgroundColor: rs.color + '20' }}
                    >
                      {rs.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{rs.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{rs.titleHindi}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
