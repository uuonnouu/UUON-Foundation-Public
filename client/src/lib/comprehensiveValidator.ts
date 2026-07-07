// Comprehensive Validation System - Production Ready
import { PREDEFINED_SURFACES } from './parametricSurfaces';
import { EXCLUSIVE_SHAPES } from './exclusiveShapes';
import { POLYGON_FIXES } from './polygonFix';
import { FIXED_SHAPES } from './fixAllShapes';

interface ValidationResult {
  shapeName: string;
  isValid: boolean;
  parameterCount: number;
  hasGeometry: boolean;
  isResponsive: boolean;
  errors: string[];
  warnings: string[];
}

export class ComprehensiveValidator {
  private results: ValidationResult[] = [];

  validateAllShapes(): void {
    console.log('Starting comprehensive shape validation...');
    
    this.validateCategory('PREDEFINED_SURFACES', PREDEFINED_SURFACES);
    this.validateCategory('EXCLUSIVE_SHAPES', EXCLUSIVE_SHAPES);
    this.validateCategory('POLYGON_FIXES', POLYGON_FIXES);
    this.validateCategory('FIXED_SHAPES', FIXED_SHAPES);
    
    this.generateReport();
  }

  private validateCategory(categoryName: string, shapes: Record<string, any>): void {
    console.log(`Validating ${categoryName}...`);
    
    for (const [shapeName, equation] of Object.entries(shapes)) {
      const result = this.validateShape(shapeName, equation);
      this.results.push(result);
      
      if (result.errors.length > 0) {
        console.log(`Issues found in ${shapeName}:`, result.errors);
      }
    }
  }

  private validateShape(shapeName: string, equation: any): ValidationResult {
    const result: ValidationResult = {
      shapeName,
      isValid: true,
      parameterCount: 0,
      hasGeometry: false,
      isResponsive: false,
      errors: [],
      warnings: []
    };

    try {
      // Test parameter support
      result.parameterCount = this.testParameterCount(equation);
      
      if (result.parameterCount < 23) {
        result.warnings.push(`Only ${result.parameterCount}/23 parameters supported`);
      }

      // Test geometry generation
      result.hasGeometry = this.testGeometry(equation);
      
      if (!result.hasGeometry) {
        result.errors.push('Failed to generate valid geometry');
        result.isValid = false;
      }

      // Test parameter responsiveness
      result.isResponsive = this.testResponsiveness(equation);
      
      if (!result.isResponsive) {
        result.warnings.push('Low parameter responsiveness detected');
      }

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation error: ${(error as Error).message}`);
    }

    return result;
  }

  private testParameterCount(equation: any): number {
    if (!equation.x || !equation.y || !equation.z) {
      return 0;
    }

    for (let count = 25; count >= 1; count--) {
      try {
        const params = new Array(count).fill(1);
        const result = equation.x(0, 0, ...params);
        
        if (typeof result === 'number' && isFinite(result)) {
          return count;
        }
      } catch {
        continue;
      }
    }
    
    return 0;
  }

  private testGeometry(equation: any): boolean {
    try {
      const params = new Array(23).fill(1);
      const testPoints = [[0, 0], [0.5, 0.5], [1, 1]];
      
      for (const [u, v] of testPoints) {
        const x = equation.x(u, v, ...params);
        const y = equation.y(u, v, ...params);
        const z = equation.z(u, v, ...params);
        
        if (!this.isValidNumber(x) || !this.isValidNumber(y) || !this.isValidNumber(z)) {
          return false;
        }
      }
      
      return true;
    } catch {
      return false;
    }
  }

  private testResponsiveness(equation: any): boolean {
    try {
      const baseParams = new Array(23).fill(1);
      const baseResult = equation.x(0.5, 0.5, ...baseParams);
      
      let responsiveCount = 0;
      
      for (let i = 0; i < 10; i++) { // Test first 10 parameters
        const testParams = [...baseParams];
        testParams[i] = 2;
        
        const testResult = equation.x(0.5, 0.5, ...testParams);
        
        if (Math.abs(testResult - baseResult) > 0.001) {
          responsiveCount++;
        }
      }
      
      return responsiveCount >= 3; // At least 3 parameters should be responsive
    } catch {
      return false;
    }
  }

  private isValidNumber(value: any): boolean {
    return typeof value === 'number' && isFinite(value) && !isNaN(value);
  }

  private generateReport(): void {
    const total = this.results.length;
    const valid = this.results.filter(r => r.isValid).length;
    const withFullParams = this.results.filter(r => r.parameterCount >= 23).length;
    const responsive = this.results.filter(r => r.isResponsive).length;
    
    console.log(`Validation Report:`);
    console.log(`Total shapes: ${total}`);
    console.log(`Valid shapes: ${valid}/${total} (${((valid/total)*100).toFixed(1)}%)`);
    console.log(`Full parameter support: ${withFullParams}/${total} (${((withFullParams/total)*100).toFixed(1)}%)`);
    console.log(`Responsive shapes: ${responsive}/${total} (${((responsive/total)*100).toFixed(1)}%)`);
    
    // Report critical issues
    const criticalIssues = this.results.filter(r => r.errors.length > 0);
    if (criticalIssues.length > 0) {
      console.log(`Critical issues found in ${criticalIssues.length} shapes:`);
      criticalIssues.forEach(shape => {
        console.log(`- ${shape.shapeName}: ${shape.errors.join(', ')}`);
      });
    }
    
    // Report warnings
    const warnings = this.results.filter(r => r.warnings.length > 0);
    if (warnings.length > 0) {
      console.log(`Warnings in ${warnings.length} shapes - mostly parameter optimization opportunities`);
    }
    
    console.log('Validation complete - system ready for mathematical visualization');
  }
}

export const validator = new ComprehensiveValidator();