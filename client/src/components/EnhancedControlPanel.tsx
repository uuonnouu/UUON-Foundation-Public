import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertTriangle, Info, Zap, Settings, Undo, Redo, RotateCcw, Search } from 'lucide-react';
import { Input } from './ui/input';
import { SurfaceParameters, VisualizationMode, SurfaceType } from '../../shared/schema';
import { useMathVisualization } from '../lib/stores/useMathVisualization';
import { ParameterValidator, ValidationResult } from '../lib/validation/parameterValidator';
import { OptimizationSettings } from '../lib/performance/optimizationManager';

interface EnhancedControlPanelProps {
  onExport: () => void;
  onOptimizationChange: (settings: Partial<OptimizationSettings>) => void;
}

export default function EnhancedControlPanel({ 
  onExport, 
  onOptimizationChange 
}: EnhancedControlPanelProps) {
  const {
    surfaceParams,
    visualMode,
    colorMode,
    performanceMode,
    showShapeInfo,
    setParameterChange,
    setVisualizationMode,
    setColorMode,
    setPerformanceMode,
    setShowShapeInfo,
    resetParameters,
    undoParameter,
    redoParameter,
    validateParameters
  } = useMathVisualization();

  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [searchQuery, setSearchQuery] = useState('');

  // Validate parameters whenever they change
  const validationResult = useMemo(() => {
    return ParameterValidator.validate(surfaceParams);
  }, [surfaceParams]);

  const handleParameterChange = useCallback((key: keyof SurfaceParameters, value: number) => {
    setParameterChange({ [key]: value });
  }, [setParameterChange]);

  const handleShapeChange = useCallback((type: SurfaceType) => {
    setParameterChange({ type });
  }, [setParameterChange]);

  const handlePerformanceModeChange = useCallback((mode: 'high' | 'medium' | 'low') => {
    setPerformanceMode(mode);
    onOptimizationChange({
      adaptiveQuality: mode !== 'high',
      maxTriangles: mode === 'high' ? 200000 : mode === 'medium' ? 100000 : 50000,
      targetFPS: mode === 'high' ? 60 : mode === 'medium' ? 30 : 15
    });
  }, [setPerformanceMode, onOptimizationChange]);

  const renderParameterSlider = (
    label: string,
    key: keyof SurfaceParameters,
    min: number = -10,
    max: number = 10,
    step: number = 0.00001
  ) => {
    const value = surfaceParams[key] as number;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-200">{label}</label>
          <span className="text-xs text-cyan-400 font-mono">
            {typeof value === 'number' ? value.toFixed(5) : value}
          </span>
        </div>
        <Slider
          value={[typeof value === 'number' ? value : 0]}
          onValueChange={([newValue]) => handleParameterChange(key, newValue)}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
      </div>
    );
  };

  const shapeOptions: { value: SurfaceType; label: string; category: string }[] = [
    // Basic Shapes
    { value: 'triangular_prism', label: '△ Triangular Prism', category: 'Basic' },
    { value: 'square', label: '□ Square', category: 'Basic' },
    { value: 'cube', label: '■ Cube', category: 'Basic' },
    { value: 'pentagonal_prism', label: '⬟ Pentagon Prism', category: 'Basic' },
    { value: 'hexagonal_prism', label: '⬢ Hexagon Prism', category: 'Basic' },
    
    // Cosmic Objects
    { value: 'GRAVITY_WELL', label: '🌀 Gravity Well', category: 'Cosmic' },
    { value: 'WHITE_HOLE', label: '⭐ White Hole', category: 'Cosmic' },
    { value: 'WORMHOLE', label: '🌌 Wormhole', category: 'Cosmic' },
    
    // 4D Objects
    { value: 'cell_16', label: '◈ 16-Cell 4D', category: '4D' },
    { value: 'cell_120', label: '⬟ 120-Cell 4D', category: '4D' },
    { value: 'cell_600', label: '⬢ 600-Cell 4D', category: '4D' },
    { value: 'pentachoron', label: '🔷 Pentachoron 4D', category: '4D' },
    { value: 'hexacosichoron', label: '💎 Hexacosichoron 4D', category: '4D' },
    { value: 'cell_24', label: '◈ 24-Cell 4D', category: '4D' },
    { value: 'klein_bottle_4d', label: '🪐 Klein Bottle 4D', category: '4D' },
    { value: 'hopf_fibration', label: '🎭 Hopf Fibration 4D', category: '4D' },
    { value: 'mobius_4d', label: '♾️ 4D Möbius Strip', category: '4D' },
    { value: 'hypercylinder', label: '🔵 Hypercylinder 4D', category: '4D' },
    { value: 'hyperellipsoid_4d', label: '🥚 4D Hyperellipsoid', category: '4D' },
    { value: 'schlafli_double_six', label: '⚡ Schläfli Double Six 4D', category: '4D' },
    { value: 'hyperprism_4d', label: '📦 4D Hyperprism Family', category: '4D' },
    { value: 'clifford_torus', label: '🟣 Clifford Torus 4D', category: '4D' },
    { value: 'topological_quantum_field_theory_4d', label: '⚛️ 4D Topological Quantum Field Theory', category: '4D' },
    { value: 'langlands_correspondence_4d', label: '🎯 4D Langlands Correspondence', category: '4D' },
    
    // Topology
    { value: 'klein_bottle', label: '🍼 Klein Bottle', category: 'Topology' },
    { value: 'trefoil_knot', label: '🪢 Trefoil Knot', category: 'Topology' },
    { value: 'mobius_4d', label: '∞ Möbius 4D', category: 'Topology' }
  ];

  const colorOptions = [
    { value: 'neon_green', label: 'Neon Green', color: '#00ff41' },
    { value: 'neon_blue', label: 'Neon Blue', color: '#00bfff' },
    { value: 'neon_magenta', label: 'Neon Magenta', color: '#ff00ff' },
    { value: 'neon_orange', label: 'Neon Orange', color: '#ff8c00' },
    { value: 'pure_white', label: 'Pure White', color: '#ffffff' },
    { value: 'pure_black', label: 'Pure Black', color: '#000000' }
  ];

  // Filter shapes based on search query
  const filteredShapeOptions = useMemo(() => {
    if (!searchQuery.trim()) return shapeOptions;
    
    const query = searchQuery.toLowerCase();
    return shapeOptions.filter(option => 
      option.label.toLowerCase().includes(query) ||
      option.value.toLowerCase().includes(query) ||
      option.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 bg-black/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 text-lg">Control Panel</CardTitle>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={undoParameter}
                className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={redoParameter}
                className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetParameters}
                className="h-8 w-8 p-0 text-cyan-400 hover:text-cyan-300"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Validation Status */}
          {validationResult && !validationResult.isValid && (
            <div className="flex items-center space-x-2 text-red-400 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>{validationResult.errors.length} errors found</span>
            </div>
          )}
          
          {validationResult && validationResult.warnings.length > 0 && (
            <div className="flex items-center space-x-2 text-yellow-400 text-sm">
              <Info className="h-4 w-4" />
              <span>{validationResult.warnings.length} warnings</span>
            </div>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Shape Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Search Designs</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for TQFT, Langlands, Klein Bottle..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/50 border-cyan-500/30 text-cyan-400 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Shape Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Shape Type</label>
                <Select value={surfaceParams.type} onValueChange={handleShapeChange}>
                  <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-cyan-500/30">
                    {Object.entries(
                      filteredShapeOptions.reduce((acc, option) => {
                        if (!acc[option.category]) acc[option.category] = [];
                        acc[option.category].push(option);
                        return acc;
                      }, {} as Record<string, typeof filteredShapeOptions>)
                    ).map(([category, options]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs text-gray-400 font-semibold">
                          {category}
                        </div>
                        {options.map((option) => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            className="text-cyan-400 hover:bg-cyan-500/20"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Visualization Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Visualization</label>
                <Select value={visualMode} onValueChange={setVisualizationMode}>
                  <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-cyan-500/30">
                    <SelectItem value="wireframe" className="text-cyan-400">Wireframe</SelectItem>
                    <SelectItem value="surface" className="text-cyan-400">Surface</SelectItem>
                    <SelectItem value="points" className="text-cyan-400">Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Color</label>
                <Select value={colorMode} onValueChange={setColorMode}>
                  <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-cyan-500/30">
                    {colorOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-cyan-400 hover:bg-cyan-500/20"
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-400"
                            style={{ backgroundColor: option.color }}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Basic Parameters */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-cyan-400">UV Ranges</h4>
                {renderParameterSlider('U Min', 'uMin', -10, 10)}
                {renderParameterSlider('U Max', 'uMax', -10, 10)}
                {renderParameterSlider('V Min', 'vMin', -10, 10)}
                {renderParameterSlider('V Max', 'vMax', -10, 10)}
              </div>

              {/* Segments */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-cyan-400">Quality</h4>
                {renderParameterSlider('U Segments', 'uSegments', 1, 500, 1)}
                {renderParameterSlider('V Segments', 'vSegments', 1, 500, 1)}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              {/* Primary Parameters */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-cyan-400">Primary Parameters</h4>
                {renderParameterSlider('Parameter A', 'a')}
                {renderParameterSlider('Parameter B', 'b')}
                {renderParameterSlider('Parameter C', 'c')}
                {renderParameterSlider('Parameter D', 'd')}
              </div>

              {/* Secondary Parameters */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-cyan-400">Secondary Parameters</h4>
                {renderParameterSlider('Parameter E', 'e')}
                {renderParameterSlider('Parameter F', 'f')}
                {renderParameterSlider('Parameter G', 'g')}
                {renderParameterSlider('Parameter H', 'h')}
              </div>

              {/* Extended Parameters */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-cyan-400">Extended Parameters</h4>
                {['i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'].map((param) => (
                  <div key={param}>
                    {renderParameterSlider(`Parameter ${param.toUpperCase()}`, param as keyof SurfaceParameters)}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {/* Performance Mode */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Performance Mode</label>
                <Select value={performanceMode} onValueChange={handlePerformanceModeChange}>
                  <SelectTrigger className="bg-black/50 border-cyan-500/30 text-cyan-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-cyan-500/30">
                    <SelectItem value="high" className="text-cyan-400">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span>High Quality</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium" className="text-cyan-400">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Balanced</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="low" className="text-cyan-400">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Performance</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Performance Info */}
              <div className="space-y-2">
                <div className="text-xs text-gray-400">
                  <div>Target FPS: {performanceMode === 'high' ? '60' : performanceMode === 'medium' ? '30' : '15'}</div>
                  <div>Max Triangles: {performanceMode === 'high' ? '200K' : performanceMode === 'medium' ? '100K' : '50K'}</div>
                </div>
              </div>

              {/* Toggle Features */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-200">Show Shape Info</span>
                  <Button
                    size="sm"
                    variant={showShapeInfo ? "default" : "outline"}
                    onClick={() => setShowShapeInfo(!showShapeInfo)}
                    className="h-6 px-2 text-xs"
                  >
                    {showShapeInfo ? 'On' : 'Off'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="validation" className="space-y-4">
              {validationResult && (
                <div className="space-y-3">
                  {/* Validation Status */}
                  <div className="flex items-center space-x-2">
                    <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                      {validationResult.isValid ? 'Valid' : 'Invalid'}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {validationResult.errors.length} errors, {validationResult.warnings.length} warnings
                    </span>
                  </div>

                  {/* Errors */}
                  {validationResult.errors.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-red-400 mb-2">Errors</h5>
                      <div className="space-y-1">
                        {validationResult.errors.map((error, index) => (
                          <div key={index} className="text-xs text-red-300 bg-red-500/10 p-2 rounded">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warnings */}
                  {validationResult.warnings.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-yellow-400 mb-2">Warnings</h5>
                      <div className="space-y-1">
                        {validationResult.warnings.map((warning, index) => (
                          <div key={index} className="text-xs text-yellow-300 bg-yellow-500/10 p-2 rounded">
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {validationResult.suggestions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-semibold text-blue-400 mb-2">Suggestions</h5>
                      <div className="space-y-1">
                        {validationResult.suggestions.map((suggestion, index) => (
                          <div key={index} className="text-xs text-blue-300 bg-blue-500/10 p-2 rounded">
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-500/30">
          <Button 
            onClick={onExport}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Export Visualization
          </Button>
        </div>
      </div>
    </div>
  );
}