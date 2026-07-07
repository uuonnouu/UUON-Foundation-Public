// Letter-based decimal pattern system for geometric visualization
export interface LetterPattern {
  letter: string;
  value: number;
  mirrorValue: number;
  description: string;
}

export const LETTER_PATTERNS: Record<string, LetterPattern> = {
  // Balanced letter patterns - equal repetitions on both sides of decimal
  'a': { letter: 'a', value: 0.0, mirrorValue: 0.0, description: 'Origin point (0|0)' },
  'A': { letter: 'A', value: 0.0, mirrorValue: 0.0, description: 'Origin point (0|0)' },
  
  'b': { letter: 'b', value: 1.1, mirrorValue: 1.1, description: 'Single 1 on each side' },
  'B': { letter: 'B', value: 1.1, mirrorValue: 1.1, description: 'Single 1 on each side' },
  
  'c': { letter: 'c', value: 22.22, mirrorValue: 22.22, description: 'Double 2s on each side' },
  'C': { letter: 'C', value: 22.22, mirrorValue: 22.22, description: 'Double 2s on each side' },
  
  'd': { letter: 'd', value: 333.333, mirrorValue: 333.333, description: 'Triple 3s on each side' },
  'D': { letter: 'D', value: 333.333, mirrorValue: 333.333, description: 'Triple 3s on each side' },
  
  'e': { letter: 'e', value: 4444.4444, mirrorValue: 4444.4444, description: 'Quad 4s on each side' },
  'E': { letter: 'E', value: 4444.4444, mirrorValue: 4444.4444, description: 'Quad 4s on each side' },
  
  'f': { letter: 'f', value: 55555.55555, mirrorValue: 55555.55555, description: 'Five 5s on each side' },
  'F': { letter: 'F', value: 55555.55555, mirrorValue: 55555.55555, description: 'Five 5s on each side' },
  
  'g': { letter: 'g', value: 666666.666666, mirrorValue: 666666.666666, description: 'Six 6s on each side' },
  'G': { letter: 'G', value: 666666.666666, mirrorValue: 666666.666666, description: 'Six 6s on each side' },
  
  'h': { letter: 'h', value: 7777777.7777777, mirrorValue: 7777777.7777777, description: 'Seven 7s on each side' },
  'H': { letter: 'H', value: 7777777.7777777, mirrorValue: 7777777.7777777, description: 'Seven 7s on each side' },
  
  'i': { letter: 'i', value: 88888888.88888888, mirrorValue: 88888888.88888888, description: 'Eight 8s on each side' },
  'I': { letter: 'I', value: 88888888.88888888, mirrorValue: 88888888.88888888, description: 'Eight 8s on each side' },
  
  'j': { letter: 'j', value: 999999999.999999999, mirrorValue: 999999999.999999999, description: 'Nine 9s on each side' },
  'J': { letter: 'J', value: 999999999.999999999, mirrorValue: 999999999.999999999, description: 'Nine 9s on each side' },
  
  'k': { letter: 'k', value: 1010101010.1010101010, mirrorValue: 1010101010.1010101010, description: 'Ten 10s on each side' },
  'K': { letter: 'K', value: 1010101010.1010101010, mirrorValue: 1010101010.1010101010, description: 'Ten 10s on each side' },
  
  'l': { letter: 'l', value: 11111111111.11111111111, mirrorValue: 11111111111.11111111111, description: 'Eleven 1s on each side' },
  'L': { letter: 'L', value: 11111111111.11111111111, mirrorValue: 11111111111.11111111111, description: 'Eleven 1s on each side' },
  
  'm': { letter: 'm', value: 121212121212.121212121212, mirrorValue: 121212121212.121212121212, description: 'Twelve 12s on each side' },
  'M': { letter: 'M', value: 121212121212.121212121212, mirrorValue: 121212121212.121212121212, description: 'Twelve 12s on each side' },
  
  'n': { letter: 'n', value: 13131313131313.13131313131313, mirrorValue: 13131313131313.13131313131313, description: 'Thirteen 13s on each side' },
  'N': { letter: 'N', value: 13131313131313.13131313131313, mirrorValue: 13131313131313.13131313131313, description: 'Thirteen 13s on each side' },
  
  'o': { letter: 'o', value: 1414141414141414.1414141414141414, mirrorValue: 1414141414141414.1414141414141414, description: 'Fourteen 14s on each side' },
  'O': { letter: 'O', value: 1414141414141414.1414141414141414, mirrorValue: 1414141414141414.1414141414141414, description: 'Fourteen 14s on each side' },
  
  'p': { letter: 'p', value: 151515151515151515.151515151515151515, mirrorValue: 151515151515151515.151515151515151515, description: 'Fifteen 15s on each side' },
  'P': { letter: 'P', value: 151515151515151515.151515151515151515, mirrorValue: 151515151515151515.151515151515151515, description: 'Fifteen 15s on each side' },
  
  'q': { letter: 'q', value: 16161616161616161616.16161616161616161616, mirrorValue: 16161616161616161616.16161616161616161616, description: 'Sixteen 16s on each side' },
  'Q': { letter: 'Q', value: 16161616161616161616.16161616161616161616, mirrorValue: 16161616161616161616.16161616161616161616, description: 'Sixteen 16s on each side' },
  
  'r': { letter: 'r', value: 1717171717171717171717.1717171717171717171717, mirrorValue: 1717171717171717171717.1717171717171717171717, description: 'Seventeen 17s on each side' },
  'R': { letter: 'R', value: 1717171717171717171717.1717171717171717171717, mirrorValue: 1717171717171717171717.1717171717171717171717, description: 'Seventeen 17s on each side' },
  
  's': { letter: 's', value: 181818181818181818181818.181818181818181818181818, mirrorValue: 181818181818181818181818.181818181818181818181818, description: 'Eighteen 18s on each side' },
  'S': { letter: 'S', value: 181818181818181818181818.181818181818181818181818, mirrorValue: 181818181818181818181818.181818181818181818181818, description: 'Eighteen 18s on each side' },
  
  't': { letter: 't', value: 19191919191919191919191919.19191919191919191919191919, mirrorValue: 19191919191919191919191919.19191919191919191919191919, description: 'Nineteen 19s on each side' },
  'T': { letter: 'T', value: 19191919191919191919191919.19191919191919191919191919, mirrorValue: 19191919191919191919191919.19191919191919191919191919, description: 'Nineteen 19s on each side' },
  
  'u': { letter: 'u', value: 2020202020202020202020202020.2020202020202020202020202020, mirrorValue: 2020202020202020202020202020.2020202020202020202020202020, description: 'Twenty 20s on each side' },
  'U': { letter: 'U', value: 2020202020202020202020202020.2020202020202020202020202020, mirrorValue: 2020202020202020202020202020.2020202020202020202020202020, description: 'Twenty 20s on each side' },
  
  'v': { letter: 'v', value: 212121212121212121212121212121.212121212121212121212121212121, mirrorValue: 212121212121212121212121212121.212121212121212121212121212121, description: 'Twenty-one 21s on each side' },
  'V': { letter: 'V', value: 212121212121212121212121212121.212121212121212121212121212121, mirrorValue: 212121212121212121212121212121.212121212121212121212121212121, description: 'Twenty-one 21s on each side' },
  
  'w': { letter: 'w', value: 22222222222222222222222222222222.22222222222222222222222222222222, mirrorValue: 22222222222222222222222222222222.22222222222222222222222222222222, description: 'Twenty-two 2s on each side' },
  'W': { letter: 'W', value: 22222222222222222222222222222222.22222222222222222222222222222222, mirrorValue: 22222222222222222222222222222222.22222222222222222222222222222222, description: 'Twenty-two 2s on each side' },
  
  'x': { letter: 'x', value: 2323232323232323232323232323232323.2323232323232323232323232323232323, mirrorValue: 2323232323232323232323232323232323.2323232323232323232323232323232323, description: 'Twenty-three 23s on each side (11.5 pairs)' },
  'X': { letter: 'X', value: 2323232323232323232323232323232323.2323232323232323232323232323232323, mirrorValue: 2323232323232323232323232323232323.2323232323232323232323232323232323, description: 'Twenty-three 23s on each side (11.5 pairs)' },
  
  'y': { letter: 'y', value: 242424242424242424242424242424242424.242424242424242424242424242424242424, mirrorValue: 242424242424242424242424242424242424.242424242424242424242424242424242424, description: 'Twenty-four 24s on each side (12 pairs)' },
  'Y': { letter: 'Y', value: 242424242424242424242424242424242424.242424242424242424242424242424242424, mirrorValue: 242424242424242424242424242424242424.242424242424242424242424242424242424, description: 'Twenty-four 24s on each side (12 pairs)' },
  
  'z': { letter: 'z', value: 25252525252525252525252525252525252525.25252525252525252525252525252525252525, mirrorValue: 25252525252525252525252525252525252525.25252525252525252525252525252525252525, description: 'Twenty-five 25s on each side (12.5 pairs)' },
  'Z': { letter: 'Z', value: 25252525252525252525252525252525252525.25252525252525252525252525252525252525, mirrorValue: 25252525252525252525252525252525252525.25252525252525252525252525252525252525, description: 'Twenty-five 25s on each side (12.5 pairs)' }
};

export function getLetterValue(letter: string, useMirror: boolean = false, useNegative: boolean = false): number {
  const pattern = LETTER_PATTERNS[letter.toLowerCase()];
  if (!pattern) return 1.0;
  
  let value = useMirror ? pattern.mirrorValue : pattern.value;
  
  // Apply negative transformation - all letters except A become negative
  if (useNegative && letter.toUpperCase() !== 'A') {
    value = -value;
  }
  
  return value;
}

export function createGeometricPattern(
  letters: string, 
  useMirror: boolean = false,
  complexity: number = 1,
  useNegative: boolean = false
): { a: number; b: number; c: number } {
  const letterArray = letters.split('').filter(l => LETTER_PATTERNS[l] || isExtendedDimension(l));
  
  if (letterArray.length === 0) {
    return { a: 1, b: 1, c: 1 };
  }
  
  const a = getExtendedLetterValue(letterArray[0], useMirror, useNegative) * complexity;
  const b = letterArray.length > 1 ? getExtendedLetterValue(letterArray[1], useMirror, useNegative) * complexity : a;
  const c = letterArray.length > 2 ? getExtendedLetterValue(letterArray[2], useMirror, useNegative) * complexity : b;
  
  return { a, b, c };
}

// Extended dimensional patterns beyond Z (26+)
export function getExtendedLetterValue(character: string, useMirror: boolean = false, useNegative: boolean = false): number {
  // First check standard patterns
  if (LETTER_PATTERNS[character]) {
    let value = LETTER_PATTERNS[character].value;
    if (useNegative && character.toUpperCase() !== 'A') {
      value = -value;
    }
    return value;
  }
  
  // Extended patterns for higher dimensions
  const extendedPatterns = generateExtendedPattern(character);
  return extendedPatterns?.value || 1.0;
}

export function isExtendedDimension(character: string): boolean {
  // Support Greek letters, numbers, and symbols for extended dimensions
  const greekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
  const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const symbols = ['∞', '∆', '∇', '∑', '∏', '∫', '∂', '∝', '≈', '≡'];
  
  return greekLetters.includes(character) || numbers.includes(character) || symbols.includes(character);
}

export function generateExtendedPattern(character: string, useNegative: boolean = false): { value: number; description: string } | null {
  const dimension = getCharacterDimension(character);
  if (dimension === null) return null;
  
  // Generate balanced pattern for any dimension
  const patternLength = Math.floor(dimension / 2);
  const isOdd = dimension % 2 === 1;
  
  let leftSide = '';
  let rightSide = '';
  
  // Create the repeating pattern
  const digitPattern = (dimension % 10).toString() + ((dimension + 1) % 10).toString();
  
  for (let i = 0; i < patternLength; i++) {
    leftSide += digitPattern;
    rightSide += digitPattern;
  }
  
  // Handle the odd case with extra half pattern
  if (isOdd) {
    leftSide += (dimension % 10).toString();
    rightSide += (dimension % 10).toString();
  }
  
  let value = parseFloat(leftSide + '.' + rightSide);
  
  // Apply negative transformation if requested
  if (useNegative) {
    value = -value;
  }
  
  return {
    value,
    description: `Dimension ${dimension}: ${useNegative ? '-' : ''}${patternLength}${isOdd ? '.5' : ''} pairs of ${digitPattern} on each side`
  };
}

export function getCharacterDimension(character: string): number | null {
  // Greek letters start from dimension 26
  const greekLetters = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω'];
  const greekIndex = greekLetters.indexOf(character);
  if (greekIndex !== -1) return 26 + greekIndex;
  
  // Numbers represent their value + 50
  if (/\d/.test(character)) return 50 + parseInt(character);
  
  // Mathematical symbols start from dimension 60
  const symbols = ['∞', '∆', '∇', '∑', '∏', '∫', '∂', '∝', '≈', '≡'];
  const symbolIndex = symbols.indexOf(character);
  if (symbolIndex !== -1) return 60 + symbolIndex;
  
  return null;
}

// Multi-dimensional grid system
export function createMultiDimensionalGrid(
  dimensions: string[],
  gridSize: number = 5
): Array<{ position: number[]; value: number; pattern: string }> {
  const grid: Array<{ position: number[]; value: number; pattern: string }> = [];
  
  function generateGridPoints(dimIndex: number, currentPosition: number[]): void {
    if (dimIndex >= dimensions.length) {
      const pattern = dimensions.map((dim, idx) => `${dim}${currentPosition[idx]}`).join('');
      const value = dimensions.reduce((acc, dim, idx) => {
        const dimValue = getExtendedLetterValue(dim, false);
        const positionMultiplier = (currentPosition[idx] + 1) / gridSize;
        return acc + dimValue * positionMultiplier;
      }, 0) / dimensions.length;
      
      grid.push({
        position: [...currentPosition],
        value,
        pattern
      });
      return;
    }
    
    for (let i = 0; i < gridSize; i++) {
      generateGridPoints(dimIndex + 1, [...currentPosition, i]);
    }
  }
  
  generateGridPoints(0, []);
  return grid;
}

export function getAvailableLetters(): string[] {
  return Object.keys(LETTER_PATTERNS);
}

export function getPatternDescription(letter: string): string {
  const pattern = LETTER_PATTERNS[letter.toLowerCase()];
  return pattern ? pattern.description : 'Unknown pattern';
}