
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MedicaidIntakeForm from "../components/inputs/MedicaidIntakeForm";

const AssetInputPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <MedicaidIntakeForm />
      </main>
      <Footer />
    </div>
  );
};

export default AssetInputPage;
