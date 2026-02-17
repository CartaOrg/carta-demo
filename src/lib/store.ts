import { create } from "zustand";
import type { Order, PosIntegration, Table, TableRequest, MenuItem } from "./mock-data";
import { orders as mockOrders, posIntegrations as mockPos, tables as mockTables } from "./mock-data";

// ── POS Store ───────────────────────────────────────────────

interface PosState {
  integrations: PosIntegration[];
  toggleIntegration: (id: string) => void;
}

export const usePosStore = create<PosState>((set) => ({
  integrations: mockPos,
  toggleIntegration: (id) =>
    set((state) => ({
      integrations: state.integrations.map((pos) => {
        if (pos.id !== id) return pos;
        if (pos.enabled) {
          // Disable
          return { ...pos, enabled: false, status: "disconnected" as const };
        }
        // Enable → set syncing first (the component will resolve to connected)
        return { ...pos, enabled: true, status: "syncing" as const };
      }),
    })),
  setSynced: (id: string) =>
    set((state) => ({
      integrations: state.integrations.map((pos) =>
        pos.id === id ? { ...pos, status: "connected" as const, lastSync: new Date().toISOString() } : pos
      ),
    })),
}));

// Helper to finish syncing (called from component after delay)
export const finishSync = (id: string) => {
  usePosStore.setState((state) => ({
    integrations: state.integrations.map((pos) =>
      pos.id === id ? { ...pos, status: "connected" as const, lastSync: new Date().toISOString() } : pos
    ),
  }));
};

// ── Orders Store ────────────────────────────────────────────

interface OrdersState {
  orders: Order[];
  moveOrder: (id: string, status: Order["status"]) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: mockOrders,
  moveOrder: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    })),
}));

// ── Tables Store ────────────────────────────────────────────

interface TablesState {
  tables: Table[];
  updateTable: (id: string, updates: Partial<Table>) => void;
  moveTable: (id: string, x: number, y: number) => void;
  addTable: () => string;
  deleteTable: (id: string) => void;
  resolveRequest: (tableId: string, requestId: string) => void;
  addRequest: (tableId: string, message: string) => void;
  setTableStatus: (id: string, status: Table["status"]) => void;
}

export const useTablesStore = create<TablesState>((set, get) => ({
  tables: mockTables,
  updateTable: (id, updates) =>
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  moveTable: (id, x, y) =>
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, x, y } : t)),
    })),
  addTable: () => {
    const currentTables = get().tables;
    const maxNumber = currentTables.reduce((max, table) => {
      const n = Number.parseInt(table.id.replace("T-", ""), 10);
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 0);
    const nextNumber = maxNumber + 1;
    const nextId = `T-${nextNumber}`;
    const index = currentTables.length;
    const x = 12 + (index % 5) * 18;
    const y = 16 + Math.floor(index / 5) * 24;

    set((state) => ({
      tables: [
        ...state.tables,
        {
          id: nextId,
          label: nextId,
          seats: 4,
          shape: "square",
          x: Math.min(90, x),
          y: Math.min(88, y),
          status: "available",
          guestCount: 0,
          requests: [],
        },
      ],
    }));

    return nextId;
  },
  deleteTable: (id) =>
    set((state) => ({
      tables: state.tables.filter((t) => t.id !== id),
    })),
  resolveRequest: (tableId, requestId) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              requests: (t.requests || []).map((r) =>
                r.id === requestId ? { ...r, resolved: true } : r
              ),
            }
          : t
      ),
    })),
  addRequest: (tableId, message) =>
    set((state) => ({
      tables: state.tables.map((t) =>
        t.id === tableId
          ? {
              ...t,
              requests: [
                ...(t.requests || []),
                {
                  id: `req-${Date.now()}`,
                  message,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  resolved: false,
                },
              ],
            }
          : t
      ),
    })),
  setTableStatus: (id, status) =>
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
}));

// ── Customer Cart Store (used by /table/[tableId]) ──────────

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes: string;
}

export type CustomerOrderStatus = "idle" | "placed" | "preparing" | "ready" | "completed";

interface CustomerState {
  tableId: string | null;
  cart: CartItem[];
  orderStatus: CustomerOrderStatus;
  orderNumber: string | null;
  setTable: (id: string) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateNotes: (itemId: string, notes: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  tableId: null,
  cart: [],
  orderStatus: "idle",
  orderNumber: null,

  setTable: (id) => set({ tableId: id }),

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { cart: [...state.cart, { menuItem: item, quantity: 1, notes: "" }] };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({ cart: state.cart.filter((c) => c.menuItem.id !== itemId) })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cart:
        quantity <= 0
          ? state.cart.filter((c) => c.menuItem.id !== itemId)
          : state.cart.map((c) =>
              c.menuItem.id === itemId ? { ...c, quantity } : c
            ),
    })),

  updateNotes: (itemId, notes) =>
    set((state) => ({
      cart: state.cart.map((c) =>
        c.menuItem.id === itemId ? { ...c, notes } : c
      ),
    })),

  clearCart: () => set({ cart: [], orderStatus: "idle", orderNumber: null }),

  placeOrder: () => {
    const num = `#${1050 + Math.floor(Math.random() * 100)}`;
    set({ orderStatus: "placed", orderNumber: num });
    // Simulate status progression
    setTimeout(() => set({ orderStatus: "preparing" }), 3000);
    setTimeout(() => set({ orderStatus: "ready" }), 10000);
  },

  cartTotal: () =>
    get().cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0),

  cartCount: () => get().cart.reduce((sum, c) => sum + c.quantity, 0),
}));
