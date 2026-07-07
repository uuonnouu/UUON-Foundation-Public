import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Monitor, Zap, AlertTriangle, TrendingUp } from 'lucide-react';
import { performanceMonitor, PerformanceMetrics } from '../lib/performance/performanceMonitor';

interface PerformanceOverlayProps {
  onOptimizationToggle: (enabled: boolean) => void;
  onQualityChange: (level: 'high' | 'medium' | 'low') => void;
}

export default function PerformanceOverlay({ 
  onOptimizationToggle, 
  onQualityChange 
}: PerformanceOverlayProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>(performanceMonitor.getMetrics());
  const [isVisible, setIsVisible] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      
      // Auto-optimization logic
      if (autoOptimize) {
        if (newMetrics.fps < 20) {
          onQualityChange('low');
        } else if (newMetrics.fps < 30) {
          onQualityChange('medium');
        } else if (newMetrics.fps > 50) {
          onQualityChange('high');
        }
      }
    });

    return unsubscribe;
  }, [autoOptimize, onQualityChange]);

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const performanceLevel = performanceMonitor.getPerformanceLevel();
  const suggestions = performanceMonitor.getOptimizationSuggestions();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Performance Panel */}
      {isVisible && (
        <Card className="w-72 mb-2 bg-black/90 backdrop-blur-sm border-cyan-500/30">
          <CardContent className="p-4 space-y-4">
            {/* Performance Status */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-cyan-400">Performance Monitor</h3>
              <Badge className={`${getPerformanceColor(performanceLevel)} text-white`}>
                {performanceLevel.toUpperCase()}
              </Badge>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-800/50 p-2 rounded">
                <div className="text-gray-400">FPS</div>
                <div className="text-cyan-400 font-mono text-lg">
                  {Math.round(metrics.fps)}
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-2 rounded">
                <div className="text-gray-400">Frame Time</div>
                <div className="text-cyan-400 font-mono text-lg">
                  {metrics.frameTime.toFixed(1)}ms
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-2 rounded">
                <div className="text-gray-400">Triangles</div>
                <div className="text-cyan-400 font-mono text-lg">
                  {(metrics.triangleCount / 1000).toFixed(0)}K
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-2 rounded">
                <div className="text-gray-400">Memory</div>
                <div className="text-cyan-400 font-mono text-lg">
                  {metrics.memoryUsage.toFixed(0)}MB
                </div>
              </div>
            </div>

            {/* Quality Controls */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-200">Quality Level</div>
              <div className="flex space-x-1">
                {['high', 'medium', 'low'].map((level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant="outline"
                    onClick={() => onQualityChange(level as 'high' | 'medium' | 'low')}
                    className="flex-1 h-8 text-xs bg-black/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                  >
                    {level === 'high' && <Zap className="h-3 w-3 mr-1" />}
                    {level === 'medium' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {level === 'low' && <Monitor className="h-3 w-3 mr-1" />}
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Auto-Optimization Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">Auto-Optimize</span>
              <Button
                size="sm"
                variant={autoOptimize ? "default" : "outline"}
                onClick={() => {
                  setAutoOptimize(!autoOptimize);
                  onOptimizationToggle(!autoOptimize);
                }}
                className="h-6 px-2 text-xs"
              >
                {autoOptimize ? 'On' : 'Off'}
              </Button>
            </div>

            {/* Performance Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center space-x-1 text-sm text-yellow-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Optimization Suggestions</span>
                </div>
                <div className="space-y-1">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <div 
                      key={index}
                      className="text-xs text-yellow-300 bg-yellow-500/10 p-2 rounded"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Real-time Graph (Simple bars) */}
            <div className="space-y-2">
              <div className="text-sm text-gray-200">Performance Trend</div>
              <div className="flex items-end space-x-1 h-12 bg-gray-800/30 p-2 rounded">
                {/* Simple performance bars */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const height = Math.max(2, (metrics.fps / 60) * 100);
                  return (
                    <div
                      key={i}
                      className="bg-cyan-400 flex-1 rounded-sm opacity-70"
                      style={{ height: `${Math.min(height, 100)}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Toggle Button */}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsVisible(!isVisible)}
        className="w-full bg-black/80 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
      >
        <Monitor className="h-4 w-4 mr-1" />
        Performance
      </Button>
    </div>
  );
}