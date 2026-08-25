export default function WeatherSkeleton() {
  return (
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-6 w-full pb-10 pt-4">
      {/* Today data skeleton */}
      <section className="space-y-4">
        {/* Main Weather Card Skeleton */}
        <div className="flex justify-center">
          <div className="flex flex-col">
            <div className="relative z-10 px-6 space-y-8 m-4">
              <div className="text-center space-y-6 max-w-sm mx-auto pt-24 px-14">
                {/* Weather Icon Skeleton */}
                <div className="w-24 h-24 absolute left-0 top-0 bg-white/20 rounded-full animate-pulse"></div>

                <div className="space-y-2">
                  {/* Temperature Skeleton */}
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-24 w-40 bg-white/20 rounded-2xl animate-pulse"></div>
                    <div className="h-8 w-8 bg-white/20 rounded animate-pulse mt-4"></div>
                  </div>

                  {/* Weather Description Skeleton */}
                  <div className="h-6 w-48 bg-white/20 rounded-xl animate-pulse mx-auto"></div>

                  {/* Feels Like + High/Low Skeleton */}
                  <div className="space-y-1">
                    <div className="h-4 w-32 bg-white/20 rounded animate-pulse mx-auto"></div>
                    <div className="h-4 w-24 bg-white/20 rounded animate-pulse mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Details Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 pb-safe">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6 flex items-center space-x-4 animate-pulse"
            >
              <div className="p-3 bg-white/20 rounded-full">
                <div className="w-5 h-5 bg-white/30 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/20 rounded"></div>
                <div className="h-5 w-12 bg-white/20 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Hourly Forecast Skeleton */}
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6">
          <div className="h-6 w-16 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 text-center space-y-3 min-w-[60px] animate-pulse"
              >
                <div className="h-4 w-12 bg-white/20 rounded mx-auto"></div>
                <div className="w-8 h-8 bg-white/20 rounded-full mx-auto"></div>
                <div className="h-6 w-10 bg-white/20 rounded mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Next 5 Days Forecast Skeleton */}
      <section className="flex w-full flex-col gap-4">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-6">
          <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-1 gap-6 p-2 pb-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-10 p-4 animate-pulse">
                  <div className="flex items-center gap-6 md:gap-10">
                    {/* Day and Date Skeleton */}
                    <div className="flex flex-col items-center space-y-1">
                      <div className="h-6 w-20 bg-white/20 rounded"></div>
                      <div className="h-4 w-16 bg-white/20 rounded"></div>
                    </div>

                    {/* Temperature Skeleton */}
                    <div className="flex items-center space-x-1">
                      <div className="h-8 w-12 bg-white/20 rounded"></div>
                      <div className="h-4 w-4 bg-white/20 rounded"></div>
                    </div>

                    {/* Weather Icon and Description Skeleton */}
                    <div className="text-center sm:text-left space-y-2">
                      <div className="w-12 h-12 bg-white/20 rounded-full mx-auto sm:mx-0"></div>
                      <div className="h-4 w-24 bg-white/20 rounded mx-auto sm:mx-0"></div>
                      <div className="h-3 w-20 bg-white/20 rounded mx-auto sm:mx-0"></div>
                    </div>
                  </div>

                  {/* Compact Weather Details Skeleton */}
                  <div className="flex justify-center lg:justify-end items-center gap-4 mt-2 lg:mt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="p-3 border border-white/20 rounded-full">
                            <div className="w-5 h-5 bg-white/20 rounded"></div>
                          </div>
                          <div className="space-y-1">
                            <div className="h-3 w-12 bg-white/20 rounded"></div>
                            <div className="h-4 w-8 bg-white/20 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {i < 6 && <hr className="border-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom safe area */}
      <div className="h-8"></div>
    </main>
  );
}
