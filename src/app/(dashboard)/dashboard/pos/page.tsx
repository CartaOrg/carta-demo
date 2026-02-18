"use client";

import { usePosStore, finishSync } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CheckCircle2, Loader2, Plug, RefreshCw } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function PosPage() {
  const integrations = usePosStore((s) => s.integrations);
  const toggleIntegration = usePosStore((s) => s.toggleIntegration);
  const syncTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // When an integration goes to "syncing", resolve it after 2s
  useEffect(() => {
    integrations.forEach((pos) => {
      if (pos.status === "syncing" && !syncTimers.current.has(pos.id)) {
        const timer = setTimeout(() => {
          finishSync(pos.id);
          syncTimers.current.delete(pos.id);
        }, 2000);
        syncTimers.current.set(pos.id, timer);
      }
    });
    return () => {
      // cleanup only on unmount
    };
  }, [integrations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            POS Integrations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Connect your favorite point-of-sale systems to sync orders and
            payments in real time.
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border-border hover:bg-slate-50">
          <RefreshCw size={16} />
          Refresh All
        </Button>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((pos) => (
          <Card
            key={pos.id}
            className={cn(
              "gap-0 p-5 transition-all",
              pos.status === "connected"
                ? "border-emerald-200 shadow-sm shadow-emerald-50"
                : "border-border"
            )}
          >
            <CardContent className="p-0">
            {/* Top: Logo + Toggle */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{pos.logo}</span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {pos.name}
                  </h3>
                  {/* Status badge */}
                  {pos.status === "connected" && (
                    <Badge className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                      <CheckCircle2 size={12} />
                      Connected
                    </Badge>
                  )}
                  {pos.status === "syncing" && (
                    <Badge className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
                      <Loader2 size={12} className="animate-spin" />
                      Syncing...
                    </Badge>
                  )}
                  {pos.status === "disconnected" && (
                    <Badge className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full mt-1">
                      <Plug size={12} />
                      Disconnected
                    </Badge>
                  )}
                </div>
              </div>

              {/* Toggle Switch */}
              <Switch
                checked={pos.enabled}
                onCheckedChange={() => toggleIntegration(pos.id)}
              />
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed">
              {pos.description}
            </p>

            {/* Last sync timestamp */}
            {pos.lastSync && (
              <p className="text-xs text-slate-400 mt-3">
                Last synced:{" "}
                {new Date(pos.lastSync).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}

            {/* Action button when connected */}
            {pos.status === "connected" && (
              <Button variant="secondary" className="mt-4 w-full text-sm font-medium text-emerald-700 bg-emerald-50 rounded-lg py-2 hover:bg-emerald-100">
                Configure Settings
              </Button>
            )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <Plug size={16} className="text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Need a different POS?
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            We&apos;re always adding new integrations. Contact our team to request
            support for your preferred POS system.
          </p>
        </div>
      </div>
    </div>
  );
}
