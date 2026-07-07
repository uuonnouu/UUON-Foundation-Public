import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';

interface ObjectInfoPanelProps {
  parameters: any;
}

// Simplified object information database
const OBJECT_INFO: Record<string, {
  name: string;
  category: string;
  vertices?: number;
  faces?: number;
  edges?: number;
  description: string;
}> = {
  cube: {
    name: "Cube",
    category: "Basic Polygons",
    vertices: 8,
    faces: 6,
    edges: 12,
    description: "Perfect cube with spacetime dynamics coordinates"
  },
  triangular_prism: {
    name: "Triangular Prism",
    category: "Basic Polygons",
    vertices: 6,
    faces: 5,
    edges: 9,
    description: "3-sided prism with triangular cross-section"
  },
  tetrahedron: {
    name: "Tetrahedron",
    category: "Pyramids",
    vertices: 4,
    faces: 4,
    edges: 6,
    description: "Regular tetrahedron with equilateral triangular faces"
  },
  GRAVITY_WELL: {
    name: "Gravity Well",
    category: "Gravitational Objects",
    description: "Conscious gravitational field with entropy"
  },
  clifford_torus: {
    name: "Clifford Torus",
    category: "4D Objects",
    description: "Flat torus embedded in 4D space"
  },
  hypercylinder: {
    name: "Hypercylinder",
    category: "4D Objects",
    description: "4D cylinder extension"
  },
  hyperellipsoid_4d: {
    name: "4D Hyperellipsoid",
    category: "4D Objects",
    description: "4D ellipsoid generalization"
  },
  klein_bottle_4d: {
    name: "Klein Bottle 4D",
    category: "4D Objects",
    description: "Non-orientable 4D Klein bottle"
  },
  cell_24: {
    name: "24-Cell (Icositetrachoron)",
    category: "4D Objects",
    vertices: 24,
    faces: 96,
    edges: 96,
    description: "4D polytope with 24 octahedral cells"
  },
  langlands_correspondence_4d: {
    name: "4D Geometric Langlands",
    category: "Mathematical Correspondence",
    description: "S-duality equivalence: D-modules ⟷ O-modules. Kapustin-Witten N=4 SYM with TQFT compactification"
  },
  topological_quantum_field_theory_4d: {
    name: "4D Topological Quantum Field Theory",
    category: "Quantum Topology",
    description: "TQFT invariants of smooth 4-manifolds. Donaldson-Seiberg-Witten theory with potential to prove 4D smooth Poincaré conjecture"
  }
};

export default function ObjectInfoPanel({ parameters }: ObjectInfoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const objectInfo = OBJECT_INFO[parameters.type];
  
  // Format parameter values in calculator style with single decimal
  const formatValue = (value: number) => {
    return Number(value).toFixed(1);
  };

  // Get all parameter values (23-parameter system)
  const allParameters = [
    'uMin', 'uMax', 'vMin', 'vMax', 'uSegments', 'vSegments',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'
  ];

  const activeParams = allParameters
    .filter(param => parameters[param] !== undefined)
    .map(param => ({
      name: param,
      value: parameters[param]
    }));

  // Object name fallback
  const objectName = objectInfo?.name || 
    parameters.type?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 
    'Unknown Object';

  const category = objectInfo?.category || 'Mathematical Object';
  const description = objectInfo?.description || 'Mathematical surface with parametric definition';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-700 text-white z-40">
      {/* Collapsible Tab */}
      <div 
        className="flex items-center justify-center py-1 px-4 cursor-pointer hover:bg-gray-800/50 transition-colors border-b border-gray-600"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-400">{objectName}</span>
          <span className="text-xs text-gray-400">({activeParams.length}/29)</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-2 border-t border-gray-600">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Object Information */}
              <div className="lg:col-span-1">
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-400">Category:</span> <span className="text-cyan-300">{category}</span></div>
                  <div><span className="text-gray-400">Description:</span> <span className="text-gray-200">{description}</span></div>
                  {objectInfo?.vertices && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div><span className="text-gray-400">Vertices:</span> <span className="text-green-300">{objectInfo.vertices}</span></div>
                      {objectInfo.faces && <div><span className="text-gray-400">Faces:</span> <span className="text-blue-300">{objectInfo.faces}</span></div>}
                      {objectInfo.edges && <div><span className="text-gray-400">Edges:</span> <span className="text-yellow-300">{objectInfo.edges}</span></div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Active Parameters */}
              <div className="lg:col-span-2">
                <h4 className="text-md font-semibold text-cyan-400 mb-2">
                  Connected Parameters ({activeParams.length}/29)
                </h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 text-xs max-h-20 overflow-y-auto">
                  {activeParams.map(({ name, value }) => (
                    <div key={name} className="bg-gray-800/60 rounded px-1.5 py-0.5 border border-gray-700 min-w-0">
                      <div className="text-gray-400 uppercase font-mono text-[10px] truncate">{name}</div>
                      <div className="text-white font-mono text-xs font-bold truncate">{formatValue(Number(value))}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}