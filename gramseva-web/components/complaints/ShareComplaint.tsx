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

import { useState, useCallback } from 'react';
import type { Complaint } from '@/lib/services/complaintService';

interface ShareComplaintProps {
  complaint: Complaint;
}

export default function ShareComplaint({ complaint }: ShareComplaintProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getShareUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/complaints/${complaint.id}`;
    }
    return `/complaints/${complaint.id}`;
  }, [complaint.id]);

  const shareText = `Complaint: ${complaint.title} — Status: ${complaint.status}`;

  const handleShare = useCallback(async () => {
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: complaint.title, text: shareText, url });
      } catch {
        // User cancelled
      }
    } else {
      setShowMenu(!showMenu);
    }
  }, [complaint.title, shareText, getShareUrl, showMenu]);

  const handleCopyLink = useCallback(async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
    setShowMenu(false);
  }, [getShareUrl]);

  const handlePrint = useCallback(() => {
    window.print();
    setShowMenu(false);
  }, []);

  const handleExportPdf = useCallback(async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text('GramSeva - Complaint Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Complaint ID: ${complaint.id}`, 15, 35);
    doc.text(`Title: ${complaint.title}`, 15, 42);
    doc.text(`Category: ${complaint.category}`, 15, 49);
    doc.text(`Status: ${complaint.status}`, 15, 56);
    doc.text(`Priority: ${complaint.priority || 'N/A'}`, 15, 63);
    doc.text(`Created: ${complaint.created_at || 'N/A'}`, 15, 70);

    doc.setFontSize(11);
    doc.text('Description:', 15, 82);
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(complaint.description || '', pageWidth - 30);
    doc.text(descLines, 15, 89);

    let y = 89 + descLines.length * 5 + 5;
    doc.setFontSize(11);
    doc.text('Location:', 15, y);
    doc.setFontSize(10);
    y += 7;
    if (complaint.village) { doc.text(`Village: ${complaint.village}`, 15, y); y += 7; }
    if (complaint.district) { doc.text(`District: ${complaint.district}`, 15, y); y += 7; }
    if (complaint.state) { doc.text(`State: ${complaint.state}`, 15, y); y += 7; }
    if (complaint.address) { doc.text(`Address: ${complaint.address}`, 15, y); y += 7; }

    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 15, doc.internal.pageSize.getHeight() - 15);

    doc.save(`${complaint.title || 'complaint'}_GramSeva.pdf`);
    setShowMenu(false);
  }, [complaint]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        aria-label="Share complaint"
      >
        <span aria-hidden="true">📤</span>
        Share
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden" role="menu">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left"
            role="menuitem"
          >
            <span aria-hidden="true">{copied ? '✅' : '📋'}</span>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left"
            role="menuitem"
          >
            <span aria-hidden="true">🖨️</span>
            Print
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors text-left"
            role="menuitem"
          >
            <span aria-hidden="true">📄</span>
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
}
