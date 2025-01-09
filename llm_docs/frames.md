# Farcaster frames v2

A streamlined guide for building a Farcaster Frames v2 demo application using Next.js, TypeScript, React, Frame SDK, and Wagmi. This documentation outlines the core architecture, key components, and interactions within the application.

Providers

Custom Wagmi Connector

A custom connector bridges the Wagmi library with the Farcaster Frame SDK, enabling interactions with the user’s Farcaster wallet.

// lib/connector.ts
import sdk from "@farcaster/frame-sdk";
import { createConnector } from "wagmi";

export function frameConnector() {
  return createConnector({
    // Connector configuration leveraging sdk.wallet.ethProvider
  });
}

Note: Future SDK releases aim to incorporate this connector directly, simplifying integration.

Wagmi Provider Component

Configures the Wagmi client with necessary chains and connectors, and integrates React Query for data fetching and caching.

// components/providers/WagmiProvider.tsx
import { createConfig, http, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { frameConnector } from "~/lib/connector";

const config = createConfig({
  chains: [base],
  connectors: [frameConnector()],
  transports: { [base.id]: http() },
});

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

Top-Level Providers

Integrates all provider components into the application using Next.js’ dynamic imports to ensure client-side rendering where necessary.

// app/providers.tsx
"use client";

import dynamic from "next/dynamic";

const WagmiProvider = dynamic(() => import("~/components/providers/WagmiProvider"), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiProvider>{children}</WagmiProvider>;
}

Core Components

Demo Component

The central component of the application, handling SDK initialization, context retrieval, and rendering interactive UI elements.

// app/components/Demo.tsx
"use client";

import { useEffect, useState } from "react";
import sdk, { type FrameContext } from "@farcaster/frame-sdk";

export default function Demo() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  useEffect(() => {
    const initializeSDK = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
      setIsSDKLoaded(true);
    };
    if (sdk && !isSDKLoaded) {
      initializeSDK();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) return <div>Loading...</div>;

  return (
    <div className="w-[300px] mx-auto py-4 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">Frames v2 Demo</h1>
      {/* Additional UI Elements */}
    </div>
  );
}

Action Buttons

Interactive buttons that invoke specific actions provided by the Frame SDK, such as opening URLs or closing the frame.

import { useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Button } from "~/components/ui/Button";

export default function ActionButtons() {
  const openUrl = useCallback(() => {
    sdk.actions.openUrl("https://www.example.com");
  }, []);

  const closeFrame = useCallback(() => {
    sdk.actions.close();
  }, []);

  return (
    <div>
      <Button onClick={openUrl}>Open Link</Button>
      <Button onClick={closeFrame}>Close Frame</Button>
    </div>
  );
}

Context Display

Displays contextual information provided by the parent Farcaster app, such as user details. Includes toggling functionality for better UX.

import { useState, useCallback } from "react";

export default function ContextDisplay({ context }: { context: FrameContext }) {
  const [isContextOpen, setIsContextOpen] = useState(false);
  const toggleContext = useCallback(() => {
    setIsContextOpen((prev) => !prev);
  }, []);

  return (
    <div className="mb-4">
      <h2 className="font-2xl font-bold">Context</h2>
      <button onClick={toggleContext} className="flex items-center gap-2 transition-colors">
        <span className={`transform transition-transform ${isContextOpen ? "rotate-90" : ""}`}>➤</span>
        Tap to expand
      </button>
      {isContextOpen && (
        <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px] overflow-x-">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

Wallet Integration

Manages wallet connections, displays the user’s address, and handles transactions and signatures using Wagmi hooks.

import { useAccount, useConnect, useDisconnect, useSendTransaction, useWaitForTransactionReceipt, useSignMessage, useSignTypedData } from "wagmi";
import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";

export default function WalletIntegration() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending: isSendTxPending, isError: isSendTxError, error: sendTxError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash as `0x${string}` });
  const { signMessage, isLoading: isSignPending, isError: isSignError, error: signError } = useSignMessage();
  const { signTypedData, isLoading: isSignTypedPending, isError: isSignTypedError, error: signTypedError } = useSignTypedData();

  const sendTx = useCallback(() => {
    sendTransaction(
      {
        to: "0xRecipientAddress",
        data: "0xTransactionData",
      },
      {
        onSuccess: (hash) => {
          setTxHash(hash);
        },
      }
    );
  }, [sendTransaction]);

  const sign = useCallback(() => {
    signMessage({ message: "Hello from Frames v2!" });
  }, [signMessage]);

  const signTyped = useCallback(() => {
    signTypedData({
      domain: { name: "Frames v2 Demo", version: "1", chainId: 8453 },
      types: { Message: [{ name: "content", type: "string" }] },
      message: { content: "Hello from Frames v2!" },
      primaryType: "Message",
    });
  }, [signTypedData]);

  return (
    <div>
      {address && <div>Address: {truncateAddress(address)}</div>}
      <Button onClick={() => (isConnected ? disconnect() : connect({ connector: config.connectors[0] }))}>
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
      {isConnected && (
        <>
          <Button onClick={sendTx} disabled={isSendTxPending}>
            Send Transaction
          </Button>
          {isSendTxError && <div className="text-red-500 text-xs mt-1">{sendTxError.message}</div>}
          {txHash && (
            <div>
              <div>Hash: {truncateAddress(txHash)}</div>
              <div>Status: {isConfirming ? "Confirming..." : isConfirmed ? "Confirmed!" : "Pending"}</div>
            </div>
          )}
          <Button onClick={sign} disabled={isSignPending}>
            Sign Message
          </Button>
          {isSignError && <div className="text-red-500 text-xs mt-1">{signError.message}</div>}
          <Button onClick={signTyped} disabled={isSignTypedPending}>
            Sign Typed Data
          </Button>
          {isSignTypedError && <div className="text-red-500 text-xs mt-1">{signTypedError.message}</div>}
        </>
      )}
    </div>
  );
}

Interactions

SDK Readiness

Upon initialization, the application signals to the Farcaster parent app that the frame is ready by invoking sdk.actions.ready(). This action transitions the frame from the splash screen to the main content.

useEffect(() => {
  const initializeSDK = async () => {
    setContext(await sdk.context);
    sdk.actions.ready();
    setIsSDKLoaded(true);
  };
  if (sdk && !isSDKLoaded) {
    initializeSDK();
  }
}, [isSDKLoaded]);

Context Management

The Frame SDK provides contextual data about the current user and environment through sdk.context. This data is asynchronously fetched and managed within the component state, allowing for dynamic rendering based on the user’s context.

const [context, setContext] = useState<FrameContext>();

useEffect(() => {
  const fetchContext = async () => {
    const ctx = await sdk.context;
    setContext(ctx);
    sdk.actions.ready();
  };
  fetchContext();
}, []);

Action Invocation

Interactive elements such as buttons utilize Frame SDK actions to perform operations like opening external URLs or closing the frame. These actions communicate directly with the Farcaster client to execute desired behaviors.

const openUrl = useCallback(() => {
  sdk.actions.openUrl("https://www.example.com");
}, []);

const closeFrame = useCallback(() => {
  sdk.actions.close();
}, []);

Wallet Operations

Leveraging Wagmi, the application manages wallet connections, displays user addresses, and handles transactions and signatures. Hooks provided by Wagmi facilitate these interactions, ensuring a responsive and secure wallet experience.
	•	Connecting/Disconnecting:

<Button onClick={() => (isConnected ? disconnect() : connect({ connector: config.connectors[0] }))}>
  {isConnected ? "Disconnect" : "Connect"}
</Button>


	•	Sending Transactions:

const sendTx = useCallback(() => {
  sendTransaction(
    {
      to: "0xRecipientAddress",
      data: "0xTransactionData",
    },
    {
      onSuccess: (hash) => {
        setTxHash(hash);
      },
    }
  );
}, [sendTransaction]);


	•	Signing Messages:

const sign = useCallback(() => {
  signMessage({ message: "Hello from Frames v2!" });
}, [signMessage]);



Signature Handling

The application supports both simple message signing and typed data signing, enabling users to authenticate or authorize actions securely.
	•	Sign Message:

const sign = useCallback(() => {
  signMessage({ message: "Hello from Frames v2!" });
}, [signMessage]);


	•	Sign Typed Data:

const signTyped = useCallback(() => {
  signTypedData({
    domain: { name: "Frames v2 Demo", version: "1", chainId: 8453 },
    types: { Message: [{ name: "content", type: "string" }] },
    message: { content: "Hello from Frames v2!" },
    primaryType: "Message",
  });
}, [signTypedData]);

