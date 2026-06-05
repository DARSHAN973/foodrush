"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Route-change side effect — when the path or query string changes,
  // scroll back to the top because Next.js layouts can preserve scroll position.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
}

export default ScrollToTop;
