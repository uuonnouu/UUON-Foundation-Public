import { SurfaceEquation } from './parametricSurfaces';

/**
 * Riemann Surface Implementations
 * Multi-valued function visualizations with branch cuts and sheets
 */

export const RIEMANN_SURFACES: Record<string, SurfaceEquation> = {
  // Square root function: z^(1/2) - two-sheeted surface
  square_root_riemann: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const rho = a * u + b; // radius
      const theta = c * v + d; // angle parameter
      const sheet = Math.floor(theta / (2 * Math.PI)) % 2; // sheet selection
      const adjustedTheta = theta - 2 * Math.PI * sheet;
      
      // Square root: w = sqrt(z) = sqrt(rho * e^(i*theta))
      const sqrtRho = Math.sqrt(Math.abs(rho));
      const sqrtTheta = adjustedTheta / 2 + sheet * Math.PI;
      
      return sqrtRho * Math.cos(sqrtTheta) + e * sheet * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const rho = a * u + b;
      const theta = c * v + d;
      const sheet = Math.floor(theta / (2 * Math.PI)) % 2;
      const adjustedTheta = theta - 2 * Math.PI * sheet;
      
      const sqrtRho = Math.sqrt(Math.abs(rho));
      const sqrtTheta = adjustedTheta / 2 + sheet * Math.PI;
      
      return sqrtRho * Math.sin(sqrtTheta) + f * sheet * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = c * v + d;
      const sheet = Math.floor(theta / (2 * Math.PI)) % 2;
      
      // Vertical separation between sheets
      return g * sheet + h * Math.sin(u * i) * Math.cos(v * j);
    }
  },

  // Logarithm function: ln(z) - infinite sheeted surface
  logarithm_riemann: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const rho = Math.exp(a * u + b); // |z| = e^u
      const theta = c * v + d; // arg(z) = v
      const sheet = Math.floor(theta / (2 * Math.PI));
      
      // ln(z) = ln|z| + i*arg(z) = u + i*(v + 2πk)
      return rho * Math.cos(theta) + e * 0.01 * sheet;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const rho = Math.exp(a * u + b);
      const theta = c * v + d;
      const sheet = Math.floor(theta / (2 * Math.PI));
      
      return rho * Math.sin(theta) + f * 0.01 * sheet;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = c * v + d;
      const sheet = Math.floor(theta / (2 * Math.PI));
      
      // Height represents the imaginary part of ln(z)
      return g * (theta + 2 * Math.PI * sheet) + h * Math.sin(u * i);
    }
  },

  // Complex exponential: e^z - periodic in imaginary direction
  exponential_riemann: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const realPart = a * u + b;
      const imagPart = c * v + d;
      
      // e^(x + iy) = e^x * (cos(y) + i*sin(y))
      const magnitude = Math.exp(realPart);
      return magnitude * Math.cos(imagPart) + e * Math.sin(f * u) * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const realPart = a * u + b;
      const imagPart = c * v + d;
      
      const magnitude = Math.exp(realPart);
      return magnitude * Math.sin(imagPart) + f * Math.cos(g * u) * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const imagPart = c * v + d;
      
      // Periodic structure in z-direction
      return h * imagPart + i * Math.sin(j * u) * Math.cos(k * v);
    }
  },

  // Nth root function: z^(1/n) - n-sheeted surface
  nth_root_riemann: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const rho = Math.abs(a * u + b);
      const theta = c * v + d;
      const rootOrder = Math.max(2, Math.floor(Math.abs(e) + 2)); // root order
      const sheet = Math.floor(theta / (2 * Math.PI)) % rootOrder;
      const adjustedTheta = theta - 2 * Math.PI * sheet;
      
      // z^(1/n) = rho^(1/n) * e^(i*(theta + 2πk)/n)
      const nthRootRho = Math.pow(rho, 1/rootOrder);
      const nthRootTheta = (adjustedTheta + 2 * Math.PI * sheet) / rootOrder;
      
      return nthRootRho * Math.cos(nthRootTheta) + f * sheet * 0.05;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const rho = Math.abs(a * u + b);
      const theta = c * v + d;
      const rootOrder = Math.max(2, Math.floor(Math.abs(e) + 2));
      const sheet = Math.floor(theta / (2 * Math.PI)) % rootOrder;
      const adjustedTheta = theta - 2 * Math.PI * sheet;
      
      const nthRootRho = Math.pow(rho, 1/rootOrder);
      const nthRootTheta = (adjustedTheta + 2 * Math.PI * sheet) / rootOrder;
      
      return nthRootRho * Math.sin(nthRootTheta) + g * sheet * 0.05;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const theta = c * v + d;
      const rootOrder = Math.max(2, Math.floor(Math.abs(e) + 2));
      const sheet = Math.floor(theta / (2 * Math.PI)) % rootOrder;
      
      // Spiral staircase structure between sheets
      return h * sheet + i * Math.sin(j * u + k * sheet) * Math.cos(l * v);
    }
  },

  // Modular function visualization - fundamental domain
  modular_function: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const tau = { real: a * u + b, imag: Math.abs(c * v + d) + 0.1 }; // τ in upper half-plane
      
      // Modular transformation: (aτ + b)/(cτ + d)
      const numeratorReal = e * tau.real + f;
      const numeratorImag = e * tau.imag;
      const denominatorReal = g * tau.real + h;
      const denominatorImag = g * tau.imag;
      
      const denomMagSq = denominatorReal * denominatorReal + denominatorImag * denominatorImag;
      const resultReal = (numeratorReal * denominatorReal + numeratorImag * denominatorImag) / denomMagSq;
      
      return resultReal + i * Math.sin(j * u) * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const tau = { real: a * u + b, imag: Math.abs(c * v + d) + 0.1 };
      
      const numeratorReal = e * tau.real + f;
      const numeratorImag = e * tau.imag;
      const denominatorReal = g * tau.real + h;
      const denominatorImag = g * tau.imag;
      
      const denomMagSq = denominatorReal * denominatorReal + denominatorImag * denominatorImag;
      const resultImag = (numeratorImag * denominatorReal - numeratorReal * denominatorImag) / denomMagSq;
      
      return resultImag + j * Math.cos(k * v) * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const tau = { real: a * u + b, imag: Math.abs(c * v + d) + 0.1 };
      
      // Height based on imaginary part for visualization
      return l * tau.imag + m * Math.sin(n * u + o * v) * 0.2;
    }
  },

  // Elliptic function - doubly periodic
  elliptic_function: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const z = { real: a * u + b, imag: c * v + d };
      
      // Simplified elliptic function using Jacobi elliptic functions
      const modulus = Math.abs(i); // elliptic modulus
      const sn = Math.sin(j * u) / Math.cosh(k * v); // sn approximation
      const cn = Math.cos(j * u) / Math.cosh(k * v); // cn approximation
      
      return sn + l * Math.sin(m * u + n * v) * 0.1;
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const z = { real: a * u + b, imag: c * v + d };
      
      const modulus = Math.abs(i);
      const sn = Math.sin(j * u) / Math.cosh(k * v);
      const cn = Math.cos(j * u) / Math.cosh(k * v);
      const dn = Math.sqrt(1 - modulus * sn * sn); // dn function
      
      return cn + l * Math.cos(modulus * u + n * v) * 0.1;
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const modulus = Math.abs(i);
      const sn = Math.sin(j * u) / Math.cosh(k * v);
      const dn = Math.sqrt(1 - modulus * sn * sn);
      
      return dn + o * Math.sin(p * u) * Math.cos(q * v) * 0.2;
    }
  }
};

/**
 * Get Riemann surface information for display
 */
export function getRiemannSurfaceInfo(type: string): {
  name: string;
  description: string;
  mathematicalBasis: string;
  sheets: number;
  branchPoints: string;
} {
  const info = {
    square_root_riemann: {
      name: "Square Root Riemann Surface",
      description: "Two-sheeted surface for w = √z with branch cut along negative real axis",
      mathematicalBasis: "Multi-valued square root function z^(1/2)",
      sheets: 2,
      branchPoints: "z = 0 (branch point of order 2)"
    },
    logarithm_riemann: {
      name: "Logarithmic Riemann Surface", 
      description: "Infinite-sheeted helical surface for w = ln(z)",
      mathematicalBasis: "Multi-valued logarithm function ln(z)",
      sheets: Infinity,
      branchPoints: "z = 0 (logarithmic branch point)"
    },
    exponential_riemann: {
      name: "Exponential Riemann Surface",
      description: "Periodic surface for w = e^z showing complex exponential behavior",
      mathematicalBasis: "Complex exponential function e^z",
      sheets: 1,
      branchPoints: "None (entire function)"
    },
    nth_root_riemann: {
      name: "Nth Root Riemann Surface",
      description: "N-sheeted surface for w = z^(1/n) with configurable root order",
      mathematicalBasis: "Multi-valued nth root function z^(1/n)",
      sheets: 0, // Variable based on parameter e
      branchPoints: "z = 0 (branch point of order n)"
    },
    modular_function: {
      name: "Modular Function Surface",
      description: "Fundamental domain visualization of modular transformations",
      mathematicalBasis: "Modular group SL(2,ℤ) acting on upper half-plane",
      sheets: 1,
      branchPoints: "τ = i, ρ = e^(2πi/3) (fixed points)"
    },
    elliptic_function: {
      name: "Elliptic Function Surface",
      description: "Doubly periodic meromorphic function on complex torus",
      mathematicalBasis: "Weierstrass ℘-function and Jacobi elliptic functions",
      sheets: 1,
      branchPoints: "Poles at lattice points"
    }
  };

  return (info as any)[type] || {
    name: "Unknown Riemann Surface",
    description: "Complex analytic surface",
    mathematicalBasis: "Multi-valued complex function",
    sheets: 1,
    branchPoints: "Unknown"
  };
}