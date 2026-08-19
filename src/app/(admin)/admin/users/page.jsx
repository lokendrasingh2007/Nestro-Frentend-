"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { FiSave, FiUsers, FiEdit2, FiX } from "react-icons/fi";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const emptyForm    = { firstName: "", lastName: "", email: "", password: "", phone: "", role: "admin" };
const emptyEditForm = { firstName: "", lastName: "", phone: "", role: "admin" };

export default function AdminUsersPage() {
    const [users, setUsers]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showForm, setShowForm]   = useState(false);
    const [form, setForm]           = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [showPw, setShowPw]       = useState(false);

    // Edit state
    const [editUser, setEditUser]     = useState(null);   // user object being edited
    const [editForm, setEditForm]     = useState(emptyEditForm);
    const [editSaving, setEditSaving] = useState(false);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await client.get("user/admin/users");
            if (res.data.success) setUsers(res.data.users || []);
        } catch {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    // ── Create ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.firstName || !form.lastName || !form.email || !form.password)
            return toast.error("All required fields must be filled");
        if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
        try {
            setSubmitting(true);
            const res = await client.post("user/admin/create", form);
            if (res.data.success) {
                toast.success("Admin user created successfully!");
                setForm(emptyForm);
                setShowForm(false);
                fetchUsers();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        } finally {
            setSubmitting(false);
        }
    };

    // ── Open edit modal ───────────────────────────────────────────────────────
    const openEdit = (u) => {
        setEditUser(u);
        setEditForm({
            firstName: u.firstName || "",
            lastName:  u.lastName  || "",
            phone:     u.mobile    || "",
            role:      u.role      || "admin",
        });
    };

    // ── Save edit ─────────────────────────────────────────────────────────────
    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!editForm.firstName || !editForm.lastName)
            return toast.error("First and last name are required");
        try {
            setEditSaving(true);
            const res = await client.patch(`user/admin/users/${editUser._id}`, editForm);
            if (res.data.success) {
                toast.success("User updated successfully!");
                setEditUser(null);
                fetchUsers();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update user");
        } finally {
            setEditSaving(false);
        }
    };

    const roleColor = (role) => {
        if (role === "super_admin") return "bg-purple-100 text-purple-700";
        if (role === "admin")       return "bg-blue-100 text-blue-700";
        return "bg-gray-100 text-gray-600";
    };

    return (
        <div className="min-h-screen bg-[#f7f8fd] p-4 lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-[#2a3460]">Admin Users</h1>
                    <p className="text-sm text-[#7a84a6] mt-1">Manage admin & super admin accounts</p>
                </div>
                <button
                    onClick={() => { setShowForm(!showForm); setEditUser(null); }}
                    className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition cursor-pointer"
                >
                    <FiUsers size={15} />
                    {showForm ? "Cancel" : "Create Admin"}
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="max-w-2xl mb-6 bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">
                    <div className="bg-[#3b497e] px-5 py-4 flex items-center gap-2 text-white">
                        <FiUsers size={16} />
                        <h2 className="text-[15px] font-semibold">Create Admin Account</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { label: "First Name *", key: "firstName", type: "text",     placeholder: "John" },
                                { label: "Last Name *",  key: "lastName",  type: "text",     placeholder: "Doe" },
                                { label: "Email *",      key: "email",     type: "email",    placeholder: "admin@nestro.com" },
                                { label: "Phone",        key: "phone",     type: "text",     placeholder: "9876543210" },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key}>
                                    <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">{label}</label>
                                    <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder}
                                        className="w-full border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-2.5 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                                        disabled={submitting} />
                                </div>
                            ))}
                            <div>
                                <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Password *</label>
                                <div className="relative">
                                    <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters"
                                        className="w-full border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-2.5 pr-10 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                                        disabled={submitting} />
                                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                        {showPw ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Role *</label>
                                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-2.5 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] bg-white cursor-pointer"
                                    disabled={submitting}>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <button type="submit" disabled={submitting}
                                className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition disabled:opacity-50 cursor-pointer">
                                <FiSave size={15} /> {submitting ? "Creating..." : "Create Account"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-[#eef0f8] shadow-md overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-[14px] font-semibold text-[#2a3460]">All Users ({users.length})</h2>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-4 border-[#eef0f8] border-t-[#3b497e] animate-spin" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="text-center py-16 text-sm text-gray-400">No users found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-5 py-3">SN.</th>
                                    <th className="px-5 py-3">Name</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Phone</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => (
                                    <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                                        <td className="px-5 py-3 font-medium text-gray-800 capitalize">
                                            {u.firstName} {u.lastName}
                                        </td>
                                        <td className="px-5 py-3 text-gray-600">{u.email}</td>
                                        <td className="px-5 py-3 text-gray-600">{u.mobile || "—"}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleColor(u.role)}`}>
                                                {u.role === "super_admin" ? "Super Admin" : u.role === "admin" ? "Admin" : "User"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {u.isVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => openEdit(u)}
                                                className="inline-flex items-center gap-1.5 bg-[#eef0f8] hover:bg-[#3b497e] text-[#3b497e] hover:text-white rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer"
                                            >
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        {/* Modal header */}
                        <div className="bg-[#3b497e] px-5 py-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <FiEdit2 size={15} />
                                <h2 className="text-[15px] font-semibold">Edit User</h2>
                            </div>
                            <button onClick={() => setEditUser(null)} className="hover:bg-white/20 rounded-lg p-1 transition cursor-pointer">
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Current user info */}
                        <div className="px-5 pt-4 pb-2">
                            <div className="bg-[#f4f5fb] rounded-xl px-4 py-3 text-[12px] text-[#7a84a6]">
                                Editing: <span className="font-semibold text-[#2a3460] capitalize">{editUser.firstName} {editUser.lastName}</span>
                                <span className="ml-2 text-gray-400">· {editUser.email}</span>
                            </div>
                        </div>

                        {/* Edit form */}
                        <form onSubmit={handleEditSave} className="px-5 pb-5 pt-3 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">First Name *</label>
                                    <input type="text" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        placeholder="John"
                                        className="w-full border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-2.5 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                                        disabled={editSaving} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Last Name *</label>
                                    <input type="text" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        placeholder="Doe"
                                        className="w-full border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-2.5 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                                        disabled={editSaving} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Phone</label>
                                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        placeholder="9876543210"
                                        className="w-full border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-2.5 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                                        disabled={editSaving} />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-[#2a3460] block mb-1.5">Role</label>
                                    <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full border-[1.5px] border-[#c3c9e3] rounded-xl px-4 py-2.5 text-sm text-[#3a3f5c] outline-none focus:border-[#3b497e] bg-white cursor-pointer"
                                        disabled={editSaving}>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2 justify-end">
                                <button type="button" onClick={() => setEditUser(null)}
                                    className="text-sm text-gray-500 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                                    Cancel
                                </button>
                                <button type="submit" disabled={editSaving}
                                    className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition disabled:opacity-50 cursor-pointer">
                                    <FiSave size={14} /> {editSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
