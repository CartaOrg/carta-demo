"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  CreditCard,
  Settings,
  QrCode,
  MapPinned,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Table Map", href: "/dashboard/tables", icon: MapPinned },
  { label: "Menu Editor", href: "/dashboard/menu", icon: UtensilsCrossed },
  { label: "Orders", href: "/dashboard/orders", icon: ClipboardList },
  { label: "POS", href: "/dashboard/pos", icon: CreditCard },
  { label: "QR Codes", href: "/dashboard/qr", icon: QrCode },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <ShadcnSidebar
      collapsible="icon"
      className="border-r border-border bg-white"
    >
      <SidebarHeader className="h-16 border-b border-border px-4 py-0 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900 truncate group-data-[collapsible=icon]:hidden">
            Carta
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive}
                tooltip={item.label}
                className={cn(
                  "h-10 rounded-lg text-sm font-medium",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Link href={item.href}>
                  <Icon
                    size={18}
                    className={cn(isActive ? "text-emerald-600" : "text-slate-400")}
                  />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        <SidebarTrigger className="w-full justify-start rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700" />
      </SidebarFooter>

      <SidebarRail />
    </ShadcnSidebar>
  );
}
