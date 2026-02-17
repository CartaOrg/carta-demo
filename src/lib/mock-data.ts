// ============================================================
// Carta — Mock Data Layer
// All data used across the app is defined here.
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide icon name
  itemCount: number;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  tags: string[];
  sortOrder: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: { menuItemId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: "new" | "preparing" | "ready" | "completed";
  type: "dine-in" | "takeout" | "delivery";
  table?: string;
  createdAt: string;
}

export interface PosIntegration {
  id: string;
  name: string;
  slug: string;
  logo: string; // path or emoji placeholder
  description: string;
  enabled: boolean;
  status: "disconnected" | "syncing" | "connected";
  lastSync?: string;
}

export interface Table {
  id: string;
  label: string;
  seats: number;
  shape: "square" | "round" | "rectangle";
  x: number; // percent from left (0-100)
  y: number; // percent from top (0-100)
  status: "available" | "occupied" | "reserved" | "needs-attention";
  orderId?: string; // linked order
  guestCount?: number;
  requests?: TableRequest[];
}

export interface TableRequest {
  id: string;
  message: string;
  time: string;
  resolved: boolean;
}

// ── Categories ──────────────────────────────────────────────

export const categories: Category[] = [
  { id: "cat-1", name: "Burgers", slug: "burgers", icon: "Beef", itemCount: 4, sortOrder: 0 },
  { id: "cat-2", name: "Pizza", slug: "pizza", icon: "Pizza", itemCount: 3, sortOrder: 1 },
  { id: "cat-3", name: "Drinks", slug: "drinks", icon: "CupSoda", itemCount: 5, sortOrder: 2 },
  { id: "cat-4", name: "Desserts", slug: "desserts", icon: "IceCreamCone", itemCount: 3, sortOrder: 3 },
  { id: "cat-5", name: "Sides", slug: "sides", icon: "Salad", itemCount: 4, sortOrder: 4 },
];

// ── Menu Items ──────────────────────────────────────────────

export const menuItems: MenuItem[] = [
  // Burgers
  { id: "item-1", categoryId: "cat-1", name: "Classic Smash Burger", description: "Double patty, American cheese, pickles, special sauce on a brioche bun.", price: 12.99, image: "/food/burger-classic.jpg", available: true, tags: ["popular", "bestseller"], sortOrder: 0 },
  { id: "item-2", categoryId: "cat-1", name: "BBQ Bacon Burger", description: "Smoky BBQ sauce, crispy bacon, cheddar, caramelized onions.", price: 14.99, image: "/food/burger-bbq.jpg", available: true, tags: ["spicy"], sortOrder: 1 },
  { id: "item-3", categoryId: "cat-1", name: "Mushroom Swiss Burger", description: "Sautéed mushrooms, Swiss cheese, garlic aioli.", price: 13.99, image: "/food/burger-mushroom.jpg", available: true, tags: [], sortOrder: 2 },
  { id: "item-4", categoryId: "cat-1", name: "Veggie Burger", description: "Plant-based patty, avocado, lettuce, tomato, vegan mayo.", price: 11.99, image: "/food/burger-veggie.jpg", available: false, tags: ["vegan"], sortOrder: 3 },

  // Pizza
  { id: "item-5", categoryId: "cat-2", name: "Margherita Pizza", description: "San Marzano tomatoes, fresh mozzarella, basil.", price: 16.99, image: "/food/pizza-margherita.jpg", available: true, tags: ["popular"], sortOrder: 0 },
  { id: "item-6", categoryId: "cat-2", name: "Pepperoni Pizza", description: "Crispy pepperoni, mozzarella, red sauce.", price: 18.99, image: "/food/pizza-pepperoni.jpg", available: true, tags: ["bestseller"], sortOrder: 1 },
  { id: "item-7", categoryId: "cat-2", name: "Hawaiian Pizza", description: "Ham, pineapple, mozzarella cheese.", price: 17.99, image: "/food/pizza-hawaiian.jpg", available: true, tags: [], sortOrder: 2 },

  // Drinks
  { id: "item-8", categoryId: "cat-3", name: "Fresh Lemonade", description: "Freshly squeezed lemon, cane sugar, mint.", price: 4.99, image: "/food/drink-lemonade.jpg", available: true, tags: ["popular"], sortOrder: 0 },
  { id: "item-9", categoryId: "cat-3", name: "Iced Americano", description: "Double espresso over ice.", price: 5.49, image: "/food/drink-americano.jpg", available: true, tags: [], sortOrder: 1 },
  { id: "item-10", categoryId: "cat-3", name: "Mango Smoothie", description: "Fresh mango, yogurt, honey.", price: 6.99, image: "/food/drink-mango.jpg", available: true, tags: [], sortOrder: 2 },
  { id: "item-11", categoryId: "cat-3", name: "Sparkling Water", description: "San Pellegrino 500ml.", price: 3.49, image: "/food/drink-sparkling.jpg", available: true, tags: [], sortOrder: 3 },
  { id: "item-12", categoryId: "cat-3", name: "Craft IPA", description: "Local hop-forward IPA, 16oz draft.", price: 7.99, image: "/food/drink-ipa.jpg", available: false, tags: [], sortOrder: 4 },

  // Desserts
  { id: "item-13", categoryId: "cat-4", name: "Tiramisu", description: "Classic Italian espresso-soaked ladyfingers, mascarpone.", price: 8.99, image: "/food/dessert-tiramisu.jpg", available: true, tags: ["popular"], sortOrder: 0 },
  { id: "item-14", categoryId: "cat-4", name: "Chocolate Lava Cake", description: "Warm molten chocolate center, vanilla ice cream.", price: 9.99, image: "/food/dessert-lava.jpg", available: true, tags: [], sortOrder: 1 },
  { id: "item-15", categoryId: "cat-4", name: "Churros", description: "Cinnamon-sugar churros with chocolate dipping sauce.", price: 6.99, image: "/food/dessert-churros.jpg", available: true, tags: [], sortOrder: 2 },

  // Sides
  { id: "item-16", categoryId: "cat-5", name: "Truffle Fries", description: "Crispy fries, truffle oil, parmesan, parsley.", price: 7.99, image: "/food/side-fries.jpg", available: true, tags: ["popular"], sortOrder: 0 },
  { id: "item-17", categoryId: "cat-5", name: "Caesar Salad", description: "Romaine, parmesan, croutons, house Caesar dressing.", price: 9.99, image: "/food/side-caesar.jpg", available: true, tags: [], sortOrder: 1 },
  { id: "item-18", categoryId: "cat-5", name: "Onion Rings", description: "Beer-battered onion rings, ranch dressing.", price: 6.99, image: "/food/side-onion-rings.jpg", available: true, tags: [], sortOrder: 2 },
  { id: "item-19", categoryId: "cat-5", name: "Garlic Bread", description: "Toasted sourdough, garlic butter, herbs.", price: 5.49, image: "/food/side-garlic-bread.jpg", available: true, tags: [], sortOrder: 3 },
];

// ── Orders ──────────────────────────────────────────────────

export const orders: Order[] = [
  {
    id: "ord-1", orderNumber: "#1041", customerName: "Alex Johnson",
    items: [{ menuItemId: "item-1", name: "Classic Smash Burger", quantity: 2, price: 12.99 }, { menuItemId: "item-16", name: "Truffle Fries", quantity: 1, price: 7.99 }],
    total: 33.97, status: "new", type: "dine-in", table: "T-4", createdAt: "2026-02-17T11:02:00Z",
  },
  {
    id: "ord-2", orderNumber: "#1042", customerName: "Maria Garcia",
    items: [{ menuItemId: "item-5", name: "Margherita Pizza", quantity: 1, price: 16.99 }, { menuItemId: "item-8", name: "Fresh Lemonade", quantity: 2, price: 4.99 }],
    total: 26.97, status: "preparing", type: "dine-in", table: "T-7", createdAt: "2026-02-17T11:08:00Z",
  },
  {
    id: "ord-3", orderNumber: "#1043", customerName: "James Lee",
    items: [{ menuItemId: "item-2", name: "BBQ Bacon Burger", quantity: 1, price: 14.99 }, { menuItemId: "item-9", name: "Iced Americano", quantity: 1, price: 5.49 }, { menuItemId: "item-13", name: "Tiramisu", quantity: 1, price: 8.99 }],
    total: 29.47, status: "ready", type: "takeout", createdAt: "2026-02-17T10:45:00Z",
  },
  {
    id: "ord-4", orderNumber: "#1044", customerName: "Sophie Chen",
    items: [{ menuItemId: "item-6", name: "Pepperoni Pizza", quantity: 2, price: 18.99 }, { menuItemId: "item-10", name: "Mango Smoothie", quantity: 2, price: 6.99 }],
    total: 51.96, status: "completed", type: "delivery", createdAt: "2026-02-17T09:30:00Z",
  },
  {
    id: "ord-5", orderNumber: "#1045", customerName: "Ryan Park",
    items: [{ menuItemId: "item-3", name: "Mushroom Swiss Burger", quantity: 1, price: 13.99 }, { menuItemId: "item-18", name: "Onion Rings", quantity: 1, price: 6.99 }],
    total: 20.98, status: "new", type: "dine-in", table: "T-2", createdAt: "2026-02-17T11:15:00Z",
  },
  {
    id: "ord-6", orderNumber: "#1046", customerName: "Emily Davis",
    items: [{ menuItemId: "item-14", name: "Chocolate Lava Cake", quantity: 1, price: 9.99 }, { menuItemId: "item-11", name: "Sparkling Water", quantity: 1, price: 3.49 }],
    total: 13.48, status: "preparing", type: "dine-in", table: "T-1", createdAt: "2026-02-17T11:12:00Z",
  },
];

// ── POS Integrations ────────────────────────────────────────

export const posIntegrations: PosIntegration[] = [
  { id: "pos-1", name: "Square", slug: "square", logo: "⬛", description: "Accept payments, track sales, and manage your menu directly from Square POS.", enabled: false, status: "disconnected" },
  { id: "pos-2", name: "Clover", slug: "clover", logo: "🍀", description: "Sync orders, inventory, and reporting with Clover's hardware terminals.", enabled: false, status: "disconnected" },
  { id: "pos-3", name: "Toast", slug: "toast", logo: "🍞", description: "Connect with Toast for restaurant-grade POS with built-in online ordering.", enabled: false, status: "disconnected" },
  { id: "pos-4", name: "Stripe Terminal", slug: "stripe", logo: "💳", description: "Use Stripe Terminal for flexible in-person payment processing.", enabled: false, status: "disconnected" },
  { id: "pos-5", name: "Lightspeed", slug: "lightspeed", logo: "⚡", description: "All-in-one restaurant POS with table management and analytics.", enabled: false, status: "disconnected" },
  { id: "pos-6", name: "Revel Systems", slug: "revel", logo: "📱", description: "Cloud-based iPad POS with advanced reporting and inventory.", enabled: false, status: "disconnected" },
];

// ── Tables (Floor Plan) ─────────────────────────────────────

export const tables: Table[] = [
  // Row 1 — Window side
  { id: "T-1", label: "T-1", seats: 2, shape: "square", x: 8, y: 10, status: "occupied", orderId: "ord-6", guestCount: 2, requests: [
    { id: "req-1", message: "Extra gravy on the side please", time: "11:14 AM", resolved: false },
  ]},
  { id: "T-2", label: "T-2", seats: 2, shape: "square", x: 28, y: 10, status: "occupied", orderId: "ord-5", guestCount: 1, requests: [
    { id: "req-2", message: "Can we get more napkins?", time: "11:18 AM", resolved: false },
  ]},
  { id: "T-3", label: "T-3", seats: 4, shape: "rectangle", x: 48, y: 10, status: "reserved", guestCount: 0, requests: [] },
  { id: "T-4", label: "T-4", seats: 4, shape: "rectangle", x: 72, y: 10, status: "occupied", orderId: "ord-1", guestCount: 3, requests: [
    { id: "req-3", message: "Needs more gravy for the burger", time: "11:05 AM", resolved: false },
    { id: "req-4", message: "One more water please", time: "11:10 AM", resolved: true },
  ]},

  // Row 2 — Center
  { id: "T-5", label: "T-5", seats: 6, shape: "round", x: 15, y: 40, status: "available", requests: [] },
  { id: "T-6", label: "T-6", seats: 6, shape: "round", x: 45, y: 40, status: "available", requests: [] },
  { id: "T-7", label: "T-7", seats: 4, shape: "round", x: 75, y: 40, status: "occupied", orderId: "ord-2", guestCount: 4, requests: [
    { id: "req-5", message: "Food is taking too long", time: "11:20 AM", resolved: false },
  ]},

  // Row 3 — Back wall
  { id: "T-8", label: "T-8", seats: 2, shape: "square", x: 8, y: 70, status: "available", requests: [] },
  { id: "T-9", label: "T-9", seats: 2, shape: "square", x: 28, y: 70, status: "reserved", requests: [] },
  { id: "T-10", label: "T-10", seats: 8, shape: "rectangle", x: 55, y: 72, status: "occupied", guestCount: 6, requests: [
    { id: "req-6", message: "Birthday candle for dessert 🎂", time: "11:22 AM", resolved: false },
  ]},
];

// ── Store stats (dashboard) ─────────────────────────────────

export const dashboardStats = {
  todayRevenue: 2847.5,
  todayOrders: 67,
  avgOrderValue: 42.5,
  activeMenuItems: menuItems.filter((i) => i.available).length,
  popularItems: menuItems.filter((i) => i.tags.includes("popular")),
  revenueByHour: [
    { hour: "9AM", revenue: 120 },
    { hour: "10AM", revenue: 340 },
    { hour: "11AM", revenue: 580 },
    { hour: "12PM", revenue: 890 },
    { hour: "1PM", revenue: 720 },
    { hour: "2PM", revenue: 410 },
    { hour: "3PM", revenue: 280 },
    { hour: "4PM", revenue: 190 },
  ],
};
