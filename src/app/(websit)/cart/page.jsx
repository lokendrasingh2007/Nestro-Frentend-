"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  cartTotal,
  emptyCart,
  lsToCart,
} from "@/redex/features/CartSlice";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { TbTrash, TbShoppingBag } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { FaPencilRuler } from "react-icons/fa";
import { TbShieldBolt, TbTruckDelivery } from "react-icons/tb";
import { LuSofa } from "react-icons/lu";

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, final_total, original_total } = useSelector(
    (state) => state.cart
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    dispatch(lsToCart());
    dispatch(cartTotal());
  }, [dispatch]);

  // Prevent hydration mismatch by only showing client-driven values after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = original_total;
  const deliveryCharge = subtotal > 50000 ? 0 : 1000;
  const total = final_total + deliveryCharge;

  const features = [
    { icon: <TbTruckDelivery />, text: "Free delivery on orders above ₹50,000" },
    { icon: <ImLoop2 />, text: "30-day hassle-free returns" },
    { icon: <FaPencilRuler />, text: "Free expert assembly included" },
    { icon: <TbShieldBolt />, text: "5-year manufacturer warranty" },
  ];

  // Helper functions using Redux actions
  const updateQuantity = (item, newQty) => {
    if (newQty < 1) return;
    if (newQty > item.qty) {
      dispatch(increaseQuantity(item));
    } else if (newQty < item.qty) {
      dispatch(decreaseQuantity(item));
    }
  };

  const removeItem = (item) => {
    dispatch(removeFromCart(item));
  };

  return (
    <div className="w-full bg-[#F8F5F1] min-h-screen py-6 sm:py-8">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link href="/store">
          <div className="flex items-center gap-2 text-[#6B7280] text-[12px] tracking-[0.04em] mb-5 hover:text-[#8B5E3C] transition">
            <GoArrowLeft />
            Continue Shopping
          </div>
        </Link>

        <h1 className="text-[24px] sm:text-[28px] font-normal text-[#1E1E1E] tracking-[-0.02em] mb-6">
          Shopping Cart
          <span className="text-[14px] text-[#6B7280] ml-2 font-normal">
            {mounted ? `(${items.length} items)` : ""}
          </span>
        </h1>

        {mounted && (items.length === 0 ? (
          <div className="bg-white border border-[#E8E0D5] rounded-xl p-12 text-center">
            <div className="text-[#C6A27E] text-5xl mb-4">
              <TbShoppingBag className="mx-auto" />
            </div>
            <h2 className="text-xl font-medium text-[#1E1E1E] mb-2">
              Your cart is empty
            </h2>
            <p className="text-[#6B7280] text-sm mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Link
              href="/store"
              className="inline-block bg-[#8B5E3C] text-white py-2 px-6 rounded-md text-sm hover:bg-[#7a4f32] transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : null)}
        {!mounted && (
          <div className="bg-white border border-[#E8E0D5] rounded-xl p-6 text-center">
            <div className="text-[#6B7280]">Loading cart…</div>
          </div>
        )}
          {mounted && items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E8E0D5] rounded-xl overflow-hidden">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-[#FAFAF9] border-b border-[#E8E0D5] text-[11px] uppercase text-[#6B7280] tracking-wide">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                {/* Cart Items */}
                {items.map((item, idx) => (
                  <div
                    key={item.id || `item-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-b border-[#E8E0D5] last:border-0"
                  >
                    {/* Product image & info */}
                    <div className="flex gap-4 flex-1">
                      <div className="w-20 h-20 bg-[#F5F0EB] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                        {item.thumbnail || item.image ? (
                          <Image
                            src={item.thumbnail || item.image}
                            alt={item.title || item.name || "Product"}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <span className="text-[#C6A27E] text-2xl"><LuSofa /></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[13px] font-medium text-[#1E1E1E]">
                          {item.title || item.name}
                        </h3>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">
                          {item.variant || "Standard"}
                        </p>
                        <p className="text-[11px] text-[#6B7280]  mt-0.5">
                          Premium quality product
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px] text-[#71b737] flex items-center gap-1">
                            ✓ In Stock
                          </span>

                          <button
                            onClick={() => removeItem(item)}
                            className="text-[#6B7280] hover:text-[#8B5E3C] transition cursor-pointer hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <TbTrash /> Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price - mobile & desktop */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                      <div className="sm:w-24 text-left sm:text-center">
                        <span className="text-[12px] text-[#6B7280] sm:hidden block text-left">Price:</span>
                        <span className="text-[13px] font-medium text-[#1E1E1E] flex items-center">
                          <MdOutlineCurrencyRupee /> 
                          {(() => {
                            const price = Number(item.salePrice) || Number(item.price) || 0;
                            return isNaN(price) ? '0' : price.toLocaleString();
                          })()}
                        </span>
                      </div>

                      {/* Quantity selector */}
                      <div className="sm:w-28 text-center">
                        <span className="text-[12px] text-[#6B7280] sm:hidden block">Qty:</span>
                        <div className="flex items-center border border-[#E8E0D5] rounded-md overflow-hidden w-fit sm:mx-auto">
                          <button
                            onClick={() => updateQuantity(item, item.qty - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-[#FAFAF9] text-[#444] text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <div className="w-8 h-7 flex items-center justify-center border-x border-[#E8E0D5] text-sm font-medium">
                            {item.qty}
                          </div>
                          <button
                            onClick={() => updateQuantity(item, item.qty + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-[#FAFAF9] text-[#444] text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="sm:w-24 text-right sm:text-center">
                        <span className="text-[12px] text-[#6B7280] sm:hidden block">Total:</span>
                        <span className="text-[14px] font-semibold text-[#1E1E1E] flex items-center justify-end sm:justify-center">
                          <MdOutlineCurrencyRupee /> 
                          {(() => {
                            const price = Number(item.salePrice) || Number(item.price) || 0;
                            const qty = Number(item.qty) || 1;
                            const total = isNaN(price) || isNaN(qty) ? 0 : price * qty;
                            return total.toLocaleString();
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Features / trust badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 py-2 px-2 bg-white border border-[#E8E0D5] rounded-lg"
                  >
                    <div className="text-[#8B5E3C] text-lg shrink-0">{feature.icon}</div>
                    <div className="text-[9px] sm:text-[10px] text-[#444] leading-tight">
                      {feature.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E8E0D5] rounded-xl p-5 sticky top-24">
                <h2 className="text-[16px] font-medium text-[#1E1E1E] pb-3 border-b border-[#E8E0D5] mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2.5">
                  <div className="flex justify-between text-[13px] text-[#444]">
                    <span>Subtotal</span>
                    <span className="flex items-center">
                      <MdOutlineCurrencyRupee /> {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#444]">
                    <span>Delivery</span>
                    {deliveryCharge === 0 ? (
                      <span className="text-[#3B6D11]">Free</span>
                    ) : (
                      <span className="flex items-center">
                        <MdOutlineCurrencyRupee /> {deliveryCharge.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-[13px] text-[#444] border-b border-[#E8E0D5] pb-3">
                    <span>Discount</span>
                    <span className="text-[#3B6D11]">- ₹{(original_total - final_total).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[16px] font-semibold text-[#1E1E1E] pt-2">
                    <span>Total</span>
                    <span className="flex items-center">
                      <MdOutlineCurrencyRupee /> {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Promo code */}
                <div className="mt-5 mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 border border-[#E8E0D5] rounded-md px-3 py-2 text-[12px] bg-white focus:outline-none focus:border-[#8B5E3C]"
                    />
                    <button className="bg-[#2C2016] text-[#D6BFA7] px-4 py-2 rounded-md text-[11px] hover:bg-[#3A2A1E] transition">
                      Apply
                    </button>
                  </div>
                </div>

                <Link href="/checkout">
                  <button className="w-full bg-[#8B5E3C] text-white py-3 rounded-md text-[13px] font-medium tracking-wide hover:bg-[#7a4f32] transition cursor-pointer">
                    Go to  Checkout
                  </button>
                </Link>

                <div className="mt-4 text-center text-[10px] text-[#6B7280]">
                  Free delivery on orders above ₹50,000 • 30-day returns
                </div>

                {/* Empty Cart Button (optional) */}
                <button
                  onClick={() => dispatch(emptyCart())}
                  className="w-full mt-4 text-[#6B7280] text-[11px] underline hover:text-[#8B5E3C] transition"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
          )}
      </div>
    </div>
  );
}