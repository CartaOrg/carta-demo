"use client";

import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from "react";
import { useTablesStore } from "@/lib/store";
import type { Table } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Eye,
  Pencil,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  MessageSquare,
  Square,
  RectangleHorizontal,
  Circle,
  Armchair,
  Plus,
  Save,
  RotateCcw,
  Bell,
  Check,
  GripVertical,
  Trash2,
  ImagePlus,
  Copy,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Mode = "edit" | "live";
type DragState = {
  id: string;
  offsetX: number;
  offsetY: number;
  pointerId: number;
};

const FLOOR_PLAN_STORAGE_KEY = "carta-floor-plan-settings-v1";
const TABLE_GRID_STEP = 2;
const DEFAULT_FLOOR_PLAN_SETTINGS = {
  image: null as string | null,
  opacity: 70,
  scale: 100,
  fit: "cover" as "cover" | "contain",
  offsetX: 0,
  offsetY: 0,
};

const statusConfig = {
  available: { color: "bg-emerald-500", ring: "ring-emerald-200", label: "Available", textColor: "text-emerald-700", bgLight: "bg-emerald-50" },
  occupied: { color: "bg-blue-500", ring: "ring-blue-200", label: "Occupied", textColor: "text-blue-700", bgLight: "bg-blue-50" },
  reserved: { color: "bg-amber-500", ring: "ring-amber-200", label: "Reserved", textColor: "text-amber-700", bgLight: "bg-amber-50" },
  "needs-attention": { color: "bg-red-500", ring: "ring-red-200", label: "Needs Attention", textColor: "text-red-700", bgLight: "bg-red-50" },
};

function getInitialFloorPlanSettings() {
  if (typeof window === "undefined") return DEFAULT_FLOOR_PLAN_SETTINGS;

  const raw = window.localStorage.getItem(FLOOR_PLAN_STORAGE_KEY);
  if (!raw) return DEFAULT_FLOOR_PLAN_SETTINGS;

  try {
    const parsed = JSON.parse(raw) as {
      image: string | null;
      opacity: number;
      scale: number;
      fit: "cover" | "contain";
      offsetX: number;
      offsetY: number;
    };

    return {
      image: parsed.image,
      opacity: parsed.opacity ?? 70,
      scale: parsed.scale ?? 100,
      fit: parsed.fit ?? "cover",
      offsetX: parsed.offsetX ?? 0,
      offsetY: parsed.offsetY ?? 0,
    };
  } catch {
    window.localStorage.removeItem(FLOOR_PLAN_STORAGE_KEY);
    return DEFAULT_FLOOR_PLAN_SETTINGS;
  }
}

export default function TableMapPage() {
  const [mode, setMode] = useState<Mode>("live");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [suppressClickUntil, setSuppressClickUntil] = useState(0);
  const [showEditorTools, setShowEditorTools] = useState(true);
  const [showFloorAdjustments, setShowFloorAdjustments] = useState(false);
  const [initialFloorPlan] = useState(getInitialFloorPlanSettings);
  const [floorPlanImage, setFloorPlanImage] = useState<string | null>(initialFloorPlan.image);
  const [floorPlanOpacity, setFloorPlanOpacity] = useState<number>(initialFloorPlan.opacity);
  const [floorPlanScale, setFloorPlanScale] = useState<number>(initialFloorPlan.scale);
  const [floorPlanFit, setFloorPlanFit] = useState<"cover" | "contain">(initialFloorPlan.fit);
  const [floorPlanOffsetX, setFloorPlanOffsetX] = useState<number>(initialFloorPlan.offsetX);
  const [floorPlanOffsetY, setFloorPlanOffsetY] = useState<number>(initialFloorPlan.offsetY);
  const [floorPlanError, setFloorPlanError] = useState<string | null>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);
  const tables = useTablesStore((s) => s.tables);
  const moveTable = useTablesStore((s) => s.moveTable);
  const addTable = useTablesStore((s) => s.addTable);
  const deleteTable = useTablesStore((s) => s.deleteTable);
  const updateTable = useTablesStore((s) => s.updateTable);

  const draggingId = dragState?.id ?? null;
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const visibleFloorPlanImage = isHydrated ? floorPlanImage : null;
  const selectedTableData = selectedTable
    ? tables.find((table) => table.id === selectedTable)
    : null;

  const unresolvedCount = tables.reduce(
    (sum, t) => sum + (t.requests?.filter((r) => !r.resolved).length || 0),
    0
  );

  // ── Floor plan persistence (localStorage) ──

  const saveFloorPlanSettings = useCallback(() => {
    if (typeof window === "undefined") return;
    const settings = {
      image: floorPlanImage,
      opacity: floorPlanOpacity,
      scale: floorPlanScale,
      fit: floorPlanFit,
      offsetX: floorPlanOffsetX,
      offsetY: floorPlanOffsetY,
    };
    window.localStorage.setItem(FLOOR_PLAN_STORAGE_KEY, JSON.stringify(settings));
  }, [floorPlanImage, floorPlanOpacity, floorPlanScale, floorPlanFit, floorPlanOffsetX, floorPlanOffsetY]);

  useEffect(() => {
    saveFloorPlanSettings();
  }, [floorPlanImage, floorPlanOpacity, floorPlanScale, floorPlanFit, floorPlanOffsetX, floorPlanOffsetY, saveFloorPlanSettings]);

  // ── Drag handlers (pointer events on the floor plan) ──
  const clamp = useCallback((value: number, min = 5, max = 95) => Math.min(max, Math.max(min, value)), []);

  const applySnap = useCallback(
    (value: number) => {
      if (!snapToGrid) return Math.round(value * 10) / 10;
      return Math.round(value / TABLE_GRID_STEP) * TABLE_GRID_STEP;
    },
    [snapToGrid]
  );

  const stopDragging = useCallback(() => {
    setSuppressClickUntil(Date.now() + 150);
    setDragState(null);
  }, []);

  const moveSelectedTableBy = useCallback(
    (deltaX: number, deltaY: number) => {
      if (!selectedTableData) return;
      const nextX = clamp(applySnap(selectedTableData.x + deltaX));
      const nextY = clamp(applySnap(selectedTableData.y + deltaY));
      moveTable(selectedTableData.id, nextX, nextY);
    },
    [selectedTableData, moveTable, applySnap, clamp]
  );

  const duplicateSelectedTable = useCallback(() => {
    if (!selectedTableData) return;
    const newTableId = addTable();
    updateTable(newTableId, {
      label: `${selectedTableData.label} Copy`,
      seats: selectedTableData.seats,
      shape: selectedTableData.shape,
      status: "available",
      guestCount: 0,
      requests: [],
      x: clamp(selectedTableData.x + 6),
      y: clamp(selectedTableData.y + 6),
      orderId: undefined,
    });
    setSelectedTable(newTableId);
  }, [selectedTableData, addTable, updateTable, clamp]);

  const handleTableDragStart = useCallback(
    (tableId: string, event: React.PointerEvent) => {
      if (mode !== "edit" || !floorRef.current) return;
      const table = tables.find((item) => item.id === tableId);
      if (!table) return;

      const rect = floorRef.current.getBoundingClientRect();
      const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
      const pointerY = ((event.clientY - rect.top) / rect.height) * 100;

      setDragState({
        id: tableId,
        offsetX: pointerX - table.x,
        offsetY: pointerY - table.y,
        pointerId: event.pointerId,
      });
      setSelectedTable(tableId);

      if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    },
    [mode, tables]
  );

  useEffect(() => {
    if (!dragState || mode !== "edit") return;

    const handleWindowPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== dragState.pointerId || !floorRef.current) return;
      const rect = floorRef.current.getBoundingClientRect();
      const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
      const pointerY = ((event.clientY - rect.top) / rect.height) * 100;
      const nextX = clamp(applySnap(pointerX - dragState.offsetX));
      const nextY = clamp(applySnap(pointerY - dragState.offsetY));
      moveTable(dragState.id, nextX, nextY);
    };

    const handleWindowPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== dragState.pointerId) return;
      stopDragging();
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    window.addEventListener("pointercancel", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
    };
  }, [dragState, mode, clamp, applySnap, moveTable, stopDragging]);

  const handleFloorWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (mode !== "edit" || !visibleFloorPlanImage) return;
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();

      setFloorPlanScale((current) => {
        const delta = event.deltaY < 0 ? 4 : -4;
        return clamp(current + delta, 50, 220);
      });
    },
    [mode, visibleFloorPlanImage, clamp]
  );

  useEffect(() => {
    if (mode !== "edit") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedTableData) return;

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        deleteTable(selectedTableData.id);
        setSelectedTable(null);
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        duplicateSelectedTable();
        return;
      }

      const step = event.shiftKey ? 5 : 1;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveSelectedTableBy(0, -step);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveSelectedTableBy(0, step);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSelectedTableBy(-step, 0);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSelectedTableBy(step, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, selectedTableData, moveSelectedTableBy, deleteTable, duplicateSelectedTable]);

  const handleFloorPlanFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFloorPlanError(null);

    // Validation: file type
    const validMimes = ["image/png", "image/jpeg", "image/webp"];
    if (!validMimes.includes(file.type)) {
      setFloorPlanError("Only PNG, JPEG, and WebP images are supported.");
      return;
    }

    // Validation: file size (max 6MB)
    const maxSizeMB = 6;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFloorPlanError(`Image must be smaller than ${maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setFloorPlanImage(result);
        setFloorPlanOpacity(70);
        setFloorPlanScale(100);
        setFloorPlanFit("cover");
        setFloorPlanOffsetX(0);
        setFloorPlanOffsetY(0);
        setFloorPlanError(null);
      }
    };
    reader.onerror = () => {
      setFloorPlanError("Failed to read image file.");
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  return (
    <div className="space-y-3 h-full flex flex-col">
      <input
        ref={floorPlanInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/*"
        className="hidden"
        onChange={handleFloorPlanFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Table Map</h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "edit"
              ? "Focus mode for layout editing — tools moved into the canvas."
              : "Live view — see real-time orders and customer requests."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Unresolved badge */}
          {unresolvedCount > 0 && mode === "live" && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg text-red-700 text-xs font-medium">
              <Bell size={14} className="animate-pulse" />
              {unresolvedCount} request{unresolvedCount !== 1 && "s"}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setMode("edit")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === "edit"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => {
                setMode("live");
                setDragState(null);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                mode === "live"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Eye size={14} />
              Live
              {unresolvedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Floor plan error alert */}
      {floorPlanError && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertTriangle size={16} />
          {floorPlanError}
          <button
            onClick={() => setFloorPlanError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Legend + Stats bar */}
      {mode === "live" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {Object.entries(statusConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={cn("w-2.5 h-2.5 rounded-full", cfg.color)} />
                <span className="text-xs text-slate-500">{cfg.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>{tables.filter((t) => t.status === "available").length} open</span>
            <span>{tables.filter((t) => t.status === "occupied").length} occupied</span>
            <span>{tables.reduce((s, t) => s + (t.guestCount || 0), 0)} guests</span>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className={cn("flex-1 min-h-0", mode === "live" ? "flex gap-5" : "relative")}>
        {/* Floor Plan */}
        <div
          ref={floorRef}
          className={cn(
            "bg-white rounded-xl border border-border relative overflow-hidden",
            mode === "live" ? "flex-1" : "h-full min-h-[72vh]",
            mode === "edit" && "cursor-crosshair",
            draggingId && "cursor-grabbing"
          )}
          onWheel={handleFloorWheel}
          onPointerDown={(event) => {
            if (event.target === event.currentTarget && mode === "edit") {
              setSelectedTable(null);
            }
          }}
        >
          {/* Floor plan image (always below table nodes) */}
          {visibleFloorPlanImage && (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src={visibleFloorPlanImage}
                alt="Store floor plan"
                className={cn(
                  "w-full h-full transition-all duration-200",
                  floorPlanFit === "cover" ? "object-cover" : "object-contain"
                )}
                style={{
                  opacity: floorPlanOpacity / 100,
                  transform: `translate(${floorPlanOffsetX}px, ${floorPlanOffsetY}px) scale(${floorPlanScale / 100})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
          )}

          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: snapToGrid
                ? "radial-gradient(circle, #000 1px, transparent 1px)"
                : "none",
              backgroundSize: "24px 24px",
            }}
          />

          {mode === "edit" && (
            <div className="absolute top-3 left-3 z-40 w-[340px] max-w-[calc(100%-1.5rem)]">
              <div className="bg-white/95 backdrop-blur border border-border rounded-xl shadow-sm p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    <SlidersHorizontal size={12} /> Layout Tools
                  </div>
                  <button
                    onClick={() => setShowEditorTools((value) => !value)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500"
                    title={showEditorTools ? "Collapse tools" : "Expand tools"}
                  >
                    {showEditorTools ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {showEditorTools && (
                  <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          const newTableId = addTable();
                          setSelectedTable(newTableId);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
                      >
                        <Plus size={12} /> Add Table
                      </button>

                      <button
                        onClick={() => floorPlanInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-border text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                      >
                        <ImagePlus size={12} />
                        {visibleFloorPlanImage ? "Change Plan" : "Add Plan"}
                      </button>

                      {visibleFloorPlanImage && (
                        <button
                          onClick={() => {
                            setFloorPlanImage(null);
                            setFloorPlanOpacity(70);
                            setFloorPlanScale(100);
                            setFloorPlanFit("cover");
                            setFloorPlanOffsetX(0);
                            setFloorPlanOffsetY(0);
                            setFloorPlanError(null);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 border border-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={12} /> Remove Plan
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => moveSelectedTableBy(0, -1)}
                        disabled={!selectedTableData}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Nudge up"
                      >
                        <ArrowUp size={14} className="mx-auto" />
                      </button>
                      <button
                        onClick={() => moveSelectedTableBy(0, 1)}
                        disabled={!selectedTableData}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Nudge down"
                      >
                        <ArrowDown size={14} className="mx-auto" />
                      </button>
                      <button
                        onClick={() => moveSelectedTableBy(-1, 0)}
                        disabled={!selectedTableData}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Nudge left"
                      >
                        <ArrowLeft size={14} className="mx-auto" />
                      </button>
                      <button
                        onClick={() => moveSelectedTableBy(1, 0)}
                        disabled={!selectedTableData}
                        className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Nudge right"
                      >
                        <ArrowRight size={14} className="mx-auto" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setSnapToGrid((value) => !value)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors",
                          snapToGrid
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        Snap {snapToGrid ? "On" : "Off"}
                      </button>

                      <button
                        onClick={duplicateSelectedTable}
                        disabled={!selectedTableData}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Copy size={12} /> Duplicate
                      </button>

                      <button
                        onClick={() => {
                          if (!selectedTableData) return;
                          deleteTable(selectedTableData.id);
                          setSelectedTable(null);
                        }}
                        disabled={!selectedTableData}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border border-red-100 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>

                    {visibleFloorPlanImage && (
                      <div className="pt-1 border-t border-slate-200">
                        <button
                          onClick={() => setShowFloorAdjustments((value) => !value)}
                          className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                          <span>Floor Plan Adjustments</span>
                          {showFloorAdjustments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {showFloorAdjustments && (
                          <div className="mt-2 grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <label>Opacity</label>
                                <span>{floorPlanOpacity}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={floorPlanOpacity}
                                onChange={(e) => setFloorPlanOpacity(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <label>Zoom</label>
                                <span>{floorPlanScale}%</span>
                              </div>
                              <input
                                type="range"
                                min="50"
                                max="220"
                                value={floorPlanScale}
                                onChange={(e) => setFloorPlanScale(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <label>Offset X</label>
                                <span>{floorPlanOffsetX}px</span>
                              </div>
                              <input
                                type="range"
                                min="-100"
                                max="100"
                                value={floorPlanOffsetX}
                                onChange={(e) => setFloorPlanOffsetX(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <label>Offset Y</label>
                                <span>{floorPlanOffsetY}px</span>
                              </div>
                              <input
                                type="range"
                                min="-100"
                                max="100"
                                value={floorPlanOffsetY}
                                onChange={(e) => setFloorPlanOffsetY(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                              />
                            </div>

                            <div className="col-span-2 flex items-center justify-between gap-2">
                              <select
                                value={floorPlanFit}
                                onChange={(e) => setFloorPlanFit(e.target.value as "cover" | "contain")}
                                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              >
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                              </select>
                              <button
                                onClick={() => {
                                  setFloorPlanOpacity(70);
                                  setFloorPlanScale(100);
                                  setFloorPlanFit("cover");
                                  setFloorPlanOffsetX(0);
                                  setFloorPlanOffsetY(0);
                                }}
                                className="shrink-0 flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
                              >
                                <RotateCcw size={12} /> Reset
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Floor labels */}
          <div className="absolute top-3 left-4 text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
            Window Side
          </div>
          <div className="absolute bottom-3 left-4 text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
            Back Wall
          </div>
          <div className="absolute top-3 right-4 text-[10px] font-semibold text-slate-300 uppercase tracking-widest">
            Entrance →
          </div>
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[10px] font-semibold text-slate-300 uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            Kitchen
          </div>

          {/* Tables */}
          {tables.map((table) => (
            <TableNode
              key={table.id}
              table={table}
              mode={mode}
              isSelected={selectedTable === table.id}
              isDragging={draggingId === table.id}
              suppressClickUntil={suppressClickUntil}
              onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}
              onDragStart={(event) => handleTableDragStart(table.id, event)}
            />
          ))}
        </div>

        {/* Side Panel */}
        {selectedTable && mode === "edit" && (
          <div className="absolute right-3 top-3 bottom-3 z-40 w-80 max-w-[calc(100%-1.5rem)]">
            <TableDetailPanel
              key={selectedTable}
              className="w-full h-full"
              tableId={selectedTable}
              mode={mode}
              onClose={() => setSelectedTable(null)}
              onDelete={() => {
                if (!selectedTable) return;
                deleteTable(selectedTable);
                setSelectedTable(null);
                setDragState(null);
              }}
            />
          </div>
        )}

        {selectedTable && mode === "live" && (
          <TableDetailPanel
            key={selectedTable}
            tableId={selectedTable}
            mode={mode}
            onClose={() => setSelectedTable(null)}
            onDelete={() => {
              if (!selectedTable) return;
              deleteTable(selectedTable);
              setSelectedTable(null);
              setDragState(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ── Table Node (on the floor plan) ──────────────────────────

function TableNode({
  table,
  mode,
  isSelected,
  isDragging,
  suppressClickUntil,
  onClick,
  onDragStart,
}: {
  table: Table;
  mode: Mode;
  isSelected: boolean;
  isDragging: boolean;
  suppressClickUntil: number;
  onClick: () => void;
  onDragStart: (event: React.PointerEvent) => void;
}) {
  const cfg = statusConfig[table.status];
  const unresolvedRequests = (table.requests || []).filter((r) => !r.resolved);
  const hasRequests = unresolvedRequests.length > 0;

  // Shape sizing
  const shapeClass = cn(
    "flex flex-col items-center justify-center transition-all border-2 relative select-none",
    table.shape === "round" && "rounded-full w-20 h-20",
    table.shape === "square" && "rounded-xl w-16 h-16",
    table.shape === "rectangle" && "rounded-xl w-28 h-16",
    isSelected
      ? "border-emerald-500 shadow-lg shadow-emerald-100 scale-105"
      : "border-slate-200 hover:border-slate-300 hover:shadow-md",
    mode === "edit" && !isDragging && "cursor-grab",
    isDragging && "cursor-grabbing scale-110 shadow-xl z-30 border-emerald-400",
    mode === "live" && "cursor-pointer",
    mode === "live" && table.status === "needs-attention" && "animate-pulse"
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode === "edit") {
      e.preventDefault();
      e.stopPropagation();
      onDragStart(e);
    }
  };

  const handleClick = () => {
    if (mode === "edit" && Date.now() < suppressClickUntil) return;
    onClick();
  };

  return (
    <div
      className={cn("absolute group", isDragging && "z-30")}
      style={{
        left: `${table.x}%`,
        top: `${table.y}%`,
        transform: "translate(-50%, -50%)",
        transition: isDragging ? "none" : "left 0.2s ease, top 0.2s ease",
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      {/* Drag handle indicator in edit mode */}
      {mode === "edit" && !isDragging && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
            <GripVertical size={10} />
            drag
          </div>
        </div>
      )}

      {/* Notification badge */}
      {mode === "live" && hasRequests && (
        <div className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce">
          {unresolvedRequests.length}
        </div>
      )}

      {/* Status ring */}
      <div className={cn("absolute inset-0 rounded-inherit", table.shape === "round" ? "rounded-full" : "rounded-xl")}>
        <div className={cn("absolute -inset-1 rounded-inherit opacity-30", table.shape === "round" ? "rounded-full" : "rounded-xl", cfg.color)} />
      </div>

      {/* Table body */}
      <div className={cn(shapeClass, "bg-white")}>
        {/* Status dot */}
        <div className={cn("absolute top-1.5 right-1.5 w-2 h-2 rounded-full", cfg.color)} />

        <span className="text-xs font-bold text-slate-700">{table.label}</span>
        <div className="flex items-center gap-0.5 mt-0.5">
          <Users size={10} className="text-slate-400" />
          <span className="text-[10px] text-slate-400">
            {table.guestCount || 0}/{table.seats}
          </span>
        </div>
      </div>

      {/* Hover tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap", cfg.bgLight, cfg.textColor)}>
          {cfg.label}
        </span>
      </div>
    </div>
  );
}

// ── Side Detail Panel ───────────────────────────────────────

function TableDetailPanel({
  className,
  tableId,
  mode,
  onClose,
  onDelete,
}: {
  className?: string;
  tableId: string;
  mode: Mode;
  onClose: () => void;
  onDelete: () => void;
}) {
  const tables = useTablesStore((s) => s.tables);
  const updateTable = useTablesStore((s) => s.updateTable);
  const resolveRequest = useTablesStore((s) => s.resolveRequest);
  const setTableStatus = useTablesStore((s) => s.setTableStatus);
  const table = tables.find((t) => t.id === tableId);

  const [editLabel, setEditLabel] = useState(table?.label || "");
  const [editSeats, setEditSeats] = useState(table?.seats.toString() || "4");
  const [editShape, setEditShape] = useState<Table["shape"]>(table?.shape || "square");

  if (!table) return null;

  const cfg = statusConfig[table.status];
  const unresolvedRequests = (table.requests || []).filter((r) => !r.resolved);
  const resolvedRequests = (table.requests || []).filter((r) => r.resolved);

  return (
    <div className={cn("w-80 bg-white rounded-xl border border-border flex flex-col overflow-hidden shrink-0", className)}>
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-slate-50">
        <div className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", cfg.color)} />
          <h3 className="text-sm font-semibold text-slate-900">
            {table.label}
          </h3>
          <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", cfg.bgLight, cfg.textColor)}>
            {cfg.label}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 transition-colors">
          <X size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mode === "edit" ? (
          /* ─── Edit Mode ─── */
          <>
            {/* Label */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Table Label</label>
              <input
                type="text"
                value={editLabel}
                onChange={(e) => setEditLabel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Seats */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Seats</label>
              <input
                type="number"
                min={1}
                max={20}
                value={editSeats}
                onChange={(e) => setEditSeats(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Shape */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Shape</label>
              <div className="flex gap-2">
                {([
                  { value: "square" as const, icon: Square, label: "Square" },
                  { value: "round" as const, icon: Circle, label: "Round" },
                  { value: "rectangle" as const, icon: RectangleHorizontal, label: "Rectangle" },
                ]).map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.value}
                      onClick={() => setEditShape(s.value)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors",
                        editShape === s.value
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-border text-slate-500 hover:bg-slate-50"
                      )}
                    >
                      <Icon size={14} />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(statusConfig) as [Table["status"], typeof statusConfig.available][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setTableStatus(table.id, key)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors",
                      table.status === key
                        ? `${val.bgLight} ${val.textColor} border-current`
                        : "border-border text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn("w-2 h-2 rounded-full", val.color)} />
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position hint */}
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-400">
              <p>Position: ({table.x}%, {table.y}%)</p>
              <p className="mt-1">💡 Drag the table on the floor plan to reposition it.</p>
            </div>

            {/* Save button */}
            <button
              onClick={() => {
                updateTable(table.id, {
                  label: editLabel,
                  seats: parseInt(editSeats) || 4,
                  shape: editShape,
                });
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Save size={14} />
              Save Changes
            </button>

            <button
              onClick={onDelete}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} />
              Delete Table
            </button>
          </>
        ) : (
          /* ─── Live Mode ─── */
          <>
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-slate-900">{table.guestCount || 0}</p>
                <p className="text-[10px] text-slate-400">Guests</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-slate-900">{table.seats}</p>
                <p className="text-[10px] text-slate-400">Seats</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 text-center">
                <p className="text-lg font-bold text-slate-900">{unresolvedRequests.length}</p>
                <p className="text-[10px] text-slate-400">Requests</p>
              </div>
            </div>

            {/* Order info (if occupied) */}
            {table.orderId && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 mb-1">
                  <Armchair size={12} />
                  Active Order
                </div>
                <p className="text-sm font-semibold text-blue-900">
                  Order {table.orderId.replace("ord-", "#104")}
                </p>
                <p className="text-xs text-blue-600 mt-0.5">
                  {table.guestCount} guest{(table.guestCount || 0) !== 1 && "s"} · Dine-in
                </p>
              </div>
            )}

            {/* Unresolved Requests */}
            {unresolvedRequests.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700 mb-2">
                  <AlertTriangle size={12} />
                  Active Requests ({unresolvedRequests.length})
                </div>
                <div className="space-y-2">
                  {unresolvedRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-2"
                    >
                      <MessageSquare size={14} className="text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-red-800 font-medium leading-relaxed">
                          {req.message}
                        </p>
                        <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                          <Clock size={10} /> {req.time}
                        </p>
                      </div>
                      <button
                        onClick={() => resolveRequest(table.id, req.id)}
                        className="shrink-0 p-1.5 rounded-lg bg-red-100 hover:bg-red-200 transition-colors"
                        title="Mark resolved"
                      >
                        <Check size={12} className="text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resolved Requests */}
            {resolvedRequests.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
                  <CheckCircle2 size={12} />
                  Resolved ({resolvedRequests.length})
                </div>
                <div className="space-y-1.5">
                  {resolvedRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-slate-50 rounded-lg p-2.5 flex items-center gap-2 opacity-60"
                    >
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      <p className="text-xs text-slate-500 line-through flex-1">{req.message}</p>
                      <span className="text-[10px] text-slate-300">{req.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No requests */}
            {(table.requests || []).length === 0 && table.status !== "occupied" && (
              <div className="text-center py-6 text-xs text-slate-400">
                <Armchair size={24} className="mx-auto text-slate-200 mb-2" />
                Table is {table.status}. No active requests.
              </div>
            )}

            {/* Quick actions */}
            <div className="pt-2 space-y-2">
              {table.status === "occupied" && (
                <button
                  onClick={() => setTableStatus(table.id, "available")}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <RotateCcw size={12} />
                  Clear Table
                </button>
              )}
              {table.status === "available" && (
                <button
                  onClick={() => setTableStatus(table.id, "reserved")}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <Clock size={12} />
                  Mark Reserved
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
