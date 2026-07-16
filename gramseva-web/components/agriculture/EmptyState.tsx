interface EmptyStateProps {
  icon?: string;
  title: string;
  titleHindi?: string;
  description?: string;
  descriptionHindi?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon = '📭',
  title,
  titleHindi,
  description,
  descriptionHindi,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center px-4">
      <span className="text-4xl">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>
        {titleHindi && <p className="text-xs text-gray-500 mt-0.5">{titleHindi}</p>}
      </div>
      {description && (
        <p className="text-xs text-gray-500 max-w-xs">{description}</p>
      )}
      {descriptionHindi && (
        <p className="text-xs text-gray-400 max-w-xs">{descriptionHindi}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
