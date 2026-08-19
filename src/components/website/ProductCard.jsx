import Link from "next/link";
import Image from "next/image";
import { MdOutlineCurrencyRupee } from "react-icons/md"
import AddtoCartBtn from "./AddtoCartBtn";
export default function ProductCard({ product }) {

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E8E0D5] overflow-hidden relative transition-all duration-200 hover:shadow-md group mx-1 sm:mx-0">
        {/* Image section */}
        <Link href={`/product/${product._id}`}>
          <div className="relative bg-[#F5F0EB] h-36 sm:h-48 overflow-hidden flex items-center justify-center p-3 sm:p-4">
            <Image
              src={product.thumbnail || "/images/placeholder.png"}
              alt={product.name || "Product image"}
              fill
              className="w-full h-full px-0.5 rounded-xl duration-300 group-hover:scale-105 object-cover transition-transform"
            />
            <div className="absolute top-2 left-2 bg-[#8B5E3C] text-white text-[8px] sm:text-[9px] py-0.5 px-1.5 sm:py-1 sm:px-2 rounded-[3px] font-medium tracking-wider">
              - {product.discount} %
            </div>
            <div className="absolute top-2 right-2 bg-[#8B5E3C] text-white text-[8px] sm:text-[9px] py-0.5 px-1.5 sm:py-1 sm:px-2 rounded-[3px] font-medium tracking-wider">
              {product.bestSeller > 0 ? "BestSeller" : "Not BestSeller"}
            </div>
          </div>
        </Link>

        {/* Content */}

        <div className="p-3 sm:p-4">
          {/* Category */}
          <div className="text-[9px] sm:text-[10px] tracking-[0.14em] uppercase text-[#6B7280] mb-1.5">
            {product.categoryId.name}
          </div>

          {/* Title + Add to cart - responsive layout */}
          <AddtoCartBtn product={product} />

          {/* Rating & Price */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[10px] sm:text-[11px] text-[#C6A27E]">★★★★★</span>
              <span className="text-[9px] sm:text-[10px] text-[#6B7280]">(2)</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] sm:text-[11px] text-[#6B7280] line-through flex items-center">
                <MdOutlineCurrencyRupee /> {product.originalPrice}
              </span>
              <span className="text-[13px] sm:text-[14px] text-[#1E1E1E] font-medium flex items-center">
                <MdOutlineCurrencyRupee /> {product.salePrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}