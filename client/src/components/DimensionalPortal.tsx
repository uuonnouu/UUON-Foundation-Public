import { useState, useCallback } from "react";
import { WebGLErrorBoundary } from "./WebGLErrorBoundary";
import DimensionalVisualizer from "./DimensionalVisualizer";
import { Button } from "./ui/button";
import { X, Minus, Maximize2 } from "lucide-react";

interface DimensionalPortalProps {
  onClose: () => void;
}

export default function DimensionalPortal({ onClose }: DimensionalPortalProps) {
  const [dimensionInput, setDimensionInput] = useState("ABC");
  const [complexity, setComplexity] = useState(3);
  const [minimized, setMinimized] = useState(false);

  const dimensions = dimensionInput
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .filter(Boolean);

  return (
    <div
      className="fixed z-50 flex flex-col"
      style={{
        bottom: "80px",
        right: "16px",
        width: minimized ? "220px" : "480px",
        maxWidth: "calc(100vw - 32px)",
        background: "#0d0d1a",
        border: "1px solid #2a2a4a",
        borderRadius: "10px",
        boxShadow: "0 0 30px rgba(0,200,255,0.15)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-3 py-2 cursor-pointer select-none"
        style={{
          borderBottom: minimized ? "none" : "1px solid #1e1e3a",
          background: "linear-gradient(90deg, #0a0a2a, #111130)",
          borderRadius: minimized ? "10px" : "10px 10px 0 0",
        }}
        onClick={() => setMinimized(m => !m)}
      >
        <span className="text-xs font-bold" style={{ color: "#00d4ff", letterSpacing: "0.08em" }}>
          ◈ DIMENSIONAL PORTAL
        </span>
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <button
            className="p-0.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
            onClick={() => setMinimized(m => !m)}
            title={minimized ? "Expand" : "Minimise"}
          >
            {minimized ? <Maximize2 size={12} /> : <Minus size={12} />}
          </button>
          <button
            className="p-0.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400"
            onClick={onClose}
            title="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {!minimized && (
        <div className="flex flex-col gap-2 p-3">
          {/* Controls */}
          <div className="flex gap-2 items-center flex-wrap">
            <div className="flex flex-col gap-0.5 flex-1 min-w-[120px]">
              <label className="text-xs text-gray-400">Letter Pattern</label>
              <input
                type="text"
                value={dimensionInput}
                onChange={e => setDimensionInput(e.target.value.toUpperCase().replace(/[^A-Za-z]/g, ""))}
                maxLength={8}
                placeholder="e.g. ABCD"
                className="text-sm px-2 py-1 rounded outline-none font-mono"
                style={{
                  background: "#111",
                  border: "1px solid #333",
                  color: "#00ff88",
                  width: "100%",
                }}
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <label className="text-xs text-gray-400">Complexity</label>
              <div className="flex items-center gap-1">
                <button
                  className="w-6 h-6 rounded text-xs font-bold"
                  style={{ background: "#1a1a3a", color: "#aaa", border: "1px solid #333" }}
                  onClick={() => setComplexity(c => Math.max(1, c - 1))}
                >−</button>
                <span className="text-sm font-mono text-white w-4 text-center">{complexity}</span>
                <button
                  className="w-6 h-6 rounded text-xs font-bold"
                  style={{ background: "#1a1a3a", color: "#aaa", border: "1px solid #333" }}
                  onClick={() => setComplexity(c => Math.min(8, c + 1))}
                >+</button>
              </div>
            </div>
          </div>

          {/* Dimension tags */}
          <div className="flex flex-wrap gap-1">
            {dimensions.length === 0 ? (
              <span className="text-xs text-gray-500">Enter letters A–Z to generate dimensions</span>
            ) : (
              dimensions.map((d, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded font-mono"
                  style={{ background: "#0a1a2a", color: "#00d4ff", border: "1px solid #0a3a5a" }}
                >
                  {d}
                </span>
              ))
            )}
          </div>

          {/* 3D View */}
          <div className="relative rounded overflow-hidden" style={{ height: "220px" }}>
            <WebGLErrorBoundary>
              <DimensionalVisualizer
                dimensions={dimensions}
                complexity={complexity}
              />
            </WebGLErrorBoundary>
          </div>

          <p className="text-xs text-gray-500 text-center">
            {dimensions.length} dimension{dimensions.length !== 1 ? "s" : ""} · harmonic point cloud
          </p>
        </div>
      )}
    </div>
  );
}
