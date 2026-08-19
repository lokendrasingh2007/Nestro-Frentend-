import Link from "next/link";
import { FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd] p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#eef0f8] p-8 text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#eef0f8] flex items-center justify-center">
            <FiSearch size={28} className="text-[#3b497e]" />
          </div>
        </div>

        {/* 404 */}
        <h1 className="text-5xl font-extrabold text-[#3b497e] mb-2">404</h1>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#2a3460] mb-2">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-sm text-[#7a84a6] mb-6 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Button */}
        <Link href="/admin">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b497e] hover:bg-[#2a3460] text-white text-sm font-semibold shadow-md transition-colors">
            Go to Dashboard
          </button>
        </Link>

      </div>
    </div>
  );
}
