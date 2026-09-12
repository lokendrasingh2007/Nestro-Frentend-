"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useState, use } from "react";
import Select from 'react-select';
import { Editor } from 'primereact/editor';
import { FiSave, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchCategory, fetchRooms, fetchColors } from "@/utils/api";
import Link from "next/link";

export default function EditProductPage({ params }) {
    const { param } = use(params);
    const router = useRouter();
    const [wait, setWait] = useState(false);
    const [loading, setLoading] = useState(true);
    const [rooms, setRooms] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    // Thumbnail
    const [existingImage, setExistingImage] = useState("");
    const [isImageChanged, setIsImageChanged] = useState(false);

    // Multiple images
    const [productImages, setProductImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [deletingImg, setDeletingImg] = useState(null);

    const [formData, setFormData] = useState({
        roomId: "",
        categoryId: "",
        name: "",
        slug: "",
        originalPrice: "",
        salePrice: "",
        discount: "",
        shortDescription: "",
        description: "",
        material: "",
        color: "",
        width: "",
        height: "",
        depth: "",
        weight: "",
        seoTitle: "",
        seoDescription: "",
        image: null,
    });

    // Auto generate slug
    const handleNameChange = (value) => {
        setFormData(prev => ({ ...prev, name: value, slug: generateSlug(value) }));
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImage = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
            setIsImageChanged(true);
        }
    };

    // Auto-calculate discount
    useEffect(() => {
        const orig = Number(formData.originalPrice);
        const sale = Number(formData.salePrice);
        if (orig > 0 && sale >= 0 && sale <= orig) {
            setFormData(prev => ({ ...prev, discount: Math.round(((orig - sale) / orig) * 100) }));
        } else {
            setFormData(prev => ({ ...prev, discount: "" }));
        }
    }, [formData.originalPrice, formData.salePrice]);

    // Fetch dropdowns + product data
    useEffect(() => {
        async function init() {
            try {
                const [roomRes, catRes, colorRes, productRes] = await Promise.all([
                    fetchRooms(),
                    fetchCategory(),
                    fetchColors({ status: true }),
                    client.get(`product/${param}`)
                ]);

                setRooms(roomRes.data || []);
                setCategories(catRes.data || []);
                setColors(colorRes.data || []);

                const p = productRes.data.product;
                if (p) {
                    setFormData({
                        roomId:           p.roomId?._id || p.roomId || "",
                        categoryId:       p.categoryId?._id || p.categoryId || "",
                        name:             p.name || "",
                        slug:             p.slug || "",
                        originalPrice:    p.originalPrice || "",
                        salePrice:        p.salePrice || "",
                        discount:         p.discount || "",
                        shortDescription: p.shortDescription || "",
                        description:      p.description || "",
                        material:         p.material || "",
                        color:            p.color || "",
                        width:            p.dimensions?.width || "",
                        height:           p.dimensions?.height || "",
                        depth:            p.dimensions?.depth || "",
                        weight:           p.weight || "",
                        seoTitle:         p.seoTitle || "",
                        seoDescription:   p.seoDescription || "",
                        image:            null,
                    });
                    setExistingImage(p.thumbnail || "");
                    setProductImages(p.images || []);
                } else {
                    toast.error("Product not found");
                }
            } catch (err) {
                toast.error("Failed to load product data");
            } finally {
                setLoading(false);
            }
        }
        if (param) init();
    }, [param]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setWait(true);
            const sendData = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "image") {
                    if (isImageChanged && formData.image) sendData.append("image", formData.image);
                } else {
                    sendData.append(key, formData[key]);
                }
            });
            const response = await client.put(`product/update/${param}`, sendData);
            if (response.data.success) {
                toast.success(response.data.message || "Product updated!");
                router.push("/admin/product");
            } else {
                toast.error(response.data.message || "Update failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setWait(false);
        }
    };

    // Upload multiple images
    const handleUploadImages = async () => {
        if (newImages.length === 0) return toast.error("Please select images first");
        try {
            setUploadingImages(true);
            const formDataImg = new FormData();
            newImages.forEach((file) => formDataImg.append("images", file));
            const res = await client.post(`product/add-multiple-images/${param}`, formDataImg, {
                timeout: 120000,
            });
            if (res.data.success) {
                toast.success("Images uploaded!");
                setNewImages([]);
                // Refresh product images
                const refreshed = await client.get(`product/${param}`);
                setProductImages(refreshed.data.product?.images || []);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setUploadingImages(false);
        }
    };

    // Delete single image
    const handleDeleteImage = async (imageUrl) => {
        try {
            setDeletingImg(imageUrl);
            const res = await client.delete(`product/delete-image/${param}`, { data: { imageUrl } });
            if (res.data.success) {
                toast.success("Image removed!");
                setProductImages(res.data.images || []);
            }
        } catch (err) {
            toast.error("Failed to remove image");
        } finally {
            setDeletingImg(null);
        }
    };

    // Select options
    const roomOptions     = rooms.map(r => ({ value: r._id, label: r.name }));
    const categoryOptions = categories.map(c => ({ value: c._id, label: c.name }));
    const colorOptions    = colors.map(c => ({
        value: c.name,
        label: (
            <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
                <span className="text-[10px] font-mono text-gray-400">{c.hex}</span>
            </div>
        )
    }));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f7f8fd]">
                <div className="w-10 h-10 rounded-full border-4 border-[#eef0f8] border-t-[#3b497e] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen mx-auto bg-[#f7f8fd] p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">
                {/* Card Header */}
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                    <FiTag size={18} />
                    <h2 className="text-[15px] font-semibold">Edit Product</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">

                    {/* Name + Slug */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#2a3460]">Product Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-[#2a3460]">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                readOnly
                                className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm bg-gray-50 outline-none"
                            />
                        </div>
                    </div>

                    {/* Room + Category */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Room *</label>
                            <Select
                                instanceId="edit-select-room"
                                options={roomOptions}
                                value={roomOptions.find(o => o.value === formData.roomId) || null}
                                onChange={(s) => setFormData(prev => ({ ...prev, roomId: s?.value || "" }))}
                                placeholder="Select room"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Category *</label>
                            <Select
                                instanceId="edit-select-category"
                                options={categoryOptions}
                                value={categoryOptions.find(o => o.value === formData.categoryId) || null}
                                onChange={(s) => setFormData(prev => ({ ...prev, categoryId: s?.value || "" }))}
                                placeholder="Select category"
                            />
                        </div>
                    </div>

                    {/* Prices */}
                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Original Price *</label>
                            <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} placeholder="Original Price" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Sale Price *</label>
                            <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} placeholder="Sale Price" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Discount %</label>
                            <input type="number" name="discount" value={formData.discount} readOnly placeholder="Auto" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full bg-gray-50 outline-none" />
                        </div>
                    </div>

                    {/* Material + Color + Weight */}
                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Material</label>
                            <input type="text" name="material" value={formData.material} onChange={handleChange} placeholder="Material" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Color</label>
                            <Select
                                instanceId="edit-select-color"
                                options={colorOptions}
                                value={colorOptions.find(o => o.value === formData.color) || null}
                                onChange={(s) => setFormData(prev => ({ ...prev, color: s?.value || "" }))}
                                placeholder="Select color..."
                                isClearable
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Weight (KG)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid md:grid-cols-3 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Width</label>
                            <input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="Width" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Height</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Height" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Depth</label>
                            <input type="number" name="depth" value={formData.depth} onChange={handleChange} placeholder="Depth" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Short Description</label>
                        <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={3} placeholder="Short Description" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                    </div>

                    {/* Description Editor */}
                    <div>
                        <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Description</label>
                        <div className="border-[1.5px] border-[#c3c9e3] rounded-xl overflow-hidden">
                            <Editor
                                value={formData.description}
                                onTextChange={(e) => setFormData(prev => ({ ...prev, description: e.htmlValue }))}
                                style={{ minHeight: "200px" }}
                            />
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">SEO Title</label>
                            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="SEO Title" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">SEO Description</label>
                            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={3} placeholder="SEO Description" className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm w-full outline-none focus:border-[#3b497e] transition" />
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Thumbnail</label>
                        {existingImage && !isImageChanged && (
                            <div className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                <img src={existingImage} alt="Current" className="w-28 h-28 object-cover rounded-xl border" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c]"
                        />
                        {isImageChanged && formData.image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">New preview:</p>
                                <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-28 h-28 object-cover rounded-xl border" />
                            </div>
                        )}
                        <span className="text-[11px] text-[#7a84a6]">Leave empty to keep current image</span>
                    </div>

                    {/* Multiple Images */}
                    <div className="flex flex-col gap-2 border-[1.5px] border-[#c3c9e3] rounded-xl p-4">
                        <label className="text-xs font-semibold text-[#2a3460]">Product Gallery Images</label>

                        {/* Existing images */}
                        {productImages.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-2">
                                {productImages.map((img, i) => (
                                    <div key={i} className="relative group">
                                        <img src={img} alt={`img-${i}`} className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteImage(img)}
                                            disabled={deletingImg === img}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                                        >
                                            {deletingImg === img ? "..." : "✕"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New images selector */}
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setNewImages(Array.from(e.target.files))}
                            className="border-[1.5px] border-dashed border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c]"
                        />

                        {/* New images preview */}
                        {newImages.length > 0 && (
                            <div className="flex flex-wrap gap-3 mt-2">
                                {newImages.map((file, i) => (
                                    <img key={i} src={URL.createObjectURL(file)} alt={`new-${i}`} className="w-24 h-24 object-cover rounded-xl border border-dashed border-[#3b497e]" />
                                ))}
                            </div>
                        )}

                        {/* Upload button */}
                        {newImages.length > 0 && (
                            <button
                                type="button"
                                onClick={handleUploadImages}
                                disabled={uploadingImages}
                                className="mt-2 inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50 w-fit"
                            >
                                {uploadingImages ? "Uploading..." : `Upload ${newImages.length} Image${newImages.length > 1 ? "s" : ""}`}
                            </button>
                        )}
                        <span className="text-[11px] text-[#7a84a6]">Max 8 images. Hover over existing images to delete.</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href="/admin/product">
                            <button type="button" className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb] transition cursor-pointer">
                                Cancel
                            </button>
                        </Link>
                        {!wait ? (
                            <button type="submit" className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition cursor-pointer">
                                <FiSave size={16} /> Update Product
                            </button>
                        ) : (
                            <button type="button" disabled className="bg-gray-400 text-white px-5 py-2.5 rounded-xl cursor-not-allowed">
                                Updating...
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
