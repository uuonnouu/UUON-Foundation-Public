import { Component, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error) {
    console.warn("3D renderer error caught by boundary:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-gray-950">
          <div className="max-w-xl mx-4 p-8 rounded-xl border border-cyan-500/40 bg-gray-900/95 text-center">
            <h2 className="text-xl font-bold text-cyan-400 mb-3">3D Preview Unavailable</h2>
            <p className="text-gray-300 text-sm mb-5">
              WebGL is not available in this embedded preview. Open the app in a new tab to see the full 3D visualization.
            </p>
            <Button
              onClick={() => window.open(window.location.href, "_blank")}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
