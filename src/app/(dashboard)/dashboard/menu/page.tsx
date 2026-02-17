"use client";

import { useState } from "react";
import { categories, menuItems, type MenuItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Edit3,
  GripVertical,
  Plus,
  Search,
  X,
  DollarSign,
  Tag,
  Check,
} from "lucide-react";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems
    .filter((item) => item.categoryId === activeCategory)
    .filter(
      (item) =>
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Menu Editor</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your digital menu. Click any item to edit details.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="flex gap-6">
        {/* Category Sidebar */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-lg border border-border p-3 space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Categories
            </p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                  activeCategory === cat.id
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{cat.name}</span>
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    activeCategory === cat.id
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {cat.itemCount}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3 py-2 mb-4">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
            />
          </div>

          {/* Item cards */}
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full bg-white rounded-lg border border-border p-4 flex items-center gap-4 hover:border-emerald-200 hover:shadow-sm transition-all text-left group"
              >
                <GripVertical
                  size={16}
                  className="text-slate-300 cursor-grab shrink-0"
                />

                {/* Thumbnail placeholder */}
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-2xl shrink-0">
                  🍽️
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </h3>
                    {item.tags.includes("popular") && (
                      <span className="text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>

                {/* Price + Availability */}
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-semibold text-slate-900">
                    ${item.price.toFixed(2)}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-1 rounded-full",
                      item.available
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    )}
                  >
                    {item.available ? "Available" : "Unavailable"}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-emerald-500 transition-colors"
                  />
                </div>
              </button>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-slate-400">No items found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sheet (Slide-over) */}
      {selectedItem && (
        <ItemSheet
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}

// ── Sheet Component ─────────────────────────────────────────

function ItemSheet({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price.toString());
  const [available, setAvailable] = useState(item.available);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-40 sheet-overlay"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col sheet-panel">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Edit3 size={16} className="text-emerald-600" />
            <h2 className="text-base font-semibold text-slate-900">
              Edit Item
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Image placeholder */}
          <div className="w-full h-40 rounded-lg bg-slate-100 flex items-center justify-center text-5xl">
            🍽️
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Price
            </label>
            <div className="relative">
              <DollarSign
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {item.tags.length > 0 ? (
                item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No tags</span>
              )}
            </div>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">Available</p>
              <p className="text-xs text-slate-400">
                Show this item on the public menu
              </p>
            </div>
            <button
              onClick={() => setAvailable(!available)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                available ? "bg-emerald-600" : "bg-slate-200"
              )}
              role="switch"
              aria-checked={available}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform",
                  available ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              saved
                ? "bg-emerald-100 text-emerald-700"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
          >
            {saved ? (
              <>
                <Check size={16} />
                Saved!
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
