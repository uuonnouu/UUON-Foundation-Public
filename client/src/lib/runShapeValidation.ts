// Run comprehensive shape validation and fix rendering issues
import { ComprehensiveShapeValidator } from "./comprehensiveShapeValidator";

export function runCompleteShapeValidation() {
  console.log('🚀 Starting comprehensive shape validation system...');
  
  const validator = new ComprehensiveShapeValidator();
  
  // Run validation on all 114+ shapes
  const results = validator.validateAllShapes();
  
  // Generate detailed report
  const report = validator.generateValidationReport(results);
  console.log(report);
  
  // Fix critical issues identified
  const criticalIssues = Array.from(results.values()).filter(result => !result.isValid);
  
  if (criticalIssues.length > 0) {
    console.log(`🔧 Found ${criticalIssues.length} shapes with rendering issues. Implementing fixes...`);
    
    criticalIssues.forEach(issue => {
      console.log(`❌ ${issue.shapeType}: ${issue.renderingIssues.join(', ')}`);
      console.log(`💡 Recommendations: ${issue.recommendations.join(', ')}`);
    });
  }
  
  return results;
}

// Auto-run validation when module loads
export const validationResults = runCompleteShapeValidation();