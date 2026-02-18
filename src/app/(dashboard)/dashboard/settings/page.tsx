import { Store, Globe, Bell, Palette, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
            <Card
              key={s.label}
              className="gap-0 p-5 hover:border-emerald-200 hover:shadow-sm transition-all"
            >
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full h-auto p-0 flex items-center justify-start gap-4 hover:bg-transparent"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-slate-500" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-semibold text-slate-900">{s.label}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
                  </div>
                  <span className="text-xs text-slate-300">→</span>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
