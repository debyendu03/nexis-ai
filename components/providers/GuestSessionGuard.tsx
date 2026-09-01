"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const GUEST_STORAGE_KEY = "nexis_guest_count";
const GUEST_MESSAGES_KEY = "nexis_guest_messages";

export function GuestSessionGuard() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) return;
 
    sessionStorage.removeItem(GUEST_MESSAGES_KEY);
    sessionStorage.removeItem(GUEST_STORAGE_KEY);

    if (pathname !== "/") router.replace("/");
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, router]);
  return null;
}
