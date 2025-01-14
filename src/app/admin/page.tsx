"use client";

import { useState, useCallback } from "react";
import { PurpleButton } from "~/components/ui/PurpleButton";
import type { FrameNotificationDetails } from "@farcaster/frame-sdk";

export default function AdminDashboard() {
  const [sendNotificationResult, setSendNotificationResult] = useState("");

  const sendNotification = useCallback(async (fid: number, notificationDetails: FrameNotificationDetails) => {
    setSendNotificationResult("");

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        mode: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fid,
          notificationDetails,
        }),
      });

      if (response.status === 200) {
        setSendNotificationResult("Success");
        return;
      } else if (response.status === 429) {
        setSendNotificationResult("Rate limited");
        return;
      }

      const data = await response.text();
      setSendNotificationResult(`Error: ${data}`);
    } catch (error) {
      setSendNotificationResult(`Error: ${error}`);
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl">Admin Dashboard</h1>
      <div className="flex flex-1 flex-col gap-4">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="text-xl mb-4">Send Notifications</h2>
          
          <div className="mb-4">
            <PurpleButton onClick={() => {
              // Example usage - you'll need to provide actual fid and notification details
              sendNotification(123, {
                token: "example-token",
                url: "https://example.com"
              });
            }}>
              Send Test Notification
            </PurpleButton>
          </div>

          {sendNotificationResult && (
            <div className="mb-2 text-sm">
              Send notification result: {sendNotificationResult}
            </div>
          )}
        </div>

        <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
        <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
      </div>
    </div>
  );
}
