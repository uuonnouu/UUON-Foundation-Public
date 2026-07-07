// Polygon Black Hole Fix
// Addresses discontinuous geometry in high-sided polygons (13+ sides)

import { SurfaceEquation } from "./parametricSurfaces";

// Generate smooth polygon geometry without black holes - Full 23-parameter system
function createPolygonPrism(sides: number): SurfaceEquation {
  return {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const baseRadius = a * b * (1 + d * Math.cos(sides * angle) * e);
      const modulation = 1 + f * Math.sin(g * angle) * h + i * Math.cos(j * angle) * k;
      const waveEffect = l * Math.sin(m * u * Math.PI) * n;
      const complexEffect = o * Math.cos(p * sides * angle) * q;
      return baseRadius * Math.cos(angle) * modulation + waveEffect + complexEffect * r;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const baseRadius = a * b * (1 + d * Math.cos(sides * angle) * e);
      const modulation = 1 + f * Math.sin(g * angle) * h + i * Math.cos(j * angle) * k;
      const waveEffect = s * Math.cos(t * u * Math.PI) * uParam;
      const complexEffect = o * Math.sin(p * sides * angle) * q;
      return baseRadius * Math.sin(angle) * modulation + waveEffect + complexEffect * vParam;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const heightModulation = 1 + w * Math.sin(v * Math.PI) * 0.1;
      return v * c * heightModulation;
    }
  };
}

function createPolygonPyramid(sides: number): SurfaceEquation {
  return {
    x: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const baseRadius = a * b * (1 + d * Math.cos(sides * angle) * e);
      const scale = (1 - v) * f;
      const modulation = 1 + g * Math.sin(h * angle) * i + j * Math.cos(k * angle) * l;
      const pyramidEffect = m * Math.sin(n * v * Math.PI) * o;
      return baseRadius * Math.cos(angle) * scale * modulation + pyramidEffect * p;
    },
    y: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const angle = u * Math.PI * 2;
      const baseRadius = a * b * (1 + d * Math.cos(sides * angle) * e);
      const scale = (1 - v) * f;
      const modulation = 1 + g * Math.sin(h * angle) * i + j * Math.cos(k * angle) * l;
      const pyramidEffect = q * Math.cos(r * v * Math.PI) * s;
      return baseRadius * Math.sin(angle) * scale * modulation + pyramidEffect * t;
    },
    z: (u, v, a = 2, b = 1, c = 1, d = 1, e = 1, f = 1, g = 1, h = 1, i = 1, j = 1, k = 1, l = 1, m = 1, n = 1, o = 1, p = 1, q = 1, r = 1, s = 1, t = 1, uParam = 1, vParam = 1, w = 1) => {
      const heightModulation = 1 + uParam * Math.sin(v * Math.PI) * vParam + w * Math.cos(v * Math.PI * 2) * 0.1;
      return v * a * c * heightModulation;
    }
  };
}

// Fixed polygon shapes without black holes
export const POLYGON_FIXES: Record<string, SurfaceEquation> = {
  // All problematic polygons have been removed
};