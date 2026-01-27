'use client';

// Base skeleton animation
function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-24 mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

// Stats card skeleton
export function StatsSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="w-4 h-4 rounded" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

// Message/List item skeleton
export function ListItemSkeleton() {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

// Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

// Inbox skeleton
export function InboxSkeleton() {
  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>

      {/* Messages */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
        <ListItemSkeleton />
      </div>
    </div>
  );
}

// Chat skeleton
export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="space-y-4">
        {/* Bot message */}
        <div className="flex gap-3">
          <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
          <Skeleton className="h-20 w-2/3 rounded-2xl" />
        </div>
        {/* User message */}
        <div className="flex gap-3 justify-end">
          <Skeleton className="h-12 w-1/2 rounded-2xl" />
          <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
        </div>
        {/* Bot message */}
        <div className="flex gap-3">
          <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
          <Skeleton className="h-32 w-3/4 rounded-2xl" />
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <Skeleton className="flex-1 h-12 rounded-xl" />
        <Skeleton className="w-12 h-12 rounded-xl" />
      </div>
    </div>
  );
}

// Text line skeleton
export function TextSkeleton({ width = 'full' }: { width?: 'full' | '3/4' | '1/2' | '1/4' }) {
  const widthClass = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/4': 'w-1/4'
  }[width];
  
  return <Skeleton className={`h-4 ${widthClass}`} />;
}

// Avatar skeleton
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }[size];
  
  return <Skeleton className={`${sizeClass} rounded-full`} />;
}

// Button skeleton
export function ButtonSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'h-8 w-20',
    md: 'h-10 w-28',
    lg: 'h-12 w-36'
  }[size];
  
  return <Skeleton className={`${sizeClass} rounded-lg`} />;
}

export default Skeleton;



