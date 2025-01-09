"use client";

import dynamic from "next/dynamic";
import { PROJECT_TITLE } from "~/lib/constants";

const Frame = dynamic(() => import("~/components/Frame"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: PROJECT_TITLE }
) {
  return <Frame title={title} />;
}
