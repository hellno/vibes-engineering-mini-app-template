"use client";

import dynamic from "next/dynamic";

const Frame = dynamic(() => import("~/components/Frame"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Farcaster Frames Template" }
) {
  return <Frame title={title} />;
}
