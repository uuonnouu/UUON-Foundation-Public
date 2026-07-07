import React from 'react';
import { SurfaceParameters } from '../types/math';
import { getShapeInfo, getShapeMathBasis, getShapeDescription } from '../lib/shapeInfo';

interface ShapeInfoDisplayProps {
  parameters: SurfaceParameters;
  className?: string;
}

export default function ShapeInfoDisplay({ parameters, className = "" }: ShapeInfoDisplayProps) {
  const shapeInfo = getShapeInfo(parameters.type, parameters);
  const mathBasis = getShapeMathBasis(parameters.type);
  const description = getShapeDescription(parameters.type);

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-7xl bg-black/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-cyan-300 text-white z-10 ${className}`}>
      <div className="flex items-center justify-between space-x-6 text-xs">
        {/* Left section - Shape name and basic info */}
        <div className="flex items-center space-x-3 flex-shrink-0 font-mono">
          <span className="text-cyan-300 font-bold">{shapeInfo}</span>
        </div>
        
        {/* Center section - Mathematical basis */}
        <div className="flex-1 text-blue-300 font-mono text-center truncate px-2">
          {mathBasis}
        </div>
        
        {/* Right section - Technical details and UV ranges */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="text-gray-300 max-w-xs truncate">
            {description}
          </div>
          <div className="text-green-300 font-mono whitespace-nowrap">
            UV: [{parameters.uMin.toFixed(2)}, {parameters.uMax.toFixed(2)}] × [{parameters.vMin.toFixed(2)}, {parameters.vMax.toFixed(2)}] | Segs: {parameters.uSegments}×{parameters.vSegments}
          </div>
        </div>
      </div>
    </div>
  );
}