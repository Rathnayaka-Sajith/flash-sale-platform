"use client";

import React from "react";
import {
  Zap,
  Search,
  ShoppingBag,
  X,
  Activity,
} from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="#top"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 group-hover:bg-emerald-500 transition-colors">
              <Zap className="h-5 w-5 fill-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-gray-900">
                  GREEN<span className="text-emerald-600">FLASH</span>
                </span>
                <span className="hidden sm:inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-200">
                  LIVE
                </span>
              </div>
              <span className="text-[11px] font-medium text-gray-500 hidden sm:block">
                High-Velocity Tech Drops
              </span>
            </div>
          </a>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search flash deals, SKU, or specs..."
                aria-label="Search flash sale products"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Cluster Status & Cart Button */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600">
              <Activity className="h-3.5 w-3.5 text-emerald-600" />
              <span>Inventory Sync:</span>
              <span className="font-semibold text-emerald-600">Online</span>
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`Open cart with ${cartCount} items`}
              className="relative inline-flex items-center gap-2.5 rounded-xl bg-white border-2 border-gray-200 px-3.5 py-2.5 text-sm font-bold text-gray-900 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              <span className="hidden sm:inline">Flash Cart</span>

              {/* Notification Badge */}
              <span
                className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-extrabold transition-transform ${
                  cartCount > 0
                    ? "bg-emerald-600 text-white scale-100 shadow-sm shadow-emerald-600/30"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
