"use client";

import { useEffect, useState, use } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import Link from "next/link";
import { FiEdit2, FiArrowLeft } from "react-icons/fi";
import { HiOutlineTag, HiOutlineCube, HiOutlinePhotograph } from "react-icons/hi";

export default function ViewProductPage({ params }) {
    const { param } = use(params);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        client.get(`product/${param}`)
            .then((res) => {
                if (res.data.success) {
                    setProduct(res.data.product);
                    setActiveImage(res.data.product.thumbnail || null);
                } else {
                    toast.error("Product not found");
                }
            })
            .catch(() => toast.error("Failed to load product"))
            .finally(() => setLoading(false));
    }, [param]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd]">
                <div className="w-10 h-10 rounded-full border-4 border-[#eef0f8] border-t-[#3b497e] animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd]">
                <p className="text-gray-500 text-sm">Product not found.</p>
            </div>
        );
    }

    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

    const badge = (val, trueLabel = "Yes", falseLabel = "No") => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${val ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {val ? trueLabel : falseLabel}
        </span>
    );

    return (
        <div className="min-h-screen bg-[#f7f8fd] p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                    <Link href="/admin/product">
                        <button className="flex items-center gap-1.5 text-sm text-[#3b497e] hover:underline">
                            <FiArrowLeft size={16} /> Back
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-semibold text-[#2a3460]">{product.name}</h1>
                        <p className="text-xs text-[#7a84a6] font-mono">{product.slug}</p>
                    </div>
                </div>
                <Link href={`/admin/product/edit/${param}`}>
                    <button className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition">
                        <FiEdit2 size={14} /> Edit Product
                    </button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">

                {/* Left — Images */}
                <div className="flex flex-col gap-3">
                    {/* Main Image */}
                    <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm overflow-hidden">
                        {activeImage ? (
                            <img src={activeImage} alt={product.name} className="w-full h-80 object-cover" />
                        ) : (
                            <div className="w-full h-80 flex items-center justify-center bg-gray-50 text-gray-300">
                                <HiOutlinePhotograph size={48} />
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex flex-wrap gap-2">
                            {allImages.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`img-${i}`}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-16 h-16 object-cover rounded-xl border-2 cursor-pointer transition ${activeImage === img ? "border-[#3b497e]" : "border-gray-200 hover:border-gray-400"}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right — Details */}
                <div className="flex flex-col gap-4">

                    {/* Pricing */}
                    <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <HiOutlineTag size={16} className="text-[#3b497e]" />
                            <h2 className="text-[14px] font-semibold text-[#2a3460]">Pricing</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-[#f7f8fd] rounded-xl p-3 text-center">
                                <p className="text-[10px] text-gray-400 mb-1">Original Price</p>
                                <p className="text-lg font-bold text-gray-700">₹{product.originalPrice?.toLocaleString()}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] text-gray-400 mb-1">Sale Price</p>
                                <p className="text-lg font-bold text-green-600">₹{product.salePrice?.toLocaleString()}</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] text-gray-400 mb-1">Discount</p>
                                <p className="text-lg font-bold text-orange-500">{product.discount}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <HiOutlineCube size={16} className="text-[#3b497e]" />
                            <h2 className="text-[14px] font-semibold text-[#2a3460]">Product Details</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { label: "Category", value: product.categoryId?.name || "—" },
                                { label: "Room Type", value: product.roomId?.name || "—" },
                                { label: "Material", value: product.material || "—" },
                                { label: "Color", value: product.color || "—" },
                                { label: "Weight", value: product.weight ? `${product.weight} kg` : "—" },
                                { label: "Width", value: product.dimensions?.width ? `${product.dimensions.width} cm` : "—" },
                                { label: "Height", value: product.dimensions?.height ? `${product.dimensions.height} cm` : "—" },
                                { label: "Depth", value: product.dimensions?.depth ? `${product.dimensions.depth} cm` : "—" },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</span>
                                    <span className="text-[13px] font-medium text-gray-700 capitalize">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-5">
                        <h2 className="text-[14px] font-semibold text-[#2a3460] mb-4">Status & Flags</h2>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-400">Active</span>
                                {badge(product.status, "Active", "Inactive")}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-400">In Stock</span>
                                {badge(product.stock, "In Stock", "Out of Stock")}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-400">Best Seller</span>
                                {badge(product.bestSeller)}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-400">New Arrival</span>
                                {badge(product.newArrival)}
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-400">Featured</span>
                                {badge(product.featured)}
                            </div>
                        </div>
                    </div>

                    {/* Short Description */}
                    {product.shortDescription && (
                        <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-5">
                            <h2 className="text-[14px] font-semibold text-[#2a3460] mb-2">Short Description</h2>
                            <p className="text-[13px] text-gray-600 leading-relaxed">{product.shortDescription}</p>
                        </div>
                    )}

                    {/* Description */}
                    {product.description && (
                        <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-5">
                            <h2 className="text-[14px] font-semibold text-[#2a3460] mb-2">Description</h2>
                            <div className="text-[13px] text-gray-600 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                        </div>
                    )}

                    {/* SEO */}
                    {(product.seoTitle || product.seoDescription) && (
                        <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-sm p-5">
                            <h2 className="text-[14px] font-semibold text-[#2a3460] mb-3">SEO</h2>
                            {product.seoTitle && (
                                <div className="mb-2">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">SEO Title</p>
                                    <p className="text-[13px] text-gray-700">{product.seoTitle}</p>
                                </div>
                            )}
                            {product.seoDescription && (
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">SEO Description</p>
                                    <p className="text-[13px] text-gray-600">{product.seoDescription}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
