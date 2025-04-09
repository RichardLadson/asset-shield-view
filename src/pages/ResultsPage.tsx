
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ResultsDashboard from "../components/results/ResultsDashboard";

const ResultsPage = () => {
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
