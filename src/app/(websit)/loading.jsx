export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8F5F1] px-4">
      <div className="relative">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-[#E8E0D5] border-t-[#8B5E3C] rounded-full animate-spin"></div>
      </div>
      <p className="mt-5 text-[#8B5E3C] text-sm font-medium tracking-wide animate-pulse">
        Loading Nestro...
      </p>
    </div>
  );
}