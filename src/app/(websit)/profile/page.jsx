"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MdCurrencyRupee } from "react-icons/md";
import { LuSofa } from "react-icons/lu";
import { HiMenu, HiX } from "react-icons/hi";
import { IoAddSharp, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import MenuItems from "@/components/website/profile/MenuItems";
import { client } from "@/utils/helper";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

// ---------- Helpers ----------
const STATUS_STYLES = {
  placed: "bg-[#EEF2FF] text-[#3730A3]",
  confirmed: "bg-[#FFF3CD] text-[#856404]",
  shipped: "bg-[#DBEAFE] text-[#1D4ED8]",
  out_for_delivery: "bg-[#FEF9C3] text-[#854D0E]",
  delivered: "bg-[#EAF3DE] text-[#3B6D11]",
  return: "bg-[#FEE2E2] text-[#B91C1C]",
};

const STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  return: "Returned",
};

const PAYMENT_STYLES = {
  Pending: "bg-[#FEF9C3] text-[#854D0E]",
  Paid: "bg-[#EAF3DE] text-[#3B6D11]",
  Failed: "bg-[#FEE2E2] text-[#B91C1C]",
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

// ---------- Orders Component ----------
const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // expanded order id

  useEffect(() => {
    client.get("order/my-orders")
      .then((res) => { if (res.data.success) setOrders(res.data.orders || []); })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-[#E8E0D5] rounded-xl p-6 text-center text-[12px] text-[#6B7280]">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 sm:p-5">
        <div className="text-[13px] font-medium text-[#1E1E1E] mb-4 pb-3 border-b border-[#E8E0D5]">
          My Orders <span className="text-[#6B7280] font-normal">({orders.length})</span>
        </div>
        <div className="bg-white border border-[#E8E0D5] rounded-xl p-8 text-center">
          <LuSofa className="mx-auto text-[36px] text-[#C6A27E] mb-3" />
          <div className="text-[13px] font-medium text-[#1E1E1E] mb-1">No orders yet</div>
          <div className="text-[11px] text-[#6B7280]">Your placed orders will appear here.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 sm:p-5">
      <div className="text-[13px] font-medium text-[#1E1E1E] mb-4 pb-3 border-b border-[#E8E0D5]">
        My Orders <span className="text-[#6B7280] font-normal">({orders.length})</span>
      </div>

      {orders.map((order) => {
        const isOpen = expanded === order._id;
        const firstItem = order.items?.[0];
        const extraCount = order.items?.length - 1;
        const statusStyle = STATUS_STYLES[order.orderStatus] || "bg-[#F5F0EB] text-[#6B7280]";
        const statusLabel = STATUS_LABELS[order.orderStatus] || order.orderStatus;
        const paymentStyle = PAYMENT_STYLES[order.paymentStatus] || "bg-[#F5F0EB] text-[#6B7280]";

        return (
          <div key={order._id} className="border border-[#E8E0D5] rounded-lg mb-3 last:mb-0 overflow-hidden">
            {/* Order header row */}
            <div
              className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 cursor-pointer hover:bg-[#FAFAF9] transition"
              onClick={() => setExpanded(isOpen ? null : order._id)}
            >
              {/* Icon / thumbnail */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#F5F0EB] rounded-lg overflow-hidden flex items-center justify-center text-[18px] text-[#C6A27E] shrink-0">
                {firstItem?.product_id?.thumbnail ? (
                  <Image
                    src={firstItem.product_id.thumbnail}
                    alt={firstItem.product_id.name || "Product"}
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <LuSofa />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-[11px] sm:text-[12px] font-medium text-[#1E1E1E] truncate">
                  {firstItem?.product_id?.name || `Order (${order.items?.length} item${order.items?.length !== 1 ? "s" : ""})`}
                  {extraCount > 0 && (
                    <span className="text-[#8B5E3C] ml-1">+{extraCount} more</span>
                  )}
                </div>
                <div className="text-[9px] sm:text-[10px] text-[#6B7280] mt-0.5">
                  #{order._id.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
                </div>
              </div>

              {/* Status + Amount */}
              <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
                <span className={`${statusStyle} text-[9px] sm:text-[10px] py-0.5 px-2 rounded-[10px] whitespace-nowrap`}>
                  {statusLabel}
                </span>
                <div className="text-[12px] sm:text-[13px] font-medium text-[#1E1E1E] flex items-center whitespace-nowrap">
                  <MdCurrencyRupee />{order.totalAmount?.toLocaleString("en-IN")}
                </div>
                <span className="text-[#6B7280] text-[14px]">{isOpen ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Expanded detail */}
            {isOpen && (
              <div className="border-t border-[#E8E0D5] bg-[#FAFAF9] px-3 py-3">
                {/* Items list */}
                <div className="mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-[#F0EBE3] last:border-0">
                      {/* Product thumbnail */}
                      <div className="w-12 h-12 bg-[#F5F0EB] rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                        {item.product_id?.thumbnail ? (
                          <Image
                            src={item.product_id.thumbnail}
                            alt={item.product_id.name || "Product"}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <LuSofa className="text-[18px] text-[#C6A27E]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-medium text-[#1E1E1E] truncate">
                          {item.product_id?.name || "Product"}
                        </div>
                        <div className="text-[9px] text-[#6B7280]">Qty: {item.qty}</div>
                      </div>
                      <div className="text-[11px] font-medium text-[#1E1E1E] flex items-center whitespace-nowrap">
                        <MdCurrencyRupee />{item.total?.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order meta */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-[#6B7280]">Payment</span>
                    <div className="mt-0.5">
                      <span className={`${paymentStyle} py-0.5 px-2 rounded-[8px] text-[9px]`}>
                        {order.paymentStatus}
                      </span>
                      <span className="text-[#6B7280] ml-1 capitalize">{order.paymentMethod === "cod" ? "· COD" : "· Online"}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#6B7280]">Shipping</span>
                    <div className="text-[#1E1E1E] mt-0.5 font-medium">
                      {order.shippingPrice === 0 ? "Free" : `₹${order.shippingPrice?.toLocaleString("en-IN")}`}
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[#6B7280]">Deliver to</span>
                    <div className="text-[#1E1E1E] mt-0.5 leading-[1.5]">
                      {order.shippingAddress?.fullName}<br />
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Personal Info Component ----------
const PersonalInfoSection = ({ user, onUserUpdate }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", phone: user.mobile || "" });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) return toast.error("First and last name are required");
    try {
      setLoading(true);
      const res = await client.patch("user/profile", { firstName: form.firstName, lastName: form.lastName, phone: form.phone });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        if (onUserUpdate) onUserUpdate(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 sm:p-5">
      <div className="text-[13px] font-medium text-[#1E1E1E] mb-4 pb-3 border-b border-[#E8E0D5]">Personal Information</div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-[#6B7280] text-[11px] block mb-1">First Name *</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="John" className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] outline-none focus:border-[#8B5E3C]" disabled={loading} />
          </div>
          <div>
            <label className="text-[#6B7280] text-[11px] block mb-1">Last Name *</label>
            <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] outline-none focus:border-[#8B5E3C]" disabled={loading} />
          </div>
          <div>
            <label className="text-[#6B7280] text-[11px] block mb-1">Email</label>
            <input type="email" value={form.email} placeholder="you@example.com" className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-[#F8F5F1] rounded-md text-[12px] outline-none text-[#9CA3AF] cursor-not-allowed" disabled />
            <p className="text-[10px] text-[#9CA3AF] mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="text-[#6B7280] text-[11px] block mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9610352595" className="w-full py-2.5 px-3 border border-[#E8E0D5] bg-white rounded-md text-[12px] outline-none focus:border-[#8B5E3C]" disabled={loading} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="bg-[#8B5E3C] text-[#FFF8F3] text-[11px] tracking-[0.08em] py-2.5 px-5 mt-4 rounded-sm font-medium disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

// ---------- Addresses Component ----------
const AddressesSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [defaultingId, setDefaultingId] = useState(null);
  const emptyForm = { fullName: "", mobile: "", addressLine: "", city: "", state: "", pincode: "", country: "India", isDefault: false };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await client.get("user/address");
      if (res.data.success) setAddresses(res.data.address || []);
    } catch { toast.error("Failed to load addresses"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.mobile || !form.addressLine || !form.city || !form.state || !form.pincode)
      return toast.error("Please fill all required fields");
    try {
      setSubmitting(true);
      if (editId) {
        await client.put(`user/address/${editId}`, form);
        toast.success("Address updated!");
      } else {
        await client.post("user/address", form);
        toast.success("Address added!");
      }
      setForm(emptyForm); setShowForm(false); setEditId(null);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await client.delete(`user/address/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch { toast.error("Failed to delete"); }
    finally { setDeletingId(null); }
  };

  const handleSetDefault = async (id) => {
    try {
      setDefaultingId(id);
      await client.patch(`user/address/${id}/default`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch { toast.error("Failed to set default"); }
    finally { setDefaultingId(null); }
  };

  const handleEdit = (addr) => {
    setForm({ fullName: addr.fullName, mobile: addr.mobile, addressLine: addr.addressLine, city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country || "India", isDefault: addr.isDefault });
    setEditId(addr._id); setShowForm(true);
  };

  const fields = [
    { label: "Full Name *", key: "fullName", placeholder: "John Doe" },
    { label: "Mobile *", key: "mobile", placeholder: "9876543210" },
    { label: "Address Line *", key: "addressLine", placeholder: "42, MG Road", span: true },
    { label: "City *", key: "city", placeholder: "Jaipur" },
    { label: "State *", key: "state", placeholder: "Rajasthan" },
    { label: "Pincode *", key: "pincode", placeholder: "302001" },
    { label: "Country", key: "country", placeholder: "India" },
  ];

  return (
    <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 sm:p-5">
      <div className="text-[13px] font-medium text-[#1E1E1E] mb-4 pb-3 border-b border-[#E8E0D5]">Saved Addresses</div>
      {loading ? (
        <div className="text-[12px] text-[#6B7280] py-4 text-center">Loading...</div>
      ) : addresses.length === 0 ? (
        <div className="text-[12px] text-[#6B7280] py-4 text-center">No addresses saved yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
          {addresses.map((addr) => (
            <div key={addr._id} className="border border-[#E8E0D5] rounded-lg p-3.5 relative">
              {addr.isDefault && <div className="absolute top-2.5 right-2.5 text-[9px] bg-[#F5EDE4] text-[#8B5E3C] py-0.5 px-2 rounded-[10px]">Default</div>}
              <div className="text-[12px] font-medium mb-1">{addr.fullName}</div>
              <div className="text-[11px] text-[#6B7280] leading-[1.7] mb-2">
                {addr.addressLine}<br />{addr.city}, {addr.state} {addr.pincode}<br />{addr.country} · {addr.mobile}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => handleEdit(addr)} className="text-[10px] text-[#8B5E3C] border border-[#C6A27E] px-2.5 py-1 rounded-sm hover:bg-[#F5EDE4] transition">Edit</button>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)} disabled={defaultingId === addr._id} className="text-[10px] text-[#6B7280] border border-[#E8E0D5] px-2.5 py-1 rounded-sm hover:bg-[#F9F5F0] transition disabled:opacity-50">
                    {defaultingId === addr._id ? "Setting..." : "Set Default"}
                  </button>
                )}
                <button onClick={() => handleDelete(addr._id)} disabled={deletingId === addr._id} className="text-[10px] text-red-500 border border-red-200 px-2.5 py-1 rounded-sm hover:bg-red-50 transition disabled:opacity-50">
                  {deletingId === addr._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="border border-[#E8E0D5] rounded-lg p-4 mb-4">
          <div className="text-[12px] font-medium text-[#1E1E1E] mb-3">{editId ? "Edit Address" : "Add New Address"}</div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fields.map(({ label, key, placeholder, span }) => (
                <div key={key} className={span ? "sm:col-span-2" : ""}>
                  <label className="text-[11px] text-[#6B7280] block mb-1">{label}</label>
                  <input type="text" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full py-2.5 px-3 border border-[#E8E0D5] rounded-md text-[12px] bg-white outline-none focus:border-[#8B5E3C]" disabled={submitting} />
                </div>
              ))}
              <div className="sm:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-[#8B5E3C] w-3.5 h-3.5" disabled={submitting} />
                <label htmlFor="isDefault" className="text-[11px] text-[#6B7280] cursor-pointer">Set as default address</label>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button type="submit" disabled={submitting} className="bg-[#8B5E3C] text-[#FFF8F3] text-[11px] tracking-[0.08em] py-2.5 px-5 rounded-sm font-medium disabled:opacity-50">
                {submitting ? "Saving..." : editId ? "Update Address" : "Save Address"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(emptyForm); }} className="text-[11px] text-[#6B7280] border border-[#E8E0D5] py-2.5 px-4 rounded-sm hover:bg-[#F9F5F0] transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="bg-transparent text-[#8B5E3C] text-[11px] tracking-[0.08em] py-2.5 px-5 border border-[#C6A27E] rounded-sm font-medium inline-flex items-center gap-1.5 hover:bg-[#F5EDE4] transition">
          <IoAddSharp /> Add New Address
        </button>
      )}
    </div>
  );
};

// ---------- Settings Component ----------
const SettingsSection = ({ userEmail }) => {
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "" });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!userEmail) return toast.error("Session not found. Please refresh.");
    if (!pwForm.old_password || !pwForm.new_password) return toast.error("Please fill in both fields");
    if (pwForm.new_password.length < 6) return toast.error("New password must be at least 6 characters");
    try {
      setPwLoading(true);
      const res = await client.patch("user/update-password", { email: userEmail, old_password: pwForm.old_password, new_password: pwForm.new_password });
      if (res.data.success) {
        toast.success("Password updated successfully!");
        setPwForm({ old_password: "", new_password: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally { setPwLoading(false); }
  };

  return (
    <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 sm:p-5">
      <div className="text-[13px] font-medium text-[#1E1E1E] mb-4 pb-3 border-b border-[#E8E0D5]">Account Settings</div>
      <div className="flex flex-col gap-3.5">
        {/* Email Notifications */}
        <div className="flex justify-between items-center border border-[#E8E0D5] rounded-lg p-3">
          <div><div className="text-[12px] font-medium">Email Notifications</div><div className="text-[10px] text-[#6B7280]">Order updates & offers</div></div>
          <div onClick={() => setEmailNotif(!emailNotif)} className={`w-10 h-5.5 rounded-[11px] relative cursor-pointer transition-colors ${emailNotif ? "bg-[#8B5E3C]" : "bg-[#E8E0D5]"}`}>
            <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 transition-all ${emailNotif ? "right-0.5" : "left-0.5"}`}></div>
          </div>
        </div>
        {/* SMS Alerts */}
        <div className="flex justify-between items-center border border-[#E8E0D5] rounded-lg p-3">
          <div><div className="text-[12px] font-medium">SMS Alerts</div><div className="text-[10px] text-[#6B7280]">Delivery & order updates via SMS</div></div>
          <div onClick={() => setSmsAlerts(!smsAlerts)} className={`w-10 h-5.5 rounded-[11px] relative cursor-pointer transition-colors ${smsAlerts ? "bg-[#8B5E3C]" : "bg-[#E8E0D5]"}`}>
            <div className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.5 transition-all ${smsAlerts ? "right-0.5" : "left-0.5"}`}></div>
          </div>
        </div>
        {/* Change Password */}
        <div className="border border-[#E8E0D5] rounded-lg p-3">
          <div className="text-[12px] font-medium mb-3">Change Password</div>
          <form onSubmit={handlePasswordUpdate}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-[11px] text-[#6B7280] block mb-1">Current Password</label>
                <div className="relative">
                  <input type={showOld ? "text" : "password"} value={pwForm.old_password} onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })} placeholder="••••••••" className="w-full py-2.5 px-3 pr-9 border border-[#E8E0D5] rounded-md text-[12px] bg-white outline-none focus:border-[#8B5E3C]" disabled={pwLoading} />
                  <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#8B5E3C] cursor-pointer">
                    {showOld ? <IoEyeOffOutline size={14} /> : <IoEyeOutline size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[#6B7280] block mb-1">New Password</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={pwForm.new_password} onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} placeholder="••••••••" className="w-full py-2.5 px-3 pr-9 border border-[#E8E0D5] rounded-md text-[12px] bg-white outline-none focus:border-[#8B5E3C]" disabled={pwLoading} />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#8B5E3C] cursor-pointer">
                    {showNew ? <IoEyeOffOutline size={14} /> : <IoEyeOutline size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" disabled={pwLoading} className="bg-[#8B5E3C] text-[#FFF8F3] text-[10px] tracking-[0.08em] py-2.5 px-4 mt-4 rounded-sm font-medium disabled:opacity-50">
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ---------- Main Page ----------
export default function ProfilePage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("My Orders");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    client.get("user/profile")
      .then((res) => { if (res.data.success) setUser(res.data.user); })
      .catch(() => { });
  }, []);

  useEffect(() => {
    client.get("order/my-orders")
      .then((res) => { if (res.data.success) setOrders(res.data.orders || []); })
      .catch(() => { });
  }, []);

  // Real stats
  const totalOrders = orders.length;
  const totalSpent  = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const formatSpent = (n) => {
    if (n >= 100000) return (n / 100000).toFixed(1) + "L";
    if (n >= 1000)   return (n / 1000).toFixed(1) + "K";
    return n.toLocaleString("en-IN");
  };

  const userEmail = user?.email || "";

  const handleSignOut = async () => {
    try {
      await client.post("user/logout").catch(() => { });
    } finally {
      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      toast.success("Signed out successfully");
      router.push("/login");
    }
  };

  const handleTabChange = (tab) => {
    if (tab === "Sign Out") { handleSignOut(); return; }
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "My Orders": return <OrdersSection />;
      case "Personal Info": return <PersonalInfoSection user={user} onUserUpdate={setUser} />;
      case "Addresses": return <AddressesSection />;
      case "Settings": return <SettingsSection userEmail={userEmail} />;
      default: return <OrdersSection />;
    }
  };

  return (
    <div className="w-full bg-[#F8F5F1] min-h-screen py-6 sm:py-8">
      <Toaster position="top-right" richColors toastOptions={{ style: { background: "#FFFFFF", color: "#8B5E3C", border: "1px solid #E8E0D5", borderRadius: "8px", fontSize: "13px" } }} />
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="lg:hidden mb-4">
          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} className="flex items-center gap-2 bg-white border border-[#E8E0D5] rounded-lg px-4 py-2 text-[#8B5E3C] text-sm font-medium cursor-pointer">
            {mobileSidebarOpen ? <HiX className="text-lg" /> : <HiMenu className="text-lg" />}
            {mobileSidebarOpen ? "Close Menu" : "Menu"}
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <div className={`${mobileSidebarOpen ? "block" : "hidden"} lg:block`}>
            <MenuItems activeTab={activeTab} onTabChange={handleTabChange} user={user} />
          </div>
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-[#E8E0D5] rounded-xl p-4 sm:p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F8F5F1] rounded-lg p-3 text-center"><div className="text-[18px] sm:text-[20px] text-[#8B5E3C] font-medium mb-1">{totalOrders}</div><div className="text-[9px] sm:text-[10px] text-[#6B7280] tracking-wide">orders</div></div>
                <div className="bg-[#F8F5F1] rounded-lg p-3 text-center"><div className="text-[18px] sm:text-[20px] text-[#8B5E3C] font-medium mb-1 flex items-center justify-center"><MdCurrencyRupee />{formatSpent(totalSpent)}</div><div className="text-[9px] sm:text-[10px] text-[#6B7280] tracking-wide">spent</div></div>
                <div className="bg-[#F8F5F1] rounded-lg p-3 text-center"><div className="text-[18px] sm:text-[20px] text-[#8B5E3C] font-medium mb-1">{Math.floor(totalSpent / 100)}</div><div className="text-[9px] sm:text-[10px] text-[#6B7280] tracking-wide">points</div></div>
                <div className="bg-[#F8F5F1] rounded-lg p-3 text-center"><div className="text-[18px] sm:text-[20px] text-[#8B5E3C] font-medium mb-1">0</div><div className="text-[9px] sm:text-[10px] text-[#6B7280] tracking-wide">reviews</div></div>
              </div>
            </div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
