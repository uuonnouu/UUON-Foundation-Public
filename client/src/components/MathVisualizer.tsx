import { useState, useCallback, useRef, useEffect } from "react";
import Scene3D from "./Scene3D";
import ExpandedControlPanel from "./ExpandedControlPanel";
import ShapeInfoDisplay from "./ShapeInfoDisplay";
import ObjectInfoPanel from "./ObjectInfoPanel";
import AccessibilityControls, { AccessibilitySettings } from "./AccessibilityControls";
import AccessibilityToggle, { AccessibilityTheme } from "./AccessibilityToggle";
import CommunityFeatures from "./CommunityFeatures";
import CustomPlot from "./CustomPlot";
import { SurfaceParameters, VisualizationMode } from "../../../shared/schema";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { testAllCosmicObjects } from "../lib/cosmicObjectTester";
import * as THREE from "three";
import { VerificationStatusBar } from "./VerificationStatusBar";
import { ResearchExportButton } from './ResearchExportButton';
import { NFTSnapshotButton } from './NFTSnapshotButton';
import { WebGLErrorBoundary } from './WebGLErrorBoundary';
import DimensionalPortal from './DimensionalPortal';

export default function MathVisualizer() {
  const [surfaceParams, setSurfaceParams] = useState<SurfaceParameters>({
    type: "cube",
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1,
    uSegments: 60,
    vSegments: 20,
    a: 2, b: 1, c: 2, d: 2, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1,
    k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1,
    u: 1, v: 1, w: 1
  });

  const [visualMode, setVisualMode] = useState<VisualizationMode>("wireframe");
  const [colorMode, setColorMode] = useState<string>("neon_green");

  const [staticMode, setStaticMode] = useState<boolean>(false);
  const [showAccessibility, setShowAccessibility] = useState<boolean>(false);
  const [showCustomPlot, setShowCustomPlot] = useState<boolean>(false);
  const [showDimensionalPortal, setShowDimensionalPortal] = useState<boolean>(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    colorScheme: 'default',
    reducedMotion: false,
    largeFonts: false,
    focusIndicators: true
  });
// Personalization settings removed per user request
  const [currentAccessibilityTheme, setCurrentAccessibilityTheme] = useState<AccessibilityTheme | null>(null);


  const handleParameterChange = useCallback((params: Partial<SurfaceParameters>) => {
    setSurfaceParams(prev => ({ ...prev, ...params }));
  }, []);



  const handleColorModeChange = useCallback((mode: string) => {
    console.log('Color mode changing from', colorMode, 'to', mode);
    setColorMode(mode);
    // Don't force re-render - let the colorMode dependency handle it
  }, [colorMode]);



  const handleExport = useCallback(() => {
    // Export functionality will be implemented
    console.log("Export functionality not yet implemented");
  }, []);

  const handleAccessibilityChange = useCallback((settings: AccessibilitySettings) => {
    setAccessibilitySettings(settings);
  }, []);

  const handleAccessibilityThemeChange = useCallback((theme: AccessibilityTheme) => {
    setCurrentAccessibilityTheme(theme);

    // Update visualization colors based on theme
    if (theme.wireframe) {
      // Update neon colors to match accessibility theme
      const wireframeColor = theme.wireframe;
      if (wireframeColor === '#ffffff') {
        setColorMode('neon_green'); // High contrast uses white, keep green for visibility
      } else if (wireframeColor === '#00ccff') {
        setColorMode('neon_magenta'); // Dark enhanced uses blue accent
      } else if (wireframeColor === '#0056b3') {
        setColorMode('neon_orange'); // Light accessible uses darker blue
      }
    }

    // Apply reduced motion to static mode if enabled
    if (accessibilitySettings.reducedMotion && !staticMode) {
      setStaticMode(true);
    } else if (!accessibilitySettings.reducedMotion && staticMode) {
      setStaticMode(false);
    }
  }, [staticMode]);

  const sceneRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.Camera | null;
    renderer: THREE.WebGLRenderer | null;
  }>({ scene: null, camera: null, renderer: null });

  const handleSceneReady = useCallback((scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) => {
    sceneRefs.current.scene = scene;
    sceneRefs.current.camera = camera;
    sceneRefs.current.renderer = renderer;
  }, []);

  // Show Custom Plot if enabled
  if (showCustomPlot) {
    return <CustomPlot onClose={() => setShowCustomPlot(false)} />;
  }

  return (
    <div className="relative h-screen w-full" style={{ 
      backgroundColor: 'var(--bg-primary, #0a0a0a)',
      overflow: 'hidden'
    }}>
      {/* 3D Visualization - Full Screen Background */}
      <div className="absolute inset-0" style={{ 
        width: '100%', 
        height: '100%',
        zIndex: 1
      }}>
        <WebGLErrorBoundary>
          <Scene3D
            parameters={surfaceParams as any}
            visualMode={visualMode}
            colorMode={colorMode}
            brightness={0.5}
            staticMode={staticMode}
            onSceneReady={handleSceneReady}
          />
        </WebGLErrorBoundary>
      </div>




      {/* Custom Plot Toggle - Minimized */}
      <div className="absolute top-4 right-20 z-50">
        <Button
          onClick={() => setShowCustomPlot(true)}
          className="bg-cyan-600/80 hover:bg-cyan-700 text-white px-2 py-1 text-xs shadow-md"
        >
          📐
        </Button>
      </div>

      {/* Dimensional Portal Toggle */}
      <div className="absolute top-4 right-32 z-50">
        <Button
          onClick={() => setShowDimensionalPortal(v => !v)}
          className="text-white px-2 py-1 text-xs shadow-md"
          style={{
            background: showDimensionalPortal ? '#0a3a5a' : 'rgba(0,100,160,0.7)',
            border: '1px solid #00d4ff44',
          }}
          title="Dimensional Portal"
        >
          ◈
        </Button>
      </div>

      {/* Dimensional Portal */}
      {showDimensionalPortal && (
        <DimensionalPortal onClose={() => setShowDimensionalPortal(false)} />
      )}

      {/* Expanded Control Panel - Overlaid */}
      <ExpandedControlPanel
        parameters={surfaceParams as any}
        visualMode={visualMode}
        colorMode={colorMode}
        onParameterChange={handleParameterChange}
        onVisualizationModeChange={setVisualMode}
        onColorModeChange={handleColorModeChange}
        onExport={handleExport}
        sceneRefs={sceneRefs.current}
      />

      {/* Accessibility Toggle - Minimized */}
      <AccessibilityToggle
        onThemeChange={handleAccessibilityThemeChange}
      />

      {/* Accessibility Controls - Hidden by default for clean workspace */}
      {showAccessibility && (
        <div className="fixed top-16 right-4 z-40">
          <AccessibilityControls onAccessibilityChange={handleAccessibilityChange} />
        </div>
      )}

      {/* Object Information Panel - Bottom of screen */}
      <ObjectInfoPanel parameters={surfaceParams} />

      {/* Verification Status Bar - Bottom edge with API percentages */}
      <VerificationStatusBar 
        surfaceType={surfaceParams.type} 
        parameters={surfaceParams} 
      />
    </div>
  );
}