import { Store, Globe, Bell, Palette, Shield } from "lucide-react";

const sections = [
  { icon: Store, label: "Restaurant Profile", description: "Name, address, hours of operation, and contact details." },
  { icon: Globe, label: "Custom Domain", description: "Connect your own domain for your public menu page." },
  { icon: Bell, label: "Notifications", description: "Configure email and push notifications for new orders." },
  { icon: Palette, label: "Branding", description: "Customize colors, logo, and fonts for your digital menu." },
  { icon: Shield, label: "Security", description: "Two-factor authentication and session management." },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your restaurant profile and app preferences.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-lg border border-border p-5 flex items-center gap-4 hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">{s.label}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
              </div>
              <span className="text-xs text-slate-300">→</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
