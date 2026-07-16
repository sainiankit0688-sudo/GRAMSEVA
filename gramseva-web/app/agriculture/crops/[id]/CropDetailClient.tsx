'use client';

import { useQuery } from '@/hooks/useQuery';
import { cropService } from '@/lib/services/cropService';
import { queryKeys } from '@/lib/queryKeys';
import { CROP_STALE_TIME } from '@/lib/constants/api';
import type { AgricultureCrop } from '@/lib/agriculture/types';
import {
  LoadingSpinner,
  ErrorAlert,
  BackButton,
  Breadcrumb,
  ShareButton,
  CropImage,
} from '@/components/agriculture';

interface CropDetailClientProps {
  cropId: string;
}

// ─── Section Component ────────────────────────────────────────────────────────

function Section({
  title,
  titleHindi,
  children,
}: {
  title: string;
  titleHindi: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 text-sm mb-1">
        {title}
        <span className="text-gray-400 font-normal text-xs ml-1">
          {titleHindi}
        </span>
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, labelHindi, value }: { label: string; labelHindi: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500">
        {label} <span className="text-gray-400">{labelHindi}</span>
      </span>
      <span className="text-xs font-medium text-gray-800 text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CropDetailClient({ cropId }: CropDetailClientProps) {
  const {
    data: crop,
    isLoading,
    error,
    refetch,
  } = useQuery<AgricultureCrop>(
    queryKeys.crops.detail(cropId),
    () => cropService.getById(cropId) as Promise<AgricultureCrop>,
    { staleTime: CROP_STALE_TIME },
  );

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div
        className="px-5 pt-4 pb-6"
        style={{ background: 'linear-gradient(135deg, #2E7D32, #4CAF50)' }}
      >
        <BackButton label="Back" className="text-white/80 hover:text-white mb-2" />
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              {String(crop?.name || 'Crop Details')}
            </h1>
            <p className="text-green-100 text-sm">फसल की जानकारी</p>
          </div>
          <ShareButton
            title={crop?.name || 'Crop'}
            text={`Learn about ${crop?.name} on GramSeva`}
            className="bg-white/20 text-white border-white/30 hover:bg-white/30"
          />
        </div>
      </div>

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Agriculture', href: '/agriculture' },
          { label: 'Crops', href: '/agriculture/crops' },
          { label: String(crop?.name || 'Detail') },
        ]}
      />

      <div className="px-4 py-4">
        {isLoading && (
          <LoadingSpinner
            message="Loading crop details..."
            messageHindi="फसल की जानकारी लोड हो रही है..."
          />
        )}

        {error && !isLoading && (
          <ErrorAlert
            message={error.message}
            messageHindi="फसल की जानकारी लोड करने में विफल"
            onRetry={refetch}
          />
        )}

        {crop && !isLoading && (
          <div className="space-y-4">
            {/* Crop Image */}
            <CropImage
              src={crop.image_url}
              alt={crop.name || 'Crop image'}
              size="lg"
            />

            {/* Basic Info */}
            <div className="flex flex-wrap gap-2">
              {crop.season && (
                <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                  {crop.season}
                </span>
              )}
              {crop.category && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                  {crop.category}
                </span>
              )}
              {crop.suitable_season && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                  {crop.suitable_season}
                </span>
              )}
            </div>

            {/* Names */}
            <Section title="About" titleHindi="परिचय">
              {crop.scientific_name && (
                <p className="text-xs text-gray-500 italic mb-1">
                  {crop.scientific_name}
                </p>
              )}
              {crop.description && (
                <p className="text-xs text-gray-700 leading-relaxed">
                  {crop.description}
                </p>
              )}
            </Section>

            {/* Growing Conditions */}
            <Section title="Growing Conditions" titleHindi="उगाने की स्थितियां">
              <InfoRow label="Soil Type" labelHindi="मिट्टी" value={crop.soil_type} />
              <InfoRow label="Climate" labelHindi="जलवायु" value={crop.climate} />
              <InfoRow
                label="Suitable States"
                labelHindi="उपयुक्त राज्य"
                value={
                  Array.isArray(crop.suitable_states)
                    ? crop.suitable_states.join(', ')
                    : crop.suitable_states
                }
              />
              <InfoRow
                label="Temperature"
                labelHindi="तापमान"
                value={crop.temperature_range}
              />
              <InfoRow
                label="Rainfall"
                labelHindi="वर्षा"
                value={crop.rainfall_requirement}
              />
              <InfoRow
                label="Water Needs"
                labelHindi="पानी की आवश्यकता"
                value={crop.water_needs}
              />
            </Section>

            {/* Seed Info */}
            <Section title="Seed Information" titleHindi="बीज की जानकारी">
              <InfoRow label="Seed Variety" labelHindi="बीज किस्म" value={crop.seed_variety} />
              <InfoRow label="Seed Rate" labelHindi="बीज दर" value={crop.seed_rate} />
              <InfoRow label="Sowing Time" labelHindi="बुआ� का समय" value={crop.sowing_time} />
              <InfoRow
                label="Land Preparation"
                labelHindi="भूमि तैयारी"
                value={crop.land_preparation}
              />
            </Section>

            {/* Farming Schedule */}
            <Section title="Farming Schedule" titleHindi="कृषि कार्यक्रम">
              <InfoRow label="Harvest Time" labelHindi="कटाई का समय" value={crop.harvest_time} />
              <InfoRow label="Expected Yield" labelHindi="अपेक्षित उपज" value={crop.expected_yield} />
              <InfoRow
                label="Growth Duration"
                labelHindi="वृद्धि अवधि"
                value={
                  crop.growth_duration_days
                    ? `${crop.growth_duration_days} days`
                    : undefined
                }
              />
            </Section>

            {/* Fertilizer Schedule */}
            {crop.fertilizer_schedule && (
              <Section title="Fertilizer Schedule" titleHindi="उर्वरक कार्यक्रम">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {crop.fertilizer_schedule}
                </p>
              </Section>
            )}

            {/* Irrigation */}
            {crop.irrigation_schedule && (
              <Section title="Irrigation" titleHindi="सिंचाई">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {crop.irrigation_schedule}
                </p>
              </Section>
            )}

            {/* Disease Management */}
            {crop.disease_management && (
              <Section title="Disease Management" titleHindi="रोग प्रबंधन">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {crop.disease_management}
                </p>
              </Section>
            )}

            {/* Pest Management */}
            {crop.pest_management && (
              <Section title="Pest Management" titleHindi="कीट प्रबंधन">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {crop.pest_management}
                </p>
              </Section>
            )}

            {/* Weed Management */}
            {crop.weed_management && (
              <Section title="Weed Management" titleHindi="खरपतवार प्रबंधन">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {crop.weed_management}
                </p>
              </Section>
            )}

            {/* Deficiency Symptoms */}
            {crop.deficiency_symptoms && (
              <Section title="Deficiency Symptoms" titleHindi="कमी के लक्षण">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {crop.deficiency_symptoms}
                </p>
              </Section>
            )}

            {/* Storage */}
            {crop.storage_method && (
              <Section title="Storage" titleHindi="भंडारण">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                  {crop.storage_method}
                </p>
              </Section>
            )}

            {/* Farming Tips */}
            {crop.farming_tips && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <h3 className="font-bold text-green-800 text-sm mb-2">
                  💡 Farming Tips / किसान सलाह
                </h3>
                <p className="text-xs text-green-700 leading-relaxed whitespace-pre-line">
                  {crop.farming_tips}
                </p>
              </div>
            )}

            {/* Related Crops */}
            {Array.isArray(crop.related_crops) && crop.related_crops.length > 0 && (
              <Section title="Related Crops" titleHindi="संबंधित फसलें">
                <div className="flex flex-wrap gap-2">
                  {crop.related_crops.map((rc: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                    >
                      {rc}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Links */}
            <div className="flex gap-3">
              {crop.youtube_video_link && (
                <a
                  href={crop.youtube_video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-red-50 text-red-700 border border-red-200 text-center hover:bg-red-100 transition-colors"
                >
                  🎬 Watch Video
                </a>
              )}
              {crop.pdf_guide_url && (
                <a
                  href={crop.pdf_guide_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 text-center hover:bg-blue-100 transition-colors"
                >
                  📄 PDF Guide
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
