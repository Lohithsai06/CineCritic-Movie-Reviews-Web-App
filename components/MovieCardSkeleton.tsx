"use client";

const MovieCardSkeleton = () => {
  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg">
      <div className="aspect-[2/3] relative animate-pulse bg-gray-700">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          <div className="h-5 bg-gray-600 rounded w-3/4"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/6"></div>
          </div>
          <div className="flex gap-1">
            <div className="h-4 bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSkeleton;