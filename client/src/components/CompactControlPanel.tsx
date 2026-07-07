import React from "react";
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { RotateCcw, Download } from "lucide-react";
import { getShapeDefaults } from "../lib/shapeDefaults";

interface CompactControlPanelProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
  onColorModeChange: (mode: string) => void;
  onExport: () => void;
}

export default function CompactControlPanel({
  parameters,
  visualMode,
  colorMode,
  onParameterChange,
  onVisualizationModeChange,
  onColorModeChange,
  onExport
}: CompactControlPanelProps) {

  const resetParameters = () => {
    onParameterChange({
      type: "cube",
      uMin: 0,
      uMax: 6.28,
      vMin: 0,
      vMax: 1,
      uSegments: 50,
      vSegments: 50,
      a: 2,
      b: 1,
      c: 1
    });
  };

  return (
    <div className="space-y-2 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Controls</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={resetParameters} className="h-6 w-6 p-0">
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} className="h-6 w-6 p-0">
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Main Controls - Compact Grid */}
      <div className="bg-card border rounded-lg p-2 space-y-2">
        {/* Shape, Pattern, Color in 2x2 + 1 layout */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Shape</Label>
            <Select value={parameters.type} onValueChange={(value: any) => {
              const defaults = getShapeDefaults(value);
              onParameterChange({ type: value, ...defaults });
            }}>
              <SelectTrigger className="h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="triangular_prism">Triangle</SelectItem>
                <SelectItem value="cube">Cube</SelectItem>
                <SelectItem value="pentagonal_prism">Pentagon</SelectItem>
                <SelectItem value="hexagonal_prism">Hexagon</SelectItem>
                <SelectItem value="octagonal_prism">Octagon</SelectItem>
                <SelectItem value="decagonal_prism">Decagon</SelectItem>
                <SelectItem value="dodecagonal_prism">Dodecagon</SelectItem>

                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="sphere">Sphere</SelectItem>
                <SelectItem value="torus">Torus</SelectItem>
                <SelectItem value="ellipsoid">Ellipsoid</SelectItem>
                <SelectItem value="paraboloid">Paraboloid</SelectItem>
                <SelectItem value="hyperboloid">Hyperboloid</SelectItem>
                <SelectItem value="hemisphere">Hemisphere</SelectItem>
                <SelectItem value="spherical_cap">Spherical Cap</SelectItem>
                <SelectItem value="quarter_sphere">Quarter Sphere</SelectItem>
                <SelectItem value="annulus_torus">Annulus Torus</SelectItem>
                <SelectItem value="cylindrical_shell">Shell</SelectItem>
                <SelectItem value="star_5_prism">★ 5-Star</SelectItem>
                <SelectItem value="star_6_hexagram">✡ 6-Star</SelectItem>
                <SelectItem value="star_8_octagram">✦ 8-Star</SelectItem>
                <SelectItem value="concave_pentagon">⬟ Concave 5</SelectItem>
                <SelectItem value="concave_hexagon">⬢ Concave 6</SelectItem>
                <SelectItem value="crescent">🌙 Crescent</SelectItem>
                <SelectItem value="heart_shape">♥ Heart</SelectItem>
                <SelectItem value="kidney_shape">Kidney</SelectItem>
                <SelectItem value="oval_prolate">Oval Pro</SelectItem>
                <SelectItem value="oval_oblate">Oval Obl</SelectItem>
                <SelectItem value="lens_biconvex">Lens +</SelectItem>
                <SelectItem value="lens_biconcave">Lens -</SelectItem>
                <SelectItem value="airfoil_naca">Airfoil</SelectItem>
                <SelectItem value="gear_tooth">⚙ Gear</SelectItem>
                <SelectItem value="cam_profile">Cam</SelectItem>
                <SelectItem value="spline_surface">Spline</SelectItem>
                <SelectItem value="bezier_surface">Bezier</SelectItem>
                <SelectItem value="nurbs_surface">NURBS</SelectItem>
                <SelectItem value="GRAVITY_WELL">🌀 Gravity Well</SelectItem>
                <SelectItem value="WHITE_HOLE">⚪ White Hole</SelectItem>
                <SelectItem value="WORMHOLE">🌀 Wormhole</SelectItem>
                <SelectItem value="ERGOSPHERE">🌌 Ergosphere</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Pattern</Label>
            <Select value={visualMode} onValueChange={onVisualizationModeChange}>
              <SelectTrigger className="h-6 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wireframe">Wire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Color</Label>
          <Select value={colorMode} onValueChange={onColorModeChange}>
            <SelectTrigger className="h-6 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plasma">Plasma</SelectItem>
              <SelectItem value="quantum">⚛️ Quantum</SelectItem>
              <SelectItem value="electron">🔋 Electron</SelectItem>
              <SelectItem value="photon">💫 Photon</SelectItem>
              <SelectItem value="letter_harmony">🔢 Harmony</SelectItem>
              <SelectItem value="rainbow">Rainbow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 9 Parameter Controls - 9 Individual Rows */}
      <div className="bg-card border rounded-lg p-2 space-y-1 flex-1 min-h-0">
        {/* Row 1: A */}
        <div className="space-y-1">
          <Label className="text-xs">A: {parameters.a.toFixed(5)}</Label>
          <Slider
            value={[parameters.a]}
            onValueChange={([value]) => onParameterChange({ a: value })}
            min={-10}
            max={10}
            step={0.00001}
            className="h-2"
          />
        </div>

        {/* Row 2: B */}
        <div className="space-y-1">
          <Label className="text-xs">B: {parameters.b.toFixed(5)}</Label>
          <Slider
            value={[parameters.b]}
            onValueChange={([value]) => onParameterChange({ b: value })}
            min={-10}
            max={10}
            step={0.00001}
            className="h-2"
          />
        </div>

        {/* Row 3: C */}
        <div className="space-y-1">
          <Label className="text-xs">C: {parameters.c.toFixed(5)}</Label>
          <Slider
            value={[parameters.c]}
            onValueChange={([value]) => onParameterChange({ c: value })}
            min={-10}
            max={10}
            step={0.00001}
            className="h-2"
          />
        </div>

        {/* Row 4: U Min */}
        <div className="space-y-1">
          <Label className="text-xs">U Min: {parameters.uMin.toFixed(5)}</Label>
          <Slider
            value={[parameters.uMin]}
            onValueChange={([value]) => onParameterChange({ uMin: value })}
            min={-10}
            max={10}
            step={0.00001}
            className="h-2"
          />
        </div>

        {/* Row 5: U Max */}
        <div className="space-y-1">
          <Label className="text-xs">U Max: {parameters.uMax.toFixed(5)}</Label>
          <Slider
            value={[parameters.uMax]}
            onValueChange={([value]) => onParameterChange({ uMax: value })}
            min={-10}
            max={10}
            step={0.00001}
            className="h-2"
          />
        </div>

        {/* Row 6: V Min */}
        <div className="space-y-1">
          <Label className="text-xs">V Min: {parameters.vMin.toFixed(5)}</Label>
          <Slider
            value={[parameters.vMin]}
            onValueChange={([value]) => onParameterChange({ vMin: value })}
            min={-10}
            max={10}
            step={0.00001}
            className="h-2"
          />
        </div>

        {/* Row 7: V Max */}
        <div className="space-y-1">
          <Label className="text-xs">V Max: {parameters.vMax.toFixed(5)}</Label>
          <Slider
            value={[parameters.vMax]}
            onValueChange={([value]) => onParameterChange({ vMax: value })}
            min={-10}
            max={10}
            step={0.00001}
            className="h-2"
          />
        </div>

        {/* Row 8: U Segs */}
        <div className="space-y-1">
          <Label className="text-xs">U Segs: {Math.round(parameters.uSegments)}</Label>
          <Slider
            value={[parameters.uSegments]}
            onValueChange={([value]) => onParameterChange({ uSegments: Math.round(value) })}
            min={5}
            max={200}
            step={1}
            className="h-2"
          />
        </div>

        {/* Row 9: V Segs */}
        <div className="space-y-1">
          <Label className="text-xs">V Segs: {Math.round(parameters.vSegments)}</Label>
          <Slider
            value={[parameters.vSegments]}
            onValueChange={([value]) => onParameterChange({ vSegments: Math.round(value) })}
            min={5}
            max={200}
            step={1}
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}