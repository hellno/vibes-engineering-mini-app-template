"use client";

import { PROJECT_TITLE } from "~/lib/constants";

export default function App() {
  return (
    <div className="w-[400px] mx-auto py-8 px-4 min-h-screen flex flex-col items-center justify-center">
      {/* TEMPLATE_CONTENT_START - Replace content below */}
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          {PROJECT_TITLE}
        </h1>
        <p className="text-lg text-muted-foreground">
          Ready to launch
        </p>
      </div>
      {/* TEMPLATE_CONTENT_END */}
    </div>
  );
}
