"use client";

import FileUploadCard from "~/components/FileUploadCard";
import { useMiniAppSdk } from "~/hooks/use-miniapp-sdk";
import { baseUSDC } from "@daimo/contract";
import { getAddress } from "viem";
import { DaimoPayTransferButton } from "./daimo-pay-transfer-button";
import VisitorCounter from "./VisitorCounter";

export default function ExampleComponents() {
  const { isSDKLoaded } = useMiniAppSdk();

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[400px] mx-auto py-2 px-2 space-y-4">
      {/* TEMPLATE_CONTENT_START - Replace content below  */}
      <DaimoPayTransferButton
        text="Pay with DaimoPay"
        toChainId={baseUSDC.chainId}
        toAddress={getAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")}
        tokenAddress={baseUSDC.token as `0x${string}`}
        amount="1"
        onPaymentStarted={() => console.log("Payment started")}
        onPaymentCompleted={() => console.log("Payment completed")}
      />
      <FileUploadCard />
      <VisitorCounter />
      {/* TEMPLATE_CONTENT_END */}
    </div>
  );
}
