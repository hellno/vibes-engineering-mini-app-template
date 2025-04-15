"use client";

import { useEffect, useCallback, useState } from "react";
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
import { optimismUSDC } from "@daimo/contract";
import { getAddress } from "viem";

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
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Daimo Payment</CardTitle>
        <CardDescription>Pay $5 using USDC on Optimism</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {/* // ai! insert simple address entry from user and use it in toAddress */}
        <DaimoPayButton
          appId="pay-demo" /* Example app ID you can use for prototyping */
          toChain={optimismUSDC.chainId}
          toUnits="1.00" /* $1.00 USDC */
          toToken={getAddress(optimismUSDC.token)}
          toAddress="vitalik.eth´"
          onPaymentStarted={(e) => console.log(e)}
          onPaymentCompleted={(e) => console.log(e)}
        />
      </CardContent>
    </Card>
  );
}

export default function Frame() {
  const { isSDKLoaded } = useFrameSDK();

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-2 px-2">
      <ExampleCard />
      <PaymentComponent />
    </div>
  );
}
