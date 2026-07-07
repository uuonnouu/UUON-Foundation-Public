import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { SurfaceParameters, SurfaceType, VisualizationMode } from "../types/math";
import { Download, RotateCcw, Calculator } from "lucide-react";
import { createGeometricPattern, getPatternDescription, LETTER_PATTERNS, createMultiDimensionalGrid, isExtendedDimension, generateExtendedPattern } from "../lib/letterPatterns";

interface ControlPanelProps {
  parameters: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  onParameterChange: (params: Partial<SurfaceParameters>) => void;
  onVisualizationModeChange: (mode: VisualizationMode) => void;
  onColorModeChange: (mode: string) => void;
  onExport: () => void;
}

export default function ControlPanel({
  parameters,
  visualMode,
  colorMode,
  onParameterChange,
  onVisualizationModeChange,
  onColorModeChange,
  onExport
}: ControlPanelProps) {

  const resetParameters = () => {
    onParameterChange({
      type: "cube",
      uMin: 0,
      uMax: 1,
      vMin: 0,
      vMax: 1,
      uSegments: 30,
      vSegments: 30,
      a: 2,
      b: 2,
      c: 2
    });
  };

  return (
    <div className="space-y-2">
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
      
      <Card className="p-2">
        <CardContent className="space-y-4">
          {/* Surface Type Selection */}
          <div className="space-y-2">
            <Label>Surface Type</Label>
            <Select value={parameters.type} onValueChange={(value: any) => onParameterChange({ type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cone">Cone</SelectItem>
                <SelectItem value="sphere">Sphere</SelectItem>
                <SelectItem value="cylinder">Cylinder</SelectItem>
                <SelectItem value="torus">Torus</SelectItem>
                <SelectItem value="custom">Custom Equation</SelectItem>
                
                {/* Basic Polygon Shapes */}
                <SelectItem value="triangular_prism">Triangular Prism</SelectItem>
                <SelectItem value="tetrahedron">Tetrahedron (4D: Tesseract)</SelectItem>
                <SelectItem value="triangular_pyramid">Triangular Pyramid</SelectItem>
                
                <SelectItem value="cube">Cube (4D: Tesseract)</SelectItem>
                <SelectItem value="rectangular_prism">Rectangular Prism (4D: Hyperrectangle)</SelectItem>
                <SelectItem value="rhombic_prism">Rhombic Prism</SelectItem>
                <SelectItem value="parallelepiped">Parallelepiped (4D: Hyperparallelepiped)</SelectItem>
                <SelectItem value="trapezoidal_prism">Trapezoidal Prism</SelectItem>
                <SelectItem value="kite_prism">Kite Prism</SelectItem>
                
                <SelectItem value="pentagonal_prism">Pentagonal Prism</SelectItem>
                <SelectItem value="pentagonal_pyramid">Pentagonal Pyramid</SelectItem>
                
                <SelectItem value="hexagonal_prism">Hexagonal Prism</SelectItem>
                <SelectItem value="hexagonal_pyramid">Hexagonal Pyramid</SelectItem>
                
                <SelectItem value="heptagonal_prism">Heptagonal Prism</SelectItem>
                <SelectItem value="heptagonal_pyramid">Heptagonal Pyramid</SelectItem>
                
                <SelectItem value="octagonal_prism">Octagonal Prism</SelectItem>
                <SelectItem value="octagonal_pyramid">Octagonal Pyramid</SelectItem>
                
                <SelectItem value="nonagonal_prism">Nonagonal Prism</SelectItem>
                <SelectItem value="nonagonal_pyramid">Nonagonal Pyramid</SelectItem>
                
                <SelectItem value="decagonal_prism">Decagonal Prism</SelectItem>
                <SelectItem value="decagonal_pyramid">Decagonal Pyramid</SelectItem>
                
                <SelectItem value="hendecagonal_prism">Hendecagonal Prism</SelectItem>
                <SelectItem value="hendecagonal_pyramid">Hendecagonal Pyramid</SelectItem>
                
                <SelectItem value="dodecagonal_prism">Dodecagonal Prism</SelectItem>
                <SelectItem value="dodecagonal_pyramid">Dodecagonal Pyramid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Visualization Mode */}
          <div className="space-y-2">
            <Label>Visualization Mode</Label>
            <Select value={visualMode} onValueChange={onVisualizationModeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wireframe">Wireframe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Mode */}
          <div className="space-y-2">
            <Label>Color Scheme</Label>
            <Select value={colorMode} onValueChange={onColorModeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plasma">Plasma</SelectItem>
                <SelectItem value="rainbow">Rainbow</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="parameters">Controls</TabsTrigger>
        </TabsList>


        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Polygon Shapes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Polygon Shape</Label>
                <Select value={parameters.type} onValueChange={(value: SurfaceType) => onParameterChange({ type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Triangle-based shapes */}
                    <SelectItem value="triangular_prism">Triangle → Triangular Prism</SelectItem>
                    <SelectItem value="tetrahedron">Triangle → Tetrahedron</SelectItem>
                    <SelectItem value="triangular_pyramid">Triangle → Triangular Pyramid</SelectItem>
                    <SelectItem value="cone">Triangle → Cone (circular base)</SelectItem>
                    
                    {/* Quadrilateral-based shapes */}
                    <SelectItem value="cube">Square → Cube</SelectItem>
                    <SelectItem value="rectangular_prism">Rectangle → Rectangular Prism</SelectItem>
                    <SelectItem value="rhombic_prism">Rhombus → Rhombic Prism</SelectItem>
                    <SelectItem value="parallelepiped">Parallelogram → Parallelepiped</SelectItem>
                    <SelectItem value="trapezoidal_prism">Trapezoid → Trapezoidal Prism</SelectItem>
                    <SelectItem value="kite_prism">Kite → Kite-shaped Prism</SelectItem>
                    
                    {/* Pentagon and beyond */}
                    <SelectItem value="pentagonal_prism">Pentagon → Pentagonal Prism</SelectItem>
                    <SelectItem value="pentagonal_pyramid">Pentagon → Pentagonal Pyramid</SelectItem>
                    <SelectItem value="hexagonal_prism">Hexagon → Hexagonal Prism</SelectItem>
                    <SelectItem value="hexagonal_pyramid">Hexagon → Hexagonal Pyramid</SelectItem>
                    <SelectItem value="heptagonal_prism">Heptagon → Heptagonal Prism</SelectItem>
                    <SelectItem value="heptagonal_pyramid">Heptagon → Heptagonal Pyramid</SelectItem>
                    <SelectItem value="octagonal_prism">Octagon → Octagonal Prism</SelectItem>
                    <SelectItem value="octagonal_pyramid">Octagon → Octagonal Pyramid</SelectItem>
                    <SelectItem value="nonagonal_prism">Nonagon → Nonagonal Prism</SelectItem>
                    <SelectItem value="nonagonal_pyramid">Nonagon → Nonagonal Pyramid</SelectItem>
                    <SelectItem value="decagonal_prism">Decagon → Decagonal Prism</SelectItem>
                    <SelectItem value="decagonal_pyramid">Decagon → Decagonal Pyramid</SelectItem>
                    <SelectItem value="hendecagonal_prism">Hendecagon → Hendecagonal Prism</SelectItem>
                    <SelectItem value="hendecagonal_pyramid">Hendecagon → Hendecagonal Pyramid</SelectItem>
                    <SelectItem value="dodecagonal_prism">Dodecagon → Dodecagonal Prism</SelectItem>
                    <SelectItem value="dodecagonal_pyramid">Dodecagon → Dodecagonal Pyramid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Visualization Mode</Label>
                <Select value={visualMode} onValueChange={onVisualizationModeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wireframe">Wireframe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color Mode</Label>
                <Select value={colorMode} onValueChange={onColorModeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="plasma">Plasma</SelectItem>
                    <SelectItem value="rainbow">Rainbow</SelectItem>
                    <SelectItem value="quantum">⚛️ Quantum Energy</SelectItem>
                    <SelectItem value="electron">🔋 Electron Orbital</SelectItem>
                    <SelectItem value="photon">💫 Photon Field</SelectItem>
                    <SelectItem value="letter_harmony">🔢 Letter Harmony (1→25→-25)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">
                  Quantum modes activate enhanced colors for high-energy patterns
                </div>
              </div>
              {/* Parameter Range Controls */}
              <div className="space-y-2">
                <Label>U Range: [{parameters.uMin.toFixed(5)}, {parameters.uMax.toFixed(5)}]</Label>
                <div className="space-y-2">
                  <Slider
                    value={[parameters.uMin]}
                    onValueChange={([value]) => onParameterChange({ uMin: value })}
                    min={-10}
                    max={10}
                    step={0.00001}
                  />
                  <Slider
                    value={[parameters.uMax]}
                    onValueChange={([value]) => onParameterChange({ uMax: value })}
                    min={-10}
                    max={20}
                    step={0.00001}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>V Range: [{parameters.vMin.toFixed(5)}, {parameters.vMax.toFixed(5)}]</Label>
                <div className="space-y-2">
                  <Slider
                    value={[parameters.vMin]}
                    onValueChange={([value]) => onParameterChange({ vMin: value })}
                    min={-10}
                    max={10}
                    step={0.00001}
                  />
                  <Slider
                    value={[parameters.vMax]}
                    onValueChange={([value]) => onParameterChange({ vMax: value })}
                    min={-10}
                    max={20}
                    step={0.00001}
                  />
                </div>
              </div>

              {/* Mesh Resolution */}
              <div className="space-y-2">
                <Label>U Segments: {parameters.uSegments}</Label>
                <Slider
                  value={[parameters.uSegments]}
                  onValueChange={([value]) => onParameterChange({ uSegments: value })}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <Label>V Segments: {parameters.vSegments}</Label>
                <Slider
                  value={[parameters.vSegments]}
                  onValueChange={([value]) => onParameterChange({ vSegments: value })}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>

              {/* Shape Parameters */}
              {(parameters.type.includes("prism") || parameters.type.includes("pyramid") ||
                parameters.type === "cube" || parameters.type === "rectangular_prism" ||
                parameters.type === "rhombic_prism" || parameters.type === "parallelepiped" ||
                parameters.type === "trapezoidal_prism" || parameters.type === "kite_prism" ||
                parameters.type === "tetrahedron" || parameters.type === "cone") && (
                <>
                  <div className="space-y-2">
                    <Label>Parameter A: {parameters.a.toFixed(5)}</Label>
                    <Slider
                      value={[parameters.a]}
                      onValueChange={([value]) => onParameterChange({ a: value })}
                      min={0.1}
                      max={5}
                      step={0.00001}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Parameter B: {parameters.b.toFixed(5)}</Label>
                    <Slider
                      value={[parameters.b]}
                      onValueChange={([value]) => onParameterChange({ b: value })}
                      min={0.1}
                      max={5}
                      step={0.00001}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Parameter C: {parameters.c.toFixed(5)}</Label>
                    <Slider
                      value={[parameters.c]}
                      onValueChange={([value]) => onParameterChange({ c: value })}
                      min={0.1}
                      max={5}
                      step={0.00001}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Parametric Equations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>X(u,v) =</Label>
                <Textarea
                  value={parameters.customEquation.x}
                  onChange={(e) => onParameterChange({
                    customEquation: { ...parameters.customEquation, x: e.target.value }
                  })}
                  placeholder="e.g., u * cos(v)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Y(u,v) =</Label>
                <Textarea
                  value={parameters.customEquation.y}
                  onChange={(e) => onParameterChange({
                    customEquation: { ...parameters.customEquation, y: e.target.value }
                  })}
                  placeholder="e.g., u * sin(v)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Z(u,v) =</Label>
                <Textarea
                  value={parameters.customEquation.z}
                  onChange={(e) => onParameterChange({
                    customEquation: { ...parameters.customEquation, z: e.target.value }
                  })}
                  placeholder="e.g., 10 - u"
                  rows={2}
                />
              </div>

              <div className="text-xs text-muted-foreground">
                <p>Available functions: sin, cos, tan, exp, log, sqrt, abs, pow</p>
                <p>Available constants: PI, E</p>
                <p>Variables: u, v, a, b, c</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
