
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ResultsDashboard from "../components/results/ResultsDashboard";
import { usePlanningContext } from "@/context/PlanningContext";
import { toast } from "@/hooks/use-toast";

const ResultsPage = () => {
  const { eligibilityResults, planningResults, clientInfo } = usePlanningContext();
  const navigate = useNavigate();

  // Check if we have results, if not redirect to form
  useEffect(() => {
    if (!eligibilityResults && !planningResults) {
      console.log("No results available, redirecting to intake form");
      toast({
        title: "No Results Available",
        description: "Please complete the form to see your results.",
        variant: "destructive",
      });
      navigate("/asset-input");
    } else if (!clientInfo?.name) {
      console.log("Missing client info, redirecting to intake form");
      toast({
        title: "Missing Client Information",
        description: "Please complete the client information section before viewing results.",
        variant: "destructive",
      });
      navigate("/asset-input");
    }
  }, [eligibilityResults, planningResults, clientInfo, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ResultsDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default ResultsPage;
