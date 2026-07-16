'use client';

interface ErrorAlertProps {
  message: string;
  messageHindi?: string;
  onRetry?: () => void;
}

export default function ErrorAlert({
  message,
  messageHindi,
  onRetry,
}: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-start">
      <span className="text-xl flex-shrink-0">⚠️</span>
      <div className="flex-1">
        <p className="text-red-700 text-sm">{message}</p>
        {messageHindi && (
          <p className="text-red-500 text-xs mt-0.5">{messageHindi}</p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry / पुनः प्रयास करें
          </button>
        )}
      </div>
    </div>
  );
}
