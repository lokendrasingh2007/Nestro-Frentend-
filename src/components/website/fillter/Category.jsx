"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function FilterGroup({ title, data, queryKey }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const selectedValues = searchParams.get(queryKey)?.split(",") || [];

  const handleFilter = (item) => {
    const params = new URLSearchParams(searchParams.toString());
    const value = item.slug;

    const currentValues = params.get(queryKey)?.split(",") || [];
    let updatedValues = [];

    if (currentValues.includes(value)) {
      updatedValues = currentValues.filter((slug) => slug !== value);
    } else {
      updatedValues = [...currentValues, value];
    }

    if (updatedValues.length > 0) {
      params.set(queryKey, updatedValues.join(","));
    } else {
      params.delete(queryKey);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-medium capitalize text-[#1E1E1E] mb-3 tracking-[0.03em]">
          {title}
        </div>
        {selectedValues.length > 0 && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete(queryKey);
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="text-[10px] text-[#8B5E3C] mb-3 cursor-pointer tracking-[0.03em] hover:underline block"
          >
            Clear {title}
          </button>
        )}
      </div>
      {data.map((item) => {
        const checked = selectedValues.includes(item.slug);
        return (
          <div
            key={item._id}
            className="flex items-center gap-2.5 mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleFilter(item)}
              className="accent-[#8B5E3C] border-[#8B5E3C] cursor-pointer"
            />
            <span className="text-[12px] capitalize text-[#444444]">
              {item.name}
            </span>
            {item.count && (
              <span className="text-[10px] text-[#6B7280] ml-auto">
                {item.count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
