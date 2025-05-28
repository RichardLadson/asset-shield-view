
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AssetInputPage from "./pages/AssetInputPage";
import ResultsPage from "./pages/ResultsPage";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { PlanningProvider } from "./context/PlanningContext";

const queryClient = new QueryClient();

const App = () => {
  // Debug environment detection
  if (import.meta.env.DEV) {
    console.log("🚀 App running in DEVELOPMENT mode");
  } else {
    console.log("🚀 App running in PRODUCTION mode");
  }
  
  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Wrap all routes in the PlanningProvider */}
        <PlanningProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/asset-input" element={<AssetInputPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PlanningProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
