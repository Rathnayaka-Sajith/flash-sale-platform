"use client";

import React, { useState } from "react";
import {
  Headphones,
  Keyboard,
  Monitor,
  Cpu,
  Watch,
  Mouse,
  Speaker,
  HardDrive,
  ShoppingCart,
  Flame,
  Star,
  CheckCircle2,
  Package,
  Plus,
  Zap,
} from "lucide-react";
import { Product } from "@/types/flash-sale";

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export default function ProductCard({
  product,
  cartQuantity,
  onAddToCart,
  onBuyNow,
}: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stockRemaining <= 0;
  const isMaxInCart = cartQuantity >= product.stockRemaining;
  const isLowStock = product.stockRemaining > 0 && product.stockRemaining <= 10;

  const discountPercentage = Math.round(
    ((product.originalPrice - product.salePrice) / product.originalPrice) * 100
  );

  const stockRatio = Math.max(
    0,
    Math.min(
      100,
      Math.round((product.stockRemaining / product.totalStock) * 100)
    )
  );

  const handleAddClick = () => {
    if (isOutOfStock || isMaxInCart) return;
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const renderProductIllustration = () => {
    const iconProps = {
      className:
        "h-16 w-16 text-emerald-600 transition-transform duration-300 group-hover:scale-110",
      strokeWidth: 1.6,
    };

    switch (product.iconName) {
      case "headphones":
        return <Headphones {...iconProps} />;
      case "keyboard":
        return <Keyboard {...iconProps} />;
      case "monitor":
        return <Monitor {...iconProps} />;
      case "cpu":
        return <Cpu {...iconProps} />;
      case "watch":
        return <Watch {...iconProps} />;
      case "mouse":
        return <Mouse {...iconProps} />;
      case "speaker":
        return <Speaker {...iconProps} />;
      case "ssd":
        return <HardDrive {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl bg-white border border-gray-200 p-5 shadow-sm transition-all duration-200 hover:border-emerald-500 hover:shadow-md">
      <div>
        {/* Product Image Placeholder Area */}
        <div className="relative mb-4 flex h-48 w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
          {/* Top-left Discount Pill */}
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
            <span className="inline-flex items-center rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-sm">
              -{discountPercentage}% OFF
            </span>
            {product.badge && (
              <span className="inline-flex items-center rounded-lg bg-white/95 border border-emerald-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                {product.badge}
              </span>
            )}
          </div>

          {/* Top-right SKU or In-Cart Badge */}
          <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
            <span className="rounded-md bg-white/90 px-2 py-0.5 font-mono text-[10px] font-medium text-gray-500 border border-gray-200">
              {product.sku}
            </span>
            {cartQuantity > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
                <ShoppingCart className="h-2.5 w-2.5" />
                {cartQuantity} in cart
              </span>
            )}
          </div>

          {/* Center Icon / Visual Placeholder */}
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-sm border border-emerald-100">
            {renderProductIllustration()}
          </div>

          {/* Bottom Specs Strip */}
          <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-center gap-1.5 flex-wrap">
            {product.specs.map((spec) => (
              <span
                key={spec}
                className="rounded-md bg-white/95 border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-600"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Category & Rating */}
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-emerald-700">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-gray-600">
            <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
            <span className="font-bold text-gray-900">{product.rating}</span>
            <span className="text-gray-400">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title & Subtitle */}
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {product.name}
        </h2>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {product.subtitle}
        </p>
      </div>

      {/* Bottom Section: Price, Inventory Microservice Bar & Action Buttons */}
      <div className="mt-5 pt-4 border-t border-gray-100 space-y-4">
        {/* Price Row */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-xs font-medium text-gray-400 block">
              Flash Deal Price
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-emerald-600">
                ${product.salePrice.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
              Save ${(product.originalPrice - product.salePrice).toFixed(0)}
            </span>
          </div>
        </div>

        {/* Inventory Microservice Progress Bar & Badge */}
        <div className="rounded-xl bg-gray-50 p-3 border border-gray-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-gray-900">
              <Flame
                className={`h-3.5 w-3.5 ${
                  isOutOfStock
                    ? "text-gray-400"
                    : "text-emerald-600 fill-emerald-500 animate-pulse"
                }`}
              />
              {isOutOfStock ? (
                <span className="text-gray-500">Sold Out</span>
              ) : (
                <span>Only {product.stockRemaining} left!</span>
              )}
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-700">
              {product.stockRemaining}/{product.totalStock} in stock
            </span>
          </div>

          {/* Progress Bar Track */}
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={product.stockRemaining}
            aria-valuemin={0}
            aria-valuemax={product.totalStock}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOutOfStock
                  ? "bg-gray-400"
                  : isLowStock
                  ? "bg-emerald-600"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${stockRatio}%` }}
            />
          </div>
        </div>

        {/* Action Buttons: Add to Cart + Buy Now */}
        {isOutOfStock ? (
          <button
            type="button"
            disabled
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-extrabold tracking-wide cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Claimed Out</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isMaxInCart}
              onClick={handleAddClick}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-xs sm:text-sm font-extrabold transition-all border-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                justAdded
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : isMaxInCart
                  ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : "border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50 active:scale-[0.99]"
              }`}
            >
              {justAdded ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Added!</span>
                </>
              ) : isMaxInCart ? (
                <span>Max in Cart</span>
              ) : (
                <>
                  <Plus className="h-4 w-4 shrink-0" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onBuyNow(product)}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-3 text-xs sm:text-sm font-extrabold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-500 active:scale-[0.99] transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Zap className="h-4 w-4 fill-white shrink-0" />
              <span>Buy Now</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
