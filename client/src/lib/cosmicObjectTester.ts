// Quick cosmic object testing utility
// Tests all four cosmic objects for basic functionality

import { GRAVITY_WELL, WHITE_HOLE, WORMHOLE, ERGOSPHERE } from './cosmicObjects';

interface TestResult {
  shape: string;
  passed: boolean;
  errors: string[];
  parameterCount: number;
  sampleOutput: { x: number; y: number; z: number };
}

function testCosmicObject(name: string, equation: any): TestResult {
  const errors: string[] = [];
  let passed = true;
  let sampleOutput = { x: 0, y: 0, z: 0 };
  
  try {
    // Test with standard parameters
    const u = 0.5, v = 0.5;
    const params = [u, v, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    
    const x = equation.x(...params);
    const y = equation.y(...params);
    const z = equation.z(...params);
    
    sampleOutput = { x, y, z };
    
    // Check for NaN or infinite values
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      errors.push('Produces NaN values');
      passed = false;
    }
    
    if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
      errors.push('Produces infinite values');
      passed = false;
    }
    
    // Check reasonable output range
    const magnitude = Math.sqrt(x*x + y*y + z*z);
    if (magnitude > 1000 || magnitude < 0.001) {
      errors.push(`Output magnitude outside reasonable range: ${magnitude.toFixed(3)}`);
    }
    
    // Test parameter responsiveness
    let responsive = 0;
    const baseResult = { x, y, z };
    
    for (let i = 2; i < params.length; i++) {
      const testParams = [...params];
      testParams[i] = testParams[i] + 1;
      
      const testX = equation.x(...testParams);
      const testY = equation.y(...testParams);
      const testZ = equation.z(...testParams);
      
      const diff = Math.abs(testX - baseResult.x) + Math.abs(testY - baseResult.y) + Math.abs(testZ - baseResult.z);
      if (diff > 0.001) responsive++;
    }
    
    if (responsive < 15) {
      errors.push(`Only ${responsive}/23 parameters are responsive`);
    }
    
  } catch (error) {
    errors.push(`Execution error: ${error instanceof Error ? error.message : String(error)}`);
    passed = false;
  }
  
  return {
    shape: name,
    passed,
    errors,
    parameterCount: 25, // u, v + 23 parameters
    sampleOutput
  };
}

export function testAllCosmicObjects(): TestResult[] {
  console.log('Testing cosmic objects...');
  
  const results = [
    testCosmicObject('GRAVITY_WELL', GRAVITY_WELL),
    testCosmicObject('WHITE_HOLE', WHITE_HOLE),
    testCosmicObject('WORMHOLE', WORMHOLE),
    testCosmicObject('ERGOSPHERE', ERGOSPHERE)
  ];
  
  // Log results
  results.forEach(result => {
    console.log(`${result.shape}: ${result.passed ? 'PASS' : 'FAIL'}`);
    if (result.errors.length > 0) {
      console.log(`  Issues: ${result.errors.join(', ')}`);
    }
    console.log(`  Sample output: (${result.sampleOutput.x.toFixed(3)}, ${result.sampleOutput.y.toFixed(3)}, ${result.sampleOutput.z.toFixed(3)})`);
  });
  
  const totalPassed = results.filter(r => r.passed).length;
  console.log(`\nOverall: ${totalPassed}/4 cosmic objects passed validation`);
  
  return results;
}

// Auto-run test when imported
if (typeof window !== 'undefined') {
  // Browser environment - delay execution
  setTimeout(() => testAllCosmicObjects(), 1000);
} else {
  // Node environment - run immediately
  testAllCosmicObjects();
}