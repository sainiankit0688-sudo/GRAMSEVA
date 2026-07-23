'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@/hooks/useQuery';
import { mandiService } from '@/lib/services/mandiService';
import { queryKeys } from '@/lib/queryKeys';
import { MANDI_STALE_TIME } from '@/lib/constants/api';
import type { LiveMandiPrice, MandiApiResponse } from '@/lib/agriculture/types';
import { mandiStates, mandiCommodities } from '@/lib/agriculture/data/mandiStates';
import {
  PageHeader,
  LoadingSpinner,
  ErrorAlert,
  EmptyState,
  BackButton,
  Breadcrumb,
  ShareButton,
} from '@/components/agriculture';

type SortKey = 'modal_price' | 'min_price' | 'max_price' | 'commodity' | 'market';
type SortDir = 'asc' | 'desc';

const accumulatedPages: Record<number, LiveMandiPrice[]> = {};
let lastDataVersion = 0;
let moduleLastUpdated: Date | null = null;

function clearAccumulated() {
  for (const key of Object.keys(accumulatedPages)) {
    delete accumulatedPages[Number(key)];
  }
  lastDataVersion = 0;
  moduleLastUpdated = null;
}

function accumulatePage(pageNum: number, records: LiveMandiPrice[], dataVersion: number) {
  if (lastDataVersion === dataVersion) return;
  accumulatedPages[pageNum] = records;
  lastDataVersion = dataVersion;
  moduleLastUpdated = new Date();
}

function getAccumulated(): LiveMandiPrice[] {
  return Object.keys(accumulatedPages)
    .map(Number)
    .sort((a, b) => a - b)
    .flatMap((k) => accumulatedPages[k]);
}

function getLastUpdated(): Date | null {
  return moduleLastUpdated;
}

export default function MandiPage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('modal_price');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const [dataVersion, setDataVersion] = useState(0);
  const limit = 50;
  const MANDI_REFETCH_INTERVAL = 5 * 60 * 1_000;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<MandiApiResponse>(
    queryKeys.mandi.filtered(selectedState, selectedCommodity),
    () =>
      mandiService.getPrices({
        state: selectedState || undefined,
        commodity: selectedCommodity || undefined,
        limit,
        offset: page * limit,
      }),
    {
      staleTime: MANDI_STALE_TIME,
      refetchInterval: MANDI_REFETCH_INTERVAL,
    },
  );

  const allRecords = useMemo(() => {
    if (data?.records) {
      accumulatePage(page, data.records, dataVersion);
    }
    return getAccumulated();
  }, [data, page, dataVersion]);

  const lastUpdated = getLastUpdated();

  const handleStateChange = (state: string) => {
    setSelectedState(state === selectedState ? '' : state);
    setPage(0);
    clearAccumulated();
    setDataVersion((v) => v + 1);
  };

  const handleCommodityChange = (commodity: string) => {
    setSelectedCommodity(commodity === selectedCommodity ? '' : commodity);
    setPage(0);
    clearAccumulated();
    setDataVersion((v) => v + 1);
  };

  const handleRefresh = useCallback(() => {
    setPage(0);
    clearAccumulated();
    setDataVersion((v) => v + 1);
    refetch();
  }, [refetch]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filteredRecords = allRecords.filter((item) => {
    if (!searchInput.trim()) return true;
    const q = searchInput.toLowerCase();
    return (
      item.commodity?.toLowerCase().includes(q) ||
      item.market?.toLowerCase().includes(q) ||
      item.district?.toLowerCase().includes(q) ||
      item.state?.toLowerCase().includes(q)
    );
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal || '');
    const bStr = String(bVal || '');
    return sortDir === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const totalRecords = data?.total || 0;
  const hasMore = allRecords.length < totalRecords;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="Mandi Prices"
        titleHindi="मंडी भाव"
        icon="📊"
        gradient="linear-gradient(135deg, #BF360C, #E64A19)"
      >
        <div className="flex items-center justify-between mt-3">
          <BackButton label="Back" className="text-white/80 hover:text-white" />
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-white/60 text-xs">
                Updated {formatTime(lastUpdated)}
              </span>
            )}
            <ShareButton title="Mandi Prices — GramSeva" text="Check live mandi prices on GramSeva" className="bg-white/20 text-white border-white/30 hover:bg-white/30" />
          </div>
        </div>
      </PageHeader>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agriculture', href: '/agriculture' }, { label: 'Mandi Prices' }]} />

      <div className="px-4 py-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 items-start mb-4">
          <span className="text-lg flex-shrink-0">ℹ️</span>
          <p className="text-xs text-blue-700">
            Live prices from Data.gov.in via government mandis.
            {totalRecords > 0 && (
              <span className="ml-1 font-medium">
                {totalRecords.toLocaleString('en-IN')} records
              </span>
            )}
            <br />
            <span className="text-blue-600">
              डेटा.गव.इन से लाइव भाव — सरकारी मंडियों से।
            </span>
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search commodity, market, district..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-orange-200 transition-shadow"
            aria-label="Search commodities or markets"
          />
        </div>

        {/* Refresh + Sort */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Refresh prices"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>

          <div className="flex gap-1.5">
            {[
              { key: 'modal_price' as SortKey, label: 'Modal' },
              { key: 'min_price' as SortKey, label: 'Min' },
              { key: 'max_price' as SortKey, label: 'Max' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => toggleSort(s.key)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  sortKey === s.key
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-white text-gray-500 border border-gray-200'
                }`}
                aria-label={`Sort by ${s.label} price`}
                aria-pressed={sortKey === s.key}
              >
                {s.label} {sortKey === s.key ? (sortDir === 'desc' ? '↓' : '↑') : ''}
              </button>
            ))}
          </div>
        </div>

        {/* State Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-2">
          <button
            onClick={() => handleStateChange('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
              ${!selectedState
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-orange-50'
              }`}
          >
            All States
          </button>
          {mandiStates.map((state) => (
            <button
              key={state}
              onClick={() => handleStateChange(state)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${selectedState === state
                  ? 'bg-orange-600 text-white border-orange-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-orange-50'
                }`}
            >
              {state}
            </button>
          ))}
        </div>

        {/* Commodity Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-4">
          <button
            onClick={() => handleCommodityChange('')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
              ${!selectedCommodity
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50'
              }`}
          >
            All Commodities
          </button>
          {mandiCommodities.map((commodity) => (
            <button
              key={commodity}
              onClick={() => handleCommodityChange(commodity)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${selectedCommodity === commodity
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50'
                }`}
            >
              {commodity}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && page === 0 && (
          <LoadingSpinner
            message="Fetching live prices..."
            messageHindi="लाइव भाव लोड हो रहे हैं..."
          />
        )}

        {/* Error */}
        {error && !isLoading && (
          <ErrorAlert
            message={error.message}
            messageHindi="मंडी भाव प्राप्त करने में विफल"
            onRetry={handleRefresh}
          />
        )}

        {/* Price List */}
        {!isLoading && sortedRecords.length > 0 && (
          <div className="flex flex-col gap-2">
            {sortedRecords.map((item, idx) => (
              <div
                key={`${item.commodity}-${item.market}-${item.arrival_date}-${idx}`}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {item.commodity}
                    </p>
                    {item.variety && (
                      <p className="text-xs text-gray-500">{item.variety}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-0.5">
                      📍 {item.market}, {item.district} — {item.state}
                    </p>
                    {item.arrival_date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        📅 {item.arrival_date}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-bold text-gray-800">
                      ₹{item.modal_price.toLocaleString('en-IN')}
                    </p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-green-600">
                        ↑ ₹{item.max_price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-red-600">
                        ↓ ₹{item.min_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-full mt-4 py-3 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Load More / और देखें ({allRecords.length} of {totalRecords.toLocaleString('en-IN')})
          </button>
        )}

        {/* Empty */}
        {!isLoading && sortedRecords.length === 0 && !error && (
          <EmptyState
            icon="📊"
            title="No prices found"
            titleHindi="कोई भाव नहीं मिला"
            description="Try different filters or search terms"
          />
        )}
      </div>
    </div>
  );
}
