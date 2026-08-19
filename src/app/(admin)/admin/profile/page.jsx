"use client";

import { useState, useEffect } from "react";
import { client } from "@/utils/helper";
import { toast } from "sonner";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaUser, FaShieldAlt } from "react-icons/fa";
import { MdEmail, MdPhone, MdLock } from "react-icons/md";

export default function AdminProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");

  // Personal Info form
  const [infoForm, setInfoForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [infoLoading, setInfoLoading] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm_password: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    client.get("user/profile")
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setInfoForm({
            firstName: res.data.user.firstName || "",
            lastName: res.data.user.lastName || "",
            phone: res.data.user.mobile || "",
          });
        }
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
    : "?";

  const roleLabel = user?.role === "super_admin" ? "Super Admin" : user?.role === "admin" ? "Admin" : user?.role || "";

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    if (!infoForm.firstName || !infoForm.lastName) return toast.error("Name fields are required");
    try {
      setInfoLoading(true);
      const res = await client.patch("user/profile", {
        firstName: infoForm.firstName,
        lastName: infoForm.lastName,
        phone: infoForm.phone,
      });
      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!pwForm.old_password || !pwForm.new_password) return toast.error("Fill all password fields");
    if (pwForm.new_password.length < 6) return toast.error("Min 6 characters required");
    if (pwForm.new_password !== pwForm.confirm_password) return toast.error("Passwords do not match");
    try {
      setPwLoading(true);
      const res = await client.patch("user/update-password", {
        email: user?.email,
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      });
      if (res.data.success) {
        toast.success("Password updated successfully!");
        setPwForm({ old_password: "", new_password: "", confirm_password: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fc]">
        <div className="text-sm text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] p-4 lg:p-6">
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-sm text-gray-500">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

        {/* Left — Profile Card */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#3b497e] flex items-center justify-center text-white text-2xl font-bold mb-4">
              {initials}
            </div>
            <h2 className="text-[15px] font-semibold text-gray-800 capitalize mb-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-[12px] text-gray-500 mb-3">{user?.email}</p>
            <span className="inline-flex items-center gap-1.5 bg-[#eef0f8] text-[#3b497e] text-[11px] font-medium py-1 px-3 rounded-full">
              <FaShieldAlt size={10} />
              {roleLabel}
            </span>
          </div>

          {/* Info Cards */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                <MdEmail size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400">Email</p>
                <p className="text-[12px] font-medium truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
                <MdPhone size={16} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Phone</p>
                <p className="text-[12px] font-medium">{user?.mobile || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
                <FaShieldAlt size={14} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Role</p>
                <p className="text-[12px] font-medium capitalize">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Header */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors ${activeTab === "info" ? "border-b-2 border-[#3b497e] text-[#3b497e]" : "text-gray-500 hover:text-gray-700"}`}
            >
              <FaUser size={13} /> Personal Info
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors ${activeTab === "password" ? "border-b-2 border-[#3b497e] text-[#3b497e]" : "text-gray-500 hover:text-gray-700"}`}
            >
              <MdLock size={15} /> Change Password
            </button>
          </div>

          {/* Personal Info Tab */}
          {activeTab === "info" && (
            <form onSubmit={handleInfoSubmit} className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    value={infoForm.firstName}
                    onChange={(e) => setInfoForm({ ...infoForm, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                    disabled={infoLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name *</label>
                  <input
                    type="text"
                    value={infoForm.lastName}
                    onChange={(e) => setInfoForm({ ...infoForm, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                    disabled={infoLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={infoForm.phone}
                    onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                    disabled={infoLoading}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Role</label>
                  <input
                    type="text"
                    value={roleLabel}
                    className="w-full px-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed capitalize"
                    disabled
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={infoLoading}
                className="inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-50"
              >
                {infoLoading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="p-6">
              <div className="flex flex-col gap-4 max-w-md">
                {[
                  { label: "Current Password", key: "old_password", show: showOld, toggle: () => setShowOld(!showOld) },
                  { label: "New Password", key: "new_password", show: showNew, toggle: () => setShowNew(!showNew) },
                  { label: "Confirm New Password", key: "confirm_password", show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                ].map(({ label, key, show, toggle }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={show ? "text" : "password"}
                        value={pwForm[key]}
                        onChange={(e) => setPwForm({ ...pwForm, [key]: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3b497e] focus:ring-2 focus:ring-[#3b497e]/10 transition"
                        disabled={pwLoading}
                      />
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {show ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={pwLoading}
                className="mt-5 inline-flex items-center gap-2 bg-[#3b497e] hover:bg-[#2a3460] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:opacity-50"
              >
                {pwLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
