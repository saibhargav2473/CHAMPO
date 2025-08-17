
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
      {text && (
        <p className="text-sm text-neutral-600 font-medium">{text}</p>
      )}
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <LoadingSpinner size="xl" text="Loading LocalTourn..." />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-neutral-200"></div>
      <div className="card-body space-y-4">
        <div className="skeleton h-6 w-3/4"></div>
        <div className="skeleton h-4 w-1/2"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-2/3"></div>
        <div className="flex gap-2">
          <div className="skeleton h-8 w-20"></div>
          <div className="skeleton h-8 w-24"></div>
        </div>
      </div>
    </div>
  );
}
