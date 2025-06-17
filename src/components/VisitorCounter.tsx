"use client";

import { useEffect, useRef, useState } from "react";
import { kv } from "~/lib/kv";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const prevCountRef = useRef<number | null>(null);
  const [anim, setAnim] = useState(false);

  useEffect(() => {
    kv.incr("visits", 1).then((v) => setCount(typeof v === "number" ? v : 0));
  }, []);

  useEffect(() => {
    const id = setInterval(async () => {
      const v = await kv.get("visits");
      if (typeof v === "number") setCount(v);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (
      prevCountRef.current != null &&
      count != null &&
      count !== prevCountRef.current
    ) {
      setAnim(true);
      const t = setTimeout(() => setAnim(false), 300);
      return () => clearTimeout(t);
    }
  }, [count]);

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  return (
    <div className="rounded-xl border p-4 text-xl flex">
      Visitors:
      {count === null ? (
        <div className="ml-1 w-6 h-6 rounded-full bg-foreground/80" />
      ) : (
        <span
          className={`ml-1 inline-block transition-transform duration-300 ease-out ${
            anim ? "text-foreground/80 animate-in" : ""
          }`}
        >
          {count}
        </span>
      )}
    </div>
  );
}
