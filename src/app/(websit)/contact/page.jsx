"use client";

import React, { useState } from 'react'
import { FiPhone, FiSend } from "react-icons/fi"
import { MdOutlineEmail } from "react-icons/md"
import { GoClock } from "react-icons/go"
import { HiOutlineLocationMarker } from "react-icons/hi"
import { TbMap2 } from "react-icons/tb"
import { client } from "@/utils/helper"
import { toast } from "sonner"

export default function Page() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", subject: "General Inquiry", message: ""
  });
  const [loading, setLoading] = useState(false);

  const contacts = [
    { icon: <FiPhone />,              label: "Phone",    value: "+91 98765 43210" },
    { icon: <MdOutlineEmail />,       label: "Email",    value: "nestrojaipur@gmail.com" },
    { icon: <GoClock />,              label: "Hours",    value: "Mon - Sat , 10am - 7pm IST" },
    { icon: <HiOutlineLocationMarker />, label: "Location", value: "MI Road, Jaipur, Rajasthan" },
  ];

  const locations = [
    { city: "Jaipur",     address: "MI Road, near Ajmeri Gate", hours: "10am - 9pm" },
    { city: "Mumbai",     address: "Bandra West, Linking Road",  hours: "10am - 9pm" },
    { city: "Bangalore",  address: "Indiranagar, 100ft Road",    hours: "10am - 8pm" },
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.message) {
      toast.error("Please fill First Name, Email and Message");
      return;
    }
    try {
      setLoading(true);
      const res = await client.post("contact", form);
      if (res.data.success) {
        toast.success("Message sent! We'll get back to you within 24 hours.");
        setForm({ firstName: "", lastName: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        toast.error(res.data.message || "Failed to send message");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full bg-[#F8F5F1]'>
      <div className="max-w-container mx-auto px-4 sm:px-6 my-6 sm:my-8">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="text-[10px] tracking-[0.2em] uppercase text-[#8B5E3C] mb-2.5">Get in touch</div>
          <div className="text-[22px] sm:text-[24px] font-normal tracking-[-0.02em] leading-[1.2] text-[#1E1E1E]">
            We'd love to hear from you
          </div>
          <div className="text-[12px] sm:text-[13px] text-[#6B7280] leading-[1.7] mt-2 max-w-2xl mx-auto sm:mx-0">
            Whether it's a question, a custom order, or just a love note — we're here.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
          {/* Left Column */}
          <div>
            <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5 sm:p-6 mb-5">
              {contacts.map((item, index) => (
                <div key={index} className="flex items-start gap-3 mb-5 last:mb-0">
                  <div className="w-9 h-9 bg-[#F5EDE4] rounded-lg flex items-center justify-center text-[#8B5E3C] text-[17px] shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[#6B7280] mb-1">{item.label}</div>
                    <div className="text-[11px] sm:text-[12px] text-[#1E1E1E] font-medium break-all">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
              className="bg-[#2C2016] rounded-xl h-36 sm:h-44 flex items-center justify-center text-[#C6A27E] text-[12px] sm:text-[13px] hover:opacity-95 transition cursor-pointer">
              <TbMap2 className="text-[20px] sm:text-[22px] mr-2" />
              <span>View on Google Maps</span>
            </a>

            <div className="mt-5 sm:mt-6">
              <div className="text-[10px] mb-3 text-[#8B5E3C] uppercase tracking-[0.2em]">showrooms location</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {locations.map((item, index) => (
                  <div key={index} className="bg-white border border-[#E8E0D5] rounded-[10px] p-3 sm:p-4">
                    <div className="text-[#1E1E1E] text-[11px] sm:text-[12px] font-medium mb-1">{item.city}</div>
                    <div className="text-[#6B7280] text-[9px] sm:text-[10px] leading-normal mb-1.5">{item.address}</div>
                    <div className="text-[#8B5E3C] text-[9px] sm:text-[10px]">{item.hours}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — Form */}
          <div className="bg-white border border-[#E8E0D5] rounded-2xl p-5 sm:p-6 md:p-7">
            <div className="text-[#1E1E1E] text-[16px] sm:text-[18px] font-medium mb-1">Send us a message</div>
            <div className="text-[#6B7280] text-[11px] sm:text-[12px] mb-5">We typically respond within 24 hours.</div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
                <div>
                  <label className='tracking-[0.04em] text-[#6B7280] text-[10px] sm:text-[11px] block mb-1.5'>First Name *</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} type="text" placeholder='Lokendra'
                    className='w-full py-2 px-3 border border-[#E8E0D5] rounded-md text-[11px] sm:text-[12px] text-[#1E1E1E] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 transition'
                    disabled={loading} />
                </div>
                <div>
                  <label className='tracking-[0.04em] text-[#6B7280] text-[10px] sm:text-[11px] block mb-1.5'>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} type="text" placeholder='Singh'
                    className='w-full py-2 px-3 border border-[#E8E0D5] rounded-md text-[11px] sm:text-[12px] text-[#1E1E1E] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 transition'
                    disabled={loading} />
                </div>
              </div>

              <div className="mb-4">
                <label className='tracking-[0.04em] text-[#6B7280] text-[10px] sm:text-[11px] block mb-1.5'>Email *</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder='lokendra@gmail.com'
                  className='w-full py-2 px-3 border border-[#E8E0D5] rounded-md text-[11px] sm:text-[12px] text-[#1E1E1E] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 transition'
                  disabled={loading} />
              </div>

              <div className="mb-4">
                <label className='tracking-[0.04em] text-[#6B7280] text-[10px] sm:text-[11px] block mb-1.5'>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}
                  className='w-full py-2 px-3 border border-[#E8E0D5] rounded-md text-[11px] sm:text-[12px] text-[#1E1E1E] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 transition bg-white cursor-pointer'
                  disabled={loading}>
                  <option>General Inquiry</option>
                  <option>Product Information</option>
                  <option>Order Support</option>
                  <option>Custom Order</option>
                  <option>Return & Refund</option>
                </select>
              </div>

              <div className="mb-5">
                <label className='tracking-[0.04em] text-[#6B7280] text-[10px] sm:text-[11px] block mb-1.5'>Message *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5}
                  placeholder='Tell us how we can help'
                  className='w-full resize-none py-2 px-3 leading-[1.6] border border-[#E8E0D5] rounded-md text-[11px] sm:text-[12px] text-[#1E1E1E] outline-none focus:border-[#8B5E3C] focus:ring-2 focus:ring-[#8B5E3C]/10 transition'
                  disabled={loading} />
              </div>

              <button type="submit" disabled={loading}
                className='flex items-center justify-center gap-2 w-full bg-[#8B5E3C] text-white py-2.5 rounded-lg text-[12px] sm:text-[13px] tracking-wider hover:bg-[#6c4b31] transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'>
                {loading ? "Sending..." : "Send Message"}
                {!loading && <FiSend />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
