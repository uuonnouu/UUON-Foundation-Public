// Mathematical expression evaluator for parametric equations
export class MathEngine {
  private static readonly FUNCTIONS = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    exp: Math.exp,
    log: Math.log,
    sqrt: Math.sqrt,
    abs: Math.abs,
    pow: Math.pow,
    PI: Math.PI,
    E: Math.E
  };

  private static readonly OPERATORS = {
    '+': (a: number, b: number) => a + b,
    '-': (a: number, b: number) => a - b,
    '*': (a: number, b: number) => a * b,
    '/': (a: number, b: number) => a / b,
    '^': (a: number, b: number) => Math.pow(a, b),
    '**': (a: number, b: number) => Math.pow(a, b)
  };

  static evaluate(expression: string, variables: Record<string, number>): number {
    try {
      // Replace constants
      let processed = expression
        .replace(/PI/g, Math.PI.toString())
        .replace(/E/g, Math.E.toString());

      // Replace variables
      for (const [name, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\b${name}\\b`, 'g');
        processed = processed.replace(regex, value.toString());
      }

      // Replace mathematical functions
      processed = processed
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/exp\(/g, 'Math.exp(')
        .replace(/log\(/g, 'Math.log(')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/pow\(/g, 'Math.pow(')
        .replace(/\^/g, '**'); // Convert ^ to ** for power operator

      // Evaluate the expression safely
      const result = Function(`"use strict"; return (${processed})`)();
      
      return isNaN(result) ? 0 : result;
    } catch (error) {
      console.warn(`Error evaluating expression "${expression}":`, error);
      return 0;
    }
  }

  static validateExpression(expression: string): { isValid: boolean; error?: string } {
    try {
      // Test with dummy variables
      const testVars = { u: 1, v: 1, a: 1, b: 1, c: 1 };
      this.evaluate(expression, testVars);
      return { isValid: true };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Invalid expression' 
      };
    }
  }
}
