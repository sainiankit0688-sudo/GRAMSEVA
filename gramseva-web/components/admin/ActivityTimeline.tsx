/**
 * ADMIN MODULE — FROZEN
 * Phase 3 Complete
 * No further feature development.
 * Bug fixes only.
 */

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp?: string;
  created_at?: string;
  user_name?: string;
  user_email?: string;
  [key: string]: unknown;
}

interface ActivityTimelineProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

const TYPE_ICONS: Record<string, string> = {
  complaint_created: '📋',
  complaint_resolved: '✅',
  complaint_rejected: '❌',
  user_signup: '👤',
  user_suspended: '🚫',
  scheme_added: '🏛️',
  emergency_alert: '🚨',
  ai_query: '🤖',
  weather_alert: '🌤️',
  default: '📌',
};

export default function ActivityTimeline({ activities, isLoading }: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No recent activity</p>
      ) : (
        <div className="space-y-3">
          {activities.map((item) => (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm flex-shrink-0" aria-hidden="true">
                {TYPE_ICONS[item.type] || TYPE_ICONS.default}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 truncate">{item.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.user_name && <span className="text-[10px] text-indigo-600">{item.user_name}</span>}
                  <span className="text-[10px] text-gray-400">{item.timestamp || (item.created_at ? new Date(item.created_at).toLocaleString('en-IN') : '—')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
