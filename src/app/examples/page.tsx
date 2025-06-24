"use client";

import dynamic from "next/dynamic";

const ExampleComponents = dynamic(() => import("~/components/ExampleComponents"), {
  ssr: false,
});

export default function ExamplesPage() {
  return (
    <div className="w-[400px] mx-auto py-4 px-2">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Component Examples</h1>
        <p className="text-gray-600 text-sm">
          Demo of various components available in this template
        </p>
      </div>
      <ExampleComponents />
    </div>
  );
}