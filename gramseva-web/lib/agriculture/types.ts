/**
 * Agriculture Module Types
 *
 * Extended types for agriculture features, building on
 * the base Crop type from cropService.
 */

import type { Crop } from '@/lib/services/cropService';

// ─── Extended Crop (matches all Supabase columns) ─────────────────────────────

export interface AgricultureCrop extends Crop {
  scientific_name?: string;
  suitable_states?: string[];
  suitable_season?: string;
  soil_type?: string;
  climate?: string;
  seed_variety?: string;
  seed_rate?: string;
  sowing_time?: string;
  land_preparation?: string;
  fertilizer_schedule?: string;
  irrigation_schedule?: string;
  weed_management?: string;
  disease_management?: string;
  pest_management?: string;
  deficiency_symptoms?: string;
  harvest_time?: string;
  expected_yield?: string;
  storage_method?: string;
  farming_tips?: string;
  related_crops?: string[];
  youtube_video_link?: string;
  pdf_guide_url?: string;
  image_url?: string;
  is_published?: boolean;
  updated_at?: string;
  local_names?: Record<string, string>;
  image_urls?: string[];
  growth_duration_days?: number;
  water_needs?: string;
  temperature_range?: string;
  rainfall_requirement?: string;
}

// ─── Live Mandi Price (Railway backend) ───────────────────────────────────────

export interface LiveMandiPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

export interface MandiApiResponse {
  status: string;
  total: number;
  count: number;
  limit: string;
  offset: string;
  records: LiveMandiPrice[];
  success: boolean;
}

export interface MandiQueryParams {
  state?: string;
  commodity?: string;
  limit?: number;
  offset?: number;
}

// ─── Fertilizer Guide ─────────────────────────────────────────────────────────

export interface FertilizerRecommendation {
  crop: string;
  cropHindi: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  tip: string;
  tipHindi: string;
}

export interface FertilizerType {
  name: string;
  nameHindi: string;
  formula: string;
  uses: string;
  usesHindi: string;
  icon: string;
}

// ─── Soil Health ──────────────────────────────────────────────────────────────

export interface SoilTypeInfo {
  type: string;
  typeHindi: string;
  description: string;
  descriptionHindi: string;
  suitableCrops: string[];
  suitableCropsHindi: string[];
  tips: string[];
  tipsHindi: string[];
  icon: string;
  color: string;
}

// ─── Crop Disease ─────────────────────────────────────────────────────────────

export interface CropDisease {
  name: string;
  nameHindi: string;
  crop: string;
  cropHindi: string;
  symptoms: string[];
  symptomsHindi: string[];
  prevention: string[];
  preventionHindi: string[];
  treatment: string;
  treatmentHindi: string;
  severity: 'low' | 'medium' | 'high';
  icon: string;
}

// ─── Weather Helpers ──────────────────────────────────────────────────────────

export interface WeatherAlert {
  type: 'heat' | 'cold' | 'rain' | 'wind' | 'uv' | 'humidity';
  severity: 'warning' | 'advisory' | 'info';
  message: string;
  messageHindi: string;
  icon: string;
}

export interface FarmingAdvice {
  category: string;
  categoryHindi: string;
  tip: string;
  tipHindi: string;
  icon: string;
}
