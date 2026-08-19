"use client";
import React, { useState } from "react";
import { MdArrowForward } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { client } from "@/utils/helper";
import { emptyCart } from "@/redex/features/CartSlice";

export default function PaymentMethod({ shippingAddress, shippingMethod = "standard", extraShipping = 0 }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedMethod, setSelectedMethod] = useState("cod"); // "cod" | "online"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cards = ["VISA", "MC", "AMEX", "RuPay"];

  // ── Load Razorpay script dynamically ──────────────────────
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ── Verify Razorpay signature with backend ─────────────────
  const verifyPayment = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }) => {
    const res = await client.post("order/verify", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    });
    return res.data;
  };

  // ── Build localCart from Redux/localStorage ────────────────
  const getLocalCart = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("cart"));
      if (!stored?.items?.length) return [];
      // Backend expects: [{ id: productId, qty }]
      return stored.items.map((item) => ({ id: item.id, qty: item.qty }));
    } catch {
      return [];
    }
  };

  // ── Main handler ───────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setError("");
    setLoading(true);

    const localCart = getLocalCart();

    if (!localCart.length) {
      router.push("/cart");
      setLoading(false);
      return;
    }

    // Validate shipping address before hitting backend
    const addr = shippingAddress || {};
    if (!addr.addressLine || !addr.city || !addr.state || !addr.pinCode) {
      setError("Your delivery address is incomplete. Please add a complete address in your profile before placing an order.");
      setLoading(false);
      return;
    }

    try {
      // Place order via backend — send localCart so backend can sync if DB cart is empty
      const { data } = await client.post("order/place", {
        shippingAddress,
        paymentMethod: selectedMethod,
        shippingMethod,
        extraShipping,
        localCart,
      });

      if (!data.success) {
        setError(data.message || "Failed to place order.");
        setLoading(false);
        return;
      }

      // ── COD: redirect to confirmation ─────────────────────
      if (selectedMethod === "cod") {
        dispatch(emptyCart());
        router.push(`/thank-you?orderId=${data.orderId}`);
        return;
      }

      // ── Online: open Razorpay checkout ────────────────────
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,          // already in paise from backend
        currency: data.currency,
        name: "Nestro",
        description: "Furniture Order Payment",
        order_id: data.razorpay_order_id,
        handler: async (response) => {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            });

            if (verifyRes.success) {
              dispatch(emptyCart());
              router.push(`/thank-you?orderId=${data.orderId}`);
            } else {
              setError("Payment verification failed. Contact support.");
            }
          } catch {
            setError("Payment verification error. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled. You can retry.");
            setLoading(false);
          },
        },
        prefill: {
          name: shippingAddress?.fullName || "",
          contact: shippingAddress?.mobile || "",
        },
        theme: {
          color: "#8B5E3C",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-[13px] text-[#1E1E1E] mb-3 font-medium">Payment</div>

      {/* Payment Method Toggle */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Online Payment */}
        <div
          onClick={() => setSelectedMethod("online")}
          className={`border rounded-md flex-1 p-2 text-[11px] text-center cursor-pointer transition
            ${selectedMethod === "online"
              ? "border-[#8B5E3C] text-[#8B5E3C] bg-[#FFF8F5]"
              : "border-[#E8E0D5] text-[#6B7280] bg-white"
            }`}
        >
          Credit / Debit Card
        </div>

        {/* COD */}
        <div
          onClick={() => setSelectedMethod("cod")}
          className={`flex-1 p-2 border-[0.5px] rounded-md text-[11px] text-center cursor-pointer transition
            ${selectedMethod === "cod"
              ? "border-[#8B5E3C] text-[#8B5E3C] bg-[#FFF8F5]"
              : "border-[#E8E0D5] text-[#6B7280] bg-white"
            }`}
        >
          Cash on Delivery
        </div>
      </div>

      {/* Card brand badges — only visible for online */}
      {selectedMethod === "online" && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-[#F0EBE3] rounded-sm py-1 px-2 text-[#444444] text-[10px] font-medium"
            >
              {card}
            </div>
          ))}
        </div>
      )}

      {/* COD note */}
      {selectedMethod === "cod" && (
        <p className="text-[11px] text-[#6B7280] mb-3">
          Pay with cash when your order is delivered.
        </p>
      )}

      {/* Error message */}
      {error && (
        <p className="text-[11px] text-red-500 mb-3">{error}</p>
      )}

      {/* Place Order button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full bg-[#8B5E3C] justify-center p-3 text-[13px] mt-4 text-[#FFF8F3] rounded-sm cursor-pointer tracking-[0.08em] border-none font-medium inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Processing..." : "Place Order"}
        {!loading && <MdArrowForward />}
      </button>
    </div>
  );
}
