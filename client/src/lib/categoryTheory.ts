import { SurfaceEquation } from './parametricSurfaces';

/**
 * Category Theory Visualizations
 * Abstract mathematical structures representing categories, functors, and natural transformations
 */

export const CATEGORY_THEORY: Record<string, SurfaceEquation> = {
  // Functor Mappings - Morphism preservation between categories
  functor_mapping: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      // Category A objects and morphisms
      const categoryA = Math.floor(u * 2); // Two categories
      const morphismIndex = Math.floor(v * 6); // Six morphisms per category
      
      if (categoryA === 0) {
        // Source category - objects as nodes
        const objectPositions = [
          [0, 0], [a, 0], [a * 2, 0],  // Objects A, B, C
          [0, b], [a, b], [a * 2, b]   // Objects D, E, F
        ];
        
        const objIndex = morphismIndex % 6;
        const pos = objectPositions[objIndex];
        
        // Morphism arrows between objects
        const t_param = v * 6 - Math.floor(v * 6);
        const nextIndex = (objIndex + 1) % 6;
        const nextPos = objectPositions[nextIndex];
        
        return pos[0] + t_param * (nextPos[0] - pos[0]) + c * Math.sin(d * u + e * v) * 0.1;
      } else {
        // Target category - functorially mapped objects
        const mappedPositions = [
          [f, g], [f + a * h, g], [f + a * 2 * h, g],
          [f, g + b * h], [f + a * h, g + b * h], [f + a * 2 * h, g + b * h]
        ];
        
        const objIndex = morphismIndex % 6;
        const pos = mappedPositions[objIndex];
        
        const t_param = v * 6 - Math.floor(v * 6);
        const nextIndex = (objIndex + 1) % 6;
        const nextPos = mappedPositions[nextIndex];
        
        return pos[0] + t_param * (nextPos[0] - pos[0]) + i * Math.sin(j * u + k * v) * 0.08;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const categoryA = Math.floor(u * 2);
      const morphismIndex = Math.floor(v * 6);
      
      if (categoryA === 0) {
        const objectPositions = [
          [0, 0], [a, 0], [a * 2, 0],
          [0, b], [a, b], [a * 2, b]
        ];
        
        const objIndex = morphismIndex % 6;
        const pos = objectPositions[objIndex];
        
        const t_param = v * 6 - Math.floor(v * 6);
        const nextIndex = (objIndex + 1) % 6;
        const nextPos = objectPositions[nextIndex];
        
        return pos[1] + t_param * (nextPos[1] - pos[1]) + d * Math.cos(c * u + e * v) * 0.1;
      } else {
        const mappedPositions = [
          [f, g], [f + a * h, g], [f + a * 2 * h, g],
          [f, g + b * h], [f + a * h, g + b * h], [f + a * 2 * h, g + b * h]
        ];
        
        const objIndex = morphismIndex % 6;
        const pos = mappedPositions[objIndex];
        
        const t_param = v * 6 - Math.floor(v * 6);
        const nextIndex = (objIndex + 1) % 6;
        const nextPos = mappedPositions[nextIndex];
        
        return pos[1] + t_param * (nextPos[1] - pos[1]) + j * Math.cos(i * u + k * v) * 0.08;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const categoryA = Math.floor(u * 2);
      
      // Height separation between source and target categories
      const baseHeight = categoryA * l;
      
      // Functor "bridge" connecting categories
      const bridgeHeight = m * Math.sin(Math.PI * u) * Math.exp(-Math.abs(u - 0.5) * n);
      
      return baseHeight + bridgeHeight + o * Math.sin(p * u + q * v) * 0.05;
    }
  },

  // Natural Transformations - Component-wise transformations between functors
  natural_transformation: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      // Two parallel functors F and G
      const functorLayer = Math.floor(v * 2); // F or G
      const objectIndex = Math.floor(u * 4); // 4 objects in category
      
      // Base category objects
      const baseObjects = [
        [0, 0], [a, 0], [a, a], [0, a]
      ];
      
      const obj = baseObjects[objectIndex % 4];
      
      if (functorLayer === 0) {
        // Functor F mapping
        return obj[0] + b * functorLayer + c * Math.sin(d * u + e * v) * 0.1;
      } else {
        // Functor G mapping  
        return obj[0] + b * functorLayer + f * (1 + g * Math.cos(h * u)) + i * Math.sin(j * u + k * v) * 0.08;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const functorLayer = Math.floor(v * 2);
      const objectIndex = Math.floor(u * 4);
      
      const baseObjects = [
        [0, 0], [a, 0], [a, a], [0, a]
      ];
      
      const obj = baseObjects[objectIndex % 4];
      
      if (functorLayer === 0) {
        return obj[1] + d * Math.cos(c * u + e * v) * 0.1;
      } else {
        return obj[1] + g * (1 + h * Math.sin(i * u)) + j * Math.cos(k * u + l * v) * 0.08;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const functorLayer = Math.floor(v * 2);
      const objectIndex = Math.floor(u * 4);
      
      // Natural transformation components connect F and G
      const componentHeight = functorLayer * m;
      
      // Natural transformation "arrows" between functors
      const transformationFlow = n * v * (1 - v) * 4; // Parabolic flow between layers
      
      return componentHeight + transformationFlow + o * Math.sin(p * u + q * v) * 0.06;
    }
  },

  // Adjoint Functors - Left/right adjoint relationship structures
  adjoint_functors: {
    x: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      // Left adjoint F ⊣ Right adjoint G
      const adjointSide = Math.floor(u * 2); // Left or right adjoint
      const unitCounit = Math.floor(v * 2); // Unit or counit
      
      if (adjointSide === 0) {
        // Left adjoint F: C → D
        const categoryC = [
          [-a, 0], [0, 0], [a, 0]  // Objects in category C
        ];
        
        const objIndex = Math.floor((u * 2 - adjointSide) * 3) % 3;
        const pos = categoryC[objIndex];
        
        // Unit transformation: Id_C → GF
        const unitTransform = unitCounit * b * Math.sin(c * u + d * v);
        
        return pos[0] + unitTransform + e * Math.sin(f * u + g * v) * 0.1;
      } else {
        // Right adjoint G: D → C
        const categoryD = [
          [-a + h, i], [h, i], [a + h, i]  // Objects in category D
        ];
        
        const objIndex = Math.floor((u * 2 - adjointSide) * 3) % 3;
        const pos = categoryD[objIndex];
        
        // Counit transformation: FG → Id_D
        const counitTransform = (1 - unitCounit) * j * Math.cos(k * u + l * v);
        
        return pos[0] + counitTransform + m * Math.sin(n * u + o * v) * 0.08;
      }
    },
    y: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const adjointSide = Math.floor(u * 2);
      const unitCounit = Math.floor(v * 2);
      
      if (adjointSide === 0) {
        const categoryC = [
          [-a, 0], [0, 0], [a, 0]
        ];
        
        const objIndex = Math.floor((u * 2 - adjointSide) * 3) % 3;
        const pos = categoryC[objIndex];
        
        const unitTransform = unitCounit * b * Math.cos(c * u + d * v);
        
        return pos[1] + unitTransform + f * Math.cos(e * u + g * v) * 0.1;
      } else {
        const categoryD = [
          [-a + h, i], [h, i], [a + h, i]
        ];
        
        const objIndex = Math.floor((u * 2 - adjointSide) * 3) % 3;
        const pos = categoryD[objIndex];
        
        const counitTransform = (1 - unitCounit) * j * Math.sin(k * u + l * v);
        
        return pos[1] + counitTransform + n * Math.cos(m * u + o * v) * 0.08;
      }
    },
    z: (u, v, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, uParam, vParam, w) => {
      const adjointSide = Math.floor(u * 2);
      const unitCounit = Math.floor(v * 2);
      
      // Adjunction creates "spiral" connection between left and right adjoints
      const adjunctionSpiral = p * u * Math.sin(q * v * 2 * Math.PI);
      
      // Height based on which adjoint and which transformation
      const baseHeight = adjointSide * r + unitCounit * s * 0.5;
      
      return baseHeight + adjunctionSpiral + t * Math.sin(u * v * Math.PI) * 0.1;
    }
  }
};

/**
 * Get category theory information for display
 */
export function getCategoryTheoryInfo(type: string): {
  name: string;
  description: string;
  concept: string;
  applications: string;
  structure: string;
} {
  const info = {
    functor_mapping: {
      name: "Functor Mapping",
      description: "Structure-preserving mapping between categories that preserves morphism composition",
      concept: "F: C → D preserves identity morphisms and composition",
      applications: "Abstract algebra, topology, computer science type theory",
      structure: "Objects mapped to objects, morphisms to morphisms"
    },
    natural_transformation: {
      name: "Natural Transformation",
      description: "Systematic way of transforming one functor into another while preserving categorical structure",
      concept: "Component-wise transformation between parallel functors F, G: C → D",
      applications: "Homological algebra, algebraic topology, programming language semantics",
      structure: "Natural components form commutative squares"
    },
    adjoint_functors: {
      name: "Adjoint Functors",
      description: "Pair of functors F ⊣ G where F is left adjoint to G, expressing optimal approximation",
      concept: "Hom(F(A), B) ≅ Hom(A, G(B)) naturally in A and B",
      applications: "Algebraic geometry, logic, optimization theory",
      structure: "Unit-counit adjunction with triangle identities"
    }
  };

  return (info as any)[type] || {
    name: "Unknown Category Theory Structure",
    description: "Abstract categorical construction",
    concept: "Category theory concept",
    applications: "Mathematical foundations",
    structure: "Categorical structure"
  };
}