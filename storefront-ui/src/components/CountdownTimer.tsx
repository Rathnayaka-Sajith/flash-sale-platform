"use client";

import React, { useEffect, useState } from "react";
import { Timer, Zap } from "lucide-react";

interface CountdownTimerProps {
  initialSeconds?: number;
  compact?: boolean;
}

export default function CountdownTimer({
  initialSeconds = 15 * 60 + 30, // Defaults to 00:15:30
  compact = false,
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : initialSeconds));
    }, 1000);

    return () => clearInterval(interval);
  }, [initialSeconds]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-emerald-700 font-mono text-sm font-semibold">
        <Timer className="h-4 w-4 text-emerald-600 animate-pulse" />
        <span>
          {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}{" "}
          remaining
        </span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-white border-2 border-emerald-500/80 p-4 sm:px-6 sm:py-4 shadow-lg shadow-emerald-500/10"
      role="timer"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            Batch Ends In
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Prices reset at zero
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono">
        <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-600 text-white px-3.5 py-2 min-w-[60px] shadow-sm">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
            {formatNumber(hours)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100 mt-1">
            HRS
          </span>
        </div>

        <span className="text-2xl font-black text-emerald-600 animate-pulse">
          :
        </span>

        <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-600 text-white px-3.5 py-2 min-w-[60px] shadow-sm">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
            {formatNumber(minutes)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100 mt-1">
            MIN
          </span>
        </div>

        <span className="text-2xl font-black text-emerald-600 animate-pulse">
          :
        </span>

        <div className="flex flex-col items-center justify-center rounded-xl bg-emerald-500 text-white px-3.5 py-2 min-w-[60px] shadow-sm ring-2 ring-emerald-200">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
            {formatNumber(seconds)}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-50 mt-1">
            SEC
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 border border-emerald-200">
        <span className="font-mono text-xs font-bold text-emerald-700">
          {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}{" "}
          remaining
        </span>
      </div>
    </div>
  );
}
