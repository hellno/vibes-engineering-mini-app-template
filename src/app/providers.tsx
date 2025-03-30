"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useFrameSDK } from "~/hooks/useFrameSDK";

const WagmiProvider = dynamic(
  () => import("~/components/providers/WagmiProvider"),
  {
    ssr: false,
  },
);

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      persistence: "memory",
      person_profiles: "identified_only",
      loaded: (ph) => {
        // Generate anonymous session ID without identifying
        const sessionId = ph.get_distinct_id() || crypto.randomUUID();
        ph.register({ session_id: sessionId });

        // Temporary distinct ID that will be aliased later
        if (!ph.get_distinct_id()) {
          ph.reset(true); // Ensure clean state
        }
      },
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
export function Providers({ children }: { children: React.ReactNode }) {
  const { isSDKLoaded, context } = useFrameSDK();

  useEffect(() => {
    if (!context?.user?.fid || !posthog?.isFeatureEnabled) return;

    const fidId = `fc_${context?.user?.fid}`;
    const currentId = posthog.get_distinct_id();

    // Skip if already identified with this FID
    if (currentId === fidId) return;

    // Create alias from session ID → FID
    posthog.alias(fidId, currentId);

    // Identify future events with FID
    posthog.identify(fidId, {
      farcaster_username: context.user?.username,
      farcaster_display_name: context.user?.displayName,
      farcaster_fid: context.user?.fid,
    });
  }, [context?.user]); // Only runs when FID changes

  return (
    <WagmiProvider>
      <PostHogProvider>{children}</PostHogProvider>
    </WagmiProvider>
  );
}
