import { createConfig, http, injected, WagmiProvider } from "wagmi";
import { base, degen, mainnet, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { DaimoPayProvider, getDefaultConfig } from "@daimo/pay";
import { PROJECT_TITLE } from "~/lib/constants";

export const config = createConfig(
  getDefaultConfig({
    appName: PROJECT_TITLE,
    chains: [base, degen, mainnet, optimism],
    additionalConnectors: [farcasterMiniApp(), injected()],
  }),
);

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DaimoPayProvider>{children}</DaimoPayProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
