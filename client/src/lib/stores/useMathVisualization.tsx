import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SurfaceParameters, VisualizationMode } from '../../types/math';
import { getShapeDefaults } from '../shapeDefaults';

interface MathVisualizationState {
  // Core Parameters
  surfaceParams: SurfaceParameters;
  visualMode: VisualizationMode;
  colorMode: string;
  staticMode: boolean;
  
  // UI State
  showAccessibility: boolean;
  showCustomPlot: boolean;
  showCommunityFeatures: boolean;
  showShapeInfo: boolean;
  
  // Performance Settings
  performanceMode: 'high' | 'medium' | 'low';
  maxFPS: number;
  enableOptimizations: boolean;
  
  // Parameter History for Undo/Redo
  parameterHistory: SurfaceParameters[];
  historyIndex: number;
  
  // Actions
  setParameterChange: (params: Partial<SurfaceParameters>) => void;
  setVisualizationMode: (mode: VisualizationMode) => void;
  setColorMode: (mode: string) => void;
  setStaticMode: (enabled: boolean) => void;
  setShowAccessibility: (show: boolean) => void;
  setShowCustomPlot: (show: boolean) => void;
  setShowCommunityFeatures: (show: boolean) => void;
  setShowShapeInfo: (show: boolean) => void;
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void;
  resetParameters: () => void;
  undoParameter: () => void;
  redoParameter: () => void;
  validateParameters: () => boolean;
}

const defaultParameters: SurfaceParameters = {
  type: "cube",
  uMin: 0,
  uMax: 1,
  vMin: 0,
  vMax: 1,
  uSegments: 60,
  vSegments: 20,
  a: 2, b: 1, c: 2, d: 2, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1,
  k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1,
  u: 1, v: 1, w: 1,
  customEquation: {
    x: "u",
    y: "v",
    z: "0"
  }
};

export const useMathVisualization = create<MathVisualizationState>()(
  persist(
    (set, get) => ({
      // Initial State
      surfaceParams: defaultParameters,
      visualMode: "wireframe",
      colorMode: "neon_green",
      staticMode: false,
      showAccessibility: false,
      showCustomPlot: false,
      showCommunityFeatures: false,
      showShapeInfo: true,
      performanceMode: 'high',
      maxFPS: 60,
      enableOptimizations: true,
      parameterHistory: [defaultParameters],
      historyIndex: 0,

      // Actions
      setParameterChange: (params) => {
        const state = get();
        const newParams = { ...state.surfaceParams, ...params };
        
        // Apply shape-specific defaults if type changed
        if (params.type && params.type !== state.surfaceParams.type) {
          const shapeDefaults = getShapeDefaults(params.type);
          Object.assign(newParams, shapeDefaults);
        }
        
        // Add to history for undo/redo
        const newHistory = state.parameterHistory.slice(0, state.historyIndex + 1);
        newHistory.push(newParams);
        
        set({
          surfaceParams: newParams,
          parameterHistory: newHistory,
          historyIndex: newHistory.length - 1
        });
      },

      setVisualizationMode: (mode) => set({ visualMode: mode }),
      setColorMode: (mode) => set({ colorMode: mode }),
      setStaticMode: (enabled) => set({ staticMode: enabled }),
      setShowAccessibility: (show) => set({ showAccessibility: show }),
      setShowCustomPlot: (show) => set({ showCustomPlot: show }),
      setShowCommunityFeatures: (show) => set({ showCommunityFeatures: show }),
      setShowShapeInfo: (show) => set({ showShapeInfo: show }),
      
      setPerformanceMode: (mode) => {
        const fps = mode === 'high' ? 60 : mode === 'medium' ? 30 : 15;
        set({ 
          performanceMode: mode, 
          maxFPS: fps,
          enableOptimizations: mode !== 'high'
        });
      },

      resetParameters: () => {
        const state = get();
        const defaults = getShapeDefaults(state.surfaceParams.type);
        const newParams = { ...defaultParameters, ...defaults };
        
        set({
          surfaceParams: newParams,
          parameterHistory: [...state.parameterHistory, newParams],
          historyIndex: state.parameterHistory.length
        });
      },

      undoParameter: () => {
        const state = get();
        if (state.historyIndex > 0) {
          set({
            surfaceParams: state.parameterHistory[state.historyIndex - 1],
            historyIndex: state.historyIndex - 1
          });
        }
      },

      redoParameter: () => {
        const state = get();
        if (state.historyIndex < state.parameterHistory.length - 1) {
          set({
            surfaceParams: state.parameterHistory[state.historyIndex + 1],
            historyIndex: state.historyIndex + 1
          });
        }
      },

      validateParameters: () => {
        const { surfaceParams } = get();
        
        // Basic validation checks
        const isValidRange = (min: number, max: number) => min < max;
        const isValidSegments = (segments: number) => segments > 0 && segments <= 500;
        
        return (
          isValidRange(surfaceParams.uMin, surfaceParams.uMax) &&
          isValidRange(surfaceParams.vMin, surfaceParams.vMax) &&
          isValidSegments(surfaceParams.uSegments) &&
          isValidSegments(surfaceParams.vSegments)
        );
      }
    }),
    {
      name: 'math-visualization-store',
      version: 4,
      partialize: (state) => ({
        surfaceParams: state.surfaceParams,
        visualMode: state.visualMode,
        colorMode: state.colorMode,
        performanceMode: state.performanceMode,
        showShapeInfo: state.showShapeInfo
      })
    }
  )
);