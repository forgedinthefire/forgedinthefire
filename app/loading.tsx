export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1714]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#1E6B73]/30 border-t-[#4C9AA3] rounded-full animate-spin" />
        <p className="text-[#B8A89A] text-sm">Loading...</p>
      </div>
    </div>
  );
}
