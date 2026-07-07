export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  triangleCount: number;
  renderTime: number;
  memoryUsage: number;
  cpuUsage: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private frameTimeSum: number = 0;
  private callbacks: ((metrics: PerformanceMetrics) => void)[] = [];

  constructor() {
    this.metrics = {
      fps: 60,
      frameTime: 16.67,
      triangleCount: 0,
      renderTime: 0,
      memoryUsage: 0,
      cpuUsage: 0
    };
  }

  startFrame(): number {
    return performance.now();
  }

  endFrame(startTime: number, triangleCount: number = 0): void {
    const currentTime = performance.now();
    const frameTime = currentTime - startTime;
    
    this.frameCount++;
    this.frameTimeSum += frameTime;
    this.metrics.triangleCount = triangleCount;
    this.metrics.renderTime = frameTime;

    // Calculate FPS every second
    if (currentTime - this.lastTime >= 1000) {
      this.metrics.fps = this.frameCount;
      this.metrics.frameTime = this.frameTimeSum / this.frameCount;
      
      // Estimate memory usage
      if (performance.memory) {
        this.metrics.memoryUsage = (performance.memory as any).usedJSHeapSize / 1024 / 1024; // MB
      }

      // Reset counters
      this.frameCount = 0;
      this.frameTimeSum = 0;
      this.lastTime = currentTime;

      // Notify callbacks
      this.callbacks.forEach(callback => callback(this.metrics));
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  subscribe(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  isPerformanceGood(): boolean {
    return this.metrics.fps >= 30 && this.metrics.frameTime <= 33.33;
  }

  getPerformanceLevel(): 'excellent' | 'good' | 'fair' | 'poor' {
    if (this.metrics.fps >= 55) return 'excellent';
    if (this.metrics.fps >= 30) return 'good';
    if (this.metrics.fps >= 20) return 'fair';
    return 'poor';
  }

  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = [];
    
    if (this.metrics.fps < 30) {
      suggestions.push('Consider reducing segment count for better performance');
    }
    
    if (this.metrics.triangleCount > 100000) {
      suggestions.push('High triangle count detected - enable Level of Detail');
    }
    
    if (this.metrics.frameTime > 33) {
      suggestions.push('Frame time is high - consider performance mode');
    }
    
    if (this.metrics.memoryUsage > 500) {
      suggestions.push('High memory usage - clear geometry cache');
    }

    return suggestions;
  }
}

export const performanceMonitor = new PerformanceMonitor();