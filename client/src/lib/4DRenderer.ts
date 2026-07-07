// True 4D Expression Methods for Advanced Mathematical Objects
import * as THREE from 'three';

export interface Point4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Point5D {
  x: number;
  y: number;
  z: number;
  w: number;
  u: number;
}

export interface Rotation4D {
  xy: number; // Rotation in XY plane
  xz: number; // Rotation in XZ plane
  xw: number; // Rotation in XW plane
  yz: number; // Rotation in YZ plane
  yw: number; // Rotation in YW plane
  zw: number; // Rotation in ZW plane
}

export interface Rotation5D {
  xy: number; // Rotation in XY plane
  xz: number; // Rotation in XZ plane
  xw: number; // Rotation in XW plane
  xu: number; // Rotation in XU plane
  yz: number; // Rotation in YZ plane
  yw: number; // Rotation in YW plane
  yu: number; // Rotation in YU plane
  zw: number; // Rotation in ZW plane
  zu: number; // Rotation in ZU plane
  wu: number; // Rotation in WU plane
}

export interface FiveDControls {
  position: Point5D;
  rotation: Rotation5D;
  scale: Point5D;
}

export class FourDRenderer {
  private rotation4D: Rotation4D = { xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 };
  private rotation5D: Rotation5D = { xy: 0, xz: 0, xw: 0, xu: 0, yz: 0, yw: 0, yu: 0, zw: 0, zu: 0, wu: 0 };
  private fiveDControls: FiveDControls = {
    position: { x: 0, y: 0, z: 0, w: 0, u: 0 },
    rotation: { xy: 0, xz: 0, xw: 0, xu: 0, yz: 0, yw: 0, yu: 0, zw: 0, zu: 0, wu: 0 },
    scale: { x: 1, y: 1, z: 1, w: 1, u: 1 }
  };
  private crossSectionW: number = 0;
  private crossSectionU: number = 0;
  private projectionMethod: 'orthogonal' | 'stereographic' = 'stereographic';

  // 1. Full 4D Coordinates (Mathematical Form)
  public cliffordTorus4D(theta: number, phi: number, a: number = 1, b: number = 1): Point4D {
    return {
      x: a * Math.cos(theta),
      y: a * Math.sin(theta),
      z: b * Math.cos(phi),
      w: b * Math.sin(phi)
    };
  }

  // 2. 4D Cross-Sections (Slicing)
  public crossSection4D(point4D: Point4D, wSlice: number): THREE.Vector3 | null {
    // Only show points within a small tolerance of the w-slice
    const tolerance = 0.1;
    if (Math.abs(point4D.w - wSlice) > tolerance) {
      return null;
    }
    return new THREE.Vector3(point4D.x, point4D.y, point4D.z);
  }

  // 3. 4D Stereographic Projection
  public stereographicProjection(point4D: Point4D): THREE.Vector3 {
    const northPole = 2.0; // Projection from north pole
    const denominator = northPole - point4D.w;
    
    if (Math.abs(denominator) < 1e-6) {
      // Handle point at north pole
      return new THREE.Vector3(0, 0, 1000);
    }
    
    return new THREE.Vector3(
      (2 * point4D.x) / denominator,
      (2 * point4D.y) / denominator,
      (2 * point4D.z) / denominator
    );
  }

  // 4. Interactive 4D Rotation Matrices
  public rotate4D(point: Point4D, rotation: Rotation4D): Point4D {
    let result = { ...point };

    // Apply rotations in all 6 4D planes
    // XY plane rotation
    if (rotation.xy !== 0) {
      const cos_xy = Math.cos(rotation.xy);
      const sin_xy = Math.sin(rotation.xy);
      const newX = result.x * cos_xy - result.y * sin_xy;
      const newY = result.x * sin_xy + result.y * cos_xy;
      result.x = newX;
      result.y = newY;
    }

    // XZ plane rotation
    if (rotation.xz !== 0) {
      const cos_xz = Math.cos(rotation.xz);
      const sin_xz = Math.sin(rotation.xz);
      const newX = result.x * cos_xz - result.z * sin_xz;
      const newZ = result.x * sin_xz + result.z * cos_xz;
      result.x = newX;
      result.z = newZ;
    }

    // XW plane rotation
    if (rotation.xw !== 0) {
      const cos_xw = Math.cos(rotation.xw);
      const sin_xw = Math.sin(rotation.xw);
      const newX = result.x * cos_xw - result.w * sin_xw;
      const newW = result.x * sin_xw + result.w * cos_xw;
      result.x = newX;
      result.w = newW;
    }

    // YZ plane rotation
    if (rotation.yz !== 0) {
      const cos_yz = Math.cos(rotation.yz);
      const sin_yz = Math.sin(rotation.yz);
      const newY = result.y * cos_yz - result.z * sin_yz;
      const newZ = result.y * sin_yz + result.z * cos_yz;
      result.y = newY;
      result.z = newZ;
    }

    // YW plane rotation
    if (rotation.yw !== 0) {
      const cos_yw = Math.cos(rotation.yw);
      const sin_yw = Math.sin(rotation.yw);
      const newY = result.y * cos_yw - result.w * sin_yw;
      const newW = result.y * sin_yw + result.w * cos_yw;
      result.y = newY;
      result.w = newW;
    }

    // ZW plane rotation
    if (rotation.zw !== 0) {
      const cos_zw = Math.cos(rotation.zw);
      const sin_zw = Math.sin(rotation.zw);
      const newZ = result.z * cos_zw - result.w * sin_zw;
      const newW = result.z * sin_zw + result.w * cos_zw;
      result.z = newZ;
      result.w = newW;
    }

    return result;
  }

  // 5. Hypersphere Coordinates (Hopf Coordinates)
  public hopfCoordinates(eta: number, xi1: number, xi2: number, xi3: number): Point4D {
    // Hopf coordinates: (η, ξ₁, ξ₂, ξ₃) where η ∈ [0,π], ξᵢ ∈ [0,2π]
    return {
      x: Math.sin(eta) * Math.cos(xi1),
      y: Math.sin(eta) * Math.sin(xi1) * Math.cos(xi2),
      z: Math.sin(eta) * Math.sin(xi1) * Math.sin(xi2) * Math.cos(xi3),
      w: Math.sin(eta) * Math.sin(xi1) * Math.sin(xi2) * Math.sin(xi3)
    };
  }

  // 6. Time-based 4D Evolution Animation
  public animate4D(basePoint: Point4D, time: number, frequency: number = 1): Point4D {
    // Use time as pseudo-dimension to show 4D evolution
    const timeRotation: Rotation4D = {
      xy: time * frequency * 0.1,
      xz: time * frequency * 0.15,
      xw: time * frequency * 0.2,
      yz: time * frequency * 0.12,
      yw: time * frequency * 0.18,
      zw: time * frequency * 0.14
    };
    
    return this.rotate4D(basePoint, timeRotation);
  }

  // Advanced Projection Methods
  public projectTo3D(point4D: Point4D): THREE.Vector3 {
    switch (this.projectionMethod) {
      case 'stereographic':
        return this.stereographicProjection(point4D);
      case 'orthogonal':
      default:
        // Simple orthogonal projection (ignore w)
        const perspective = 3.0 / (3.0 + Math.abs(point4D.w));
        return new THREE.Vector3(
          point4D.x * perspective,
          point4D.y * perspective,
          point4D.z * perspective
        );
    }
  }

  // Generate 4D Surface Points
  public generate4DSurface(
    equation: (u: number, v: number, t: number) => Point4D,
    uSteps: number = 50,
    vSteps: number = 50,
    time: number = 0
  ): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= uSteps; i++) {
      for (let j = 0; j <= vSteps; j++) {
        const u = i / uSteps;
        const v = j / vSteps;
        
        // Get 4D point
        const point4D = equation(u, v, time);
        
        // Apply 4D rotation
        const rotated4D = this.rotate4D(point4D, this.rotation4D);
        
        // Project to 3D
        const point3D = this.projectTo3D(rotated4D);
        
        points.push(point3D);
      }
    }
    
    return points;
  }

  // Interactive Controls
  public setRotation4D(rotation: Partial<Rotation4D>) {
    this.rotation4D = { ...this.rotation4D, ...rotation };
  }

  public setCrossSection(w: number) {
    this.crossSectionW = w;
  }

  public setProjectionMethod(method: 'orthogonal' | 'stereographic') {
    this.projectionMethod = method;
  }

  // 5D Rotation for advanced 4D objects
  public rotate5D(point: Point5D, rotation: Rotation5D): Point5D {
    let result = { ...point };

    // Apply all 10 possible 5D rotations
    const rotations = [
      { plane: 'xy', cos: Math.cos(rotation.xy), sin: Math.sin(rotation.xy), coords: ['x', 'y'] },
      { plane: 'xz', cos: Math.cos(rotation.xz), sin: Math.sin(rotation.xz), coords: ['x', 'z'] },
      { plane: 'xw', cos: Math.cos(rotation.xw), sin: Math.sin(rotation.xw), coords: ['x', 'w'] },
      { plane: 'xu', cos: Math.cos(rotation.xu), sin: Math.sin(rotation.xu), coords: ['x', 'u'] },
      { plane: 'yz', cos: Math.cos(rotation.yz), sin: Math.sin(rotation.yz), coords: ['y', 'z'] },
      { plane: 'yw', cos: Math.cos(rotation.yw), sin: Math.sin(rotation.yw), coords: ['y', 'w'] },
      { plane: 'yu', cos: Math.cos(rotation.yu), sin: Math.sin(rotation.yu), coords: ['y', 'u'] },
      { plane: 'zw', cos: Math.cos(rotation.zw), sin: Math.sin(rotation.zw), coords: ['z', 'w'] },
      { plane: 'zu', cos: Math.cos(rotation.zu), sin: Math.sin(rotation.zu), coords: ['z', 'u'] },
      { plane: 'wu', cos: Math.cos(rotation.wu), sin: Math.sin(rotation.wu), coords: ['w', 'u'] }
    ];

    rotations.forEach(({ cos, sin, coords }) => {
      const [coord1, coord2] = coords as [keyof Point5D, keyof Point5D];
      const old1 = result[coord1];
      const old2 = result[coord2];
      result[coord1] = old1 * cos - old2 * sin;
      result[coord2] = old1 * sin + old2 * cos;
    });

    return result;
  }

  // 5D to 4D projection (for advanced 4D objects)
  public project5Dto4D(point: Point5D, uSlice: number = 0): Point4D {
    // Project from 5D to 4D by setting u coordinate or slicing
    const tolerance = 0.2;
    const uFactor = Math.exp(-Math.pow(point.u - uSlice, 2) / (2 * tolerance * tolerance));
    
    return {
      x: point.x * uFactor,
      y: point.y * uFactor,
      z: point.z * uFactor,
      w: point.w * uFactor
    };
  }

  // Enhanced 4D object generation with 5D controls
  public generate5DTo4DSurface(
    equation: (u: number, v: number, t: number, controls: FiveDControls) => Point5D,
    uSteps: number = 50,
    vSteps: number = 50,
    time: number = 0
  ): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= uSteps; i++) {
      for (let j = 0; j <= vSteps; j++) {
        const u = i / uSteps;
        const v = j / vSteps;
        
        // Get 5D point with controls
        const point5D = equation(u, v, time, this.fiveDControls);
        
        // Apply 5D transformations
        const transformed5D = this.transform5D(point5D);
        
        // Project to 4D
        const point4D = this.project5Dto4D(transformed5D, this.crossSectionU);
        
        // Apply 4D rotation
        const rotated4D = this.rotate4D(point4D, this.rotation4D);
        
        // Project to 3D
        const point3D = this.projectTo3D(rotated4D);
        
        points.push(point3D);
      }
    }
    
    return points;
  }

  // Apply 5D transformations (position, rotation, scale)
  private transform5D(point: Point5D): Point5D {
    // Apply scale
    let result: Point5D = {
      x: point.x * this.fiveDControls.scale.x,
      y: point.y * this.fiveDControls.scale.y,
      z: point.z * this.fiveDControls.scale.z,
      w: point.w * this.fiveDControls.scale.w,
      u: point.u * this.fiveDControls.scale.u
    };

    // Apply rotation
    result = this.rotate5D(result, this.fiveDControls.rotation);

    // Apply position
    result = {
      x: result.x + this.fiveDControls.position.x,
      y: result.y + this.fiveDControls.position.y,
      z: result.z + this.fiveDControls.position.z,
      w: result.w + this.fiveDControls.position.w,
      u: result.u + this.fiveDControls.position.u
    };

    return result;
  }

  // 5D Controls Setters
  public set5DPosition(position: Partial<Point5D>) {
    this.fiveDControls.position = { ...this.fiveDControls.position, ...position };
  }

  public set5DRotation(rotation: Partial<Rotation5D>) {
    this.fiveDControls.rotation = { ...this.fiveDControls.rotation, ...rotation };
  }

  public set5DScale(scale: Partial<Point5D>) {
    this.fiveDControls.scale = { ...this.fiveDControls.scale, ...scale };
  }

  public setCrossSectionU(u: number) {
    this.crossSectionU = u;
  }

  // Get current states
  public getRotation4D(): Rotation4D {
    return { ...this.rotation4D };
  }

  public get5DControls(): FiveDControls {
    return { 
      position: { ...this.fiveDControls.position },
      rotation: { ...this.fiveDControls.rotation },
      scale: { ...this.fiveDControls.scale }
    };
  }

  // 4D Distance and Metrics
  public distance4D(p1: Point4D, p2: Point4D): number {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2) +
      Math.pow(p1.w - p2.w, 2)
    );
  }

  // 4D Normal Vector Calculation
  public normal4D(
    equation: (u: number, v: number) => Point4D,
    u: number,
    v: number,
    epsilon: number = 1e-6
  ): Point4D {
    const center = equation(u, v);
    const du = equation(u + epsilon, v);
    const dv = equation(u, v + epsilon);
    
    // Approximate partial derivatives
    const partialU = {
      x: (du.x - center.x) / epsilon,
      y: (du.y - center.y) / epsilon,
      z: (du.z - center.z) / epsilon,
      w: (du.w - center.w) / epsilon
    };
    
    const partialV = {
      x: (dv.x - center.x) / epsilon,
      y: (dv.y - center.y) / epsilon,
      z: (dv.z - center.z) / epsilon,
      w: (dv.w - center.w) / epsilon
    };
    
    // 4D cross product (simplified - returns one of many possible normals)
    return {
      x: partialU.y * partialV.z - partialU.z * partialV.y,
      y: partialU.z * partialV.x - partialU.x * partialV.z,
      z: partialU.x * partialV.y - partialU.y * partialV.x,
      w: 0 // Simplified 4D normal
    };
  }
}

// Import 4D to 3D projection formulas
import { FourDTo3DFormulas, ProjectionSettings, DEFAULT_PROJECTION_SETTINGS, SHAPE_4D_FORMULAS } from './4Dto3D_Formulas';

// Export singleton instance
export const fourDRenderer = new FourDRenderer();

// Enhanced 4D Renderer with formula integration
export class Enhanced4DRenderer extends FourDRenderer {
  private projectionSettings: ProjectionSettings = DEFAULT_PROJECTION_SETTINGS;

  // Set projection settings
  public setProjectionSettings(settings: Partial<ProjectionSettings>) {
    this.projectionSettings = { ...this.projectionSettings, ...settings };
  }

  // Generate points using 4D formulas
  public generate4DShapePoints(
    shapeName: keyof typeof SHAPE_4D_FORMULAS,
    uSteps: number = 50,
    vSteps: number = 50,
    ...args: any[]
  ): THREE.Vector3[] {
    const shapeFunction = SHAPE_4D_FORMULAS[shapeName];
    if (!shapeFunction) {
      throw new Error(`4D shape '${shapeName}' not found`);
    }

    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= uSteps; i++) {
      for (let j = 0; j <= vSteps; j++) {
        const u = i / uSteps;
        const v = j / vSteps;
        
        // Call the shape function with projection settings
        const point3D = shapeFunction(u, v, this.projectionSettings, ...args);
        points.push(point3D);
      }
    }
    
    return points;
  }

  // Enhanced surface generation with 4D formula integration
  public generateEnhanced4DSurface(
    shapeName: keyof typeof SHAPE_4D_FORMULAS,
    uSteps: number = 50,
    vSteps: number = 50,
    time: number = 0,
    ...shapeArgs: any[]
  ): THREE.Vector3[] {
    const shapeFunction = SHAPE_4D_FORMULAS[shapeName];
    if (!shapeFunction) {
      console.warn(`4D shape '${shapeName}' not found, falling back to default`);
      return this.generate4DSurface(this.cliffordTorus4D.bind(this), uSteps, vSteps, time);
    }

    return FourDTo3DFormulas.generate4DSurface(
      (u, v, settings) => shapeFunction(u, v, settings, ...shapeArgs),
      uSteps,
      vSteps,
      this.projectionSettings,
      this.getRotation4D()
    );
  }

  // Get current projection settings
  public getProjectionSettings(): ProjectionSettings {
    return { ...this.projectionSettings };
  }
}

// Export enhanced renderer instance
export const enhanced4DRenderer = new Enhanced4DRenderer();