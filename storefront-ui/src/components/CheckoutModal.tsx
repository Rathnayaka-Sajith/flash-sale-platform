"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Server,
  Lock,
  Receipt,
} from "lucide-react";
import { CartItem, PurchasedOrder } from "@/types/flash-sale";
import CountdownTimer from "./CountdownTimer";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  purchasedOrders: PurchasedOrder[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onConfirmPurchase: () => string; // returns generated order ID
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  purchasedOrders,
  onUpdateQuantity,
  onRemoveItem,
  onConfirmPurchase,
}: CheckoutModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  // Whenever new items are added to the cart, show the active cart items immediately
  useEffect(() => {
    if (items.length > 0) {
      setConfirmedOrderId(null);
    }
  }, [items.length]);

  if (!isOpen) return null;

  const subtotalOriginal = items.reduce(
    (sum, item) => sum + item.product.originalPrice * item.quantity,
    0
  );
  const subtotalSale = items.reduce(
    (sum, item) => sum + item.product.salePrice * item.quantity,
    0
  );
  const totalSavings = subtotalOriginal - subtotalSale;

  const handleConfirm = () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      const orderId = onConfirmPurchase();
      setIsSubmitting(false);
      setConfirmedOrderId(orderId);
    }, 350);
  };

  const handleCloseModal = () => {
    setConfirmedOrderId(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={handleCloseModal}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-gray-200 flex flex-col justify-between">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2
                  id="slide-over-title"
                  className="text-lg font-black text-gray-900"
                >
                  Flash Cart &amp; Checkout
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  Order Microservice Dispatch Queue
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close checkout modal"
              className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Urgency Timer Banner inside Modal */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-3.5 py-2.5">
              <span className="text-xs font-bold text-gray-700">
                Reservation Lock
              </span>
              <CountdownTimer compact initialSeconds={15 * 60 + 30} />
            </div>

            {confirmedOrderId && items.length === 0 ? (
              <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 p-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 font-mono text-xs font-bold text-emerald-800">
                    ORDER #{confirmedOrderId}
                  </span>
                  <h3 className="text-xl font-black text-gray-900">
                    Purchase Confirmed!
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Your flash sale order has been dispatched to the{" "}
                    <span className="font-semibold text-emerald-700">
                      Order Microservice
                    </span>{" "}
                    and stock has been deducted from the{" "}
                    <span className="font-semibold text-emerald-700">
                      Inventory Microservice
                    </span>
                    .
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-500 transition-colors"
                >
                  Continue Shopping Flash Sale
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Your active flash cart is empty
                </h3>
                <p className="mt-1 text-xs text-gray-500 max-w-xs">
                  Click &ldquo;Add to Cart&rdquo; or &ldquo;Buy Now&rdquo; on
                  any live flash sale product to lock in discounted pricing.
                </p>
              </div>
            ) : (
              <>
                {/* Item Summary List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                    <span>Active Cart Items ({items.length})</span>
                    <span>Subtotal</span>
                  </div>

                  {items.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {product.sku}
                          </span>
                          <h4 className="mt-1 text-sm font-bold text-gray-900">
                            {product.name}
                          </h4>
                          <div className="mt-0.5 flex items-baseline gap-2">
                            <span className="text-sm font-extrabold text-emerald-600">
                              ${product.salePrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <span className="text-base font-black text-gray-900">
                          ${(product.salePrice * quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity & Remove Controls */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            aria-label="Decrease quantity"
                            className="rounded-md p-1.5 text-gray-600 hover:bg-white hover:text-emerald-600 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-gray-900">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            disabled={quantity >= product.stockRemaining}
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            aria-label="Increase quantity"
                            className="rounded-md p-1.5 text-gray-600 hover:bg-white hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-medium text-gray-500">
                            Max: {product.stockRemaining} left
                          </span>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            aria-label="Remove item"
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Simulated Microservice Telemetry Box */}
                <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Server className="h-4 w-4 text-emerald-600" />
                    <span>Microservice Pipeline Preview</span>
                  </div>
                  <div className="font-mono text-[11px] text-gray-600 space-y-1">
                    <p>
                      1.{" "}
                      <span className="text-emerald-700 font-semibold">
                        POST /api/orders
                      </span>{" "}
                      → Order Service
                    </p>
                    <p>
                      2.{" "}
                      <span className="text-emerald-700 font-semibold">
                        PATCH /api/inventory/reserve
                      </span>{" "}
                      → Inventory Service
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Purchased Orders History in Current Session */}
            {purchasedOrders.length > 0 && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Confirmed Purchases ({purchasedOrders.length})</span>
                </div>
                <div className="space-y-2.5">
                  {purchasedOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-800">
                          #{order.orderId}
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {order.timestamp}
                        </span>
                      </div>
                      <ul className="space-y-1 text-xs text-gray-700">
                        {order.items.map((item) => (
                          <li
                            key={item.product.id}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium truncate pr-2">
                              {item.quantity}x {item.product.name}
                            </span>
                            <span className="font-bold text-gray-900 shrink-0">
                              ${(item.product.salePrice * item.quantity).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-1.5 border-t border-emerald-200/60 flex items-center justify-between text-xs font-extrabold text-emerald-700">
                        <span>Total Paid</span>
                        <span>${order.totalPaid.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Original Retail Value</span>
                  <span className="line-through">
                    ${subtotalOriginal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Flash Sale Instant Savings</span>
                  <span>-${totalSavings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Due</span>
                  <span className="text-xl text-emerald-600">
                    ${subtotalSale.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-60 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <span>Dispatching to Order Service...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Confirm Purchase</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-gray-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Atomic stock reservation • Zero-latency checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
