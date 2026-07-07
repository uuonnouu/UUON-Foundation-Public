import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { fourDRenderer, type Rotation4D } from '../lib/4DRenderer';

interface FourDControlsProps {
  onRotationChange: (rotation: Rotation4D) => void;
  onCrossSectionChange: (w: number) => void;
  onProjectionChange: (method: 'orthogonal' | 'stereographic') => void;
  onAnimationSpeedChange: (speed: number) => void;
}

export const FourDControls: React.FC<FourDControlsProps> = ({
  onRotationChange,
  onCrossSectionChange,
  onProjectionChange,
  onAnimationSpeedChange
}) => {
  const [rotation4D, setRotation4D] = React.useState<Rotation4D>({
    xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0
  });
  const [crossSectionW, setCrossSectionW] = React.useState(0);
  const [projectionMethod, setProjectionMethod] = React.useState<'orthogonal' | 'stereographic'>('stereographic');
  const [animationSpeed, setAnimationSpeed] = React.useState(1);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Update 4D rotation
  const updateRotation = (plane: keyof Rotation4D, value: number) => {
    const newRotation = { ...rotation4D, [plane]: value };
    setRotation4D(newRotation);
    fourDRenderer.setRotation4D(newRotation);
    onRotationChange(newRotation);
  };

  // Update cross-section
  const updateCrossSection = (w: number) => {
    setCrossSectionW(w);
    fourDRenderer.setCrossSection(w);
    onCrossSectionChange(w);
  };

  // Update projection method
  const updateProjection = (method: 'orthogonal' | 'stereographic') => {
    setProjectionMethod(method);
    fourDRenderer.setProjectionMethod(method);
    onProjectionChange(method);
  };

  // Reset all rotations
  const resetRotations = () => {
    const resetRotation = { xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 };
    setRotation4D(resetRotation);
    fourDRenderer.setRotation4D(resetRotation);
    onRotationChange(resetRotation);
  };

  // Auto-rotate in 4D
  const toggleAutoRotation = () => {
    setIsAnimating(!isAnimating);
  };

  React.useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        const time = Date.now() * 0.001 * animationSpeed;
        const autoRotation: Rotation4D = {
          xy: Math.sin(time * 0.5) * 0.1,
          xz: Math.cos(time * 0.3) * 0.1,
          xw: Math.sin(time * 0.7) * 0.1,
          yz: Math.cos(time * 0.4) * 0.1,
          yw: Math.sin(time * 0.6) * 0.1,
          zw: Math.cos(time * 0.8) * 0.1
        };
        fourDRenderer.setRotation4D(autoRotation);
        onRotationChange(autoRotation);
        setRotation4D(autoRotation);
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isAnimating, animationSpeed, onRotationChange]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-cyan-400">
          4D Mathematical Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* 4D Rotation Controls - All 6 Planes */}
        <div className="space-y-3">
          <h3 className="text-md font-medium text-cyan-300">4D Rotations (6 Planes)</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-300">XY Plane</label>
              <Slider
                value={[rotation4D.xy]}
                onValueChange={([value]) => updateRotation('xy', value)}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{rotation4D.xy.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-300">XZ Plane</label>
              <Slider
                value={[rotation4D.xz]}
                onValueChange={([value]) => updateRotation('xz', value)}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{rotation4D.xz.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-300">XW Plane</label>
              <Slider
                value={[rotation4D.xw]}
                onValueChange={([value]) => updateRotation('xw', value)}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{rotation4D.xw.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-300">YZ Plane</label>
              <Slider
                value={[rotation4D.yz]}
                onValueChange={([value]) => updateRotation('yz', value)}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{rotation4D.yz.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-300">YW Plane</label>
              <Slider
                value={[rotation4D.yw]}
                onValueChange={([value]) => updateRotation('yw', value)}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{rotation4D.yw.toFixed(2)}</span>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-gray-300">ZW Plane</label>
              <Slider
                value={[rotation4D.zw]}
                onValueChange={([value]) => updateRotation('zw', value)}
                min={-Math.PI}
                max={Math.PI}
                step={0.01}
                className="w-full"
              />
              <span className="text-xs text-gray-400">{rotation4D.zw.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 4D Cross-Section Control */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-cyan-300">4D Cross-Section (W-Slice)</h3>
          <Slider
            value={[crossSectionW]}
            onValueChange={([value]) => updateCrossSection(value)}
            min={-2}
            max={2}
            step={0.05}
            className="w-full"
          />
          <span className="text-xs text-gray-400">W = {crossSectionW.toFixed(2)}</span>
        </div>

        {/* Projection Method */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-cyan-300">4D Projection Method</h3>
          <Select value={projectionMethod} onValueChange={updateProjection}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stereographic">Stereographic Projection</SelectItem>
              <SelectItem value="orthogonal">Orthogonal Projection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animation Controls */}
        <div className="space-y-2">
          <h3 className="text-md font-medium text-cyan-300">4D Animation</h3>
          <div className="flex gap-2">
            <Button
              onClick={toggleAutoRotation}
              variant={isAnimating ? "default" : "outline"}
              size="sm"
              className="flex-1"
            >
              {isAnimating ? "Stop 4D Rotation" : "Start 4D Rotation"}
            </Button>
            <Button
              onClick={resetRotations}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Reset All
            </Button>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-gray-300">Animation Speed</label>
            <Slider
              value={[animationSpeed]}
              onValueChange={([value]) => {
                setAnimationSpeed(value);
                onAnimationSpeedChange(value);
              }}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{animationSpeed.toFixed(1)}x</span>
          </div>
        </div>

        {/* 4D Information */}
        <div className="p-3 bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-cyan-300 mb-2">4D Visualization Info</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Projection: {projectionMethod === 'stereographic' ? 'Stereographic (preserves angles)' : 'Orthogonal (simple)'}</div>
            <div>Active Rotations: {Object.entries(rotation4D).filter(([_, v]) => Math.abs(v) > 0.01).length}/6 planes</div>
            <div>W-Slice: {crossSectionW === 0 ? 'Center section' : `Offset ${crossSectionW > 0 ? '+' : ''}${crossSectionW.toFixed(2)}`}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};