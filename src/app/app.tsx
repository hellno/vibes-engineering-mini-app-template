"use client";

import dynamic from "next/dynamic";

const MiniApp = dynamic(() => import("~/components/MiniApp"), {
  ssr: false,
});

export default function App() {
  return <MiniApp />;
}
