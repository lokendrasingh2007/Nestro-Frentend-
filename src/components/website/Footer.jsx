import React from 'react'
import Link from 'next/link'
import { IoLogoPinterest } from "react-icons/io5"
import { FaInstagram } from "react-icons/fa"
import { FaYoutube } from "react-icons/fa6"

export default function Footer() {
  const companyLinks = [
    { label: "Our Story", href: "/" },
    { label: "Sustainability", href: "/" },
    { label: "Showrooms", href: "/" },
    { label: "Careers", href: "/" },
  ];
  const supportLinks = [
    { label: "Track Order", href: "/" },
    { label: "Returns & Exchange", href: "/" },
    { label: "Assembly Help", href: "/" },
    { label: "Contact Us", href: "/contact" },
  ];
  const followLinks = [
    { label: "Instagram", href: "/" },
    { label: "Pinterest", href: "/" },
    { label: "Houzz", href: "/" },
  ];

  const socialIcons = [
    { href: "/instagram", icon: <FaInstagram /> },
    { href: "/pinterest", icon: <IoLogoPinterest /> },
    { href: "/youtube", icon: <FaYoutube /> },
  ];
  return (
    <>
      <footer className="w-full bg-[#1A1208] pt-10 px-4 sm:px-6 pb-5">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between gap-10 lg:gap-16 mb-10">
          <div className="w-full lg:max-w-sm">
            <Link href="/">
              <div className="text-[#D6BFA7] font-medium text-[18px] uppercase tracking-wider">
                Nestro.
              </div>
            </Link>
            <div className="mt-3 mb-5">
              <p className='text-[13px] leading-[1.8] text-[#ffffff59]'>
                Curated furniture for thoughtful homes.
                Crafted with intention, made to endure.
              </p>
            </div>
            
            <div className="flex ">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-[#ffffff12] border-[0.5px] border-[#c6a27e4d] border-r-0 rounded-[4px_0_0_4px] py-2 px-3 text-[11px] text-[#D6BFA7] outline-none"
              />

              <button className="bg-[#8B5E3C] border-none  text-white rounded-[0_4px_4px_0] text-[11px]  py-2 px-3.5 ">
                Subscribe
              </button>

            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 w-full">
            <div>
              <div className="text-[#C6A27E] font-medium tracking-[0.18em] text-[10px] uppercase mb-4">
                Company
              </div>
              <ul className="space-y-3">
                {companyLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block text-[12px] text-[#ffffff61] hover:text-[#8b5e3c] transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[#C6A27E] font-medium tracking-[0.18em] text-[10px] uppercase mb-4">
                Support
              </div>
              <ul className="space-y-3">
                {supportLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block text-[12px] text-[#ffffff61] hover:text-[#8b5e3c] transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-[#C6A27E] font-medium tracking-[0.18em] text-[10px] uppercase mb-4">
                Follow Us
              </div>
              <ul className="space-y-3 mb-5">
                {followLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="block text-[12px] text-[#ffffff61] hover:text-[#8b5e3c] transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              
              <div className="flex items-center gap-3">
                {socialIcons.map((item, index) => (
                  <Link key={index} href={item.href}>
                    <div className="text-[#C6A27E] text-[14px] rounded-full p-2 border border-[#8b5e3c]/30 hover:bg-[#8b5e3c] hover:text-white transition">
                      {item.icon}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Footer */}
        <div className='container mx-auto pt-5 border-t border-[#ffffff14]'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left'>
            <div>
              <p className='text-[11px] text-[#ffffff38]'>
                © 2026 Nestro. All rights reserved.
              </p>
            </div>
            <div>
              <p className='text-[11px] text-[#ffffff38]'>
                Privacy · Terms · Sitemap
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}