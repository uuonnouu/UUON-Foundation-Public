// Comprehensive Shape Validation System
import { SurfaceType, SurfaceParameters } from "../../../shared/schema";
import { getShapeDefaults } from "./shapeDefaults";

export interface ShapeValidationResult {
  shapeType: SurfaceType;
  isValid: boolean;
  hasAllParameters: boolean;
  parameterCount: number;
  missingParameters: string[];
  renderingIssues: string[];
  geometryValid: boolean;
  recommendations: string[];
}

export class ComprehensiveShapeValidator {
  private readonly REQUIRED_PARAMETERS = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
    'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w'
  ];

  // Step 1: Verify Shape Definitions
  validateShapeDefinition(shapeType: SurfaceType): ShapeValidationResult {
    console.log(`🔍 Validating shape definition for: ${shapeType}`);
    
    const result: ShapeValidationResult = {
      shapeType,
      isValid: true,
      hasAllParameters: false,
      parameterCount: 0,
      missingParameters: [],
      renderingIssues: [],
      geometryValid: false,
      recommendations: []
    };

    try {
      // Get shape defaults and validate
      const defaults = getShapeDefaults(shapeType);
      
      if (!defaults) {
        result.isValid = false;
        result.renderingIssues.push(`No default parameters found for ${shapeType}`);
        result.recommendations.push(`Add ${shapeType} to shapeDefaults.ts with complete 23-parameter definition`);
        return result;
      }

      // Step 2: Validate 23-Parameter System Usage
      const presentParameters = this.REQUIRED_PARAMETERS.filter(param => 
        defaults[param as keyof SurfaceParameters] !== undefined
      );
      
      result.parameterCount = presentParameters.length;
      result.missingParameters = this.REQUIRED_PARAMETERS.filter(param => 
        defaults[param as keyof SurfaceParameters] === undefined
      );
      result.hasAllParameters = result.parameterCount === 23;

      if (!result.hasAllParameters) {
        result.isValid = false;
        result.renderingIssues.push(
          `Missing ${result.missingParameters.length} parameters: ${result.missingParameters.join(', ')}`
        );
        result.recommendations.push(
          `Add missing parameters to ${shapeType} definition: ${result.missingParameters.join(', ')}`
        );
      }

      // Step 3: Geometry Generation Validation
      result.geometryValid = this.validateGeometry(shapeType, defaults);
      
      if (!result.geometryValid) {
        result.isValid = false;
        result.renderingIssues.push(`Geometry generation failed for ${shapeType}`);
        result.recommendations.push(`Check parametric equations and mathematical definitions for ${shapeType}`);
      }

      // Additional validations
      this.validateParameterRanges(defaults, result);
      this.validateSegmentCounts(defaults, result);
      
      console.log(`✅ Shape validation complete for ${shapeType}:`, {
        valid: result.isValid,
        parameters: `${result.parameterCount}/23`,
        geometry: result.geometryValid ? 'Valid' : 'Invalid'
      });

    } catch (error) {
      result.isValid = false;
      result.renderingIssues.push(`Validation error: ${error}`);
      result.recommendations.push(`Fix implementation errors in ${shapeType} definition`);
      console.error(`❌ Validation error for ${shapeType}:`, error);
    }

    return result;
  }

  // Validate geometry generation capability
  private validateGeometry(shapeType: SurfaceType, parameters: SurfaceParameters): boolean {
    try {
      // Test basic parameter ranges
      const hasValidURange = parameters.uMin !== undefined && parameters.uMax !== undefined && 
                            parameters.uMax > parameters.uMin;
      const hasValidVRange = parameters.vMin !== undefined && parameters.vMax !== undefined && 
                            parameters.vMax > parameters.vMin;
      const hasValidSegments = parameters.uSegments > 0 && parameters.vSegments > 0;

      return hasValidURange && hasValidVRange && hasValidSegments;
    } catch (error) {
      console.error(`Geometry validation failed for ${shapeType}:`, error);
      return false;
    }
  }

  // Validate parameter ranges
  private validateParameterRanges(parameters: SurfaceParameters, result: ShapeValidationResult): void {
    if (parameters.uMin === undefined || parameters.uMax === undefined || 
        parameters.uMin >= parameters.uMax) {
      result.renderingIssues.push('Invalid U parameter range');
      result.recommendations.push('Set valid uMin < uMax range');
    }

    if (parameters.vMin === undefined || parameters.vMax === undefined || 
        parameters.vMin >= parameters.vMax) {
      result.renderingIssues.push('Invalid V parameter range');
      result.recommendations.push('Set valid vMin < vMax range');
    }
  }

  // Validate segment counts
  private validateSegmentCounts(parameters: SurfaceParameters, result: ShapeValidationResult): void {
    if (!parameters.uSegments || parameters.uSegments < 3) {
      result.renderingIssues.push('Invalid uSegments count');
      result.recommendations.push('Set uSegments >= 3 for proper geometry');
    }

    if (!parameters.vSegments || parameters.vSegments < 3) {
      result.renderingIssues.push('Invalid vSegments count');
      result.recommendations.push('Set vSegments >= 3 for proper geometry');
    }
  }

  // Validate all shapes in the system
  validateAllShapes(): Map<SurfaceType, ShapeValidationResult> {
    console.log('🚀 Starting comprehensive validation of all 114+ shapes...');
    
    const results = new Map<SurfaceType, ShapeValidationResult>();
    
    // Get all shape types from the enum
    const allShapeTypes: SurfaceType[] = [
      'triangular_prism', 'square', 'cube', 'square_prism', 'pentagonal_prism', 'hexagonal_prism',
      'heptagonal_prism', 'octagonal_prism', 'nonagonal_prism', 'decagonal_prism',
      'hendecagonal_prism', 'dodecagonal_prism', 'tetrahedron', 'triangular_pyramid', 'square_pyramid',
      'pentagonal_pyramid', 'hexagonal_pyramid', 'heptagonal_pyramid', 'octagonal_pyramid',
      'nonagonal_pyramid', 'decagonal_pyramid', 'hendecagonal_pyramid', 'dodecagonal_pyramid',
      'hemisphere', 'spherical_cap',
      'quarter_sphere', 'annulus_torus', 'cylindrical_shell', 'star_5_prism', 'star_6_hexagram',
      'star_8_octagram', 'concave_pentagon', 'concave_hexagon', 'crescent', 'heart_shape',
      'kidney_shape', 'oval_prolate', 'oval_oblate', 'lens_biconvex', 'lens_biconcave',
      'airfoil_naca', 'gear_tooth', 'cam_profile', 'spline_surface', 'bezier_surface',
      'nurbs_surface', 'koch_snowflake', 'sierpinski_pyramid', 'dragon_curve', 'mandelbrot_solid',
      'gothic_arch', 'roman_arch', 'ogee_curve', 's_curve_flowing',
      'simplex_4d', 'hypersphere_4d', 'cell_16', 'cell_120', 'cell_600', 'pseudosphere',
      'hyperbolic_paraboloid', 'hyperbolic_pentagon', 'hyperbolic_tiling', 'spherical_triangle',
      'spherical_polygon', 'minkowski_hyperboloid', 'light_cone', 'spacetime_geodesic',
      'square_root_riemann', 'logarithm_riemann', 'exponential_riemann', 'nth_root_riemann',
      'modular_function', 'elliptic_function', 'root_chakra', 'sacral_chakra',
      'solar_plexus_chakra', 'heart_chakra', 'throat_chakra', 'third_eye_chakra',
      'crown_chakra', 'tree_of_life', 'icosahedron_group', 'dodecahedron_group',
      'cubic_lattice', 'fcc_lattice', 'hcp_lattice', 'functor_mapping',
      'natural_transformation', 'adjoint_functors', 'klein_bottle', 'trefoil_knot',
      'figure8_knot', 'genus2_surface', 'genus3_surface', 'fiber_bundle',
      'homotopy_deformation', 'sun', 'sunflower', 'letter_A', 'number_3', 'apple',
      'star_3d', 'GRAVITY_WELL', 'WHITE_HOLE', 'WORMHOLE', 'ERGOSPHERE'
    ];

    let validCount = 0;
    let invalidCount = 0;
    let fullParameterCount = 0;

    for (const shapeType of allShapeTypes) {
      const result = this.validateShapeDefinition(shapeType);
      results.set(shapeType, result);
      
      if (result.isValid) {
        validCount++;
      } else {
        invalidCount++;
      }
      
      if (result.hasAllParameters) {
        fullParameterCount++;
      }
    }

    console.log(`📊 Validation Summary:
    ✅ Valid shapes: ${validCount}/${allShapeTypes.length}
    ❌ Invalid shapes: ${invalidCount}/${allShapeTypes.length}
    🎯 Full 23-parameter support: ${fullParameterCount}/${allShapeTypes.length}
    📈 System completion: ${((validCount / allShapeTypes.length) * 100).toFixed(1)}%`);

    return results;
  }

  // Generate detailed validation report
  generateValidationReport(results: Map<SurfaceType, ShapeValidationResult>): string {
    const report = ['=== COMPREHENSIVE SHAPE VALIDATION REPORT ===\n'];
    
    const validShapes: SurfaceType[] = [];
    const invalidShapes: SurfaceType[] = [];
    const incompleteParameterShapes: SurfaceType[] = [];

    for (const [shapeType, result] of results) {
      if (result.isValid) {
        validShapes.push(shapeType);
      } else {
        invalidShapes.push(shapeType);
      }
      
      if (!result.hasAllParameters) {
        incompleteParameterShapes.push(shapeType);
      }
    }

    report.push(`✅ VALID SHAPES (${validShapes.length}): ${validShapes.join(', ')}\n`);
    report.push(`❌ INVALID SHAPES (${invalidShapes.length}): ${invalidShapes.join(', ')}\n`);
    report.push(`⚠️  INCOMPLETE PARAMETERS (${incompleteParameterShapes.length}): ${incompleteParameterShapes.join(', ')}\n`);

    // Detailed issues for invalid shapes
    if (invalidShapes.length > 0) {
      report.push('\n=== DETAILED ISSUES ===');
      for (const shapeType of invalidShapes) {
        const result = results.get(shapeType)!;
        report.push(`\n${shapeType}:`);
        report.push(`  Issues: ${result.renderingIssues.join(', ')}`);
        report.push(`  Recommendations: ${result.recommendations.join(', ')}`);
        report.push(`  Parameters: ${result.parameterCount}/23`);
      }
    }

    return report.join('\n');
  }
}