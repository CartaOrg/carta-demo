"use client";

import { Bell, Search, User } from "lucide-react";

export default function TopNav() {
  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 w-full max-w-md">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search menu items, orders..."
          className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notification bell */}
        <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <Bell size={20} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User avatar */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <User size={16} className="text-emerald-700" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-800">John Doe</p>
            <p className="text-xs text-slate-400">Restaurant Owner</p>
          </div>
        </button>
      </div>
    </header>
  );
}
