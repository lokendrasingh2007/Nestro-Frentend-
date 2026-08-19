"use client";
import { GoArrowRight } from "react-icons/go";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";

export default function LodeMore({ totalPages = 1, currentPage = 1 }) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`?${params.toString()}`);
    // Scroll to top of product grid
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Build page numbers with ellipsis
  const buildPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const pages = buildPages();

  return (
    <>
      {/* Promo banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-5 py-4 px-4 sm:px-6 bg-[#2C2016] rounded-[10px]">
        <div className="text-center sm:text-left">
          <div className="text-[12px] text-[#D6BFA7] tracking-[0.06em]">Limited Time Offer</div>
          <div className="text-[14px] sm:text-[16px] font-normal text-[#FAF7F4] my-1">
            Free White Glove Delivery on orders above ₹75,000
          </div>
        </div>
        <button className="bg-[#8B5E3C] text-[#FFF8F3] text-[11px] px-4 py-2 tracking-[0.08em] rounded-sm cursor-pointer border-none font-medium inline-flex items-center gap-2 whitespace-nowrap">
          Shop Now <GoArrowRight className="text-[12px]" />
        </button>
      </div>

      {/* Pagination — only show if more than 1 page */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-7 mb-2">
          {/* Prev */}
          <div
            onClick={() => goToPage(currentPage - 1)}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-[12px] border-[0.5px] border-[#E8E0D5] text-[#444444]
              ${currentPage === 1 ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#F5F0EB]"}`}
          >
            <IoChevronBackOutline />
          </div>

          {/* Page numbers */}
          {pages.map((page, index) => (
            <div
              key={index}
              onClick={() => typeof page === "number" && goToPage(page)}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-[12px] border-[0.5px]
                ${page === "..."
                  ? "border-transparent text-[#6B7280] cursor-default"
                  : page === currentPage
                    ? "bg-[#8B5E3C] text-white border-[#8B5E3C] cursor-pointer"
                    : "border-[#E8E0D5] text-[#444444] cursor-pointer hover:bg-[#F5F0EB]"
                }`}
            >
              {page}
            </div>
          ))}

          {/* Next */}
          <div
            onClick={() => goToPage(currentPage + 1)}
            className={`w-8 h-8 rounded-md flex items-center justify-center text-[12px] border-[0.5px] border-[#E8E0D5] text-[#444444]
              ${currentPage === totalPages ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-[#F5F0EB]"}`}
          >
            <IoChevronForwardOutline />
          </div>
        </div>
      )}

      {/* Page info */}
      {totalPages > 1 && (
        <div className="text-center text-[11px] text-[#6B7280] mt-2 pb-8">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </>
  );
}
