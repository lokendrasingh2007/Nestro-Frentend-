"use client";
import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { client } from "@/utils/helper";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    agreeTerms: false,
    receiveOffers: false,
  });

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function resisrerHandler(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await client.post("user/register", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          agreeTerms: false,
          receiveOffers: false,
        });
        router.push(`/verify-otp?email=${response.data.user.email}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-[24px] font-medium text-[#1E1E1E] mb-1">Create account</div>
          <div className="text-[12px] text-[#6B7280]">Join Nestro and start designing your dream home.</div>
        </div>

        {/* Form */}
        <form onSubmit={resisrerHandler}>
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[12px] font-medium text-[#6B7280] tracking-wide">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Nestro"
                className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C]"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#6B7280] tracking-wide">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="last name"
                className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C]"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-[12px] font-medium text-[#6B7280] tracking-wide">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nestro475@gmail.com"
              className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C]"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-[12px] font-medium text-[#6B7280] tracking-wide">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C] pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#8B5E3C]"
              >
                {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="block text-[12px] font-medium text-[#6B7280] tracking-wide">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="123-456-7890"
              className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C]"
              disabled={loading}
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2 mb-3">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 accent-[#8B5E3C]"
              disabled={loading}
            />
            <label className="text-[11px] sm:text-[12px] text-[#6B7280]">
              I agree to the{" "}
              <Link href="/terms" className="text-[#8B5E3C] hover:underline">
                Terms of Service & Privacy Policy
              </Link>
            </label>
          </div>

          {/* Offers */}
          <div className="flex items-start gap-2 mb-5">
            <input
              type="checkbox"
              name="receiveOffers"
              checked={formData.receiveOffers}
              onChange={handleChange}
              className="mt-0.5 accent-[#8B5E3C]"
              disabled={loading}
            />
            <label className="text-[11px] sm:text-[12px] text-[#6B7280]">
              Send me design tips & exclusive offers
            </label>
          </div>

          {/* Error */}
          {error && <p className="text-[11px] text-red-500 text-center mb-3">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#8B5E3C] text-white rounded-md text-[13px] font-medium tracking-wide hover:bg-[#7a4f32] transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#E8E0D5]"></div>
          <span className="text-[11px] text-[#6B7280]">or sign up with</span>
          <div className="flex-1 h-px bg-[#E8E0D5]"></div>
        </div>

        {/* Google Button */}
        <button className="w-full py-2 border border-[#E8E0D5] rounded-md text-[12px] text-[#444] bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <IoLogoGoogle /> Continue with Google
        </button>

        {/* Footer */}
        <div className="text-center mt-5">
          <span className="text-[10px] text-[#6B7280]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#8B5E3C] hover:underline">
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}