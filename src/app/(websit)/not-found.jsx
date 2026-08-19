import Link from "next/link";
import { TbArmchair } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F5F1] px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="text-[#C6A27E] text-8xl mb-4 flex justify-center">
          <TbArmchair className="mx-auto" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-light text-[#1E1E1E] mb-3">404</h1>
        <h2 className="text-xl sm:text-2xl font-normal text-[#1E1E1E] mb-3">
          Page not found
        </h2>
        <p className="text-[#6B7280] text-sm mb-6">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <span className="inline-flex items-center justify-center bg-[#8B5E3C] text-white text-xs sm:text-[11px] tracking-[0.08em] py-2.5 px-6 rounded-sm hover:bg-[#7a4f32] transition">
            Back to Home
          </span>
        </Link>
      </div>
    </div>
  );
}