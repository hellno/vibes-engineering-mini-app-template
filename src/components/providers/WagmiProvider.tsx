import { createConfig, http, injected, WagmiProvider } from "wagmi";
import { base, celo, degen, mainnet, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { DaimoPayProvider, getDefaultConfig } from "@daimo/pay";
import { PROJECT_TITLE } from "~/lib/constants";

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

export const config = createConfig(
  getDefaultConfig({
    appName: PROJECT_TITLE,
    chains: [base, degen, mainnet, optimism, celo],
    additionalConnectors: [farcasterMiniApp(), injected()],
    transports: {
      [base.id]: http(
        alchemyApiKey
          ? `https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`
          : undefined,
      ),
    },
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
