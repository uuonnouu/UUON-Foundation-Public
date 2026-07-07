
import { SurfaceParameters } from '../types/math';

interface ChromaticAberrationProps {
  parameters: SurfaceParameters;
  enabled?: boolean;
}

export default function ChromaticAberration({ parameters, enabled = true }: ChromaticAberrationProps) {
  // Simplified version without postprocessing effects
  // Returns null for now to prevent import errors
  return null;
}
