export type ProductCategory =
  | "All"
  | "Audio"
  | "Keyboards"
  | "Displays"
  | "Compute"
  | "Accessories";

export interface Product {
  id: string;
  sku: string;
  name: string;
  subtitle: string;
  category: Exclude<ProductCategory, "All">;
  originalPrice: number;
  salePrice: number;
  stockRemaining: number;
  totalStock: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  specs: string[];
  iconName:
    | "headphones"
    | "keyboard"
    | "monitor"
    | "cpu"
    | "watch"
    | "mouse"
    | "speaker"
    | "ssd";
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PurchasedOrder {
  orderId: string;
  items: CartItem[];
  totalPaid: number;
  timestamp: string;
}
