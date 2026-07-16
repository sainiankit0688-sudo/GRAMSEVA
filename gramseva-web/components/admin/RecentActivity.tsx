/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

import type { ActivityItem } from '@/lib/services/dashboardService';
import ActivityTimeline from './ActivityTimeline';

interface RecentActivityProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

export default function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return <ActivityTimeline activities={activities} isLoading={isLoading} />;
}
