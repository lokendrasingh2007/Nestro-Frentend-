"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdOutlineArrowBack } from "react-icons/md";
import { useSearchParams, useRouter } from "next/navigation";
import { client } from "@/utils/helper";
import { toast } from "sonner";

export default function VerifyOtpClient() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown for resend
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    try {
      setResendTimer(30);
      const response = await client.post("user/resend-otp", { email });
      toast.success(response.data.message || "OTP resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    try {
      setLoading(true);
      const response = await client.post("user/verify-otp", { email, otp: otpValue });
      if (response.data.success) {
        toast.success("Email verified successfully!");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
      <div className="w-full max-w-md mx-auto">
        {/* Back button */}
        <Link href="/register" className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#8B5E3C] text-[12px] mb-6 transition">
          <MdOutlineArrowBack size={16} /> Back
        </Link>

        {/* Heading */}
        <div className="text-center mb-6">
          <div className="text-[24px] font-medium text-[#1E1E1E] mb-1">Verify your email</div>
          <div className="text-[12px] text-[#6B7280]">
            We've sent a 6-digit code to <br />
            <span className="text-[#8B5E3C] font-medium">{email}</span>
          </div>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-[18px] font-semibold border border-[#E8E0D5] rounded-md bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 outline-none transition"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-2.5 bg-[#8B5E3C] text-white rounded-md text-[13px] font-medium tracking-wide hover:bg-[#7a4f32] transition mb-4 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* Resend Section */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className="text-[11px] text-[#8B5E3C] hover:underline disabled:opacity-50"
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Didn't receive code? Resend OTP"}
          </button>
        </div>

        {/* Additional note */}
        <div className="text-center mt-6">
          <p className="text-[10px] text-[#6B7280]">
            Check your spam folder if you don't see the email.
          </p>
        </div>
      </div>
    </div>
  );
}
