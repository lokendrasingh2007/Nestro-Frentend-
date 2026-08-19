'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearchOutline } from 'react-icons/io5';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { IoPersonOutline } from 'react-icons/io5';
import { HiMenu, HiX } from 'react-icons/hi';
import { MdOutlineCurrencyRupee } from 'react-icons/md';
import { lsToCart } from '@/redex/features/CartSlice';
import { client } from '@/utils/helper';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Store' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/checkout', label: 'Checkout' },
];

// ── Search Popup ─────────────────────────────────────────────────────────────
function SearchPopup({ onClose }) {
  const [query, setQuery]         = useState('');
  const [results, setResults]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [searched, setSearched]   = useState(false);
  const inputRef                  = useRef(null);
  const router                    = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    // Close on Escape
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await client.get(`product?search=${encodeURIComponent(query.trim())}&limit=8&status=true`);
        setResults(res.data.products || []);
        setSearched(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/store?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center pt-16 sm:pt-24 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Search box */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E8E0D5] z-10">
        {/* Input */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F0EBE3]">
            <IoSearchOutline className="text-[20px] text-[#8B5E3C] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 text-[14px] text-[#1E1E1E] outline-none bg-transparent placeholder:text-[#9CA3AF]"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}
                className="text-[#9CA3AF] hover:text-[#8B5E3C] transition cursor-pointer">
                <HiX size={16} />
              </button>
            )}
            <button type="button" onClick={onClose}
              className="text-[#6B7280] hover:text-[#8B5E3C] transition ml-1 cursor-pointer text-[12px]">
              ESC
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {loading && (
            <div className="py-8 text-center text-[13px] text-[#6B7280]">Searching...</div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="py-8 text-center text-[13px] text-[#6B7280]">
              No products found for "<span className="text-[#8B5E3C]">{query}</span>"
            </div>
          )}

          {!loading && results.length > 0 && results.map((product) => (
            <Link key={product._id} href={`/product/${product._id}`} onClick={onClose}>
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#FFF8F5] transition border-b border-[#F9F5F0] last:border-0 cursor-pointer">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg bg-[#F5F0EB] overflow-hidden shrink-0 flex items-center justify-center">
                  {product.thumbnail
                    ? <Image src={product.thumbnail} alt={product.name} width={48} height={48} className="object-cover w-full h-full" />
                    : <IoSearchOutline className="text-[#C6A27E]" />
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[#1E1E1E] truncate">{product.name}</div>
                  <div className="text-[10px] text-[#6B7280] mt-0.5 uppercase tracking-wide">
                    {product.categoryId?.name || ''}
                  </div>
                </div>
                {/* Price */}
                <div className="text-[13px] font-semibold text-[#8B5E3C] flex items-center shrink-0">
                  <MdOutlineCurrencyRupee />{product.salePrice?.toLocaleString('en-IN')}
                </div>
              </div>
            </Link>
          ))}

          {/* View all results */}
          {!loading && results.length > 0 && (
            <button onClick={handleSubmit}
              className="w-full py-3 text-[12px] text-[#8B5E3C] font-medium hover:bg-[#FFF8F5] transition cursor-pointer border-t border-[#F0EBE3]">
              View all results for "{query}" →
            </button>
          )}

          {/* Initial hint */}
          {!query && (
            <div className="py-8 text-center text-[12px] text-[#9CA3AF]">
              Type to search products...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export default function Header({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen]         = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu  = () => setMobileMenuOpen(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(lsToCart());
    setMounted(true);
  }, [dispatch]);

  if (!user) user = { firstName: null };
  const displayName = user?.firstName || '';

  return (
    <>
      <header className="w-full bg-[#fafaf9f7] backdrop-blur-sm sticky top-0 z-50 border-b border-solid border-[0.5px] border-[#E8E0D5]">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <div className="text-[16px] font-medium tracking-[0.12em] uppercase text-[#1E1E1E]">
              Nestro<span className="text-[#8B5E3C]">.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link href={link.href}
                      className={`block font-medium text-[13px] tracking-[0.06em] rounded-md px-2 lg:px-3 py-1.5 transition ${
                        isActive ? 'bg-[#F0EBE3] text-[#8b5e3c]' : 'text-[#6B7280] hover:bg-[#F0EBE3] hover:text-[#8b5e3c]'
                      }`}>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search button */}
            <button onClick={() => setSearchOpen(true)}
              className="hover:bg-[#F0EBE3] hover:rounded-full p-2 hover:text-[#8b5e3c] transition cursor-pointer">
              <IoSearchOutline className="text-xl" />
            </button>

            {/* Cart */}
            <Link href="/cart">
              <div className="relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-[#444444] hover:bg-[#F0EBE3] hover:text-[#8b5e3c] transition">
                <HiOutlineShoppingBag />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B5E3C] rounded-full text-[8px] text-white flex items-center justify-center">
                  {mounted ? cartItems.length : ''}
                </span>
              </div>
            </Link>

            {/* Profile */}
            <Link href="/profile">
              <div className="hover:bg-[#D6BFA7] bg-[#F0EBE3] text-[#8b5e3c] rounded-full p-1.5 sm:p-2 border border-[#8b5e3c]/30 transition">
                <IoPersonOutline className="text-sm sm:text-base" />
              </div>
            </Link>

            {/* Login / Name */}
            {user?.firstName ? (
              <span className="text-sm font-medium text-[#8B5E3C] hidden sm:inline">{displayName}</span>
            ) : (
              <Link href="/login" className="text-sm font-medium text-[#6B7280] hover:text-[#8B5E3C] hidden sm:inline">
                Login
              </Link>
            )}

            {/* Mobile toggle */}
            <button onClick={toggleMobileMenu}
              className="md:hidden text-[#6B7280] hover:text-[#8b5e3c] focus:outline-none p-1 cursor-pointer">
              {mobileMenuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 shadow-lg">
            <nav className="max-w-7xl mx-auto px-4 py-4">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={closeMobileMenu}
                      className="block w-full font-medium text-[15px] text-[#6B7280] hover:bg-[#F0EBE3] hover:text-[#8b5e3c] rounded-md px-3 py-2 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
                {user?.firstName ? (
                  <li className="px-3 py-2 text-sm text-[#8B5E3C] font-medium">Logged in as {displayName}</li>
                ) : (
                  <li>
                    <Link href="/login" onClick={closeMobileMenu}
                      className="block w-full font-medium text-[15px] text-[#6B7280] hover:bg-[#F0EBE3] hover:text-[#8b5e3c] rounded-md px-3 py-2 transition">
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Search Popup */}
      {searchOpen && <SearchPopup onClose={() => setSearchOpen(false)} />}
    </>
  );
}
