import { categories, menuItems } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Clock, MapPin, Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Generate static params for all category slugs
export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export default async function PublicMenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  const allAvailable = menuItems.filter((i) => i.available);

  // If slug matches a category, show that category's items. Otherwise show all.
  const items = category
    ? allAvailable.filter((i) => i.categoryId === category.id)
    : allAvailable;

  const displayTitle = category ? category.name : "Full Menu";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Restaurant Header */}
      <div className="bg-emerald-600 text-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="text-2xl font-bold">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Carta Kitchen</h1>
              <div className="flex items-center gap-3 text-emerald-100 text-sm mt-0.5">
                <span className="flex items-center gap-1">
                  <Star size={12} fill="currentColor" /> 4.8
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> 20-30 min
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> 0.8 mi
                </span>
              </div>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <Button
              asChild
              variant="ghost"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                "bg-white/20 text-white hover:bg-white/30"
              )}
            >
              <Link href="/menu">All</Link>
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                asChild
                variant="ghost"
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  category?.id === cat.id
                    ? "bg-white text-emerald-700"
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                <a href={`/menu/${cat.slug}`}>{cat.name}</a>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {displayTitle}
        </h2>

        <div className="space-y-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="gap-0 p-4"
            >
              <CardContent className="p-0 flex gap-4">
              {/* Image placeholder */}
              <div className="w-20 h-20 rounded-lg bg-slate-100 flex items-center justify-center text-3xl shrink-0">
                🍽️
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-slate-900">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button size="sm" className="h-auto flex items-center gap-1 text-xs font-medium text-white bg-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-700">
                    <ShoppingBag size={12} />
                    Add
                  </Button>
                </div>

                {item.tags.length > 0 && (
                  <div className="flex gap-1.5 mt-2">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="text-[10px] font-medium bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-16 text-sm text-slate-400">
            No items available in this category.
          </div>
        )}
      </div>

      {/* Sticky cart bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 max-w-lg mx-auto">
        <Button className="w-full h-auto bg-emerald-600 text-white py-3 rounded-xl font-medium text-sm hover:bg-emerald-700 flex items-center justify-center gap-2">
          <ShoppingBag size={16} />
          View Cart (0 items)
        </Button>
      </div>
    </div>
  );
}
