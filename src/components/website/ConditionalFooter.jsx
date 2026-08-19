"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  const hideFooterRoutes = ["/contact", "/checkout", "/profile", "/cart"];
  const shouldHideFooter =
    hideFooterRoutes.includes(pathname) || pathname.startsWith("/product/");

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />
}
