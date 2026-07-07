import { SurfaceParameters } from "../../../shared/schema";
import { getSurfaceEquation } from "./parametricSurfaces";

export interface SurfaceData {
  vertices: number[];
  normals: number[];
  uvs: number[];
  indices: number[];
}

export function generateParametricSurface(parameters: SurfaceParameters): SurfaceData {
  // Adaptive Level of Detail system - no hard limits!
  const complexity = parameters.uSegments * parameters.vSegments;
  const deviceMemory = (navigator as any).deviceMemory || 4; // GB
  const maxComplexity = deviceMemory * 50000; // Scale with device capability

  let uSegments = parameters.uSegments;
  let vSegments = parameters.vSegments;

  if (complexity > maxComplexity) {
    const scaleFactor = Math.sqrt(maxComplexity / complexity);
    uSegments = Math.floor(uSegments * scaleFactor);
    vSegments = Math.floor(vSegments * scaleFactor);
  }

  // Ensure minimum quality
  uSegments = Math.max(uSegments, 10);
  vSegments = Math.max(vSegments, 10);

  // Use safe parameters
  const safeParams = {
    ...parameters,
    uSegments: uSegments,
    vSegments: vSegments
  };
  const { uMin, uMax, vMin, vMax } = safeParams;
  const { a, b, c, d, e, f, g, h, i: iParam, j: jParam, k, l, m, n, o, p, q, r, s, t, u: uParam, v: vParam, w, type } = safeParams;

  const equation = getSurfaceEquation(type);

  const vertices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const uStep = (uMax - uMin) / uSegments;
  const vStep = (vMax - vMin) / vSegments;

  // Generate vertices and UVs
  for (let i = 0; i <= vSegments; i++) {
    const v = vMin + i * vStep;

    for (let j = 0; j <= uSegments; j++) {
      const u = uMin + j * uStep;

      try {
        const x = equation.x(u, v, a, b, c, d, e, f, g, h, iParam, jParam, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w);
        const y = equation.y(u, v, a, b, c, d, e, f, g, h, iParam, jParam, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w);
        const z = equation.z(u, v, a, b, c, d, e, f, g, h, iParam, jParam, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w);

        // Validate the computed values
        if (isFinite(x) && isFinite(y) && isFinite(z)) {
          vertices.push(x, y, z);
        } else {
          // Fallback to origin if computation fails
          vertices.push(0, 0, 0);
        }

        // UV coordinates
        uvs.push(j / uSegments, i / vSegments);
      } catch (error) {
        // Fallback for computation errors
        vertices.push(0, 0, 0);
        uvs.push(j / uSegments, i / vSegments);
      }
    }
  }

  // Generate indices for triangular faces
  for (let i = 0; i < vSegments; i++) {
    for (let j = 0; j < uSegments; j++) {
      const a = i * (uSegments + 1) + j;
      const b = a + uSegments + 1;
      const c = a + 1;
      const d = b + 1;

      // Two triangles per quad
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  // Calculate normals using cross product
  const computedNormals = computeNormals(vertices, indices);
  normals.push(...computedNormals);

  return {
    vertices,
    normals,
    uvs,
    indices
  };
}

function computeNormals(vertices: number[], indices: number[]): number[] {
  const normals = new Array(vertices.length).fill(0);

  // Calculate face normals and accumulate vertex normals
  for (let i = 0; i < indices.length; i += 3) {
    const i1 = indices[i] * 3;
    const i2 = indices[i + 1] * 3;
    const i3 = indices[i + 2] * 3;

    // Get vertices
    const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
    const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
    const v3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];

    // Calculate edges
    const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
    const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

    // Calculate cross product (normal)
    const normal = [
      edge1[1] * edge2[2] - edge1[2] * edge2[1],
      edge1[2] * edge2[0] - edge1[0] * edge2[2],
      edge1[0] * edge2[1] - edge1[1] * edge2[0]
    ];

    // Normalize
    const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
    if (length > 0) {
      normal[0] /= length;
      normal[1] /= length;
      normal[2] /= length;
    }

    // Accumulate normals for each vertex
    for (const idx of [i1, i2, i3]) {
      normals[idx] += normal[0];
      normals[idx + 1] += normal[1];
      normals[idx + 2] += normal[2];
    }
  }

  // Normalize accumulated normals
  for (let i = 0; i < normals.length; i += 3) {
    const length = Math.sqrt(normals[i] * normals[i] + normals[i + 1] * normals[i + 1] + normals[i + 2] * normals[i + 2]);
    if (length > 0) {
      normals[i] /= length;
      normals[i + 1] /= length;
      normals[i + 2] /= length;
    } else {
      // Default normal pointing up
      normals[i] = 0;
      normals[i + 1] = 0;
      normals[i + 2] = 1;
    }
  }

  return normals;
}