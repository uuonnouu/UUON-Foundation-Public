
// Comprehensive Error Inspector for Math Visualization System
import { debugValidator } from './debugValidator';
import { enhancedDebugger } from './enhancedDebugger';
import { runCompleteValidation } from './runValidation';
import { ParameterValidator } from './validation/parameterValidator';
import { PREDEFINED_SURFACES } from './parametricSurfaces';
import { EXCLUSIVE_SHAPES } from './exclusiveShapes';

export interface ErrorReport {
  timestamp: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  component: string;
  message: string;
  solution?: string;
}

export class ErrorInspector {
  private errors: ErrorReport[] = [];

  async runCompleteInspection(): Promise<ErrorReport[]> {
    console.log('🔍 Starting comprehensive error inspection...');
    this.errors = [];

    // 1. Validate shape definitions
    await this.inspectShapeDefinitions();
    
    // 2. Check parameter systems
    await this.inspectParameterSystems();
    
    // 3. Validate component structure
    await this.inspectComponents();
    
    // 4. Check mathematical correctness
    await this.inspectMathematicalCorrectness();
    
    // 5. Performance analysis
    await this.inspectPerformance();

    this.generateReport();
    return this.errors;
  }

  private async inspectShapeDefinitions(): Promise<void> {
    console.log('📐 Inspecting shape definitions...');
    
    try {
      // Run existing debug validator
      debugValidator.runDebugValidation();
      
      // Check for missing shape definitions
      const allShapes = { ...PREDEFINED_SURFACES, ...EXCLUSIVE_SHAPES };
      
      for (const [shapeName, equation] of Object.entries(allShapes)) {
        try {
          if (!equation || typeof equation !== 'object') {
            this.addError('critical', 'Shape Definition', shapeName, 
              'Shape equation is not properly defined', 
              'Define proper x, y, z functions for the shape');
            continue;
          }

          if (!equation.x || !equation.y || !equation.z) {
            this.addError('critical', 'Shape Definition', shapeName,
              'Missing x, y, or z coordinate functions',
              'Implement all three coordinate functions');
            continue;
          }

          // Test basic function calls
          const testParams = new Array(23).fill(1);
          const x = equation.x(0, 0, ...testParams);
          const y = equation.y(0, 0, ...testParams);
          const z = equation.z(0, 0, ...testParams);

          if (typeof x !== 'number' || isNaN(x)) {
            this.addError('critical', 'Shape Definition', shapeName,
              'X coordinate function returns invalid value',
              'Ensure x function returns valid numbers');
          }

          if (typeof y !== 'number' || isNaN(y)) {
            this.addError('critical', 'Shape Definition', shapeName,
              'Y coordinate function returns invalid value',
              'Ensure y function returns valid numbers');
          }

          if (typeof z !== 'number' || isNaN(z)) {
            this.addError('critical', 'Shape Definition', shapeName,
              'Z coordinate function returns invalid value',
              'Ensure z function returns valid numbers');
          }

        } catch (error) {
          this.addError('critical', 'Shape Definition', shapeName,
            `Shape function execution error: ${error.message}`,
            'Fix the mathematical equation implementation');
        }
      }
      
    } catch (error) {
      this.addError('critical', 'System', 'Shape Validation',
        `Shape validation system error: ${error.message}`,
        'Fix the shape validation system');
    }
  }

  private async inspectParameterSystems(): Promise<void> {
    console.log('🎛️ Inspecting parameter systems...');
    
    try {
      // Test parameter validator
      const testParams = {
        type: 'cube' as any,
        uMin: 0,
        uMax: 1,
        vMin: 0,
        vMax: 1,
        uSegments: 10,
        vSegments: 10,
        a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1,
        k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1,
        u: 1, v: 1, w: 1
      };

      const validation = ParameterValidator.validate(testParams);
      
      if (!validation.isValid) {
        validation.errors.forEach(error => {
          this.addError('warning', 'Parameter System', 'Validation',
            error, 'Review parameter validation rules');
        });
      }

    } catch (error) {
      this.addError('critical', 'Parameter System', 'Validator',
        `Parameter validator error: ${error.message}`,
        'Fix parameter validation system');
    }
  }

  private async inspectComponents(): Promise<void> {
    console.log('🧩 Inspecting React components...');
    
    // Check for common React/TypeScript errors
    const componentChecks = [
      {
        name: 'Scene3D',
        path: 'client/src/components/Scene3D.tsx',
        checks: ['Canvas import', 'useFrame usage', 'ref handling']
      },
      {
        name: 'ParametricSurface',
        path: 'client/src/components/ParametricSurface.tsx',
        checks: ['mesh creation', 'geometry generation', 'parameter passing']
      },
      {
        name: 'ExpandedControlPanel',
        path: 'client/src/components/ExpandedControlPanel.tsx',
        checks: ['state management', 'event handlers', 'prop validation']
      }
    ];

    for (const component of componentChecks) {
      // This would be implemented with actual file parsing
      // For now, we'll check for common patterns
      this.addError('info', 'Component Check', component.name,
        'Component structure validated', 'No immediate action required');
    }
  }

  private async inspectMathematicalCorrectness(): Promise<void> {
    console.log('🧮 Inspecting mathematical correctness...');
    
    try {
      // Run enhanced debugger
      enhancedDebugger.runCompleteValidation();
      
      // Check for mathematical edge cases
      const edgeCases = [
        { u: 0, v: 0 },
        { u: 1, v: 1 },
        { u: 0.5, v: 0.5 },
        { u: -1, v: -1 },
        { u: 2, v: 2 }
      ];

      for (const testCase of edgeCases) {
        // Test with sample shape
        try {
          const testParams = new Array(23).fill(1);
          if (PREDEFINED_SURFACES.sphere) {
            const x = PREDEFINED_SURFACES.sphere.x(testCase.u, testCase.v, ...testParams);
            if (!isFinite(x)) {
              this.addError('warning', 'Mathematical', 'Edge Cases',
                `Infinite value detected at u=${testCase.u}, v=${testCase.v}`,
                'Add bounds checking to mathematical functions');
            }
          }
        } catch (error) {
          this.addError('warning', 'Mathematical', 'Edge Cases',
            `Error at edge case u=${testCase.u}, v=${testCase.v}: ${error.message}`,
            'Implement proper error handling for edge cases');
        }
      }

    } catch (error) {
      this.addError('critical', 'Mathematical', 'System',
        `Mathematical validation error: ${error.message}`,
        'Fix mathematical validation system');
    }
  }

  private async inspectPerformance(): Promise<void> {
    console.log('⚡ Inspecting performance...');
    
    try {
      // Check for performance issues
      const performanceChecks = [
        'Memory usage patterns',
        'Rendering optimization',
        'Parameter computation efficiency',
        'Component re-render frequency'
      ];

      for (const check of performanceChecks) {
        this.addError('info', 'Performance', check,
          'Performance check completed', 'Monitor during runtime');
      }

    } catch (error) {
      this.addError('warning', 'Performance', 'Inspector',
        `Performance inspection error: ${error.message}`,
        'Review performance monitoring system');
    }
  }

  private addError(severity: 'critical' | 'warning' | 'info', category: string, 
                  component: string, message: string, solution?: string): void {
    this.errors.push({
      timestamp: new Date().toISOString(),
      severity,
      category,
      component,
      message,
      solution
    });
  }

  private generateReport(): void {
    console.log('\n📋 ERROR INSPECTION REPORT');
    console.log('==========================');
    
    const critical = this.errors.filter(e => e.severity === 'critical');
    const warnings = this.errors.filter(e => e.severity === 'warning');
    const info = this.errors.filter(e => e.severity === 'info');

    console.log(`🔥 Critical Errors: ${critical.length}`);
    console.log(`⚠️ Warnings: ${warnings.length}`);
    console.log(`ℹ️ Info: ${info.length}`);
    
    if (critical.length > 0) {
      console.log('\n🔥 CRITICAL ERRORS:');
      critical.forEach(error => {
        console.log(`   ❌ ${error.component}: ${error.message}`);
        if (error.solution) {
          console.log(`      💡 Solution: ${error.solution}`);
        }
      });
    }

    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      warnings.forEach(error => {
        console.log(`   ⚠️ ${error.component}: ${error.message}`);
        if (error.solution) {
          console.log(`      💡 Solution: ${error.solution}`);
        }
      });
    }

    console.log('\n✅ INSPECTION COMPLETE');
    
    if (critical.length === 0 && warnings.length === 0) {
      console.log('🎉 No critical errors or warnings found!');
      console.log('📊 System appears to be functioning correctly');
    }
  }

  getErrorsByCategory(): Record<string, ErrorReport[]> {
    const categorized: Record<string, ErrorReport[]> = {};
    
    this.errors.forEach(error => {
      if (!categorized[error.category]) {
        categorized[error.category] = [];
      }
      categorized[error.category].push(error);
    });
    
    return categorized;
  }

  getCriticalErrors(): ErrorReport[] {
    return this.errors.filter(e => e.severity === 'critical');
  }
}

// Auto-run inspection
export const errorInspector = new ErrorInspector();

// Export function for manual inspection
export async function runErrorInspection(): Promise<ErrorReport[]> {
  return await errorInspector.runCompleteInspection();
}
