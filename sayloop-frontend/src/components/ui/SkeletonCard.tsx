import React from 'react';

// ── Base shimmer block ─────────────────────────────────────────────────────────
const Sk = ({
  w = 'w-full', h = 'h-4', rounded = 'rounded-xl', className = '',
}: { w?: string; h?: string; rounded?: string; className?: string }) => (
  <div className={`animate-pulse bg-slate-200 ${w} ${h} ${rounded} ${className}`} />
);

// ─────────────────────────────────────────────────────────────────────────────
// SwipeCard Skeleton — used in Match browse tab while loading users
// ─────────────────────────────────────────────────────────────────────────────
export const SwipeCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm space-y-5">
    {/* Avatar + name row */}
    <div className="flex items-center gap-4">
      <Sk w="w-16" h="h-16" rounded="rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Sk w="w-32" h="h-4" />
        <Sk w="w-20" h="h-3" />
      </div>
      <Sk w="w-16" h="h-6" rounded="rounded-full" />
    </div>
    {/* Bio lines */}
    <div className="space-y-2">
      <Sk h="h-3" />
      <Sk w="w-4/5" h="h-3" />
    </div>
    {/* Interest chips */}
    <div className="flex gap-2 flex-wrap">
      {[60, 80, 55, 70, 65].map(w => (
        <div key={w} className={`animate-pulse bg-slate-200 h-7 rounded-full`} style={{ width: w }} />
      ))}
    </div>
    {/* Buttons */}
    <div className="flex gap-3">
      <Sk h="h-12" rounded="rounded-2xl" className="flex-1" />
      <Sk w="w-28" h="h-12" rounded="rounded-2xl" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Request Card Skeleton — for incoming requests tab
// ─────────────────────────────────────────────────────────────────────────────
export const RequestCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-5 border-2 border-slate-100 shadow-sm space-y-4">
    <div className="flex items-center gap-3">
      <Sk w="w-12" h="h-12" rounded="rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Sk w="w-28" h="h-4" />
        <Sk w="w-20" h="h-3" />
      </div>
      <Sk w="w-16" h="h-6" rounded="rounded-full" />
    </div>
    <Sk h="h-3" />
    <div className="flex gap-2">
      <Sk h="h-10" rounded="rounded-2xl" className="flex-1" />
      <Sk h="h-10" rounded="rounded-2xl" className="flex-1" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// History Row Skeleton — for match history tab
// ─────────────────────────────────────────────────────────────────────────────
export const HistoryRowSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border-2 border-slate-100 flex items-center gap-4">
    <Sk w="w-11" h="h-11" rounded="rounded-2xl" />
    <div className="flex-1 space-y-2">
      <Sk w="w-28" h="h-4" />
      <Sk w="w-20" h="h-3" />
    </div>
    <Sk w="w-16" h="h-6" rounded="rounded-full" />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Home Stats Skeleton
// ─────────────────────────────────────────────────────────────────────────────
export const HomeSkeleton = () => (
  <div className="space-y-6 p-4 max-w-2xl mx-auto">
    {/* Hero card */}
    <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center gap-4">
        <Sk w="w-16" h="h-16" rounded="rounded-2xl" />
        <div className="space-y-2 flex-1">
          <Sk w="w-40" h="h-5" />
          <Sk w="w-24" h="h-3" />
        </div>
      </div>
      <div className="flex gap-3">
        {[1,2,3].map(i => (
          <div key={i} className="flex-1 bg-slate-100 rounded-2xl p-4 space-y-2 animate-pulse">
            <Sk w="w-8" h="h-8" rounded="rounded-xl" />
            <Sk w="w-12" h="h-5" />
            <Sk w="w-16" h="h-3" />
          </div>
        ))}
      </div>
    </div>

    {/* Recent sessions */}
    <div className="space-y-3">
      <Sk w="w-40" h="h-5" />
      {[1,2,3].map(i => <HistoryRowSkeleton key={i} />)}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Video Area Skeleton — shown before both peers connect
// ─────────────────────────────────────────────────────────────────────────────
export const VideoSkeleton = () => (
  <div className="flex flex-col sm:flex-row flex-1 gap-1 p-1 bg-slate-200">
    {[1, 2].map(i => (
      <div key={i} className="flex-1 rounded-2xl animate-pulse bg-slate-300 min-h-[30vh] sm:min-h-0 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-400/30 mx-auto flex items-center justify-center text-3xl">🎭</div>
          <div className="h-3 w-24 rounded-xl bg-slate-400/30 mx-auto" />
        </div>
      </div>
    ))}
  </div>
);

export default Sk;
