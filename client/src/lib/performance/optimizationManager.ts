import * as THREE from 'three';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  triangleCount: number;
  drawCalls: number;
  memoryUsage: number;
}

export interface OptimizationSettings {
  adaptiveQuality: boolean;
  levelOfDetail: boolean;
  frustumCulling: boolean;
  occlusion: boolean;
  geometryInstancing: boolean;
  textureCompression: boolean;
  maxTriangles: number;
  targetFPS: number;
}

export class OptimizationManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private settings: OptimizationSettings;
  private metrics: PerformanceMetrics;
  private frameCount: number = 0;
  private lastTime: number = 0;
  private geometryCache: Map<string, THREE.BufferGeometry> = new Map();
  private materialCache: Map<string, THREE.Material> = new Map();

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.settings = this.getDefaultSettings();
    this.metrics = this.getDefaultMetrics();
  }

  private getDefaultSettings(): OptimizationSettings {
    return {
      adaptiveQuality: true,
      levelOfDetail: true,
      frustumCulling: true,
      occlusion: false,
      geometryInstancing: true,
      textureCompression: true,
      maxTriangles: 100000,
      targetFPS: 60
    };
  }

  private getDefaultMetrics(): PerformanceMetrics {
    return {
      fps: 60,
      frameTime: 16.67,
      triangleCount: 0,
      drawCalls: 0,
      memoryUsage: 0
    };
  }

  updateMetrics(deltaTime: number): void {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.metrics.fps = this.frameCount;
      this.metrics.frameTime = (currentTime - this.lastTime) / this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    // Update renderer info
    const info = this.renderer.info;
    this.metrics.triangleCount = info.render.triangles;
    this.metrics.drawCalls = info.render.calls;
    this.metrics.memoryUsage = info.memory.geometries + info.memory.textures;
  }

  optimizeGeometry(geometry: THREE.BufferGeometry, key: string): THREE.BufferGeometry {
    // Check cache first
    const cached = this.geometryCache.get(key);
    if (cached) return cached;

    // Apply optimizations
    let optimized = geometry.clone();
    
    // Merge vertices
    optimized = this.mergeVertices(optimized);
    
    // Compute normals if missing
    if (!optimized.attributes.normal) {
      optimized.computeVertexNormals();
    }

    // Simplify if too many triangles
    if (this.settings.levelOfDetail && this.getTriangleCount(optimized) > this.settings.maxTriangles) {
      optimized = this.simplifyGeometry(optimized);
    }

    // Cache the result
    this.geometryCache.set(key, optimized);
    return optimized;
  }

  private mergeVertices(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    // Simple vertex merging - in production, use BufferGeometryUtils.mergeVertices
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    return geometry;
  }

  private simplifyGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    // Basic LOD - reduce segments based on distance
    const simplified = geometry.clone();
    
    // For parametric surfaces, reduce segments
    if (geometry.attributes.position) {
      const positions = geometry.attributes.position.array;
      const targetVertices = Math.min(positions.length / 3, this.settings.maxTriangles * 3);
      
      if (positions.length / 3 > targetVertices) {
        // Simple decimation - take every nth vertex
        const step = Math.ceil((positions.length / 3) / targetVertices);
        const newPositions = [];
        
        for (let i = 0; i < positions.length; i += step * 3) {
          newPositions.push(positions[i], positions[i + 1], positions[i + 2]);
        }
        
        simplified.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
        simplified.computeVertexNormals();
      }
    }
    
    return simplified;
  }

  private getTriangleCount(geometry: THREE.BufferGeometry): number {
    if (geometry.index) {
      return geometry.index.count / 3;
    }
    return geometry.attributes.position.count / 3;
  }

  optimizeMaterial(material: THREE.Material, key: string): THREE.Material {
    const cached = this.materialCache.get(key);
    if (cached) return cached;

    const optimized = material.clone();
    
    // Reduce shader complexity based on performance
    if (this.metrics.fps < this.settings.targetFPS * 0.8) {
      if (optimized instanceof THREE.MeshStandardMaterial) {
        optimized.roughness = 0.5;
        optimized.metalness = 0.0;
      }
    }

    this.materialCache.set(key, optimized);
    return optimized;
  }

  adaptiveQualityUpdate(): void {
    if (!this.settings.adaptiveQuality) return;

    const targetFPS = this.settings.targetFPS;
    const currentFPS = this.metrics.fps;
    
    if (currentFPS < targetFPS * 0.8) {
      // Reduce quality
      this.settings.maxTriangles = Math.max(10000, this.settings.maxTriangles * 0.8);
      this.clearCaches();
    } else if (currentFPS > targetFPS * 1.1) {
      // Increase quality
      this.settings.maxTriangles = Math.min(200000, this.settings.maxTriangles * 1.1);
      this.clearCaches();
    }
  }

  clearCaches(): void {
    // Dispose of cached geometries
    this.geometryCache.forEach(geometry => geometry.dispose());
    this.geometryCache.clear();
    
    // Dispose of cached materials
    this.materialCache.forEach(material => material.dispose());
    this.materialCache.clear();
  }

  updateSettings(newSettings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.clearCaches();
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  dispose(): void {
    this.clearCaches();
  }
}

export default OptimizationManager;