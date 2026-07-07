// Cosmic Object Validation System
// Comprehensive testing for GRAVITY_WELL, WHITE_HOLE, WORMHOLE, ERGOSPHERE

import { SurfaceParameters, SurfaceType } from '../../shared/schema';
import { GRAVITY_WELL, WHITE_HOLE, WORMHOLE, ERGOSPHERE } from './cosmicObjects';

interface CosmicValidationResult {
  shapeType: SurfaceType;
  parameterUsage: {
    totalParameters: number;
    activeParameters: number;
    unusedParameters: string[];
    responsiveParameters: string[];
  };
  mathematicalCorrectness: {
    hasNaN: boolean;
    hasInfinity: boolean;
    validRange: boolean;
    geometryValid: boolean;
  };
  performance: {
    executionTime: number;
    memoryEfficient: boolean;
    renderingStable: boolean;
  };
  responsiveness: {
    parameterSensitivity: Record<string, number>;
    overallResponsiveness: number;
  };
  issues: string[];
  recommendations: string[];
}

class CosmicObjectValidator {
  private readonly parameterNames = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'
  ];

  private createTestParameters(overrides: Partial<SurfaceParameters> = {}): SurfaceParameters {
    return {
      type: 'GRAVITY_WELL' as SurfaceType,
      uMin: 0,
      uMax: 1,
      vMin: 0,
      vMax: 1,
      uSegments: 50,
      vSegments: 50,
      a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1, u: 1, v: 1, w: 1,
      ...overrides
    };
  }

  private testParameterUsage(equation: any, baseParams: SurfaceParameters): {
    activeParameters: number;
    unusedParameters: string[];
    responsiveParameters: string[];
  } {
    const baseResult = this.evaluateEquation(equation, 0.5, 0.5, baseParams);
    const responsiveParameters: string[] = [];
    const unusedParameters: string[] = [];

    for (const param of this.parameterNames) {
      const testParams = { ...baseParams };
      (testParams as any)[param] = (testParams as any)[param] + 1; // Increase by 1
      
      const testResult = this.evaluateEquation(equation, 0.5, 0.5, testParams);
      const difference = Math.abs(testResult.x - baseResult.x) + Math.abs(testResult.y - baseResult.y) + Math.abs(testResult.z - baseResult.z);
      
      if (difference > 0.001) {
        responsiveParameters.push(param);
      } else {
        unusedParameters.push(param);
      }
    }

    return {
      activeParameters: responsiveParameters.length,
      unusedParameters,
      responsiveParameters
    };
  }

  private evaluateEquation(equation: any, u: number, v: number, params: SurfaceParameters) {
    const args = [
      u, v, params.a, params.b, params.c, params.d, params.e, params.f, params.g, params.h,
      params.i, params.j, params.k, params.l, params.m, params.n, params.o, params.p,
      params.q, params.r, params.s, params.t, params.u, params.v, params.w
    ];

    return {
      x: equation.x(...args),
      y: equation.y(...args),
      z: equation.z(...args)
    };
  }

  private testMathematicalCorrectness(equation: any, params: SurfaceParameters): {
    hasNaN: boolean;
    hasInfinity: boolean;
    validRange: boolean;
    geometryValid: boolean;
  } {
    let hasNaN = false;
    let hasInfinity = false;
    let validRange = true;
    let geometryValid = true;
    
    const testPoints = [
      [0, 0], [0.5, 0.5], [1, 1], [0.25, 0.75], [0.75, 0.25]
    ];

    for (const [u, v] of testPoints) {
      const result = this.evaluateEquation(equation, u, v, params);
      
      if (isNaN(result.x) || isNaN(result.y) || isNaN(result.z)) hasNaN = true;
      if (!isFinite(result.x) || !isFinite(result.y) || !isFinite(result.z)) hasInfinity = true;
      
      const magnitude = Math.sqrt(result.x * result.x + result.y * result.y + result.z * result.z);
      if (magnitude > 1000 || magnitude < 0.001) validRange = false;
    }

    // Test for geometric continuity
    const result1 = this.evaluateEquation(equation, 0.5, 0.5, params);
    const result2 = this.evaluateEquation(equation, 0.501, 0.501, params);
    const continuity = Math.abs(result1.x - result2.x) + Math.abs(result1.y - result2.y) + Math.abs(result1.z - result2.z);
    if (continuity > 10) geometryValid = false;

    return { hasNaN, hasInfinity, validRange, geometryValid };
  }

  private testPerformance(equation: any, params: SurfaceParameters): {
    executionTime: number;
    memoryEfficient: boolean;
    renderingStable: boolean;
  } {
    const startTime = performance.now();
    
    // Test multiple evaluations for performance
    for (let i = 0; i < 1000; i++) {
      const u = Math.random();
      const v = Math.random();
      this.evaluateEquation(equation, u, v, params);
    }
    
    const executionTime = performance.now() - startTime;
    const memoryEfficient = executionTime < 100; // Should complete 1000 evaluations in under 100ms
    const renderingStable = executionTime < 200; // Stable rendering threshold

    return {
      executionTime,
      memoryEfficient,
      renderingStable
    };
  }

  private testResponsiveness(equation: any, params: SurfaceParameters): {
    parameterSensitivity: Record<string, number>;
    overallResponsiveness: number;
  } {
    const parameterSensitivity: Record<string, number> = {};
    const baseResult = this.evaluateEquation(equation, 0.5, 0.5, params);
    
    for (const param of this.parameterNames) {
      const testParams = { ...params };
      (testParams as any)[param] = (testParams as any)[param] + 0.1;
      
      const testResult = this.evaluateEquation(equation, 0.5, 0.5, testParams);
      const sensitivity = Math.abs(testResult.x - baseResult.x) + Math.abs(testResult.y - baseResult.y) + Math.abs(testResult.z - baseResult.z);
      parameterSensitivity[param] = sensitivity;
    }

    const totalSensitivity = Object.values(parameterSensitivity).reduce((sum, val) => sum + val, 0);
    const overallResponsiveness = totalSensitivity / this.parameterNames.length;

    return {
      parameterSensitivity,
      overallResponsiveness
    };
  }

  validateCosmicObject(shapeType: SurfaceType): CosmicValidationResult {
    const equations = {
      'GRAVITY_WELL': GRAVITY_WELL,
      'WHITE_HOLE': WHITE_HOLE,
      'WORMHOLE': WORMHOLE,
      'ERGOSPHERE': ERGOSPHERE
    };

    const equation = equations[shapeType];
    if (!equation) {
      throw new Error(`Unknown cosmic object: ${shapeType}`);
    }

    const params = this.createTestParameters({ type: shapeType });
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Test parameter usage
    const parameterUsage = this.testParameterUsage(equation, params);
    if (parameterUsage.activeParameters < 15) {
      issues.push(`Only ${parameterUsage.activeParameters} parameters are responsive`);
      recommendations.push('Increase parameter usage to utilize full 23-parameter system');
    }

    // Test mathematical correctness
    const mathematicalCorrectness = this.testMathematicalCorrectness(equation, params);
    if (mathematicalCorrectness.hasNaN) {
      issues.push('Equation produces NaN values');
      recommendations.push('Add safeguards against division by zero and invalid operations');
    }
    if (mathematicalCorrectness.hasInfinity) {
      issues.push('Equation produces infinite values');
      recommendations.push('Implement bounds checking and mathematical stability');
    }
    if (!mathematicalCorrectness.validRange) {
      issues.push('Generated values outside reasonable range');
      recommendations.push('Normalize output values to reasonable geometric scale');
    }

    // Test performance
    const performance = this.testPerformance(equation, params);
    if (!performance.memoryEfficient) {
      issues.push(`Slow execution time: ${performance.executionTime.toFixed(2)}ms`);
      recommendations.push('Optimize mathematical calculations for better performance');
    }

    // Test responsiveness
    const responsiveness = this.testResponsiveness(equation, params);
    if (responsiveness.overallResponsiveness < 0.01) {
      issues.push('Low parameter responsiveness');
      recommendations.push('Increase parameter influence on geometry generation');
    }

    return {
      shapeType,
      parameterUsage: {
        totalParameters: this.parameterNames.length,
        ...parameterUsage
      },
      mathematicalCorrectness,
      performance,
      responsiveness,
      issues,
      recommendations
    };
  }

  validateAllCosmicObjects(): Record<SurfaceType, CosmicValidationResult> {
    const cosmicObjects: SurfaceType[] = ['GRAVITY_WELL', 'WHITE_HOLE', 'WORMHOLE', 'ERGOSPHERE'];
    const results: Record<string, CosmicValidationResult> = {};

    for (const shapeType of cosmicObjects) {
      try {
        results[shapeType] = this.validateCosmicObject(shapeType);
      } catch (error) {
        results[shapeType] = {
          shapeType,
          parameterUsage: { totalParameters: 23, activeParameters: 0, unusedParameters: [], responsiveParameters: [] },
          mathematicalCorrectness: { hasNaN: true, hasInfinity: true, validRange: false, geometryValid: false },
          performance: { executionTime: 0, memoryEfficient: false, renderingStable: false },
          responsiveness: { parameterSensitivity: {}, overallResponsiveness: 0 },
          issues: [`Validation failed: ${error}`],
          recommendations: ['Fix critical errors in equation definition']
        };
      }
    }

    return results as Record<SurfaceType, CosmicValidationResult>;
  }

  generateValidationReport(): string {
    const results = this.validateAllCosmicObjects();
    let report = "COSMIC OBJECTS VALIDATION REPORT\n";
    report += "=====================================\n\n";

    for (const [shapeType, result] of Object.entries(results)) {
      report += `${shapeType}:\n`;
      report += `  Parameters: ${result.parameterUsage.activeParameters}/${result.parameterUsage.totalParameters} responsive\n`;
      report += `  Math Valid: ${!result.mathematicalCorrectness.hasNaN && !result.mathematicalCorrectness.hasInfinity}\n`;
      report += `  Performance: ${result.performance.executionTime.toFixed(2)}ms\n`;
      report += `  Responsiveness: ${result.responsiveness.overallResponsiveness.toFixed(4)}\n`;
      
      if (result.issues.length > 0) {
        report += `  Issues: ${result.issues.join(', ')}\n`;
      }
      
      report += "\n";
    }

    return report;
  }
}

export const cosmicValidator = new CosmicObjectValidator();
export type { CosmicValidationResult };