
import { SurfaceParameters } from '../types/math';

interface HDRBloomRendererProps {
  children: React.ReactNode;
  parameters: SurfaceParameters;
  enabled?: boolean;
}

export default function HDRBloomRenderer({ children, parameters, enabled = true }: HDRBloomRendererProps) {
  // Simplified version without postprocessing effects to prevent import errors
  // Just renders children directly
  return <>{children}</>;
}
