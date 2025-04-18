"use client";

import { useState } from "react";
import FileUploadCard from "~/components/FileUploadCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import { DaimoPayButton } from "@daimo/pay";
import { Label } from "~/components/ui/label";
import { useFrameSDK } from "~/hooks/useFrameSDK";
import { baseUSDC } from "@daimo/contract";
import { getAddress } from "viem";
import BucketExplorer from "./BucketExplorer";

function ExampleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to the vibes.engineering template</CardTitle>
        <CardDescription>
          This is an example card that you can customize or remove
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Label>Place content in a Card here.</Label>
      </CardContent>
    </Card>
  );
}

function PaymentComponent() {
  const [address, setAddress] = useState<`0x${string}`>(
    "0x32e3C7fD24e175701A35c224f2238d18439C7dBC", // ethereum protocol guild
  );

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Pay $1 using USDC on Base</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Recipient Address</Label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => {
              if (e.target.value.startsWith("0x")) {
                return setAddress(e.target.value as `0x${string}`);
              }
            }}
            className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ETH address or ENS name"
          />
        </div>
        <div className="flex justify-center">
          <DaimoPayButton
            appId="pay-demo" /* Example app ID you can use for prototyping */
            toChain={baseUSDC.chainId}
            toUnits="1.00" /* $1.00 USDC */
            toToken={getAddress(baseUSDC.token)}
            toAddress={address}
            onPaymentStarted={(e) => console.log(e)}
            onPaymentCompleted={(e) => console.log(e)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function MiniApp() {
  const { isSDKLoaded } = useFrameSDK();

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[400px] mx-auto py-2 px-2 space-y-4">
      <ExampleCard />
      <PaymentComponent />
      <FileUploadCard />
      <BucketExplorer />
    </div>
  );
}
