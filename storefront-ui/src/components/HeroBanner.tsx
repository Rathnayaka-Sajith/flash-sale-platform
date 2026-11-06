"use client";

import React from "react";
import { Flame, ShieldCheck, Truck, Zap } from "lucide-react";
import CountdownTimer from "./CountdownTimer";

interface HeroBannerProps {
  totalRemainingUnits: number;
  activeDealsCount: number;
}

export default function HeroBanner({
  totalRemainingUnits,
  activeDealsCount,
}: HeroBannerProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-white border-b border-gray-200"
    >
      {/* Subtle decorative green grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Column: Headline & Subcopy */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-700">
              <Flame className="h-4 w-4 text-emerald-600 fill-emerald-500" />
              <span>Wave #04 • Instant Allocation Active</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.08]">
              Live Flash Sale{" "}
              <span className="text-emerald-600 underline decoration-emerald-300 decoration-4 underline-offset-8">
                Up to 49% Off
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-xl">
              Flagship hardware drops at strictly limited inventory quantities.
              Real-time stock locks upon checkout confirmation. Once the timer
              hits zero or stock depletes, prices revert immediately.
            </p>

            {/* Micro-trust bar */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Zap className="h-3.5 w-3.5" />
                </span>
                <span>{activeDealsCount} Active Tech Drops</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <span>{totalRemainingUnits} Total Units Remaining</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Truck className="h-3.5 w-3.5" />
                </span>
                <span>Same-Day Priority Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent Ticking Countdown Timer */}
          <div className="flex flex-col items-start lg:items-end justify-center">
            <CountdownTimer initialSeconds={15 * 60 + 30} />
          </div>
        </div>
      </div>
    </section>
  );
}
