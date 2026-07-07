import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { fourDRenderer, type Point5D, type Rotation5D, type FiveDControls } from '../lib/4DRenderer';

interface Enhanced4DControlsProps {
  onControlsChange: (controls: FiveDControls) => void;
  isVisible: boolean;
  shape4D: boolean; // Only show for 4D mathematical objects
}

export const Enhanced4DControls: React.FC<Enhanced4DControlsProps> = ({
  onControlsChange,
  isVisible,
  shape4D
}) => {
  const [fiveDControls, setFiveDControls] = React.useState<FiveDControls>({
    position: { x: 0, y: 0, z: 0, w: 0, u: 0 },
    rotation: { xy: 0, xz: 0, xw: 0, xu: 0, yz: 0, yw: 0, yu: 0, zw: 0, zu: 0, wu: 0 },
    scale: { x: 1, y: 1, z: 1, w: 1, u: 1 }
  });

  const [uSlice, setUSlice] = React.useState(0);
  const [isAutoRotating, setIsAutoRotating] = React.useState(false);

  // Only render for 4D objects
  if (!shape4D || !isVisible) {
    return null;
  }

  // Update position
  const updatePosition = (dimension: keyof Point5D, value: number) => {
    const newControls = {
      ...fiveDControls,
      position: { ...fiveDControls.position, [dimension]: value }
    };
    setFiveDControls(newControls);
    fourDRenderer.set5DPosition({ [dimension]: value });
    onControlsChange(newControls);
  };

  // Update rotation
  const updateRotation = (plane: keyof Rotation5D, value: number) => {
    const newControls = {
      ...fiveDControls,
      rotation: { ...fiveDControls.rotation, [plane]: value }
    };
    setFiveDControls(newControls);
    fourDRenderer.set5DRotation({ [plane]: value });
    onControlsChange(newControls);
  };

  // Update scale
  const updateScale = (dimension: keyof Point5D, value: number) => {
    const newControls = {
      ...fiveDControls,
      scale: { ...fiveDControls.scale, [dimension]: value }
    };
    setFiveDControls(newControls);
    fourDRenderer.set5DScale({ [dimension]: value });
    onControlsChange(newControls);
  };

  // Update U-slice
  const updateUSlice = (value: number) => {
    setUSlice(value);
    fourDRenderer.setCrossSectionU(value);
  };

  // Reset all controls
  const resetControls = () => {
    const resetControls: FiveDControls = {
      position: { x: 0, y: 0, z: 0, w: 0, u: 0 },
      rotation: { xy: 0, xz: 0, xw: 0, xu: 0, yz: 0, yw: 0, yu: 0, zw: 0, zu: 0, wu: 0 },
      scale: { x: 1, y: 1, z: 1, w: 1, u: 1 }
    };
    setFiveDControls(resetControls);
    fourDRenderer.set5DPosition(resetControls.position);
    fourDRenderer.set5DRotation(resetControls.rotation);
    fourDRenderer.set5DScale(resetControls.scale);
    setUSlice(0);
    fourDRenderer.setCrossSectionU(0);
    onControlsChange(resetControls);
  };

  // Auto-rotation effect
  React.useEffect(() => {
    if (isAutoRotating) {
      const interval = setInterval(() => {
        const time = Date.now() * 0.001;
        const autoRotation: Rotation5D = {
          xy: Math.sin(time * 0.3) * 0.05,
          xz: Math.cos(time * 0.4) * 0.05,
          xw: Math.sin(time * 0.5) * 0.05,
          xu: Math.cos(time * 0.6) * 0.05,
          yz: Math.sin(time * 0.7) * 0.05,
          yw: Math.cos(time * 0.8) * 0.05,
          yu: Math.sin(time * 0.9) * 0.05,
          zw: Math.cos(time * 1.0) * 0.05,
          zu: Math.sin(time * 1.1) * 0.05,
          wu: Math.cos(time * 1.2) * 0.05
        };
        
        const newControls = { ...fiveDControls, rotation: autoRotation };
        setFiveDControls(newControls);
        fourDRenderer.set5DRotation(autoRotation);
        onControlsChange(newControls);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAutoRotating, onControlsChange]);

  return (
    <Card className="w-full bg-gray-900/95 border-cyan-500/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-cyan-400 flex items-center gap-2">
          🌀 Enhanced 4D Controls (x,y,z,w,u)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="position" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="position">Position</TabsTrigger>
            <TabsTrigger value="rotation">Rotation</TabsTrigger>
            <TabsTrigger value="scale">Scale</TabsTrigger>
            <TabsTrigger value="slicing">Slicing</TabsTrigger>
          </TabsList>

          {/* 5D Position Controls */}
          <TabsContent value="position" className="space-y-3">
            <h3 className="text-sm font-medium text-cyan-300">5D Position (x,y,z,w,u)</h3>
            <div className="grid grid-cols-1 gap-3">
              {(['x', 'y', 'z', 'w', 'u'] as const).map((dim) => (
                <div key={dim} className="space-y-1">
                  <Label className="text-xs text-gray-300 uppercase">{dim}-Position</Label>
                  <Slider
                    value={[fiveDControls.position[dim]]}
                    onValueChange={([value]) => updatePosition(dim, value)}
                    min={-5}
                    max={5}
                    step={0.01}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{fiveDControls.position[dim].toFixed(2)}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 5D Rotation Controls (10 planes) */}
          <TabsContent value="rotation" className="space-y-3">
            <h3 className="text-sm font-medium text-cyan-300">5D Rotations (10 Planes)</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['xy', 'xz', 'xw', 'xu', 'yz', 'yw', 'yu', 'zw', 'zu', 'wu'] as const).map((plane) => (
                <div key={plane} className="space-y-1">
                  <Label className="text-xs text-gray-300 uppercase">{plane} Plane</Label>
                  <Slider
                    value={[fiveDControls.rotation[plane]]}
                    onValueChange={([value]) => updateRotation(plane, value)}
                    min={-Math.PI}
                    max={Math.PI}
                    step={0.01}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{fiveDControls.rotation[plane].toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                variant={isAutoRotating ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                {isAutoRotating ? "Stop Auto 5D" : "Start Auto 5D"}
              </Button>
            </div>
          </TabsContent>

          {/* 5D Scale Controls */}
          <TabsContent value="scale" className="space-y-3">
            <h3 className="text-sm font-medium text-cyan-300">5D Scale (x,y,z,w,u)</h3>
            <div className="grid grid-cols-1 gap-3">
              {(['x', 'y', 'z', 'w', 'u'] as const).map((dim) => (
                <div key={dim} className="space-y-1">
                  <Label className="text-xs text-gray-300 uppercase">{dim}-Scale</Label>
                  <Slider
                    value={[fiveDControls.scale[dim]]}
                    onValueChange={([value]) => updateScale(dim, value)}
                    min={0.1}
                    max={3}
                    step={0.01}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-400">{fiveDControls.scale[dim].toFixed(2)}x</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 5D Slicing Controls */}
          <TabsContent value="slicing" className="space-y-3">
            <h3 className="text-sm font-medium text-cyan-300">5D → 4D Slicing</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-300">U-Dimension Slice</Label>
                <Slider
                  value={[uSlice]}
                  onValueChange={([value]) => updateUSlice(value)}
                  min={-2}
                  max={2}
                  step={0.05}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">U = {uSlice.toFixed(2)}</span>
              </div>
              
              <div className="p-3 bg-gray-800 rounded-lg">
                <h4 className="text-xs font-medium text-cyan-300 mb-2">5D → 4D Projection Info</h4>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Active Rotations: {Object.entries(fiveDControls.rotation).filter(([_, v]) => Math.abs(v) > 0.01).length}/10 planes</div>
                  <div>Position Offset: {Object.entries(fiveDControls.position).filter(([_, v]) => Math.abs(v) > 0.01).length}/5 dimensions</div>
                  <div>Scale Factors: {Object.entries(fiveDControls.scale).filter(([_, v]) => Math.abs(v - 1) > 0.01).length}/5 dimensions</div>
                  <div>U-Slice: {uSlice === 0 ? 'Center' : `${uSlice > 0 ? '+' : ''}${uSlice.toFixed(2)}`}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Control Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-700">
          <Button
            onClick={resetControls}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Reset All 5D
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};