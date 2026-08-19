"use client";

import { client, generateSlug } from "@/utils/helper";
import { useEffect, useState, use } from "react";
import Select from 'react-select';
import { FiSave, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchCategoryById, fetchRooms } from "@/utils/api";
import Link from "next/link";

export default function EditCategoryPage({ params }) {
    const { param } = use(params); // category ID
    const router = useRouter();

    const [wait, setWait] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        roomId: "",
        image: null,           // new image file (if changed)
    });
    const [existingImage, setExistingImage] = useState(""); // URL of current image
    const [isImageChanged, setIsImageChanged] = useState(false);

    // Auto-generate slug when name changes
    const handleNameChange = (value) => {
        const slug_value = generateSlug(value);
        setFormData(prev => ({
            ...prev,
            name: value,
            slug: slug_value
        }));
    };

    // Handle new image selection
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
            setIsImageChanged(true);
        }
    };

    // Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setWait(true);

        try {
            const sendData = new FormData();
            sendData.append("name", formData.name);
            sendData.append("slug", formData.slug);
            sendData.append("roomId", formData.roomId);
            if (isImageChanged && formData.image) {
                sendData.append("image", formData.image);
            }

            // Use PUT/PATCH endpoint – adjust to your backend
            const response = await client.put(`category/update/${param}`, sendData);

            if (response.data.success) {
                toast.success(response.data.message);
                router.push("/admin/category");
            } else {
                toast.error(response.data.message || "Update failed");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setWait(false);
        }
    };

    // Fetch rooms for dropdown
    useEffect(() => {
        async function getRooms() {
            const response = await fetchRooms();
            if (response.success) {
                setRooms(response.data);
            } else {
                setRooms([]);
            }
        }
        getRooms();
    }, []);

    // Fetch existing category data
    useEffect(() => {
        async function getCategory() {
            const response = await fetchCategoryById(param);
            if (response.success && response.data) {
                const cat = response.data;
                setFormData({
                    name: cat.name || "",
                    slug: cat.slug || "",
                    roomId: cat.roomId || "",
                    image: null,
                });
                setExistingImage(cat.image || "");
                setIsImageChanged(false);
            } else {
                toast.error("Failed to load category data");
            }
        }
        if (param) getCategory();
    }, [param]);

    // Prepare room options for react-select
    const roomOptions = rooms.map(room => ({
        value: room._id,
        label: room.name
    }));

    // Find selected room value
    const selectedRoom = roomOptions.find(option => option.value === formData.roomId);

    return (
        <div className="min-h-screen mx-auto bg-[#f7f8fd] p-6">
            {/* Header */}
            <div className="mb-6 mx-auto w-2xl">
                <h1 className="text-2xl font-semibold text-[#2a3460]">Edit Category</h1>
                <p className="text-sm text-[#7a84a6] mt-1">Update category details</p>
            </div>

            {/* Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                    <FiTag size={18} />
                    <h2 className="text-[15px] font-semibold">Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Electronics"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            readOnly
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none bg-gray-50"
                        />
                        <span className="text-[11px] text-[#7a84a6]">URL friendly category identifier</span>
                    </div>

                   

                    {/* Image */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Image</label>

                        {/* Existing image preview */}
                        {existingImage && !isImageChanged && (
                            <div className="mb-2">
                                <p className="text-xs text-gray-500 mb-1">Current image:</p>
                                <img src={existingImage} alt="Current" className="w-28 h-28 object-cover rounded-xl border" />
                            </div>
                        )}

                        {/* New image input */}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c]"
                        />

                        {/* New image preview */}
                        {isImageChanged && formData.image && (
                            <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">New preview:</p>
                                <img src={URL.createObjectURL(formData.image)} alt="Preview" className="w-28 h-28 object-cover rounded-xl border" />
                            </div>
                        )}
                        <span className="text-[11px] text-[#7a84a6]">Leave empty to keep current image</span>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href="/admin/category">
                            <button
                                type="button"
                                className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb] transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </Link>

                        {!wait && (
                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition-colors cursor-pointer"
                            >
                                <FiSave size={16} />
                                Update Category
                            </button>
                        )}

                        {wait && (
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-5 py-2.5 rounded-xl cursor-not-allowed"
                                disabled
                            >
                                Updating...
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}