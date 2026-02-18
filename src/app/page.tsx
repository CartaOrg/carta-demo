import Link from "next/link";
import {
  ArrowRight,
  QrCode,
  LayoutDashboard,
  CreditCard,
  Smartphone,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: QrCode,
    title: "QR Code Menus",
    description:
      "Generate scannable QR codes that link directly to your digital menu. Update in real-time.",
  },
  {
    icon: LayoutDashboard,
    title: "Live Order Dashboard",
    description:
      "Track orders as they flow from new to preparing to ready with a visual Kanban board.",
  },
  {
    icon: CreditCard,
    title: "POS Integrations",
    description:
      "Connect Square, Toast, Clover, and more. Sync orders and payments seamlessly.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Menu",
    description:
      "Beautiful, responsive digital menus optimized for every device your customers use.",
  },
];

const testimonials = [
  { name: "Sarah M.", role: "Café Owner", text: "Carta cut our order errors by 40% in the first month." },
  { name: "David L.", role: "Restaurant Manager", text: "The POS sync alone saved us 10 hours a week of manual entry." },
  { name: "Priya K.", role: "Food Truck Owner", text: "Our customers love scanning the QR code. So simple!" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              Carta
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="link" className="text-sm text-slate-500 hover:text-slate-900 p-0">
              <Link href="/menu">Demo Menu</Link>
            </Button>
            <Button asChild className="text-sm font-medium text-white bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-700">
              <Link href="/dashboard">Open Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <Badge className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Star size={14} fill="currentColor" />
          #1 Digital Menu Platform for Restaurants
        </Badge>
        <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Your menu, digitized.
          <br />
          <span className="text-emerald-600">Your orders, streamlined.</span>
        </h1>
        <p className="text-lg text-slate-500 mt-6 max-w-xl mx-auto leading-relaxed">
          Carta helps restaurants create beautiful digital menus, manage live
          orders, and connect with any POS system — all from one dashboard.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button asChild className="inline-flex items-center gap-2 text-sm font-medium text-white bg-emerald-600 px-6 py-3 rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 h-auto">
            <Link href="/dashboard">
              Get Started Free
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="secondary" className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-6 py-3 rounded-lg hover:bg-slate-200 h-auto">
            <Link href="/menu">View Demo Menu</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything you need to run a modern restaurant
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              From QR menus to POS integration, Carta gives you the tools to
              delight customers and simplify operations.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  className="gap-0 p-6"
                >
                  <CardContent className="p-0">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Loved by restaurant owners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card
                key={t.name}
                className="gap-0 p-6"
              >
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill="#059669"
                        className="text-emerald-600"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-700">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to modernize your restaurant?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-md mx-auto">
            Join thousands of restaurants already using Carta to manage their
            digital menu and orders.
          </p>
          <Button asChild className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-white px-6 py-3 rounded-lg hover:bg-emerald-50 h-auto">
            <Link href="/dashboard">
              <CheckCircle2 size={16} />
              Start Free Trial
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">C</span>
            </div>
            <span className="text-sm text-slate-400">
              © 2026 Carta. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms</span>
            <span className="hover:text-slate-600 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
