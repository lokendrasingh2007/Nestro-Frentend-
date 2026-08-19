import ProductCard from "@/components/website/ProductCard";
import { fetchProduct } from "@/utils/api";
import LodeMore from "@/components/website/store/LodeMore";

const PER_PAGE = 9;

export default async function StorePage({ searchParams }) {
  const params = await searchParams;

  const rooms      = params.rooms    || "";
  const categories = params.category || "";
  const min        = params.min      || 800;
  const max        = params.max      || 100000;
  const sort       = params.sort     || "";
  const stock      = params.stock    || "";
  const color      = params.color    || "";
  const search     = params.search   || "";
  const page       = Math.max(1, parseInt(params.page || "1"));
  const skip       = (page - 1) * PER_PAGE;

  const products = await fetchProduct({
    rooms,
    category: categories,
    min,
    max,
    sort,
    limit: PER_PAGE,
    skip,
    ...(search !== "" && { search }),
    ...(stock  !== "" && { stock }),
    ...(color  !== "" && { color }),
  });

  const total      = products?.meta?.total ?? products?.data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <>
      {!products.data || products.data.length === 0 ? (
        <div className="w-full text-center py-10 bg-[#FAFAF9] border border-[#E8E0D5] rounded-md">
          <h2 className="text-[#1E1E1E] text-lg font-medium mb-2">No Products Found</h2>
          <p className="text-[#6B7280] text-sm">Try adjusting your filters or search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {products.data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <LodeMore totalPages={totalPages} currentPage={page} />
    </>
  );
}
