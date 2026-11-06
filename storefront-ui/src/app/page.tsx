"use client";

import React, { useMemo, useState } from "react";
import {
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import {
  CartItem,
  Product,
  ProductCategory,
  PurchasedOrder,
} from "@/types/flash-sale";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";

const CATEGORIES: ProductCategory[] = [
  "All",
  "Audio",
  "Keyboards",
  "Displays",
  "Compute",
  "Accessories",
];

export default function FlashSalePage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("All");
  const [sortBy, setSortBy] = useState<"urgency" | "discount" | "price-asc">(
    "urgency"
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchasedOrders, setPurchasedOrders] = useState<PurchasedOrder[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastOrderBanner, setLastOrderBanner] = useState<string | null>(null);

  // Total items in cart
  const totalCartItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  // Total remaining stock across all products
  const totalRemainingUnits = useMemo(
    () => products.reduce((acc, item) => acc + item.stockRemaining, 0),
    [products]
  );

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.specs.some((s) => s.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "urgency") {
        if (a.stockRemaining === 0 && b.stockRemaining > 0) return 1;
        if (b.stockRemaining === 0 && a.stockRemaining > 0) return -1;
        return a.stockRemaining - b.stockRemaining;
      }
      if (sortBy === "discount") {
        const discA = (a.originalPrice - a.salePrice) / a.originalPrice;
        const discB = (b.originalPrice - b.salePrice) / b.originalPrice;
        return discB - discA;
      }
      return a.salePrice - b.salePrice;
    });
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Adds 1 unit of a product to the cart without opening modal
  const handleAddToCart = (product: Product) => {
    if (product.stockRemaining <= 0) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        const existing = prevCart[existingIndex];
        const nextQty = Math.min(
          product.stockRemaining,
          existing.quantity + 1
        );
        const updated = [...prevCart];
        updated[existingIndex] = { product, quantity: nextQty };
        return updated;
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Adds 1 unit of a product to the cart AND opens the checkout modal immediately
  const handleBuyNow = (product: Product) => {
    if (product.stockRemaining <= 0) return;
    handleAddToCart(product);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id !== productId) return item;
          const nextQty = Math.min(
            item.product.stockRemaining,
            item.quantity + delta
          );
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // Confirm purchase against BOTH the Redis Inventory and Postgres Order Microservices
  const handleConfirmPurchase = async (): Promise<string> => {
    const orderId = `GF-${Math.floor(100000 + Math.random() * 900000)}`;
    let allSuccessful = true;

    // 1. Process inventory deduction via Redis Microservice (Port 3001)
    for (const item of cart) {
      for (let i = 0; i < item.quantity; i++) {
        try {
          const res = await fetch(`http://localhost:3001/api/inventory/buy/${item.product.id}`, {
            method: "POST",
          });
          const data = await res.json();

          if (data.success) {
            // Live update the UI with actual remaining stock from Redis
            setProducts((prevProducts) =>
              prevProducts.map((prod) =>
                prod.id === item.product.id
                  ? { ...prod, stockRemaining: data.remainingStock }
                  : prod
              )
            );
          } else {
            allSuccessful = false;
          }
        } catch (error) {
          console.error("Inventory Microservice offline:", error);
          allSuccessful = false;
        }
      }
    }

    // 2. Prepare the final order data
    const totalPaid = cart.reduce(
      (sum, item) => sum + item.product.salePrice * item.quantity,
      0
    );
    
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const newOrder: PurchasedOrder = {
      orderId,
      items: [...cart],
      totalPaid,
      timestamp,
    };

    // 3. Save the permanent receipt via PostgreSQL Order Microservice (Port 3002)
    if (allSuccessful) {
      try {
        await fetch("http://localhost:3002/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder),
        });
      } catch (error) {
        console.error("Order Microservice offline:", error);
      }
    }

    // 4. Update the Frontend UI
    setPurchasedOrders((prev) => [newOrder, ...prev]);
    setLastOrderBanner(
      allSuccessful 
        ? `Order #${orderId} confirmed! Inventory secured (Redis) & Receipt Saved (Postgres).`
        : `Order #${orderId} processed, but some items failed due to stock limits.`
    );
    setCart([]);
    return orderId;
  };

  const handleResetDemo = () => {
    setProducts(MOCK_PRODUCTS);
    setCart([]);
    setPurchasedOrders([]);
    setLastOrderBanner(null);
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky White & Green Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartItems}
        onOpenCart={() => setIsCheckoutOpen(true)}
      />

      {/* Live Order Notification Toast Banner */}
      {lastOrderBanner && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-xs">
          <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{lastOrderBanner}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="underline text-white hover:text-emerald-100 text-xs font-extrabold"
              >
                View Order in Cart
              </button>
              <button
                type="button"
                onClick={() => setLastOrderBanner(null)}
                className="underline text-emerald-100 hover:text-white text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Hero Section with Ticking Countdown Timer */}
      <HeroBanner
        totalRemainingUnits={totalRemainingUnits}
        activeDealsCount={products.filter((p) => p.stockRemaining > 0).length}
      />

      {/* Main Content: Filter Bar & Product Grid */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Category Pills & Sort Control */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-extrabold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/20"
                      : "bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Right Controls: Sort & Demo Reset */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
              <label htmlFor="sort-select" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "urgency" | "discount" | "price-asc"
                  )
                }
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-800 focus:border-emerald-500 focus:outline-none"
              >
                <option value="urgency">Sort: Lowest Stock First</option>
                <option value="discount">Sort: Biggest Discount</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              title="Reset mock inventory levels"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Stock</span>
            </button>
          </div>
        </div>

        {/* Product Grid Header Count */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-gray-700">
              Live Flash Inventory ({filteredProducts.length} Items)
            </h2>
          </div>
          <span className="text-xs font-medium text-gray-500">
            Simulated Inventory &amp; Order Microservice UI
          </span>
        </div>

        {/* Responsive Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center space-y-3">
            <p className="text-base font-bold text-gray-900">
              No matching flash sale products found
            </p>
            <p className="text-xs text-gray-500">
              Try clearing your search filter or switching product categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-2 inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-500"
            >
              Show All Flash Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const cartEntry = cart.find((c) => c.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={cartEntry ? cartEntry.quantity : 0}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Minimalist White & Green Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Zap className="h-3.5 w-3.5 fill-white" />
            </span>
            <span>GREENFLASH E-Commerce UI</span>
          </div>
          <p>
            Frontend UI Prototype • Ready for Inventory &amp; Order Microservice
            Integration
          </p>
        </div>
      </footer>

      {/* Slide-out Cart / Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        purchasedOrders={purchasedOrders}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </div>
  );
}