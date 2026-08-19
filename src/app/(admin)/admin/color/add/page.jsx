"use client";

import { client } from "@/utils/helper";
import { useState } from "react";
import { FiSave, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddColorPage() {
    const router = useRouter();
    const [wait, setWait] = useState(false);
    const [formData, setFormData] = useState({ name: "", hex: "#8B5E3C" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setWait(true);
            const response = await client.post("color/create", formData);
            if (response.data.success) {
                toast.success(response.data.message);
                setFormData({ name: "", hex: "#8B5E3C" });
                router.push("/admin/color");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setWait(false);
        }
    };

    return (
        <div className="min-h-screen mx-auto bg-[#f7f8fd] p-6">
            {/* Header */}
            <div className="mb-6 mx-auto w-2xl">
                <h1 className="text-2xl font-semibold text-[#2a3460]">Add Color</h1>
                <p className="text-sm text-[#7a84a6] mt-1">Create a new product color option</p>
            </div>

            {/* Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">
                {/* Card Header */}
                <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                    <FiTag size={18} />
                    <h2 className="text-[15px] font-semibold">Information</h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-5">

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Color Name *</label>
                        <input
                            type="text"
                            placeholder="e.g. Midnight Black"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                            required
                            disabled={wait}
                        />
                    </div>

                    {/* Hex Picker */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Hex Code *</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={formData.hex}
                                onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                                className="w-14 h-14 rounded-xl border-[1.5px] border-[#c3c9e3] cursor-pointer p-1"
                                disabled={wait}
                            />
                            <input
                                type="text"
                                value={formData.hex}
                                onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                                placeholder="#000000"
                                className="flex-1 border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-3 text-sm text-[#3a3f5c] font-mono outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                                disabled={wait}
                            />
                        </div>
                        <span className="text-[11px] text-[#7a84a6]">Pick from color picker or enter hex manually</span>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#2a3460]">Preview</label>
                        <div className="flex items-center gap-3 p-3 border-[1.5px] border-[#c3c9e3] rounded-xl bg-gray-50">
                            <div className="w-10 h-10 rounded-xl border border-gray-200 shadow-sm shrink-0" style={{ backgroundColor: formData.hex }} />
                            <div>
                                <p className="text-sm font-medium text-[#2a3460]">{formData.name || "Color Name"}</p>
                                <p className="text-xs font-mono text-[#7a84a6]">{formData.hex}</p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link href="/admin/color">
                            <button type="button" className="px-5 py-2.5 rounded-xl border-[1.5px] border-[#c3c9e3] text-sm font-medium text-[#3a3f5c] hover:bg-[#f4f5fb] transition">
                                Cancel
                            </button>
                        </Link>
                        {!wait ? (
                            <button type="submit" className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition">
                                <FiSave size={16} /> Save Color
                            </button>
                        ) : (
                            <button type="button" disabled className="bg-gray-400 text-white px-5 py-2.5 rounded-xl text-sm">
                                Saving...
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
