"use client";

export default function AdminDashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl">Admin Dashboard</h1>
      <div className="flex flex-1 flex-col gap-4">
        <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
        <div className="mx-auto h-full w-full max-w-3xl rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50" />
      </div>
    </div>
  );
}
