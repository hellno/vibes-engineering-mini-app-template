"use client";

import { UserAvatar } from "~/components/avatar";
import { NavActions } from "~/components/nav-actions";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";

export function MinimalNavbar() {
  const { context, isSDKLoaded } = useMiniAppSdk();
  const user = context?.user;
  
  return (
    <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Left: User Avatar */}
      <div className="px-4">
        {isSDKLoaded && user ? (
          <UserAvatar
            src={user.pfpUrl}
            fallback={user.username?.[0]?.toUpperCase() || "U"}
            size={32}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-muted" />
        )}
      </div>
      
      {/* Right: Actions */}
      <div className="px-4">
        <NavActions />
      </div>
    </header>
  );
}