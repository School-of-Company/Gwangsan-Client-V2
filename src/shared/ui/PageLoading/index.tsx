export function PageLoading() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex-shrink-0 space-y-2">
        <div className="h-7 w-40 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-gray-100" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,_360px)_minmax(0,_1fr)]">
        <div className="min-h-[18rem] animate-pulse rounded-2xl bg-gray-50" />
        <div className="min-h-[24rem] animate-pulse rounded-2xl bg-gray-50" />
      </div>
    </div>
  );
}
