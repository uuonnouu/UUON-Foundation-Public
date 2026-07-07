import * as THREE from 'three';

export interface CustomEquation {
  x: string;
  y: string;
  z: string;
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
}

export interface CustomPlotParameters {
  equation: CustomEquation;
  uSegments: number;
  vSegments: number;
  name?: string;
  description?: string;
}

// Safe math expression evaluator
export function evaluateExpression(expression: string, variables: Record<string, number>): number {
  try {
    // Replace variables in the expression
    let expr = expression;
    Object.keys(variables).forEach(variable => {
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      expr = expr.replace(regex, variables[variable].toString());
    });

    // Replace Math functions with safe equivalents
    expr = expr.replace(/Math\./g, '');
    
    // Create safe math context
    const mathContext = {
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      sqrt: Math.sqrt,
      exp: Math.exp,
      log: Math.log,
      abs: Math.abs,
      pow: Math.pow,
      PI: Math.PI,
      E: Math.E,
      min: Math.min,
      max: Math.max,
      floor: Math.floor,
      ceil: Math.ceil,
      round: Math.round,
      atan2: Math.atan2,
      sinh: Math.sinh,
      cosh: Math.cosh,
      tanh: Math.tanh
    };

    // Use Function constructor for safe evaluation
    const func = new Function(...Object.keys(mathContext), `return ${expr}`);
    return func(...Object.values(mathContext));
  } catch (error) {
    console.warn('Expression evaluation error:', error);
    return 0;
  }
}

// Generate parametric surface from custom equations
export function generateCustomParametricSurface(params: CustomPlotParameters) {
  const { equation, uSegments, vSegments } = params;
  const uMin = equation.uMin ?? -2;
  const uMax = equation.uMax ?? 2;
  const vMin = equation.vMin ?? -2;
  const vMax = equation.vMax ?? 2;

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  // Generate vertices
  for (let i = 0; i <= uSegments; i++) {
    for (let j = 0; j <= vSegments; j++) {
      const u = uMin + (uMax - uMin) * (i / uSegments);
      const v = vMin + (vMax - vMin) * (j / vSegments);

      const x = evaluateExpression(equation.x, { u, v, t: 0 });
      const y = evaluateExpression(equation.y, { u, v, t: 0 });
      const z = evaluateExpression(equation.z, { u, v, t: 0 });

      vertices.push(x, y, z);
      
      // UV coordinates
      uvs.push(i / uSegments, j / vSegments);
    }
  }

  // Generate indices for triangles
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = a + vSegments + 1;
      const c = a + 1;
      const d = b + 1;

      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  // Calculate normals
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();

  const normalAttribute = geometry.getAttribute('normal');
  for (let i = 0; i < normalAttribute.count; i++) {
    normals.push(
      normalAttribute.getX(i),
      normalAttribute.getY(i),
      normalAttribute.getZ(i)
    );
  }

  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    uvs: new Float32Array(uvs),
    indices: new Uint32Array(indices)
  };
}

// Predefined mathematical expressions for common visualizations
export const MATHEMATICAL_EXPRESSIONS: Record<string, CustomEquation> = {
  // Wave Functions
  'gaussian_wave': {
    x: 'u',
    y: 'v', 
    z: 'exp(-(u*u + v*v)) * cos(sqrt(u*u + v*v) * 5)',
    uMin: -3,
    uMax: 3,
    vMin: -3,
    vMax: 3
  },

  // Electromagnetic Field Visualization
  'dipole_field': {
    x: 'u',
    y: 'v',
    z: '1 / sqrt((u*u + v*v + 1)) - 1 / sqrt((u*u + v*v + 1))',
    uMin: -2,
    uMax: 2,
    vMin: -2,
    vMax: 2
  },

  // Quantum Wave Functions
  'hydrogen_orbital': {
    x: 'u * exp(-sqrt(u*u + v*v)) * cos(v)',
    y: 'u * exp(-sqrt(u*u + v*v)) * sin(v)',
    z: 'exp(-sqrt(u*u + v*v)) * cos(u)',
    uMin: 0,
    uMax: 4,
    vMin: 0,
    vMax: 6.28
  },

  // Mathematical Surfaces
  'monkey_saddle': {
    x: 'u',
    y: 'v',
    z: 'u*u*u - 3*u*v*v',
    uMin: -1.5,
    uMax: 1.5,
    vMin: -1.5,
    vMax: 1.5
  },

  'klein_bottle_4d': {
    x: '(2 + cos(v/2)*sin(u) - sin(v/2)*sin(2*u)) * cos(v)',
    y: '(2 + cos(v/2)*sin(u) - sin(v/2)*sin(2*u)) * sin(v)', 
    z: 'sin(v/2)*sin(u) + cos(v/2)*sin(2*u)',
    uMin: 0,
    uMax: 6.28,
    vMin: 0,
    vMax: 6.28
  },

  // Physical Phenomena
  'gravity_well': {
    x: 'u',
    y: 'v',
    z: '-1 / sqrt(u*u + v*v + 0.1)',
    uMin: -3,
    uMax: 3,
    vMin: -3, 
    vMax: 3
  },

  'standing_wave': {
    x: 'u',
    y: 'v',
    z: 'sin(u * 3) * cos(v * 3) * exp(-0.1 * (u*u + v*v))',
    uMin: -5,
    uMax: 5,
    vMin: -5,
    vMax: 5
  }
};

// Generate field lines for vector fields
export interface VectorField {
  fx: string; // x component of field
  fy: string; // y component of field
  fz: string; // z component of field
}

export function generateFieldLines(field: VectorField, startPoints: number[][], stepSize: number = 0.1, maxSteps: number = 100) {
  const fieldLines: number[][][] = [];

  startPoints.forEach(startPoint => {
    const line: number[][] = [];
    let [x, y, z] = startPoint;
    
    for (let step = 0; step < maxSteps; step++) {
      line.push([x, y, z]);

      // Calculate field components at current position
      const fx = evaluateExpression(field.fx, { x, y, z });
      const fy = evaluateExpression(field.fy, { x, y, z });
      const fz = evaluateExpression(field.fz, { x, y, z });

      // Normalize field vector
      const magnitude = Math.sqrt(fx*fx + fy*fy + fz*fz);
      if (magnitude < 0.001) break; // Stop if field is too weak

      // Step along field direction
      x += (fx / magnitude) * stepSize;
      y += (fy / magnitude) * stepSize;
      z += (fz / magnitude) * stepSize;

      // Boundary check
      if (Math.abs(x) > 10 || Math.abs(y) > 10 || Math.abs(z) > 10) break;
    }

    fieldLines.push(line);
  });

  return fieldLines;
}