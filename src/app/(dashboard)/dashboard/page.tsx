import { dashboardStats, orders } from "@/lib/mock-data";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

const revenueFallbackData = [
  { hour: "9AM", revenue: 180 },
  { hour: "10AM", revenue: 360 },
  { hour: "11AM", revenue: 620 },
  { hour: "12PM", revenue: 980 },
  { hour: "1PM", revenue: 840 },
  { hour: "2PM", revenue: 540 },
  { hour: "3PM", revenue: 380 },
  { hour: "4PM", revenue: 260 },
];

const revenueByHour =
  dashboardStats.revenueByHour && dashboardStats.revenueByHour.length > 0
    ? dashboardStats.revenueByHour
    : revenueFallbackData;

const revenueToday =
  dashboardStats.todayRevenue > 0
    ? dashboardStats.todayRevenue
    : revenueByHour.reduce((sum, point) => sum + point.revenue, 0);

const maxRevenuePoint = Math.max(
  1,
  ...revenueByHour.map((point) => point.revenue)
);

const stats = [
  {
    label: "Today's Revenue",
    value: `$${revenueToday.toLocaleString()}`,
    icon: DollarSign,
    change: "+12.5%",
    changeType: "positive" as const,
    color: "emerald",
  },
  {
    label: "Total Orders",
    value: dashboardStats.todayOrders.toString(),
    icon: ShoppingBag,
    change: "+8.2%",
    changeType: "positive" as const,
    color: "blue",
  },
  {
    label: "Avg. Order Value",
    value: `$${dashboardStats.avgOrderValue.toFixed(2)}`,
    icon: TrendingUp,
    change: "+3.1%",
    changeType: "positive" as const,
    color: "violet",
  },
  {
    label: "Active Menu Items",
    value: dashboardStats.activeMenuItems.toString(),
    icon: UtensilsCrossed,
    change: "19 items",
    changeType: "neutral" as const,
    color: "amber",
  },
];

const colorMap: Record<string, { bg: string; icon: string }> = {
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
  blue: { bg: "bg-blue-50", icon: "text-blue-600" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600" },
};

export default function DashboardPage() {
  const activeOrders = orders.filter((o) => o.status !== "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening at your restaurant today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = colorMap[stat.color];
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg border border-border p-5 flex items-start justify-between"
            >
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    stat.changeType === "positive"
                      ? "text-emerald-600"
                      : "text-slate-400"
                  }`}
                >
                  {stat.change}
                  {stat.changeType === "positive" && " vs yesterday"}
                </p>
              </div>
              <div
                className={`${colors.bg} p-2.5 rounded-lg`}
              >
                <Icon size={20} className={colors.icon} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart Placeholder + Active Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-border p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Revenue Today
          </h2>
          <div className="rounded-xl border border-slate-100 bg-gradient-to-b from-slate-50/70 to-white p-3">
            <div className="flex items-end gap-3 h-44 border-b border-slate-200 pb-2">
              {revenueByHour.map((d) => {
                const heightPct = (d.revenue / maxRevenuePoint) * 100;
                return (
                  <div key={d.hour} className="flex-1 h-full flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-medium">${d.revenue}</span>
                    <div className="h-full w-full flex items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_8px_16px_rgba(16,185,129,0.28)] transition-all min-h-[10px]"
                        style={{ height: `${Math.max(heightPct, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 pt-2">
              {revenueByHour.map((d) => (
                <div key={`${d.hour}-label`} className="flex-1 text-center">
                  <span className="text-xs text-slate-400">{d.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-lg border border-border p-5">
          <h2 className="text-base font-semibold text-slate-900 mb-4">
            Active Orders
          </h2>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-slate-400">
                    {order.customerName} · {order.type}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === "new"
                      ? "bg-blue-50 text-blue-700"
                      : order.status === "preparing"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-lg border border-border p-5">
        <h2 className="text-base font-semibold text-slate-900 mb-4">
          Popular Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardStats.popularItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-lg">
                🍽️
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-sm text-emerald-600 font-medium">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
