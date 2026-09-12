import { Suspense } from "react";
import VerifyOtpClient from "./VerifyOtpClient";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        <div className="w-8 h-8 rounded-full border-4 border-[#F0EBE3] border-t-[#8B5E3C] animate-spin" />
      </div>
    }>
      <VerifyOtpClient />
    </Suspense>
  );
}
