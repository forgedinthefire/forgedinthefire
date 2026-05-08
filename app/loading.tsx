export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-ember/30 border-t-ember rounded-full animate-spin" />
        <p className="text-cream-300/70 text-sm">Loading...</p>
      </div>
    </div>
  );
}
