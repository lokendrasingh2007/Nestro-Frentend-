"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { TbShoppingBag } from "react-icons/tb";
import { addToCart } from "@/redex/features/CartSlice";
import { toast } from "sonner";

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [qty, setQty] = useState(1);

  const cartItem = {
    id: product._id,
    title: product.name,
    name: product.name,
    thumbnail: product.thumbnail || null,
    salePrice: product.salePrice,
    originalPrice: product.originalPrice,
    price: product.salePrice,
    slug: product.slug,
  };

  const handleAddToCart = () => {
    if (!product.stock) return;
    // addToCart adds 1 each call — so we dispatch qty times
    for (let i = 0; i < qty; i++) {
      dispatch(addToCart(cartItem));
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <div>
      {/* Quantity selector */}
      <div className="text-[11px] text-[#1E1E1E] uppercase mb-2.5 tracking-[0.04em] font-medium">
        Quantity
      </div>
      <div className="flex flex-wrap items-center gap-4 mb-5">
        <div className="flex items-center border border-[#E8E0D5] rounded-md overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer bg-[#FAFAF9] text-[#444444] text-[14px] transition-all duration-150 hover:bg-[#F0EBE3]"
          >
            -
          </button>
          <div className="w-9 h-8 sm:w-10 sm:h-9 flex items-center justify-center border-l border-r border-[#E8E0D5] font-medium text-sm">
            {qty}
          </div>
          <button
            onClick={() => setQty((q) => Math.min(5, q + 1))}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center cursor-pointer bg-[#FAFAF9] text-[#444444] text-[14px] transition-all duration-150 hover:bg-[#F0EBE3]"
          >
            +
          </button>
        </div>
        <span className="text-[11px] sm:text-[12px] text-[#6B7280]">Max 5 per order</span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className="bg-[#8B5E3C] text-[#FFF8F3] py-2.5 px-4 sm:py-3 sm:px-6 font-medium gap-2 rounded-md text-[12px] cursor-pointer flex flex-1 justify-center items-center hover:bg-[#7a4f32] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TbShoppingBag /> {product.stock ? "Add to Cart" : "Out of Stock"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={!product.stock}
          className="bg-[#2C2016] text-[#D6BFA7] py-2.5 px-4 sm:py-3 sm:px-6 font-medium gap-2 rounded-md text-[12px] cursor-pointer flex flex-1 justify-center items-center hover:bg-[#3a2a1e] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
