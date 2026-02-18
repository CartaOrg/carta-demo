"use client";

import { useOrdersStore } from "@/lib/store";
import type { Order } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Clock,
  Flame,
  CheckCircle2,
  Package,
  User,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const columns: { key: Order["status"]; label: string; color: string; icon: React.ElementType }[] = [
  { key: "new", label: "New Orders", color: "blue", icon: Clock },
  { key: "preparing", label: "Preparing", color: "amber", icon: Flame },
  { key: "ready", label: "Ready", color: "emerald", icon: Package },
  { key: "completed", label: "Completed", color: "slate", icon: CheckCircle2 },
];

const colorMap: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  blue: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  slate: { bg: "bg-slate-50", border: "border-slate-200", badge: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

const nextStatus: Record<string, Order["status"] | null> = {
  new: "preparing",
  preparing: "ready",
  ready: "completed",
  completed: null,
};

export default function OrdersPage() {
  const orders = useOrdersStore((s) => s.orders);
  const moveOrder = useOrdersStore((s) => s.moveOrder);

  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Live Orders</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track and manage orders as they flow through your kitchen.
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col.key);
          const colors = colorMap[col.color];

          return (
            <div key={col.key} className="flex flex-col">
              {/* Column header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-2 h-2 rounded-full", colors.dot)} />
                <h2 className="text-sm font-semibold text-slate-700">
                  {col.label}
                </h2>
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", colors.badge)}>
                  {colOrders.length}
                </span>
              </div>

              {/* Column body */}
              <div className={cn("flex-1 rounded-lg p-3 space-y-3 min-h-[300px]", colors.bg)}>
                {colOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="gap-0 p-4 shadow-sm"
                  >
                    <CardContent className="p-0">
                    {/* Order header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-slate-900">
                        {order.orderNumber}
                      </span>
                      <Badge
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          order.type === "dine-in"
                            ? "bg-violet-50 text-violet-700"
                            : order.type === "takeout"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-cyan-50 text-cyan-700"
                        )}
                      >
                        {order.type}
                      </Badge>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <User size={12} />
                      <span>{order.customerName}</span>
                      {order.table && (
                        <>
                          <span className="text-slate-300">·</span>
                          <MapPin size={12} />
                          <span>{order.table}</span>
                        </>
                      )}
                    </div>

                    {/* Items */}
                    <div className="space-y-1 mb-3">
                      {order.items.map((oi, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-slate-600">
                            {oi.quantity}× {oi.name}
                          </span>
                          <span className="text-slate-400">
                            ${(oi.quantity * oi.price).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total + Action */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <span className="text-sm font-semibold text-slate-900">
                        ${order.total.toFixed(2)}
                      </span>
                      {nextStatus[order.status] && (
                        <Button
                          onClick={() =>
                            moveOrder(order.id, nextStatus[order.status]!)
                          }
                          variant="secondary"
                          size="sm"
                          className="h-auto flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100"
                        >
                          Move
                          <ArrowRight size={12} />
                        </Button>
                      )}
                    </div>
                    </CardContent>
                  </Card>
                ))}

                {colOrders.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-xs text-slate-400">
                    No orders
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
