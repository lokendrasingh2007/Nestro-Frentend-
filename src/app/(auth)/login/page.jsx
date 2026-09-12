"use client";

import React, { useState, useEffect } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { IoLogoGoogle } from "react-icons/io";
import { RiAppleFill } from "react-icons/ri";
import Link from "next/link";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { lsToCart, cartTotal } from "@/redex/features/CartSlice";

export default function LoginPage() {
  const [cart, setCart] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  // Read localStorage only on client
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart"));
      setCart(stored);
    } catch {
      setCart(null);
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await client.post(
        "user/login",
        formData
      );

      if (response.data.success) {
        toast.success("Login successful!");

        // Sync local cart with server, then fetch populated cart
        try {
          await client.post("cart/syns-cart", {
            localCart: JSON.stringify(cart?.items || []),
          });

          // Always fetch the populated cart after sync
          const cartRes = await client.post("cart/syns-cart", {
            localCart: JSON.stringify([]), // empty = just fetch from DB
          });

          const cartData = cartRes.data.cart;
          const rawItems = Array.isArray(cartData)
            ? cartData                    // returns items array directly when localCart is empty
            : cartData?.items || [];

          let final_total = 0;
          let original_total = 0;

          const updatedCart = rawItems
            .map((item) => {
              const p = item.productId;
              if (!p || typeof p !== "object") return null;

              final_total    += (p.salePrice    || 0) * item.qty;
              original_total += (p.originalPrice || 0) * item.qty;

              return {
                id:            p._id,
                name:          p.name,
                title:         p.name,
                thumbnail:     p.thumbnail || null,
                salePrice:     p.salePrice,
                originalPrice: p.originalPrice,
                price:         p.salePrice,
                discount:      p.discount,
                qty:           item.qty,
              };
            })
            .filter(Boolean);

          localStorage.setItem(
            "cart",
            JSON.stringify({ items: updatedCart, final_total, original_total })
          );

          dispatch(lsToCart());
          dispatch(cartTotal());
        } catch (cartErr) {
          console.log("Cart sync error:", cartErr);
        }

        const role = response.data.user?.role;
        setFormData({
          email: "",
          password: ""
        });
        if (role === "admin" || role === "superadmin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error(response.data.message || "Login successful");
      }
    } catch (error) {
      console.log(error);
      setError(
        error.response?.data?.message ||
        "Something went wrong"
      );
      toast.error(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-10 py-8 lg:py-10">
      <div className="w-full max-w-md mx-auto">
        {/* Heading */}
        <div className="text-center mb-6">
          <div className="text-[24px] font-medium text-[#1E1E1E] mb-1">Welcome back</div>
          <div className="text-[12px] text-[#6B7280]">Sign in to your Nestro account to continue.</div>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5 tracking-wide">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C] transition"
              disabled={loading}
            />
          </div>

          <div className="mb-2">
            <label className="block text-[12px] font-medium text-[#6B7280] mb-1.5 tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-[#E8E0D5] rounded-md text-[13px] text-[#1E1E1E] bg-white outline-none focus:border-[#8B5E3C] pr-10"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#8B5E3C] cursor-pointer"
              >
                {showPassword ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
              </button>
            </div>
          </div>

          <div className="text-right mb-5">
            <Link href="/forgot-password" className="text-[11px] text-[#8B5E3C] hover:underline">
              Forgot Password?
            </Link>
          </div>

          {error && <p className="text-[11px] text-red-500 text-center mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#8B5E3C] text-white rounded-md text-[13px] font-medium tracking-wide hover:bg-[#7a4f32] transition mb-4 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#E8E0D5]"></div>
          <span className="text-[11px] text-[#6B7280]">or continue with</span>
          <div className="flex-1 h-px bg-[#E8E0D5]"></div>
        </div>

        {/* Social Buttons */}
        <button className="w-full py-2 border border-[#E8E0D5] rounded-md text-[12px] text-[#444] bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition mb-2">
          <IoLogoGoogle /> Continue with Google
        </button>

        <button className="w-full py-2 border border-[#E8E0D5] rounded-md text-[12px] text-[#444] bg-white flex items-center justify-center gap-2 hover:bg-gray-50 transition">
          <RiAppleFill /> Continue with Apple
        </button>

        {/* Footer */}
        <div className="text-center mt-5">
          <span className="text-[10px] text-[#6B7280]">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#8B5E3C] hover:underline">
              Create one
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
