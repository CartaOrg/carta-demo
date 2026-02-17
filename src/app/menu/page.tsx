import { categories, menuItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Clock,
  MapPin,
  Star,
  ShoppingBag,
  Search,
  Wifi,
  Phone,
  Instagram,
} from "lucide-react";

// Map category IDs to food emojis for visual flair
const categoryEmoji: Record<string, string> = {
  "cat-1": "🍔",
  "cat-2": "🍕",
  "cat-3": "🥤",
  "cat-4": "🍰",
  "cat-5": "🥗",
};

export default function FullMenuPage() {
  const availableItems = menuItems.filter((i) => i.available);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* ── Hero Header ──────────────────────────────────── */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-2xl mx-auto px-4 pt-8 pb-10">
          {/* Restaurant branding */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Carta Kitchen
                </h1>
                <p className="text-emerald-200 text-sm">
                  Modern American · Casual Dining
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <Phone size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Info chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Star size={12} fill="currentColor" className="text-amber-300" />{" "}
              4.8 (320 reviews)
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock size={12} /> Open · Closes 10 PM
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MapPin size={12} /> 123 Main St, Downtown
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Wifi size={12} /> Free Wi-Fi
            </span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3">
            <Search size={16} className="text-emerald-200" />
            <input
              type="text"
              placeholder="Search our menu..."
              className="bg-transparent text-sm text-white placeholder:text-emerald-200/70 outline-none w-full"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* ── Sticky Category Nav ──────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-3 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <span>{categoryEmoji[cat.id] || "🍽️"}</span>
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Menu Sections by Category ────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-10">
        {categories.map((cat) => {
          const catItems = availableItems.filter(
            (i) => i.categoryId === cat.id
          );
          if (catItems.length === 0) return null;

          return (
            <section key={cat.id} id={cat.slug}>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">
                  {categoryEmoji[cat.id] || "🍽️"}
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {cat.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {catItems.length} item{catItems.length !== 1 ? "s" : ""}{" "}
                    available
                  </p>
                </div>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all group cursor-pointer"
                  >
                    {/* Image area */}
                    <div className="relative h-36 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                      <span className="text-5xl group-hover:scale-110 transition-transform">
                        {categoryEmoji[cat.id] || "🍽️"}
                      </span>

                      {/* Tags overlay */}
                      {item.tags.length > 0 && (
                        <div className="absolute top-2 left-2 flex gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cn(
                                "text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full",
                                tag === "bestseller"
                                  ? "bg-amber-400 text-amber-900"
                                  : tag === "popular"
                                  ? "bg-rose-100 text-rose-700"
                                  : tag === "spicy"
                                  ? "bg-red-100 text-red-700"
                                  : tag === "vegan"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-100 text-slate-600"
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900">
                          ${item.price.toFixed(2)}
                        </span>
                        <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 pl-3 pr-3.5 py-2 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all">
                          <ShoppingBag size={13} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Restaurant Info Footer ───────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="bg-white rounded-xl border border-border p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Restaurant Info
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 mb-1">Hours</p>
              <p className="text-slate-700 font-medium">Mon – Fri: 11AM – 10PM</p>
              <p className="text-slate-700 font-medium">Sat – Sun: 10AM – 11PM</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Location</p>
              <p className="text-slate-700 font-medium">123 Main Street</p>
              <p className="text-slate-700 font-medium">Downtown, CA 90210</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Contact</p>
              <p className="text-slate-700 font-medium">(555) 123-4567</p>
              <p className="text-slate-700 font-medium">hello@cartakitchen.com</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Dining Options</p>
              <p className="text-slate-700 font-medium">Dine-in · Takeout · Delivery</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-300 mt-6 mb-4">
          Powered by <span className="font-semibold text-slate-400">Carta</span>
        </p>
      </div>

      {/* ── Sticky Cart Bar ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="max-w-2xl mx-auto px-4 pb-4">
          <button className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-xl shadow-emerald-900/20">
            <ShoppingBag size={18} />
            View Cart · 0 items
          </button>
        </div>
      </div>
    </div>
  );
}
