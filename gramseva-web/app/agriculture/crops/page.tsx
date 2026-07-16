'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@/hooks/useQuery';
import { cropService, type Crop } from '@/lib/services/cropService';
import { queryKeys } from '@/lib/queryKeys';
import { CROP_STALE_TIME } from '@/lib/constants/api';
import { PageHeader, LoadingSpinner, ErrorAlert, EmptyState, CropImage, Breadcrumb, ShareButton } from '@/components/agriculture';

export default function CropsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [activeSeason, setActiveSeason] = useState<string>('all');

  const { data: crops, isLoading, error, refetch } = useQuery<Crop[]>(
    queryKeys.crops.list(activeSeason === 'all' ? undefined : activeSeason),
    () => cropService.list({ season: activeSeason === 'all' ? undefined : activeSeason }),
    { staleTime: CROP_STALE_TIME },
  );

  const seasons = ['all', 'Kharif', 'Rabi', 'Summer', 'Perennial'];
  const seasonLabels: Record<string, string> = {
    all: 'All / सभी',
    Kharif: 'Kharif / खरीफ',
    Rabi: 'Rabi / रबी',
    Summer: 'Summer / ग्रीष्म',
    Perennial: 'Perennial / बहुवर्षीय',
  };

  const filteredCrops = crops?.filter((crop) => {
    if (!searchInput.trim()) return true;
    const q = searchInput.toLowerCase();
    return (
      (crop.name && crop.name.toLowerCase().includes(q)) ||
      (crop.season && crop.season.toLowerCase().includes(q)) ||
      (crop.category && crop.category.toLowerCase().includes(q)) ||
      (crop.description && crop.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <PageHeader
        title="Crop Information"
        titleHindi="फसल की जानकारी"
        icon="🌾"
      />
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Agriculture', href: '/agriculture' }, { label: 'Crops' }]} />

      <div className="px-4 py-4">
        <div className="flex justify-end mb-3">
          <ShareButton title="Crop Information — GramSeva" text="Check out crop information on GramSeva" />
        </div>
        {/* Search */}
        <div className="relative mb-4">
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
            placeholder="Search crops / फसल खोजें"
            aria-label="Search crops"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-green-200 transition-shadow"
          />
        </div>

        {/* Season Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
          {seasons.map((season) => (
            <button
              key={season}
              onClick={() => setActiveSeason(season)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${activeSeason === season
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-green-50'
                }`}
            >
              {seasonLabels[season] || season}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <LoadingSpinner message="Loading crops..." messageHindi="फसलें लोड हो रही हैं..." />
        )}

        {/* Error */}
        {error && !isLoading && (
          <ErrorAlert
            message={error.message}
            messageHindi="फसलों को लोड करने में विफल"
            onRetry={refetch}
          />
        )}

        {/* Crops List */}
        {!isLoading && !error && filteredCrops && filteredCrops.length > 0 && (
          <div className="flex flex-col gap-3">
            {filteredCrops.map((crop) => (
              <Link
                key={crop.id}
                href={`/agriculture/crops/${crop.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <CropImage
                    src={crop.image_url as string | null}
                    alt={crop.name}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm">
                      {crop.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {crop.season && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          {crop.season}
                        </span>
                      )}
                      {crop.category && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {crop.category}
                        </span>
                      )}
                    </div>
                    {crop.description && (
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">
                        {crop.description}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-300 text-xs mt-2">›</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && filteredCrops && filteredCrops.length === 0 && (
          <EmptyState
            icon="🌾"
            title="No crops found"
            titleHindi="कोई फसल नहीं मिली"
            description={searchInput ? 'Try a different search term' : undefined}
          />
        )}
      </div>
    </div>
  );
}
