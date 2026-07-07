import { SurfaceParameters, SurfaceType } from '../../types/math';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface ParameterConstraints {
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;
  required?: boolean;
}

export interface ShapeConstraints {
  [key: string]: ParameterConstraints;
}

export class ParameterValidator {
  private static shapeConstraints: Map<SurfaceType, ShapeConstraints> = new Map([
    ['cube' as SurfaceType, {
      uMin: { min: 0, max: 2, required: true },
      uMax: { min: 0, max: 2, required: true },
      vMin: { min: 0, max: 2, required: true },
      vMax: { min: 0, max: 2, required: true },
      uSegments: { min: 1, max: 500, integer: true, required: true },
      vSegments: { min: 1, max: 500, integer: true, required: true },
      a: { min: -10, max: 10, step: 0.00001 },
      b: { min: -10, max: 10, step: 0.00001 }
    }],
    ['GRAVITY_WELL' as SurfaceType, {
      uMin: { min: -Math.PI, max: Math.PI, required: true },
      uMax: { min: -Math.PI, max: Math.PI, required: true },
      vMin: { min: 0, max: Math.PI, required: true },
      vMax: { min: 0, max: Math.PI, required: true },
      a: { min: 0.1, max: 50, step: 0.01 }, // Event horizon radius
      b: { min: 0.01, max: 10, step: 0.001 }, // Mass parameter
      c: { min: 0, max: 2, step: 0.01 } // Consciousness factor
    }],
    ['klein_bottle' as SurfaceType, {
      uMin: { min: 0, max: 2 * Math.PI, required: true },
      uMax: { min: 0, max: 2 * Math.PI, required: true },
      vMin: { min: 0, max: 2 * Math.PI, required: true },
      vMax: { min: 0, max: 2 * Math.PI, required: true },
      a: { min: 0.5, max: 5, step: 0.1 }, // Tube radius
      b: { min: 1, max: 10, step: 0.1 }   // Major radius
    }]
  ]);

  static validate(parameters: SurfaceParameters): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Basic parameter validation
    this.validateBasicParameters(parameters, result);
    
    // Shape-specific validation
    this.validateShapeParameters(parameters, result);
    
    // Mathematical consistency checks
    this.validateMathematicalConsistency(parameters, result);
    
    // Performance considerations
    this.validatePerformance(parameters, result);

    result.isValid = result.errors.length === 0;
    return result;
  }

  private static validateBasicParameters(params: SurfaceParameters, result: ValidationResult): void {
    // UV range validation
    if (params.uMin >= params.uMax) {
      result.errors.push('uMin must be less than uMax');
    }
    
    if (params.vMin >= params.vMax) {
      result.errors.push('vMin must be less than vMax');
    }

    // Segment validation
    if (params.uSegments < 1 || params.uSegments > 500) {
      result.errors.push('uSegments must be between 1 and 500');
    }
    
    if (params.vSegments < 1 || params.vSegments > 500) {
      result.errors.push('vSegments must be between 1 and 500');
    }

    // Performance warning for high segment counts
    const totalVertices = params.uSegments * params.vSegments;
    if (totalVertices > 50000) {
      result.warnings.push(`High vertex count (${totalVertices}). Consider reducing segments for better performance.`);
    }
  }

  private static validateShapeParameters(params: SurfaceParameters, result: ValidationResult): void {
    const constraints = this.shapeConstraints.get(params.type);
    if (!constraints) return;

    // Validate each parameter against its constraints
    Object.entries(constraints).forEach(([paramName, constraint]) => {
      const value = (params as any)[paramName];
      if (value === undefined) {
        if (constraint.required) {
          result.errors.push(`Parameter ${paramName} is required for ${params.type}`);
        }
        return;
      }

      if (typeof value !== 'number') {
        result.errors.push(`Parameter ${paramName} must be a number`);
        return;
      }

      if (constraint.min !== undefined && value < constraint.min) {
        result.errors.push(`Parameter ${paramName} (${value}) is below minimum (${constraint.min})`);
      }
      
      if (constraint.max !== undefined && value > constraint.max) {
        result.errors.push(`Parameter ${paramName} (${value}) is above maximum (${constraint.max})`);
      }
      
      if (constraint.integer && !Number.isInteger(value)) {
        result.errors.push(`Parameter ${paramName} must be an integer`);
      }
    });
  }

  private static validateMathematicalConsistency(params: SurfaceParameters, result: ValidationResult): void {
    // Check for mathematical inconsistencies specific to certain shapes
    switch (params.type) {
      case 'GRAVITY_WELL':
        // Event horizon should be positive
        if (params.a <= 0) {
          result.errors.push('Gravity well event horizon radius (parameter a) must be positive');
        }
        
        // Mass parameter should be positive
        if (params.b <= 0) {
          result.errors.push('Gravity well mass parameter (parameter b) must be positive');
        }
        
        // Warn about extreme values
        if (params.a > 20) {
          result.warnings.push('Large event horizon radius may cause visualization issues');
        }
        break;

      case 'klein_bottle':
        // Klein bottle specific validations
        if (params.a >= params.b) {
          result.warnings.push('For proper Klein bottle visualization, tube radius (a) should be smaller than major radius (b)');
        }
        break;

      case 'trefoil_knot':
        // Knot parameters should maintain proper ratios
        if (Math.abs(params.a - params.b) < 0.1) {
          result.warnings.push('Trefoil knot parameters a and b should be sufficiently different for clear visualization');
        }
        break;
    }
  }

  private static validatePerformance(params: SurfaceParameters, result: ValidationResult): void {
    const totalSegments = params.uSegments * params.vSegments;
    
    // Performance thresholds
    if (totalSegments > 100000) {
      result.errors.push('Total segments exceed maximum limit (100,000). Reduce uSegments or vSegments.');
    } else if (totalSegments > 50000) {
      result.warnings.push('High segment count may impact performance on slower devices');
      result.suggestions.push('Consider enabling performance optimizations or reducing segment counts');
    }

    // Check for inefficient parameter ranges
    const uRange = Math.abs(params.uMax - params.uMin);
    const vRange = Math.abs(params.vMax - params.vMin);
    
    if (uRange < 0.1 || vRange < 0.1) {
      result.warnings.push('Very small parameter ranges may result in degenerate geometry');
    }
    
    if (uRange > 100 || vRange > 100) {
      result.warnings.push('Very large parameter ranges may cause numerical precision issues');
    }
  }

  static getParameterInfo(type: SurfaceType, parameterName: string): ParameterConstraints | null {
    const constraints = this.shapeConstraints.get(type);
    return constraints?.[parameterName] || null;
  }

  static getAllParameterInfo(type: SurfaceType): ShapeConstraints | null {
    return this.shapeConstraints.get(type) || null;
  }

  static addShapeConstraints(type: SurfaceType, constraints: ShapeConstraints): void {
    this.shapeConstraints.set(type, constraints);
  }

  static sanitizeParameters(params: SurfaceParameters): SurfaceParameters {
    const sanitized = { ...params };
    
    // Clamp segments to valid ranges
    sanitized.uSegments = Math.max(1, Math.min(500, Math.round(params.uSegments)));
    sanitized.vSegments = Math.max(1, Math.min(500, Math.round(params.vSegments)));
    
    // Ensure UV ranges are valid
    if (sanitized.uMin >= sanitized.uMax) {
      const temp = sanitized.uMin;
      sanitized.uMin = sanitized.uMax;
      sanitized.uMax = temp + 0.1;
    }
    
    if (sanitized.vMin >= sanitized.vMax) {
      const temp = sanitized.vMin;
      sanitized.vMin = sanitized.vMax;
      sanitized.vMax = temp + 0.1;
    }
    
    // Apply shape-specific sanitization
    const constraints = this.shapeConstraints.get(params.type);
    if (constraints) {
      Object.entries(constraints).forEach(([paramName, constraint]) => {
        const value = (sanitized as any)[paramName];
        if (typeof value === 'number') {
          let sanitizedValue = value;
          
          if (constraint.min !== undefined) {
            sanitizedValue = Math.max(constraint.min, sanitizedValue);
          }
          
          if (constraint.max !== undefined) {
            sanitizedValue = Math.min(constraint.max, sanitizedValue);
          }
          
          if (constraint.integer) {
            sanitizedValue = Math.round(sanitizedValue);
          }
          
          (sanitized as any)[paramName] = sanitizedValue;
        }
      });
    }
    
    return sanitized;
  }
}

export default ParameterValidator;