
import crypto from 'crypto';

// Obfuscate mathematical constants and algorithms
export const obfuscateConstants = () => {
  const constants = {
    // Mathematical constants with obfuscated names
    π: Math.PI,
    φ: (1 + Math.sqrt(5)) / 2, // Golden ratio
    e: Math.E,
    τ: 2 * Math.PI,
    // Euler-Mascheroni constant
    γ: 0.5772156649015329
  };
  
  // Create encoded lookup table
  const encoded = Object.entries(constants).reduce((acc, [key, value]) => {
    const encodedKey = Buffer.from(key).toString('base64');
    const encodedValue = Buffer.from(value.toString()).toString('base64');
    acc[encodedKey] = encodedValue;
    return acc;
  }, {} as Record<string, string>);
  
  return encoded;
};

// Generate dynamic mathematical seeds
export const generateMathSeed = (): string => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(16).toString('hex');
  const seed = crypto.createHash('sha256')
    .update(`${timestamp}-${random}-dimensional-math`)
    .digest('hex');
  
  return seed;
};

// Protect parametric equations
export const encryptEquation = (equation: string): string => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-cbc', key);
  
  let encrypted = cipher.update(equation, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${key.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
};

// SHA-256 based parameter validation
export const generateParameterHash = (params: any): string => {
  const paramString = JSON.stringify(params, Object.keys(params).sort());
  return crypto.createHash('sha256').update(paramString).digest('hex');
};

// Anti-debugging techniques
export const generateAntiDebugCode = (): string => {
  return `
    // Anti-debugging protection
    (function() {
      const checkDebugger = () => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
          document.body.innerHTML = '';
          window.location.href = 'about:blank';
        }
      };
      
      setInterval(checkDebugger, 1000);
      
      // Disable right-click
      document.addEventListener('contextmenu', e => e.preventDefault());
      
      // Disable F12, Ctrl+Shift+I, etc.
      document.addEventListener('keydown', e => {
        if (e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
            (e.ctrlKey && e.keyCode === 85)) {
          e.preventDefault();
          return false;
        }
      });
      
      // Detect DevTools
      let devtools = { open: false };
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || 
            window.outerWidth - window.innerWidth > 200) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
            console.log('%cDimensional Mathematics - Protected Application', 
                       'color: red; font-size: 20px; font-weight: bold;');
          }
        }
      }, 500);
    })();
  `;
};
