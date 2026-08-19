export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd]">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-4 border-[#eef0f8] border-t-[#3b497e] animate-spin" />
        <p className="text-sm font-medium text-[#7a84a6] tracking-wide">Loading...</p>
      </div>
    </div>
  );
}
