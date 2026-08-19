"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import ActionDropdown from "@/components/admin/ActionDropdown";
import TableHeader from "@/components/admin/TableHeader";
import StatusBtn from "@/components/admin/StatusBtn";
import ProductStatus from "@/components/admin/ProductStatus";
import { MdSearch } from "react-icons/md";

export default function Page() {
    const [allProducts, setAllProducts] = useState([]);
    const [filtered, setFiltered]       = useState([]);
    const [loading, setLoading]         = useState(true);
    const [search, setSearch]           = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchProducts = () => {
        setLoading(true);
        client.get("product")
            .then((res) => {
                if (res.data.success) {
                    setAllProducts(res.data.products || []);
                    setFiltered(res.data.products || []);
                }
            })
            .catch(() => toast.error("Failed to load products"))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchProducts(); }, []);

    // Filter whenever search or status changes
    useEffect(() => {
        let list = [...allProducts];

        if (statusFilter === "active")   list = list.filter((p) => p.status === true);
        if (statusFilter === "inactive") list = list.filter((p) => p.status === false);

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter((p) =>
                p.name?.toLowerCase().includes(q) ||
                p.categoryId?.name?.toLowerCase().includes(q) ||
                p.slug?.toLowerCase().includes(q)
            );
        }

        setFiltered(list);
    }, [search, statusFilter, allProducts]);

    return (
        <div className="min-h-screen p-4 lg:p-6">
            {/* HEADER */}
            <TableHeader title="Products" path="/admin/product/add" />

            {/* MAIN CARD */}
            <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white min-h-87.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">

                {/* FILTER */}
                <div className="border-b border-gray-100 p-4">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
                        {/* SEARCH */}
                        <div className="relative lg:col-span-8">
                            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="h-11 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-xs font-medium text-gray-700 outline-none transition-all focus:border-black focus:bg-white focus:ring-4 focus:ring-black/5"
                            />
                        </div>
                        {/* STATUS */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 outline-none transition-all focus:border-black focus:ring-4 focus:ring-black/5 lg:col-span-2 cursor-pointer"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {/* Count */}
                        <div className="lg:col-span-2 flex items-center justify-end text-xs text-gray-400">
                            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
                        </div>
                    </div>
                </div>

                {/* TABLE HEADER */}
                <div className="hidden lg:grid grid-cols-12 border-b border-gray-100 bg-gray-50 px-6 py-4">
                    {["Thumbnail", "Product Name", "Category", "Price", "Status", "Flags", "Action"].map((h, i) => (
                        <div key={h} className={`${i === 6 ? "col-span-1 text-right" : i === 5 ? "col-span-3" : i <= 1 ? "col-span-1" : "col-span-2"}`}>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{h}</p>
                        </div>
                    ))}
                </div>

                {/* TABLE BODY */}
                <div>
                    {loading ? (
                        <div className="flex min-h-75 items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#3b497e] animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex min-h-75 items-center justify-center">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800">No Products Found</h2>
                                <p className="mt-2 text-sm text-gray-500">
                                    {search ? `No results for "${search}"` : "There are no products available right now."}
                                </p>
                            </div>
                        </div>
                    ) : (
                        filtered.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="grid grid-cols-1 gap-4 border-b border-gray-100 px-6 py-5 transition-all duration-300 hover:bg-gray-50 lg:grid-cols-12 lg:items-center"
                            >
                                {/* MOBILE CARD */}
                                <div className="flex items-center gap-4 lg:hidden">
                                    <img src={item.thumbnail} alt={item.name} className="h-16 w-16 rounded-xl border object-cover" />
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-gray-900">{item.name}</h2>
                                        <p className="mt-1 text-sm text-gray-500">{item?.categoryId?.name}</p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="font-semibold text-green-600">₹{item.salePrice}</span>
                                            <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                                            <span className="text-xs font-medium text-red-500">{item.discount}% OFF</span>
                                        </div>
                                    </div>
                                </div>

                                {/* THUMBNAIL */}
                                <div className="hidden lg:flex lg:col-span-1">
                                    <img src={item.thumbnail} alt={item.name} className="h-14 w-14 rounded-xl border object-cover" />
                                </div>

                                {/* PRODUCT NAME */}
                                <div className="lg:col-span-2">
                                    <h2 className="truncate text-sm font-semibold text-gray-900">{item.name}</h2>
                                </div>

                                {/* CATEGORY */}
                                <div className="hidden lg:block lg:col-span-2">
                                    <span className="inline-flex rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                                        {item?.categoryId?.name}
                                    </span>
                                </div>

                                {/* PRICE */}
                                <div className="hidden lg:block lg:col-span-2">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-green-600">₹{item.salePrice}</span>
                                        <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                                        <span className="text-xs font-medium text-red-500">{item.discount}% OFF</span>
                                    </div>
                                </div>

                                {/* STATUS */}
                                <div className="lg:col-span-1">
                                    <StatusBtn
                                        status={item.status}
                                        path={`product/status-update/${item._id}`}
                                        onToggle={() =>
                                            setAllProducts((prev) =>
                                                prev.map((p) =>
                                                    p._id === item._id ? { ...p, status: !p.status } : p
                                                )
                                            )
                                        }
                                    />
                                </div>

                                {/* FLAGS */}
                                <div className="lg:col-span-3">
                                    <div className="flex flex-wrap gap-2">
                                        <ProductStatus status={item.bestSeller} flag="bestSeller" id={item._id}
                                            onToggle={() => setAllProducts((prev) => prev.map((p) => p._id === item._id ? { ...p, bestSeller: !p.bestSeller } : p))} />
                                        <ProductStatus status={item.stock}      flag="stock"      id={item._id}
                                            onToggle={() => setAllProducts((prev) => prev.map((p) => p._id === item._id ? { ...p, stock: !p.stock } : p))} />
                                        <ProductStatus status={item.newArrival} flag="newArrival" id={item._id}
                                            onToggle={() => setAllProducts((prev) => prev.map((p) => p._id === item._id ? { ...p, newArrival: !p.newArrival } : p))} />
                                        <ProductStatus status={item.featured}   flag="featured"   id={item._id}
                                            onToggle={() => setAllProducts((prev) => prev.map((p) => p._id === item._id ? { ...p, featured: !p.featured } : p))} />
                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="hidden justify-end lg:flex lg:col-span-1">
                                    <ActionDropdown module="product" id={item._id} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
