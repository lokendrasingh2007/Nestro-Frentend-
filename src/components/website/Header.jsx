'use client';

import React, { useState, useEffect, useRef } from 'react';
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

// ── Inline Search Bar ─────────────────────────────────────────────────────────
function SearchBar() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [searched, setSearched] = useState(false);
  const wrapperRef              = useRef(null);
  const inputRef                = useRef(null);
  const router                  = useRouter();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setExpanded(false);
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); setOpen(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      setOpen(true);
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
    e?.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    setExpanded(false);
    setQuery('');
    router.push(`/store?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:flex items-center">
      <form onSubmit={handleSubmit}>
        <div className={`flex items-center rounded-full border transition-all duration-300 overflow-hidden
          ${expanded
            ? 'bg-white border-[#E8E0D5] shadow-sm w-64 lg:w-80 px-3 py-1.5 gap-2'
            : 'bg-transparent border-transparent w-9 h-9 justify-center'
          }`}>

          {/* Input — only when expanded */}
          {expanded && (
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 text-[13px] text-[#1E1E1E] outline-none bg-transparent placeholder:text-[#9CA3AF] border-l-2 border-[#8B5E3C] pl-2"
            />
          )}

          {/* Icon button */}
          <button
            type="button"
            onClick={() => expanded ? handleSubmit() : setExpanded(true)}
            className={`shrink-0 flex items-center justify-center rounded-full transition cursor-pointer
              ${expanded
                ? 'w-7 h-7 bg-[#8B5E3C] hover:bg-[#7a5233]'
                : 'w-9 h-9 hover:bg-[#F0EBE3] text-[#6B7280] hover:text-[#8b5e3c]'
              }`}>
            <IoSearchOutline className={expanded ? 'text-white text-[14px]' : 'text-[18px]'} />
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {open && expanded && (
        <div className="absolute top-full mt-2 right-0 w-64 lg:w-80 bg-white rounded-2xl shadow-xl border border-[#E8E0D5] overflow-hidden z-50">
          <div className="max-h-72 overflow-y-auto">
            {loading && (
              <div className="py-6 text-center text-[12px] text-[#9CA3AF]">Searching...</div>
            )}
            {!loading && searched && results.length === 0 && (
              <div className="py-6 text-center text-[12px] text-[#9CA3AF]">
                No products found for "<span className="text-[#8B5E3C]">{query}</span>"
              </div>
            )}
            {!loading && results.length > 0 && results.map((product) => (
              <Link key={product._id} href={`/product/${product._id}`}
                onClick={() => { setOpen(false); setExpanded(false); setQuery(''); }}>
                <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FFF8F5] transition border-b border-[#F9F5F0] last:border-0 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#F5F0EB] overflow-hidden shrink-0 flex items-center justify-center">
                    {product.thumbnail
                      ? <Image src={product.thumbnail} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                      : <IoSearchOutline className="text-[#C6A27E] text-sm" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[#1E1E1E] truncate">{product.name}</div>
                    <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wide">{product.categoryId?.name || ''}</div>
                  </div>
                  <div className="text-[12px] font-semibold text-[#8B5E3C] flex items-center shrink-0">
                    <MdOutlineCurrencyRupee />{product.salePrice?.toLocaleString('en-IN')}
                  </div>
                </div>
              </Link>
            ))}
            {!loading && results.length > 0 && (
              <button onClick={handleSubmit}
                className="w-full py-2.5 text-[11px] text-[#8B5E3C] font-medium hover:bg-[#FFF8F5] transition cursor-pointer border-t border-[#F0EBE3]">
                View all results for "{query}" →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Header ───────────────────────────────────────────────────────────────
export default function Header({ user }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch]     = useState('');
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu  = () => setMobileMenuOpen(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router   = useRouter();
  const cartItems = useSelector((state) => state.cart?.items || []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(lsToCart());
    setMounted(true);
  }, [dispatch]);

  if (!user) user = { firstName: null };
  const displayName = user?.firstName || '';

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (!mobileSearch.trim()) return;
    closeMobileMenu();
    router.push(`/store?search=${encodeURIComponent(mobileSearch.trim())}`);
    setMobileSearch('');
  };

  return (
    <>
      <header className="w-full bg-[#fafaf9f7] backdrop-blur-sm sticky top-0 z-50 border-b border-solid border-[0.5px] border-[#E8E0D5]">
        <div className="max-w-container mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu}>
            <div className="text-[16px] font-medium tracking-[0.12em] uppercase text-[#1E1E1E] shrink-0">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search (desktop) */}
            <SearchBar />

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
              {/* Mobile Search */}
              <form onSubmit={handleMobileSearch} className="mb-3">
                <div className="flex items-center bg-[#F8F5F1] rounded-full border border-[#E8E0D5] px-4 py-2 gap-2">
                  <input
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 text-[13px] text-[#1E1E1E] outline-none bg-transparent placeholder:text-[#9CA3AF]"
                  />
                  <button type="submit"
                    className="w-7 h-7 bg-[#8B5E3C] rounded-full flex items-center justify-center cursor-pointer">
                    <IoSearchOutline className="text-white text-[13px]" />
                  </button>
                </div>
              </form>

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
    </>
  );
}
