/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { queryKeys } from '@/lib/queryKeys';
import { adminService } from '@/lib/services/adminService';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import SearchBar from '@/components/admin/SearchBar';
import Pagination from '@/components/admin/Pagination';
import ExportButton from '@/components/admin/ExportButton';
import type { PaginatedResponse } from '@/types/api';

type FieldType = 'text' | 'textarea' | 'select' | 'number';

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

interface ContentEditorProps {
  table: string;
  title: string;
  fields: FieldDef[];
}

type FormValues = Record<string, string>;

interface ValidationErrors {
  [fieldKey: string]: string;
}

function buildEmptyForm(fields: FieldDef[]): FormValues {
  const values: FormValues = {};
  for (const f of fields) {
    values[f.key] = '';
  }
  if (!fields.some((f) => f.key === 'status')) {
    values['status'] = 'draft';
  }
  return values;
}

function validateForm(values: FormValues, fields: FieldDef[]): ValidationErrors {
  const errors: ValidationErrors = {};
  for (const f of fields) {
    if (f.required && !values[f.key]?.trim()) {
      errors[f.key] = `${f.label} is required`;
    }
  }
  return errors;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

function RichTextEditor({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (ref.current && !isInternalUpdate.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
    isInternalUpdate.current = false;
  }, [value]);

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
        <div className="flex gap-1 px-2 py-1.5 border-b border-gray-100 bg-gray-50">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold'); }}
            className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-300"
            aria-label="Bold"
          >
            B
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic'); }}
            className="px-2 py-0.5 text-xs italic text-gray-600 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-300"
            aria-label="Italic"
          >
            I
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertUnorderedList'); }}
            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-300"
            aria-label="Bullet list"
          >
            &bull; List
          </button>
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertOrderedList'); }}
            className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-300"
            aria-label="Numbered list"
          >
            1. List
          </button>
        </div>
        <div
          ref={ref}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label={label}
          className="min-h-[120px] max-h-[300px] overflow-y-auto px-3 py-2 text-sm text-gray-800 outline-none empty:before:content-['Enter_content...'] empty:before:text-gray-300"
          onInput={() => {
            isInternalUpdate.current = true;
            onChange(ref.current?.innerHTML ?? '');
          }}
          onBlur={() => {
            isInternalUpdate.current = true;
            onChange(ref.current?.innerHTML ?? '');
          }}
          suppressContentEditableWarning
        />
      </div>
    </div>
  );
}

function ImageUrlInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
        aria-label={label}
      />
      {value && (
        <div className="mt-2 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover rounded-xl border border-gray-100"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}
    </div>
  );
}

function PreviewContent({ values, fields }: { values: FormValues; fields: FieldDef[] }) {
  return (
    <div className="space-y-4">
      {fields.map((f) => {
        const val = values[f.key];
        if (!val) return null;
        if (f.key.includes('image') || f.key.includes('thumbnail') || f.key.includes('url')) {
          return (
            <div key={f.key}>
              <p className="text-xs font-medium text-gray-500 mb-1">{f.label}</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={val} alt={f.label} className="w-full max-h-48 object-cover rounded-xl border border-gray-100" />
            </div>
          );
        }
        if (f.type === 'textarea') {
          return (
            <div key={f.key}>
              <p className="text-xs font-medium text-gray-500 mb-1">{f.label}</p>
              <div className="text-sm text-gray-700 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: val }} />
            </div>
          );
        }
        return (
          <div key={f.key}>
            <p className="text-xs font-medium text-gray-500 mb-1">{f.label}</p>
            <p className="text-sm text-gray-800">{val}</p>
          </div>
        );
      })}
      {values['status'] && (
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${values['status'] === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {values['status'] === 'published' ? 'Published' : 'Draft'}
        </span>
      )}
    </div>
  );
}

export default function ContentEditor({ table, title, fields }: ContentEditorProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(() => buildEmptyForm(fields));
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [previewMode, setPreviewMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; label: string } | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const pageSize = 10;

  const fetchData = useCallback(async (): Promise<PaginatedResponse<Record<string, unknown>>> => {
    return adminService.getContent(table, { page, limit: pageSize });
  }, [table, page]);

  const { data, isLoading, isFetching, refetch } = useQuery<PaginatedResponse<Record<string, unknown>>>(
    queryKeys.admin.content(table),
    fetchData,
    { staleTime: 30_000 },
  );

  const records = useMemo(() => data?.data ?? [], [data]);
  const totalPages = data?.totalPages ?? 0;

  const filteredRecords = search.trim()
    ? records.filter((r) => {
        const q = search.toLowerCase();
        return fields.some((f) => {
          const v = r[f.key];
          return typeof v === 'string' && v.toLowerCase().includes(q);
        });
      })
    : records;

  const openCreate = useCallback(() => {
    setEditingId(null);
    setFormValues(buildEmptyForm(fields));
    setFormErrors({});
    setPreviewMode(false);
    setModalOpen(true);
  }, [fields]);

  const openEdit = useCallback((record: Record<string, unknown>) => {
    setEditingId(String(record.id ?? ''));
    const values: FormValues = {};
    for (const f of fields) {
      values[f.key] = typeof record[f.key] === 'string' ? String(record[f.key]) : '';
    }
    if ('status' in record) {
      values['status'] = String(record['status'] ?? 'draft');
    } else if (!values['status']) {
      values['status'] = 'draft';
    }
    setFormValues(values);
    setFormErrors({});
    setPreviewMode(false);
    setModalOpen(true);
  }, [fields]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
    setPreviewMode(false);
  }, []);

  const handleFormChange = useCallback((key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const errors = validateForm(formValues, fields);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setMutationLoading(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        payload[f.key] = formValues[f.key] || '';
      }
      if ('status' in formValues || !fields.some((f) => f.key === 'status')) {
        payload['status'] = formValues['status'] || 'draft';
      }

      if (editingId) {
        await adminService.updateContent(table, editingId, payload);
      } else {
        await adminService.createContent(table, payload);
      }
      closeModal();
      refetch();
    } catch {
      // error handled by UI state
    } finally {
      setMutationLoading(false);
    }
  }, [formValues, fields, editingId, table, closeModal, refetch]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setMutationLoading(true);
    try {
      await adminService.deleteContent(table, deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch {
      // error handled by UI state
    } finally {
      setMutationLoading(false);
    }
  }, [deleteTarget, table, refetch]);

  const handleToggleStatus = useCallback(async (record: Record<string, unknown>) => {
    const currentStatus = String(record['status'] ?? 'draft');
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await adminService.updateContent(table, String(record.id ?? ''), { status: newStatus });
      refetch();
    } catch {
      // error handled by UI state
    }
  }, [table, refetch]);

  const handleExportCSV = useCallback(() => {
    const headers = fields.map((f) => f.label);
    const rows = records.map((r) => fields.map((f) => {
      const val = r[f.key];
      return typeof val === 'string' ? val.replace(/"/g, '""') : '';
    }));
    const csv = [headers.join(','), ...rows.map((row) => `"${row.join('","')}"`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${table}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [fields, records, table]);

  const hasStatusField = fields.some((f) => f.key === 'status');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg font-bold bg-gradient-to-r from-[#1A237E] to-[#3949AB] bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          <ExportButton onExportCSV={handleExportCSV} />
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#1A237E] to-[#3949AB] text-white rounded-xl px-3 py-2 text-xs font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label={`Create new ${title} item`}
          >
            <span aria-hidden="true">+</span> Add New
          </button>
        </div>
      </div>

      <div className="max-w-xs">
        <SearchBar value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}...`} />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" aria-label="Loading content" />
          <p className="text-xs text-gray-400 mt-2">Loading {title.toLowerCase()}...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label={`${title} content table`}>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {fields.slice(0, 4).map((f) => (
                    <th key={f.key} className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">
                      {f.label}
                    </th>
                  ))}
                  {hasStatusField && (
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500" scope="col">Status</th>
                  )}
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell" scope="col">Created</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500" scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={fields.slice(0, 4).length + (hasStatusField ? 1 : 0) + 2}
                      className="px-4 py-12 text-center"
                    >
                      <p className="text-sm text-gray-400">No {title.toLowerCase()} found</p>
                      <button
                        type="button"
                        onClick={openCreate}
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded px-2 py-1"
                      >
                        Create your first one
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => {
                    const id = String(record.id ?? '');
                    return (
                      <tr key={id} className="border-b border-50 hover:bg-gray-50 transition-colors">
                        {fields.slice(0, 4).map((f) => (
                          <td key={f.key} className="px-4 py-3">
                            {f.key.includes('image') || f.key.includes('thumbnail') ? (
                              <div className="flex items-center gap-2">
                                {record[f.key] ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={String(record[f.key])} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400" aria-hidden="true">—</div>
                                )}
                                <span className="text-xs text-gray-600 truncate max-w-[120px]">{String(record[f.key] || '—')}</span>
                              </div>
                            ) : f.type === 'textarea' ? (
                              <span className="text-xs text-gray-600 line-clamp-1 max-w-[180px] block">
                                {String(record[f.key] || '—').replace(/<[^>]*>/g, '')}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-800 truncate max-w-[150px] block">
                                {String(record[f.key] || '—')}
                              </span>
                            )}
                          </td>
                        ))}
                        {hasStatusField && (
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(record)}
                              className={`text-xs px-2 py-0.5 rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 ${record['status'] === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                              aria-label={`Toggle status: currently ${record['status'] === 'published' ? 'published' : 'draft'}`}
                            >
                              {record['status'] === 'published' ? 'Published' : 'Draft'}
                            </button>
                          </td>
                        )}
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs text-gray-500">{formatDate(String(record['created_at'] ?? ''))}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEdit(record)}
                              className="text-[10px] text-indigo-600 hover:text-indigo-700 px-1.5 py-0.5 rounded hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-300"
                              aria-label={`Edit ${record[fields[0]?.key] ?? 'item'}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ id, label: String(record[fields[0]?.key] ?? id) })}
                              className="text-[10px] text-gray-400 hover:text-red-500 px-1.5 py-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-red-300"
                              aria-label={`Delete ${record[fields[0]?.key] ?? 'item'}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {isFetching && !isLoading && (
        <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2 z-30">
          <div className="w-3 h-3 border border-indigo-200 border-t-indigo-600 rounded-full animate-spin" aria-hidden="true" />
          <span className="text-[10px] text-gray-500">Updating...</span>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="content-editor-modal-title">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={closeModal} aria-label="Close modal" tabIndex={-1} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 id="content-editor-modal-title" className="text-sm font-semibold text-gray-800">
                {editingId ? `Edit ${title}` : `New ${title}`}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  aria-label={previewMode ? 'Edit content' : 'Preview content'}
                >
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded p-1"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {previewMode ? (
                <PreviewContent values={formValues} fields={fields} />
              ) : (
                <>
                  {fields.map((f) => {
                    const error = formErrors[f.key];
                    if (f.type === 'textarea') {
                      return (
                        <div key={f.key}>
                          <RichTextEditor
                            value={formValues[f.key] ?? ''}
                            onChange={(v) => handleFormChange(f.key, v)}
                            label={`${f.label}${f.required ? ' *' : ''}`}
                          />
                          {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
                        </div>
                      );
                    }
                    if (f.key.includes('image') || f.key.includes('thumbnail') || f.key.includes('url')) {
                      return (
                        <div key={f.key}>
                          <ImageUrlInput
                            value={formValues[f.key] ?? ''}
                            onChange={(v) => handleFormChange(f.key, v)}
                            label={`${f.label}${f.required ? ' *' : ''}`}
                          />
                          {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
                        </div>
                      );
                    }
                    if (f.type === 'select' && f.options) {
                      return (
                        <div key={f.key}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {f.label}{f.required ? ' *' : ''}
                          </label>
                          <select
                            value={formValues[f.key] ?? ''}
                            onChange={(e) => handleFormChange(f.key, e.target.value)}
                            className={`w-full border rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none transition-all ${error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100'}`}
                            aria-label={f.label}
                            aria-invalid={!!error}
                          >
                            <option value="">Select {f.label.toLowerCase()}...</option>
                            {f.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
                        </div>
                      );
                    }
                    return (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {f.label}{f.required ? ' *' : ''}
                        </label>
                        <input
                          type={f.type === 'number' ? 'number' : 'text'}
                          value={formValues[f.key] ?? ''}
                          onChange={(e) => handleFormChange(f.key, e.target.value)}
                          className={`w-full border rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none transition-all ${error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100'}`}
                          aria-label={f.label}
                          aria-invalid={!!error}
                        />
                        {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
                      </div>
                    );
                  })}

                  {!fields.some((f) => f.key === 'status') && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                      <select
                        value={formValues['status'] ?? 'draft'}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                        aria-label="Content status"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100">
              <button
                type="button"
                onClick={closeModal}
                disabled={mutationLoading}
                className="px-4 py-2 text-xs text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={mutationLoading || previewMode}
                className="px-4 py-2 text-xs text-white bg-gradient-to-r from-[#1A237E] to-[#3949AB] rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {mutationLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete ${title}`}
        message={`Are you sure you want to delete "${deleteTarget?.label}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={mutationLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
