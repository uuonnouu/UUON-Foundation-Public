import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HashMarketplace from "@/components/HashMarketplace";
import "@fontsource/inter";
import MathVisualizer from "./components/MathVisualizer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen" style={{ 
        backgroundColor: '#0a0a0a', 
        color: '#ffffff',
        overflow: 'hidden'
      }}>
        <MathVisualizer />
      </div>
    </QueryClientProvider>
  );
}

export default App;