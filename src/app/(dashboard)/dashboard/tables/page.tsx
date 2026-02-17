"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTablesStore } from "@/lib/store";
import type { Table } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Eye,
  Pencil,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  MessageSquare,
  CircleDot,
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
} from "lucide-react";

type Mode = "edit" | "live";

const statusConfig = {
  available: { color: "bg-emerald-500", ring: "ring-emerald-200", label: "Available", textColor: "text-emerald-700", bgLight: "bg-emerald-50" },
  occupied: { color: "bg-blue-500", ring: "ring-blue-200", label: "Occupied", textColor: "text-blue-700", bgLight: "bg-blue-50" },
  reserved: { color: "bg-amber-500", ring: "ring-amber-200", label: "Reserved", textColor: "text-amber-700", bgLight: "bg-amber-50" },
  "needs-attention": { color: "bg-red-500", ring: "ring-red-200", label: "Needs Attention", textColor: "text-red-700", bgLight: "bg-red-50" },
};

export default function TableMapPage() {
  const [mode, setMode] = useState<Mode>("live");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [floorPlanImage, setFloorPlanImage] = useState<string | null>(null);
  const [floorPlanOpacity, setFloorPlanOpacity] = useState<number>(70);
  const [floorPlanScale, setFloorPlanScale] = useState<number>(100);
  const [floorPlanFit, setFloorPlanFit] = useState<"cover" | "contain">("cover");
  const [floorPlanOffsetX, setFloorPlanOffsetX] = useState<number>(0);
  const [floorPlanOffsetY, setFloorPlanOffsetY] = useState<number>(0);
  const [floorPlanError, setFloorPlanError] = useState<string | null>(null);
  const floorRef = useRef<HTMLDivElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);
  const tables = useTablesStore((s) => s.tables);
  const moveTable = useTablesStore((s) => s.moveTable);
  const addTable = useTablesStore((s) => s.addTable);
  const deleteTable = useTablesStore((s) => s.deleteTable);

  const unresolvedCount = tables.reduce(
    (sum, t) => sum + (t.requests?.filter((r) => !r.resolved).length || 0),
    0
  );

  // ── Floor plan persistence (localStorage) ──
  const FLOOR_PLAN_STORAGE_KEY = "carta-floor-plan-settings-v1";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(FLOOR_PLAN_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        image: string | null;
        opacity: number;
        scale: number;
        fit: "cover" | "contain";
        offsetX: number;
        offsetY: number;
      };
      setFloorPlanImage(parsed.image);
      setFloorPlanOpacity(parsed.opacity ?? 70);
      setFloorPlanScale(parsed.scale ?? 100);
      setFloorPlanFit(parsed.fit ?? "cover");
      setFloorPlanOffsetX(parsed.offsetX ?? 0);
      setFloorPlanOffsetY(parsed.offsetY ?? 0);
    } catch (err) {
      window.localStorage.removeItem(FLOOR_PLAN_STORAGE_KEY);
    }
  }, []);

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
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingId || mode !== "edit" || !floorRef.current) return;
      const rect = floorRef.current.getBoundingClientRect();
      const x = Math.min(95, Math.max(5, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.min(95, Math.max(5, ((e.clientY - rect.top) / rect.height) * 100));
      moveTable(draggingId, Math.round(x), Math.round(y));
    },
    [draggingId, mode, moveTable]
  );

  const handlePointerUp = useCallback(() => {
    setDraggingId(null);
  }, []);

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
    <div className="space-y-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Table Map</h1>
          <p className="text-sm text-slate-500 mt-1">
            {mode === "edit"
              ? "Drag tables to reposition. Click to edit details."
              : "Live view — see real-time orders and customer requests."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {mode === "edit" && (
            <>
              <input
                ref={floorPlanInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/*"
                className="hidden"
                onChange={handleFloorPlanFileChange}
              />
              <button
                onClick={() => floorPlanInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                <ImagePlus size={14} />
                {floorPlanImage ? "Change Plan" : "Add Plan"}
              </button>
              {floorPlanImage && (
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                  Remove Plan
                </button>
              )}
            </>
          )}

          {mode === "edit" && (
            <button
              onClick={() => {
                const newTableId = addTable();
                setSelectedTable(newTableId);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus size={14} />
              Add Table
            </button>
          )}

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
              onClick={() => setMode("live")}
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

      {/* Floor plan adjustment controls */}
      {mode === "edit" && floorPlanImage && (
        <div className="bg-slate-50 border border-border rounded-lg p-4 space-y-3">
          <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Floor Plan Adjustments</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Opacity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">Opacity</label>
                <span className="text-xs text-slate-500">{floorPlanOpacity}%</span>
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

            {/* Zoom / Scale */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">Zoom</label>
                <span className="text-xs text-slate-500">{floorPlanScale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={floorPlanScale}
                onChange={(e) => setFloorPlanScale(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Fit Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Fit</label>
              <select
                value={floorPlanFit}
                onChange={(e) => setFloorPlanFit(e.target.value as "cover" | "contain")}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-md bg-white cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
              </select>
            </div>

            {/* Offset X */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">Offset X</label>
                <span className="text-xs text-slate-500">{floorPlanOffsetX}px</span>
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

            {/* Offset Y */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600">Offset Y</label>
                <span className="text-xs text-slate-500">{floorPlanOffsetY}px</span>
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
          </div>

          {/* Reset button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setFloorPlanOpacity(70);
                setFloorPlanScale(100);
                setFloorPlanFit("cover");
                setFloorPlanOffsetX(0);
                setFloorPlanOffsetY(0);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* Floor Plan */}
        <div
          ref={floorRef}
          className={cn(
            "flex-1 bg-white rounded-xl border border-border relative overflow-hidden",
            mode === "edit" && "cursor-crosshair",
            draggingId && "cursor-grabbing"
          )}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Floor plan image (always below table nodes) */}
          {floorPlanImage && (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src={floorPlanImage}
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
              backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

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
              onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}
              onDragStart={() => {
                if (mode === "edit") setDraggingId(table.id);
              }}
            />
          ))}
        </div>

        {/* Side Panel */}
        {selectedTable && (
          <TableDetailPanel
            tableId={selectedTable}
            mode={mode}
            onClose={() => setSelectedTable(null)}
            onDelete={() => {
              if (!selectedTable) return;
              deleteTable(selectedTable);
              setSelectedTable(null);
              setDraggingId(null);
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
  onClick,
  onDragStart,
}: {
  table: Table;
  mode: Mode;
  isSelected: boolean;
  isDragging: boolean;
  onClick: () => void;
  onDragStart: () => void;
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
      onDragStart();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't fire click when finishing a drag
    if (mode === "edit" && isDragging) return;
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
  tableId,
  mode,
  onClose,
  onDelete,
}: {
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
    <div className="w-80 bg-white rounded-xl border border-border flex flex-col overflow-hidden shrink-0">
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
