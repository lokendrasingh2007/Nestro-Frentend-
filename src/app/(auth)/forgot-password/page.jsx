"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MdOutlineArrowBack } from "react-icons/md";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Step 1 — Enter Email
const EmailStep = ({ onNext, loading, setLoading }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    try {
      setLoading(true);
      const res = await client.post("user/forgot-password", { email });
      if (res.data.success) {
        toast.success("OTP sent to your email!");
        onNext(email);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="text-[24px] font-medium text-[#1E1E1E] mb-1">Forgot Password?</div>
        <div className="text-[12px] text-[#6B7280]">
          Enter your registered email — we'll send you a verification code.
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5 tracking-wide">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C] transition"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#8B5E3C] text-white rounded-md text-[13px] font-medium tracking-wide hover:bg-[#7a4f32] transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>
    </>
  );
};

// Step 2 — Verify OTP
const OtpStep = ({ email, onNext, loading, setLoading }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  useEffect(() => {
    let t;
    if (resendTimer > 0) t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const handleChange = (i, val) => {
    if (val.length > 1 || (val && !/^\d$/.test(val))) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === "Enter") handleVerify();
  };

  const handleResend = async () => {
    try {
      setResendTimer(30);
      await client.post("user/forgot-password", { email });
      toast.success("OTP resent successfully");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  const handleVerify = () => {
    const val = otp.join("");
    if (val.length !== 6) return toast.error("Please enter the 6-digit OTP");
    onNext(val);
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="text-[24px] font-medium text-[#1E1E1E] mb-1">Verify OTP</div>
        <div className="text-[12px] text-[#6B7280]">
          We've sent a 6-digit code to <br />
          <span className="text-[#8B5E3C] font-medium">{email}</span>
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {otp.map((d, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              ref={(el) => (inputRefs.current[i] = el)}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-[18px] font-semibold border border-[#E8E0D5] rounded-md bg-white focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 outline-none transition"
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#8B5E3C] text-white rounded-md text-[13px] font-medium tracking-wide hover:bg-[#7a4f32] transition mb-4 disabled:opacity-50"
        >
          Verify OTP
        </button>
      </form>
      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="text-[11px] text-[#8B5E3C] hover:underline disabled:opacity-50"
        >
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
        </button>
      </div>
    </>
  );
};

// Step 3 — New Password
const NewPasswordStep = ({ email, loading, setLoading }) => {
  const [form, setForm] = useState({ new_password: "", confirm_password: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.new_password) return toast.error("Enter new password");
    if (form.new_password.length < 6) return toast.error("Min 6 characters");
    if (form.new_password !== form.confirm_password) return toast.error("Passwords do not match");
    try {
      setLoading(true);
      const res = await client.patch("user/update-password", {
        email,
        old_password: null,
        new_password: form.new_password,
      });
      if (res.data.success) {
        toast.success("Password reset successfully! Please login.");
        router.push("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="text-[24px] font-medium text-[#1E1E1E] mb-1">Set New Password</div>
        <div className="text-[12px] text-[#6B7280]">Choose a strong new password for your account.</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5 tracking-wide">New Password</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] bg-white outline-none focus:border-[#8B5E3C] pr-10 transition"
              disabled={loading}
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#8B5E3C]">
              {showNew ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
            </button>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5 tracking-wide">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] bg-white outline-none focus:border-[#8B5E3C] pr-10 transition"
              disabled={loading}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#8B5E3C]">
              {showConfirm ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-[#8B5E3C] text-white rounded-md text-[13px] font-medium tracking-wide hover:bg-[#7a4f32] transition disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </>
  );
};

// ---------- Main Page ----------
export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const stepLabels = ["Email", "Verify OTP", "New Password"];

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
      <div className="w-full max-w-md mx-auto">
        <Link href="/login" className="inline-flex items-center gap-1 text-[#6B7280] hover:text-[#8B5E3C] text-[12px] mb-6 transition">
          <MdOutlineArrowBack size={16} /> Back to Login
        </Link>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-7">
          {stepLabels.map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-colors ${step > i + 1 ? "bg-[#8B5E3C] text-white" : step === i + 1 ? "bg-[#8B5E3C] text-white" : "bg-[#E8E0D5] text-[#6B7280]"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-[9px] ${step === i + 1 ? "text-[#8B5E3C]" : "text-[#6B7280]"}`}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px mb-4 ${step > i + 1 ? "bg-[#8B5E3C]" : "bg-[#E8E0D5]"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && <EmailStep loading={loading} setLoading={setLoading} onNext={(e) => { setEmail(e); setStep(2); }} />}
        {step === 2 && <OtpStep email={email} loading={loading} setLoading={setLoading} onNext={(o) => { setOtp(o); setStep(3); }} />}
        {step === 3 && <NewPasswordStep email={email} otp={otp} loading={loading} setLoading={setLoading} />}
      </div>
    </div>
  );
}
