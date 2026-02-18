import { QrCode, Download, Copy, Armchair } from "lucide-react";
import { categories, tables } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function QrPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">QR Codes</h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate and download QR codes that link to your digital menu and
          table ordering.
        </p>
      </div>

      {/* ── Table QR Codes ──────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Armchair size={18} className="text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">
            Table QR Codes
          </h2>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Print and place these QR codes on each table so customers can scan to
          order and request service.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {tables.map((t) => (
            <Card
              key={t.id}
              className="gap-0 p-4 text-center hover:shadow-md transition-shadow"
            >
              <CardContent className="p-0">
              <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-xl flex items-center justify-center mb-3">
                <QrCode size={36} className="text-emerald-500" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900">
                {t.label}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                /table/{t.id} · {t.seats} seats
              </p>
              <div className="flex gap-1.5 justify-center">
                <Button size="sm" className="h-auto flex items-center gap-1 text-[11px] font-medium text-white bg-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-700">
                  <Download size={11} /> PNG
                </Button>
                <Button variant="secondary" size="sm" className="h-auto flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200">
                  <Copy size={11} /> Link
                </Button>
              </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Menu QR Codes ──────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <QrCode size={18} className="text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">
            Menu QR Codes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Main QR */}
          <Card className="gap-0 p-6 text-center col-span-full lg:col-span-1 lg:row-span-2">
            <CardContent className="p-0">
            <div className="w-48 h-48 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-4">
              <QrCode size={80} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Full Menu</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">/menu</p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" className="h-auto flex items-center gap-1.5 text-xs font-medium text-white bg-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-700">
                <Download size={12} /> Download PNG
              </Button>
              <Button variant="secondary" size="sm" className="h-auto flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200">
                <Copy size={12} /> Copy Link
              </Button>
            </div>
            </CardContent>
          </Card>

          {/* Category QRs */}
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="gap-0 p-5 flex items-center"
            >
              <CardContent className="p-0 flex items-center gap-4 w-full">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                <QrCode size={28} className="text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400">/menu/{cat.slug}</p>
              </div>
              <Button variant="ghost" size="icon" className="p-2 rounded-lg hover:bg-slate-50">
                <Download size={16} className="text-slate-400" />
              </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
