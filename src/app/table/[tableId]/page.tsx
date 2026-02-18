"use client";

import { useState, useEffect, useMemo } from "react";
import {
  UtensilsCrossed,
  ShoppingCart,
  Bell,
  ClipboardList,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Clock,
  ChefHat,
  PartyPopper,
  Send,
  MessageSquare,
  Droplets,
  Receipt,
  HandPlatter,
  Sparkles,
  X,
  StickyNote,
  ArrowLeft,
  Globe,
  ChevronDown,
} from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  categories,
  menuItems,
  tables as mockTables,
  type MenuItem,
} from "@/lib/mock-data";
import { useCustomerStore, useTablesStore } from "@/lib/store";
import {
  type Locale,
  type Translations,
  languages,
  getTranslations,
} from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Types ──────────────────────────────────────────────────

type View = "welcome" | "menu" | "cart" | "tracker" | "requests";

// ─── Main Page ──────────────────────────────────────────────

export default function CustomerTablePage() {
  const params = useParams();
  const tableId = params.tableId as string;

  const [view, setView] = useState<View>("welcome");
  const [locale, setLocale] = useState<Locale>("en");
  const [activeCat, setActiveCat] = useState(categories[0].id);
  const [customRequest, setCustomRequest] = useState("");
  const [requestSent, setRequestSent] = useState<string | null>(null);
  const [itemAdded, setItemAdded] = useState<string | null>(null);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const t = getTranslations(locale);
  const dir = languages.find((l) => l.code === locale)?.dir ?? "ltr";

  // Stores
  const {
    cart,
    orderStatus,
    orderNumber,
    setTable: setStoreTable,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNotes,
    placeOrder,
    clearCart,
    cartTotal,
    cartCount,
  } = useCustomerStore();
  const { addRequest } = useTablesStore();

  const table = useMemo(
    () => mockTables.find((tbl) => tbl.id === tableId) ?? null,
    [tableId]
  );

  useEffect(() => {
    if (table) {
      setStoreTable(table.id);
    }
  }, [table, setStoreTable]);

  // Computed
  const total = cartTotal();
  const count = cartCount();
  const availableItems = useMemo(
    () => menuItems.filter((i) => i.available),
    []
  );
  const catItems = useMemo(
    () => availableItems.filter((i) => i.categoryId === activeCat),
    [activeCat, availableItems]
  );

  // Build quick requests from translations
  const quickRequests = useMemo(
    () => [
      { icon: Droplets, label: t.waterRefill, message: t.waterRefillMsg },
      { icon: HandPlatter, label: t.callWaiter, message: t.callWaiterMsg },
      { icon: Receipt, label: t.getBill, message: t.getBillMsg },
      { icon: UtensilsCrossed, label: t.extraCutlery, message: t.extraCutleryMsg },
      { icon: StickyNote, label: t.napkins, message: t.napkinsMsg },
      { icon: Sparkles, label: t.cleanTable, message: t.cleanTableMsg },
    ],
    [t]
  );

  // Helpers
  const handleAddItem = (item: MenuItem) => {
    addToCart(item);
    setItemAdded(item.id);
    setTimeout(() => setItemAdded(null), 1200);
  };

  const handlePlaceOrder = () => {
    placeOrder();
    setView("tracker");
  };

  const handleSendRequest = (message: string) => {
    if (!tableId) return;
    addRequest(tableId, message);
    setRequestSent(message);
    setTimeout(() => setRequestSent(null), 2500);
  };

  const handleCustomRequest = () => {
    if (!customRequest.trim()) return;
    handleSendRequest(customRequest.trim());
    setCustomRequest("");
  };

  // ─── Welcome View ──────────────────────────────────────────

  if (view === "welcome") {
    const currentLang = languages.find((l) => l.code === locale)!;
    return (
      <div
        dir={dir}
        className="min-h-dvh bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 flex flex-col items-center justify-center p-6 text-white relative"
      >
        {/* Language selector */}
        <div className="absolute top-4 right-4 left-4 flex justify-end z-20">
          <div className="relative">
            <Button
              onClick={() => setShowLangPicker(!showLangPicker)}
              variant="ghost"
              className="h-auto flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/25 text-white"
            >
              <Globe className="w-4 h-4" />
              <span>{currentLang.flag} {currentLang.nativeName}</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  showLangPicker && "rotate-180"
                )}
              />
            </Button>

            {/* Language dropdown */}
            {showLangPicker && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowLangPicker(false)}
                />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl shadow-emerald-900/20 border border-emerald-100 overflow-hidden z-20 w-56 animate-fade-in">
                  <div className="px-3 py-2 bg-emerald-50 border-b border-emerald-100">
                    <p className="text-xs font-medium text-emerald-700">
                      {t.selectLanguage}
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        onClick={() => {
                          setLocale(lang.code);
                          setShowLangPicker(false);
                        }}
                        variant="ghost"
                        className={cn(
                          "h-auto w-full flex items-center gap-3 px-3 py-2.5 text-sm",
                          locale === lang.code
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{lang.nativeName}</p>
                          <p className="text-xs text-slate-400">{lang.name}</p>
                        </div>
                        {locale === lang.code && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Logo / Restaurant name */}
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 animate-bounce-slow">
          <UtensilsCrossed className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-2">{t.welcome}</h1>
        <p className="text-emerald-100 mb-8 text-center">
          {t.welcomeSubtitle}
        </p>

        {/* Table card */}
        {table ? (
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center mb-8 w-full max-w-xs border border-white/20">
            <p className="text-emerald-100 text-sm mb-1">{t.seatedAt}</p>
            <p className="text-5xl font-bold mb-2">{table.label}</p>
            <div className="flex items-center justify-center gap-2 text-emerald-100 text-sm">
              <span>
                {table.seats} {t.seats}
              </span>
              <span>·</span>
              <span className="capitalize">
                {table.shape} {t.table}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 text-center mb-8 w-full max-w-xs border border-red-300/20">
            <p className="text-lg font-semibold">{t.tableNotFound}</p>
            <p className="text-sm text-red-100 mt-1">
              {t.tableNotFoundDesc}
            </p>
          </div>
        )}

        {table && (
          <>
            <Button
              onClick={() => setView("menu")}
              className="h-auto bg-white text-emerald-700 font-semibold text-lg px-8 py-4 rounded-2xl shadow-lg shadow-emerald-800/20 hover:bg-emerald-50 active:scale-95 w-full max-w-xs"
            >
              {t.startOrdering}
            </Button>
            <p className="text-emerald-200 text-xs mt-4 text-center">
              {t.welcomeFooter}
            </p>
          </>
        )}
      </div>
    );
  }

  // ─── No table fallback ─────────────────────────────────────

  if (!table) {
    return (
      <div
        dir={dir}
        className="min-h-dvh flex items-center justify-center bg-slate-50 p-6"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {t.tableNotFound}
          </h2>
          <p className="text-slate-500">{t.tableNotFoundDesc}</p>
        </div>
      </div>
    );
  }

  // ─── App Shell (Menu / Cart / Tracker / Requests) ──────────

  const currentLang = languages.find((l) => l.code === locale)!;

  return (
    <div
      dir={dir}
      className="min-h-dvh bg-slate-50 flex flex-col max-w-lg mx-auto relative"
    >
      {/* ── Top Header ──────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          {view !== "menu" && (
            <Button
              onClick={() => setView("menu")}
              variant="ghost"
              size="icon"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-bold text-slate-800">Carta</h1>
            <p className="text-xs text-slate-400">
              {table.label} · {table.seats} {t.seats}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language switcher (compact) */}
          <div className="relative">
            <Button
              onClick={() => setShowLangPicker(!showLangPicker)}
              variant="ghost"
              className="h-auto flex items-center gap-1 text-xs bg-slate-100 px-2 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
            >
              <span>{currentLang.flag}</span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform",
                  showLangPicker && "rotate-180"
                )}
              />
            </Button>
            {showLangPicker && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowLangPicker(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-20 w-48 animate-fade-in">
                  <div className="max-h-56 overflow-y-auto">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        onClick={() => {
                          setLocale(lang.code);
                          setShowLangPicker(false);
                        }}
                        variant="ghost"
                        className={cn(
                          "h-auto w-full flex items-center gap-2 px-3 py-2 text-xs",
                          locale === lang.code
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Cart button */}
          <Button
            onClick={() => {
              if (orderStatus !== "idle") {
                setView("tracker");
              } else if (count > 0) {
                setView("cart");
              }
            }}
            variant="ghost"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          >
            {orderStatus !== "idle" ? (
              <ClipboardList className="w-5 h-5" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
            {count > 0 && orderStatus === "idle" && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* ── View Content ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-24">
        {view === "menu" && (
          <MenuView
            t={t}
            categories={categories}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
            catItems={catItems}
            onAddItem={handleAddItem}
            itemAdded={itemAdded}
            cart={cart}
          />
        )}
        {view === "cart" && (
          <CartView
            t={t}
            cart={cart}
            total={total}
            updateQuantity={updateQuantity}
            updateNotes={updateNotes}
            removeFromCart={removeFromCart}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => setView("menu")}
          />
        )}
        {view === "tracker" && (
          <TrackerView
            t={t}
            orderNumber={orderNumber}
            orderStatus={orderStatus}
            cart={cart}
            total={total}
            onNewOrder={() => {
              clearCart();
              setView("menu");
            }}
          />
        )}
        {view === "requests" && (
          <RequestsView
            t={t}
            quickRequests={quickRequests}
            customRequest={customRequest}
            setCustomRequest={setCustomRequest}
            onSendRequest={handleSendRequest}
            onCustomRequest={handleCustomRequest}
            requestSent={requestSent}
          />
        )}
      </main>

      {/* ── Sticky Cart Bar (menu view only, when cart has items) */}
      {view === "menu" && count > 0 && orderStatus === "idle" && (
        <div className="fixed bottom-20 left-0 right-0 z-20 px-4 max-w-lg mx-auto">
          <Button
            onClick={() => setView("cart")}
            className="h-auto w-full bg-emerald-600 text-white rounded-2xl px-5 py-4 flex items-center justify-between shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-sm font-bold">
                {count}
              </span>
              <span className="font-semibold">{t.viewCart}</span>
            </div>
            <span className="font-bold">${total.toFixed(2)}</span>
          </Button>
        </div>
      )}

      {/* ── Bottom Navigation ───────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 max-w-lg mx-auto">
        <div className="flex">
          {[
            { id: "menu" as View, icon: UtensilsCrossed, label: t.menu },
            {
              id: (orderStatus !== "idle" ? "tracker" : "cart") as View,
              icon: orderStatus !== "idle" ? ClipboardList : ShoppingCart,
              label: orderStatus !== "idle" ? t.myOrder : t.cart,
              badge: orderStatus === "idle" ? count : undefined,
            },
            { id: "requests" as View, icon: Bell, label: t.requests },
          ].map((tab) => {
            const isActive = view === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => setView(tab.id)}
                variant="ghost"
                className={cn(
                  "h-auto flex-1 flex flex-col items-center py-3 gap-1",
                  isActive
                    ? "text-emerald-600"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div className="relative">
                  <tab.icon className="w-5 h-5" />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium">{tab.label}</span>
              </Button>
            );
          })}
        </div>
        {/* Safe area padding for notched phones */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MENU VIEW
// ═══════════════════════════════════════════════════════════════

function MenuView({
  t,
  categories: cats,
  activeCat,
  setActiveCat,
  catItems,
  onAddItem,
  itemAdded,
  cart,
}: {
  t: Translations;
  categories: typeof categories;
  activeCat: string;
  setActiveCat: (id: string) => void;
  catItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  itemAdded: string | null;
  cart: { menuItem: MenuItem; quantity: number }[];
}) {
  return (
    <div>
      {/* Hero banner */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 px-5 py-6 text-white">
        <h2 className="text-xl font-bold mb-1">{t.ourMenu}</h2>
        <p className="text-emerald-100 text-sm">{t.menuSubtitle}</p>
      </div>

      {/* Category pills */}
      <div className="sticky top-[57px] z-20 bg-white border-b border-slate-100">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {cats.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              variant="ghost"
              className={cn(
                "h-auto flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium",
                activeCat === cat.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-300/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 py-4 space-y-3">
        {catItems.map((item) => {
          const inCart = cart.find((c) => c.menuItem.id === item.id);
          const justAdded = itemAdded === item.id;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image placeholder */}
              <div className="w-28 h-28 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl">
                {item.categoryId === "cat-1"
                  ? "🍔"
                  : item.categoryId === "cat-2"
                  ? "🍕"
                  : item.categoryId === "cat-3"
                  ? "🥤"
                  : item.categoryId === "cat-4"
                  ? "🍰"
                  : "🥗"}
              </div>
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                      {item.name}
                    </h3>
                    {item.tags.includes("popular") && (
                      <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ml-1">
                        {t.popular}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-emerald-600">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() => onAddItem(item)}
                    className={cn(
                      "h-auto flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-medium active:scale-95",
                      justAdded
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    )}
                  >
                    {justAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.added}
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        {t.add}{inCart ? ` (${inCart.quantity})` : ""}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        {catItems.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">{t.noItems}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CART VIEW
// ═══════════════════════════════════════════════════════════════

function CartView({
  t,
  cart,
  total,
  updateQuantity,
  updateNotes,
  removeFromCart,
  onPlaceOrder,
  onBack,
}: {
  t: Translations;
  cart: { menuItem: MenuItem; quantity: number; notes: string }[];
  total: number;
  updateQuantity: (id: string, q: number) => void;
  updateNotes: (id: string, notes: string) => void;
  removeFromCart: (id: string) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
}) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart className="w-9 h-9 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-1">
          {t.cartEmpty}
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          {t.cartEmptyDesc}
        </p>
        <Button
          onClick={onBack}
          className="h-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-700"
        >
          {t.browseMenu}
        </Button>
      </div>
    );
  }

  const tax = total * 0.08;
  const grandTotal = total + tax;

  return (
    <div className="px-4 py-4">
      <h2 className="text-xl font-bold text-slate-800 mb-4">{t.yourCart}</h2>

      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div
            key={item.menuItem.id}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-800 text-sm">
                  {item.menuItem.name}
                </h4>
                <p className="text-emerald-600 font-medium text-sm mt-0.5">
                  ${item.menuItem.price.toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => removeFromCart(item.menuItem.id)}
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-red-500 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-1 py-1">
                <Button
                  onClick={() =>
                    updateQuantity(item.menuItem.id, item.quantity - 1)
                  }
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-lg bg-white border-slate-200 hover:bg-slate-100"
                >
                  <Minus className="w-3.5 h-3.5 text-slate-600" />
                </Button>
                <span className="text-sm font-bold text-slate-800 w-5 text-center">
                  {item.quantity}
                </span>
                <Button
                  onClick={() =>
                    updateQuantity(item.menuItem.id, item.quantity + 1)
                  }
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 rounded-lg bg-white border-slate-200 hover:bg-slate-100"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-600" />
                </Button>
              </div>
              <span className="font-bold text-slate-800 text-sm">
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </span>
            </div>

            {/* Special notes */}
            <Input
              type="text"
              placeholder={t.specialInstructions}
              value={item.notes}
              onChange={(e) => updateNotes(item.menuItem.id, e.target.value)}
              className="mt-3 w-full text-xs bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
            />
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-slate-800 mb-3">{t.orderSummary}</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>{t.subtotal}</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>{t.tax}</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-800">
            <span>{t.total}</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <Button
        onClick={onPlaceOrder}
        className="h-auto w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        {t.placeOrder} · ${grandTotal.toFixed(2)}
      </Button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ORDER TRACKER VIEW
// ═══════════════════════════════════════════════════════════════

function TrackerView({
  t,
  orderNumber,
  orderStatus,
  cart,
  total,
  onNewOrder,
}: {
  t: Translations;
  orderNumber: string | null;
  orderStatus: string;
  cart: { menuItem: MenuItem; quantity: number }[];
  total: number;
  onNewOrder: () => void;
}) {
  const steps = [
    { key: "placed", label: t.orderPlaced, icon: CheckCircle2, desc: t.orderPlacedDesc },
    { key: "preparing", label: t.preparing, icon: ChefHat, desc: t.preparingDesc },
    { key: "ready", label: t.readyToServe, icon: PartyPopper, desc: t.readyToServeDesc },
  ];

  const currentIdx = steps.findIndex((s) => s.key === orderStatus);

  return (
    <div className="px-4 py-6">
      {/* Order header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
          {orderStatus === "ready" ? (
            <PartyPopper className="w-8 h-8 text-emerald-600" />
          ) : (
            <ClipboardList className="w-8 h-8 text-emerald-600" />
          )}
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          {orderStatus === "ready" ? t.orderReady : t.orderInProgress}
        </h2>
        {orderNumber && (
          <p className="text-slate-400 text-sm mt-1">{t.order} {orderNumber}</p>
        )}
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm mb-6">
        <div className="space-y-0">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isPending = idx > currentIdx;
            return (
              <div key={step.key} className="flex gap-4">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                      isCompleted && "bg-emerald-600 text-white",
                      isCurrent &&
                        "bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50",
                      isPending && "bg-slate-100 text-slate-300"
                    )}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-0.5 h-10 my-1 transition-all",
                        isCompleted ? "bg-emerald-600" : "bg-slate-200"
                      )}
                    />
                  )}
                </div>
                {/* Text */}
                <div className="pt-2 pb-4">
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      isPending ? "text-slate-300" : "text-slate-800"
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-0.5",
                      isPending ? "text-slate-200" : "text-slate-400"
                    )}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated time */}
      {orderStatus !== "ready" && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-700">
              {t.estimatedWait}
            </p>
            <p className="text-xs text-amber-500">
              {orderStatus === "placed" ? t.waitPlaced : t.waitPreparing}
            </p>
          </div>
        </div>
      )}

      {/* Order details */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm mb-6">
        <h4 className="font-semibold text-slate-800 mb-3 text-sm">
          {t.orderDetails}
        </h4>
        <div className="space-y-2">
          {cart.map((item) => (
            <div
              key={item.menuItem.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate-600">
                {item.quantity}× {item.menuItem.name}
              </span>
              <span className="text-slate-800 font-medium">
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-sm">
            <span>{t.total}</span>
            <span>${(total * 1.08).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* New order button (show when ready) */}
      {orderStatus === "ready" && (
        <Button
          onClick={onNewOrder}
          className="h-auto w-full bg-emerald-600 text-white py-4 rounded-2xl font-semibold shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-[0.98]"
        >
          {t.orderMore}
        </Button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// REQUESTS VIEW
// ═══════════════════════════════════════════════════════════════

function RequestsView({
  t,
  quickRequests: qr,
  customRequest,
  setCustomRequest,
  onSendRequest,
  onCustomRequest,
  requestSent,
}: {
  t: Translations;
  quickRequests: { icon: React.ComponentType<{ className?: string }>; label: string; message: string }[];
  customRequest: string;
  setCustomRequest: (v: string) => void;
  onSendRequest: (msg: string) => void;
  onCustomRequest: () => void;
  requestSent: string | null;
}) {
  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold text-slate-800 mb-1">{t.needSomething}</h2>
      <p className="text-sm text-slate-400 mb-6">
        {t.requestSubtitle}
      </p>

      {/* Success toast */}
      {requestSent && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 mb-6 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-700">
              {t.requestSent}
            </p>
            <p className="text-xs text-emerald-500">
              {t.requestSentDesc}
            </p>
          </div>
        </div>
      )}

      {/* Quick requests grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {qr.map((req) => (
          <Button
            key={req.label}
            onClick={() => onSendRequest(req.message)}
            variant="outline"
            className="h-auto bg-white rounded-2xl border-slate-100 p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:border-emerald-200 active:scale-95 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition">
              <req.icon className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {req.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Custom request */}
      <div>
        <h3 className="font-semibold text-slate-700 text-sm mb-3">
          {t.customRequest}
        </h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={t.typePlaceholder}
            value={customRequest}
            onChange={(e) => setCustomRequest(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onCustomRequest()}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition"
          />
          <Button
            onClick={onCustomRequest}
            disabled={!customRequest.trim()}
            className="h-auto bg-emerald-600 text-white px-4 rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Info note */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-700">{t.howItWorks}</p>
          <p className="text-xs text-blue-500 mt-1">
            {t.howItWorksDesc}
          </p>
        </div>
      </div>
    </div>
  );
}
