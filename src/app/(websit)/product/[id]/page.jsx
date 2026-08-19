import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GoArrowLeft } from "react-icons/go";
import { LuCheck } from "react-icons/lu";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { TbShoppingBag } from "react-icons/tb";
import { ImLoop2 } from "react-icons/im";
import { FaPencilRuler } from "react-icons/fa";
import { TbShieldBolt, TbTruckDelivery } from "react-icons/tb";
import { fetchProductById, fetchColors } from '@/utils/api';
import ImageProduct from '@/components/website/product/ImageProduct';
import ProductColor from '@/components/website/product/ProductColor';
import ProductDecription from '@/components/website/product/ProductDecription';
import NewProduct from '@/components/website/product/NewProduct';
import AddToCartButton from '@/components/website/product/AddToCartButton';

export default async function Page({ params }) {
  const { id } = await params;
  const res = await fetchProductById(id);

  if (!res.success || !res.data) return notFound();

  const product = res.data;
  const colorResponse = await fetchColors({ status: true });
  const colorOption = colorResponse.data?.find(
    (item) => item.name?.toLowerCase() === product.color?.toLowerCase()
  );
  const colorLabel = colorOption?.name || product.color;
  const colorSwatch = colorOption?.hex || product.color;
  const discount = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);

  const features = [
    { icon: <TbTruckDelivery className="text-[#8B5E3C] text-[16px]" />, description: "Free delivery on orders above ₹50,000" },
    { icon: <ImLoop2 className="text-[#8B5E3C] text-[16px]" />, description: "30-day hassle-free returns" },
    { icon: <FaPencilRuler className="text-[#8B5E3C] text-[16px]" />, description: "Free expert assembly included" },
    { icon: <TbShieldBolt className="text-[#8B5E3C] text-[16px]" />, description: "5-year manufacturer warranty" },
  ];

  return (
    <div className="">
      <Link href="/store">
        <span className="px-7 pt-4.5 pb-0 flex items-center gap-2 cursor-pointer text-[#6B7280] text-[12px] tracking-[0.04em] w-fit">
          <GoArrowLeft /> Back
        </span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 px-6 pb-10 gap-6">
        {/* Images */}
        <ImageProduct thumbnail={product.thumbnail} images={product.images} name={product.name} />

        {/* Details */}
        <div className="pl-1 pt-2">
          {/* Category breadcrumb */}
          <div className="text-[10px] text-[#6B7280] uppercase mb-2 tracking-[0.16em]">
            {product.categoryId?.name || "Furniture"}
          </div>

          {/* Name */}
          <h1 className="text-[22px] sm:text-[28px] font-normal mb-2 tracking-[-0.02em] leading-[1.2] text-[#1E1E1E]">
            {product.name}
          </h1>

          {/* Rating + stock */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-4">
            <span className="text-[13px] text-[#C6A27E]">★★★★★</span>
            <span className="text-[11px] sm:text-[12px] text-[#6B7280]">4.9 (48 reviews)</span>
            <div className="w-px h-3.5 bg-[#E8E0D5] hidden sm:block"></div>
            <span className={`text-[11px] sm:text-[12px] flex items-center gap-1 ${product.stock ? "text-[#3B6D11]" : "text-red-500"}`}>
              <LuCheck /> {product.stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-5 pb-5 border-b border-[#E8E0D5]">
            <span className="text-[24px] sm:text-[30px] font-medium text-[#1E1E1E] flex items-center">
              <MdOutlineCurrencyRupee />{product.salePrice?.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.salePrice && (
              <>
                <span className="text-[18px] sm:text-[20px] text-[#6B7280] line-through flex items-center">
                  <MdOutlineCurrencyRupee />{product.originalPrice?.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] sm:text-[12px] text-[#3B6D11] bg-[#EAF3DE] py-0.5 px-2 rounded-[10px] whitespace-nowrap">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Color */}
          {product.color && (
            <ProductColor color={colorSwatch} label={colorLabel} />
          )}

          {/* Add to Cart / Buy Now */}
          <AddToCartButton product={product} />

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
            {features.map((item, index) => (
              <div key={index} className="flex items-center gap-2 py-2 px-3 bg-[#FAFAF9] rounded-lg border border-[#E8E0D5]">
                {item.icon}
                <div className="text-[11px] sm:text-[12px] text-[#444444] leading-tight">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          {/* Description tabs */}
          <ProductDecription
            description={product.description}
            shortDescription={product.shortDescription}
            material={product.material}
            dimensions={product.dimensions}
            weight={product.weight}
          />
        </div>
      </div>

      <NewProduct />
    </div>
  );
}
