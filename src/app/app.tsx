"use client";

import dynamic from "next/dynamic";

const Frame = dynamic(() => import("~/components/Frame"), {
  ssr: false,
});

export default function App() {
  return <Frame />;
}
