import { QrCode, Download, Copy, Armchair } from "lucide-react";
import { categories, tables } from "@/lib/mock-data";

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
            <div
              key={t.id}
              className="bg-white rounded-lg border border-border p-4 text-center hover:shadow-md transition-shadow"
            >
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
                <button className="flex items-center gap-1 text-[11px] font-medium text-white bg-emerald-600 px-2.5 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors">
                  <Download size={11} /> PNG
                </button>
                <button className="flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                  <Copy size={11} /> Link
                </button>
              </div>
            </div>
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
          <div className="bg-white rounded-lg border border-border p-6 text-center col-span-full lg:col-span-1 lg:row-span-2">
            <div className="w-48 h-48 mx-auto bg-slate-100 rounded-xl flex items-center justify-center mb-4">
              <QrCode size={80} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Full Menu</h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">/menu</p>
            <div className="flex gap-2 justify-center">
              <button className="flex items-center gap-1.5 text-xs font-medium text-white bg-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                <Download size={12} /> Download PNG
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                <Copy size={12} /> Copy Link
              </button>
            </div>
          </div>

          {/* Category QRs */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-lg border border-border p-5 flex items-center gap-4"
            >
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                <QrCode size={28} className="text-slate-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400">/menu/{cat.slug}</p>
              </div>
              <button className="p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <Download size={16} className="text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
