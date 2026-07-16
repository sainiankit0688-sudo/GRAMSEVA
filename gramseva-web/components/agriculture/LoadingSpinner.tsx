interface LoadingSpinnerProps {
  message?: string;
  messageHindi?: string;
}

export default function LoadingSpinner({
  message = 'Loading...',
  messageHindi,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12" role="status" aria-label={message}>
      <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{message}</p>
      {messageHindi && <p className="text-gray-400 text-xs">{messageHindi}</p>}
    </div>
  );
}
