"use client";

import { Bell, Search, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <SidebarTrigger className="rounded-lg" />
        <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 w-full">
        <Search size={16} className="text-slate-400" />
        <Input
          type="text"
          placeholder="Search menu items, orders..."
          className="h-auto border-0 shadow-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-0"
        />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative rounded-lg hover:bg-slate-50">
          <Bell size={20} className="text-slate-500" />
          <Badge className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 p-0" />
        </Button>

        {/* User avatar */}
        <Button variant="ghost" className="h-auto flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50">
          <Avatar className="size-8 bg-emerald-100">
            <AvatarFallback className="bg-emerald-100">
            <User size={16} className="text-emerald-700" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-800">John Doe</p>
            <p className="text-xs text-slate-400">Restaurant Owner</p>
          </div>
        </Button>
      </div>
    </header>
  );
}
