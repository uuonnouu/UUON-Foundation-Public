import { SurfaceParameters, SurfaceType } from '../../types/math';
import { getShapeDefaults } from '../shapeDefaults';

export interface TestResult {
  shapeName: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  performanceMetrics: {
    renderTime: number;
    triangleCount: number;
    memoryUsage: number;
  };
}

export interface TestSuite {
  name: string;
  description: string;
  tests: TestCase[];
}

export interface TestCase {
  name: string;
  parameters: SurfaceParameters;
  expectedOutcome: 'success' | 'warning' | 'error';
  description: string;
}

export class ParameterTester {
  private testSuites: TestSuite[] = [];

  constructor() {
    this.initializeTestSuites();
  }

  private initializeTestSuites(): void {
    // Basic Shape Tests
    this.testSuites.push({
      name: 'Basic Shapes',
      description: 'Test fundamental geometric shapes with default parameters',
      tests: [
        {
          name: 'Cube Default Parameters',
          parameters: {
            ...getShapeDefaults('cube'),
            type: 'cube' as SurfaceType
          },
          expectedOutcome: 'success',
          description: 'Basic cube should render without issues'
        },
        {
          name: 'Triangular Prism Default',
          parameters: {
            ...getShapeDefaults('triangular_prism'),
            type: 'triangular_prism' as SurfaceType
          },
          expectedOutcome: 'success',
          description: 'Triangular prism should render correctly'
        }
      ]
    });

    // Parameter Range Tests
    this.testSuites.push({
      name: 'Parameter Ranges',
      description: 'Test parameter boundaries and edge cases',
      tests: [
        {
          name: 'Minimum Segments',
          parameters: {
            ...getShapeDefaults('cube'),
            type: 'cube' as SurfaceType,
            uSegments: 1,
            vSegments: 1
          },
          expectedOutcome: 'warning',
          description: 'Very low segment counts should show warnings'
        },
        {
          name: 'Maximum Segments',
          parameters: {
            ...getShapeDefaults('cube'),
            type: 'cube' as SurfaceType,
            uSegments: 500,
            vSegments: 500
          },
          expectedOutcome: 'warning',
          description: 'Very high segment counts should show performance warnings'
        }
      ]
    });

    // Mathematical Accuracy Tests
    this.testSuites.push({
      name: 'Mathematical Accuracy',
      description: 'Test mathematical correctness and edge cases',
      tests: [
        {
          name: 'Zero Range Parameters',
          parameters: {
            ...getShapeDefaults('cube'),
            type: 'cube' as SurfaceType,
            uMin: 0,
            uMax: 0,
            vMin: 0,
            vMax: 0
          },
          expectedOutcome: 'error',
          description: 'Zero ranges should produce errors'
        },
        {
          name: 'Inverted Range Parameters',
          parameters: {
            ...getShapeDefaults('cube'),
            type: 'cube' as SurfaceType,
            uMin: 1,
            uMax: 0,
            vMin: 1,
            vMax: 0
          },
          expectedOutcome: 'error',
          description: 'Inverted ranges should produce errors'
        }
      ]
    });
  }

  async runTest(testCase: TestCase): Promise<TestResult> {
    const startTime = performance.now();
    const result: TestResult = {
      shapeName: testCase.name,
      passed: false,
      errors: [],
      warnings: [],
      performanceMetrics: {
        renderTime: 0,
        triangleCount: 0,
        memoryUsage: 0
      }
    };

    try {
      // Validate basic parameter structure
      if (!this.validateParameterStructure(testCase.parameters)) {
        result.errors.push('Invalid parameter structure');
        return result;
      }

      // Test parameter ranges
      const rangeValidation = this.validateParameterRanges(testCase.parameters);
      if (!rangeValidation.valid) {
        result.errors.push(...rangeValidation.errors);
        result.warnings.push(...rangeValidation.warnings);
      }

      // Test mathematical consistency
      const mathValidation = this.validateMathematicalConsistency(testCase.parameters);
      if (!mathValidation.valid) {
        result.errors.push(...mathValidation.errors);
        result.warnings.push(...mathValidation.warnings);
      }

      // Performance estimation
      const performanceEst = this.estimatePerformance(testCase.parameters);
      result.performanceMetrics = performanceEst;

      if (performanceEst.triangleCount > 100000) {
        result.warnings.push('High triangle count may impact performance');
      }

      // Determine if test passed based on expected outcome
      const hasErrors = result.errors.length > 0;
      const hasWarnings = result.warnings.length > 0;

      switch (testCase.expectedOutcome) {
        case 'success':
          result.passed = !hasErrors && !hasWarnings;
          break;
        case 'warning':
          result.passed = !hasErrors && hasWarnings;
          break;
        case 'error':
          result.passed = hasErrors;
          break;
      }

    } catch (error) {
      result.errors.push(`Test execution failed: ${error}`);
      result.passed = false;
    }

    result.performanceMetrics.renderTime = performance.now() - startTime;
    return result;
  }

  async runTestSuite(suiteName: string): Promise<TestResult[]> {
    const suite = this.testSuites.find(s => s.name === suiteName);
    if (!suite) {
      throw new Error(`Test suite '${suiteName}' not found`);
    }

    const results: TestResult[] = [];
    for (const test of suite.tests) {
      const result = await this.runTest(test);
      results.push(result);
    }

    return results;
  }

  async runAllTests(): Promise<Map<string, TestResult[]>> {
    const allResults = new Map<string, TestResult[]>();
    
    for (const suite of this.testSuites) {
      const results = await this.runTestSuite(suite.name);
      allResults.set(suite.name, results);
    }

    return allResults;
  }

  private validateParameterStructure(params: SurfaceParameters): boolean {
    const required = ['type', 'uMin', 'uMax', 'vMin', 'vMax', 'uSegments', 'vSegments'];
    return required.every(key => params.hasOwnProperty(key));
  }

  private validateParameterRanges(params: SurfaceParameters): { valid: boolean; errors: string[]; warnings: string[] } {
    const result = { valid: true, errors: [] as string[], warnings: [] as string[] };

    // UV range validation
    if (params.uMin >= params.uMax) {
      result.errors.push('uMin must be less than uMax');
      result.valid = false;
    }

    if (params.vMin >= params.vMax) {
      result.errors.push('vMin must be less than vMax');
      result.valid = false;
    }

    // Segment validation
    if (params.uSegments < 1 || params.uSegments > 500) {
      result.errors.push('uSegments must be between 1 and 500');
      result.valid = false;
    }

    if (params.vSegments < 1 || params.vSegments > 500) {
      result.errors.push('vSegments must be between 1 and 500');
      result.valid = false;
    }

    // Performance warnings
    const totalVertices = params.uSegments * params.vSegments;
    if (totalVertices > 50000) {
      result.warnings.push(`High vertex count (${totalVertices})`);
    }

    return result;
  }

  private validateMathematicalConsistency(params: SurfaceParameters): { valid: boolean; errors: string[]; warnings: string[] } {
    const result = { valid: true, errors: [] as string[], warnings: [] as string[] };

    // Check for very small ranges that might cause numerical issues
    const uRange = Math.abs(params.uMax - params.uMin);
    const vRange = Math.abs(params.vMax - params.vMin);

    if (uRange < 0.001 || vRange < 0.001) {
      result.warnings.push('Very small parameter ranges may cause numerical precision issues');
    }

    if (uRange > 1000 || vRange > 1000) {
      result.warnings.push('Very large parameter ranges may cause numerical overflow');
    }

    return result;
  }

  private estimatePerformance(params: SurfaceParameters): { renderTime: number; triangleCount: number; memoryUsage: number } {
    const triangleCount = (params.uSegments - 1) * (params.vSegments - 1) * 2;
    const vertexCount = params.uSegments * params.vSegments;
    
    // Rough estimates based on typical performance characteristics
    const renderTime = triangleCount * 0.001; // ~1ms per 1000 triangles
    const memoryUsage = (vertexCount * 3 * 4 + triangleCount * 3 * 2) / 1024 / 1024; // MB

    return {
      renderTime,
      triangleCount,
      memoryUsage
    };
  }

  getTestSuites(): TestSuite[] {
    return [...this.testSuites];
  }

  addCustomTest(suiteName: string, testCase: TestCase): void {
    let suite = this.testSuites.find(s => s.name === suiteName);
    if (!suite) {
      suite = {
        name: suiteName,
        description: 'Custom test suite',
        tests: []
      };
      this.testSuites.push(suite);
    }
    suite.tests.push(testCase);
  }
}

export const parameterTester = new ParameterTester();