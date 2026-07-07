
// 4D Scientific Verification API Endpoints
import { scientific4DVerifier, Scientific4DVerificationResult } from './4DShapeVerificationAPI';
import { SurfaceType, SurfaceParameters } from '../../../shared/schema';
import { getShapeDefaults } from './shapeDefaults';

export interface API4DVerificationRequest {
  shapeType: SurfaceType;
  parameters?: SurfaceParameters;
  verificationLevel: 'basic' | 'comprehensive' | 'research';
}

export interface API4DVerificationResponse {
  success: boolean;
  data?: Scientific4DVerificationResult;
  error?: string;
  timestamp: string;
  verificationId: string;
}

export interface APIBatchVerificationRequest {
  shapes: API4DVerificationRequest[];
  generateReport: boolean;
}

export interface APIBatchVerificationResponse {
  success: boolean;
  results?: Map<SurfaceType, Scientific4DVerificationResult>;
  report?: string;
  summary: {
    totalShapes: number;
    highAccuracy: number;
    mediumAccuracy: number;
    lowAccuracy: number;
    averageScore: number;
  };
  timestamp: string;
  batchId: string;
}

export class Scientific4DAPI {
  private verificationCache = new Map<string, Scientific4DVerificationResult>();
  private readonly CACHE_DURATION = 300000; // 5 minutes

  /**
   * Verify a single 4D shape for scientific accuracy
   */
  async verifyShape(request: API4DVerificationRequest): Promise<API4DVerificationResponse> {
    const verificationId = this.generateVerificationId(request);
    
    try {
      console.log(`🔬 API: Verifying 4D shape ${request.shapeType} (${request.verificationLevel})`);
      
      // Get parameters (use defaults if not provided)
      const parameters = request.parameters || getShapeDefaults(request.shapeType);
      if (!parameters) {
        throw new Error(`No parameters available for shape ${request.shapeType}`);
      }

      // Check cache
      const cacheKey = this.getCacheKey(request.shapeType, parameters);
      const cached = this.verificationCache.get(cacheKey);
      if (cached) {
        console.log(`📋 Using cached verification for ${request.shapeType}`);
        return {
          success: true,
          data: cached,
          timestamp: new Date().toISOString(),
          verificationId
        };
      }

      // Perform verification
      const result = await scientific4DVerifier.verifyShape(request.shapeType, parameters);
      
      // Apply verification level filtering
      const filteredResult = this.applyVerificationLevel(result, request.verificationLevel);
      
      // Cache result
      this.verificationCache.set(cacheKey, filteredResult);
      
      return {
        success: true,
        data: filteredResult,
        timestamp: new Date().toISOString(),
        verificationId
      };
      
    } catch (error) {
      console.error(`❌ API: Verification failed for ${request.shapeType}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
        verificationId
      };
    }
  }

  /**
   * Verify multiple 4D shapes in batch
   */
  async verifyBatch(request: APIBatchVerificationRequest): Promise<APIBatchVerificationResponse> {
    const batchId = this.generateBatchId();
    
    try {
      console.log(`🚀 API: Starting batch verification of ${request.shapes.length} shapes`);
      
      const results = new Map<SurfaceType, Scientific4DVerificationResult>();
      const summary = {
        totalShapes: request.shapes.length,
        highAccuracy: 0,
        mediumAccuracy: 0,
        lowAccuracy: 0,
        averageScore: 0
      };

      // Process each shape
      for (const shapeRequest of request.shapes) {
        try {
          const response = await this.verifyShape(shapeRequest);
          if (response.success && response.data) {
            results.set(shapeRequest.shapeType, response.data);
            
            // Update summary
            const score = response.data.score;
            if (score >= 90) summary.highAccuracy++;
            else if (score >= 70) summary.mediumAccuracy++;
            else summary.lowAccuracy++;
          }
        } catch (error) {
          console.warn(`⚠️ Failed to verify ${shapeRequest.shapeType} in batch:`, error);
        }
      }

      // Calculate average score
      const scores = Array.from(results.values()).map(r => r.score);
      summary.averageScore = scores.length > 0 ? 
        Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

      // Generate report if requested
      let report: string | undefined;
      if (request.generateReport) {
        report = scientific4DVerifier.generateScientificReport(results);
      }

      console.log(`✅ API: Batch verification complete - Average score: ${summary.averageScore}/100`);

      return {
        success: true,
        results,
        report,
        summary,
        timestamp: new Date().toISOString(),
        batchId
      };
      
    } catch (error) {
      console.error(`❌ API: Batch verification failed:`, error);
      return {
        success: false,
        summary: {
          totalShapes: request.shapes.length,
          highAccuracy: 0,
          mediumAccuracy: 0,
          lowAccuracy: 0,
          averageScore: 0
        },
        timestamp: new Date().toISOString(),
        batchId
      };
    }
  }

  /**
   * Get verification status for all known 4D shapes
   */
  async getSystemVerificationStatus(): Promise<{
    totalShapes: number;
    verifiedShapes: number;
    verificationCoverage: number;
    criticalIssues: string[];
    lastVerification: string;
  }> {
    console.log('📊 API: Getting system verification status...');
    
    const known4DShapes: SurfaceType[] = [
      'tesseract_4d', 'hypersphere_4d', 'klein_bottle_4d', 'duocylinder_4d',
      'simplex_5cell', 'cross_polytope_16cell', 'mobius_strip_4d', 'hopf_fibration',
      'clifford_torus', 'duoprism', 'stereographic_projection', 'pentachoron',
      'hyperboloid_two_sheet', 'lissajous_knot'
    ];

    const verificationRequests: API4DVerificationRequest[] = known4DShapes.map(shape => ({
      shapeType: shape,
      verificationLevel: 'basic'
    }));

    const batchResponse = await this.verifyBatch({
      shapes: verificationRequests,
      generateReport: false
    });

    const criticalIssues: string[] = [];
    let verifiedCount = 0;

    if (batchResponse.results) {
      for (const [shapeType, result] of batchResponse.results) {
        if (result.score >= 70) {
          verifiedCount++;
        } else {
          criticalIssues.push(`${shapeType}: Score ${result.score}/100`);
        }
      }
    }

    const verificationCoverage = (verifiedCount / known4DShapes.length) * 100;

    return {
      totalShapes: known4DShapes.length,
      verifiedShapes: verifiedCount,
      verificationCoverage: Math.round(verificationCoverage),
      criticalIssues,
      lastVerification: new Date().toISOString()
    };
  }

  /**
   * Get detailed scientific information for a 4D shape
   */
  async getShapeScientificInfo(shapeType: SurfaceType): Promise<{
    mathematicalDefinition: string;
    knownProperties: string[];
    literatureReferences: string[];
    dimensionalCharacteristics: any;
    symmetryGroup: string;
    applications: string[];
  }> {
    console.log(`📚 API: Getting scientific info for ${shapeType}`);
    
    // This would integrate with the scientific database
    return {
      mathematicalDefinition: `Mathematical definition for ${shapeType}`,
      knownProperties: ['Property 1', 'Property 2'],
      literatureReferences: ['Reference 1', 'Reference 2'],
      dimensionalCharacteristics: {},
      symmetryGroup: 'Unknown',
      applications: ['Application 1', 'Application 2']
    };
  }

  private applyVerificationLevel(
    result: Scientific4DVerificationResult, 
    level: 'basic' | 'comprehensive' | 'research'
  ): Scientific4DVerificationResult {
    switch (level) {
      case 'basic':
        // Return essential verification data only
        return {
          ...result,
          issues: result.issues.slice(0, 3), // Limit issues
          recommendations: result.recommendations.slice(0, 3)
        };
      
      case 'comprehensive':
        // Return full verification data
        return result;
      
      case 'research':
        // Return all data plus additional research metrics
        return {
          ...result,
          recommendations: [
            ...result.recommendations,
            'Consider peer review for research applications',
            'Validate against experimental data if available'
          ]
        };
      
      default:
        return result;
    }
  }

  private getCacheKey(shapeType: SurfaceType, parameters: SurfaceParameters): string {
    // Create cache key based on shape type and key parameters
    const keyParams = [
      parameters.a, parameters.b, parameters.c, parameters.d,
      parameters.uSegments, parameters.vSegments
    ].join('-');
    return `${shapeType}-${keyParams}`;
  }

  private generateVerificationId(request: API4DVerificationRequest): string {
    return `verify-${request.shapeType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBatchId(): string {
    return `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear verification cache
  clearCache(): void {
    this.verificationCache.clear();
    console.log('🗑️ API: Verification cache cleared');
  }

  // Get cache statistics
  getCacheStats(): {
    size: number;
    hitRate: number;
    lastCleared: string;
  } {
    return {
      size: this.verificationCache.size,
      hitRate: 0, // Would track in production
      lastCleared: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const scientific4DAPI = new Scientific4DAPI();

// Convenience functions for common use cases
export async function verifyShape4D(shapeType: SurfaceType, parameters?: SurfaceParameters): Promise<Scientific4DVerificationResult | null> {
  const response = await scientific4DAPI.verifyShape({
    shapeType,
    parameters,
    verificationLevel: 'comprehensive'
  });
  
  return response.success ? response.data || null : null;
}

export async function quickVerify4D(shapeType: SurfaceType): Promise<number> {
  const response = await scientific4DAPI.verifyShape({
    shapeType,
    verificationLevel: 'basic'
  });
  
  return response.success && response.data ? response.data.score : 0;
}

export async function verifyAll4DShapes(): Promise<Map<SurfaceType, Scientific4DVerificationResult> | null> {
  const known4DShapes: SurfaceType[] = [
    'tesseract_4d', 'hypersphere_4d', 'klein_bottle_4d', 'hopf_fibration',
    'clifford_torus', 'simplex_5cell', 'cross_polytope_16cell'
  ];

  const batchResponse = await scientific4DAPI.verifyBatch({
    shapes: known4DShapes.map(shape => ({
      shapeType: shape,
      verificationLevel: 'comprehensive'
    })),
    generateReport: true
  });

  return batchResponse.success ? batchResponse.results || null : null;
}
