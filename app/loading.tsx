export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-ivory">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-forge-200 border-t-forge-500 rounded-full animate-spin" />
        <p className="text-charcoal-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}
