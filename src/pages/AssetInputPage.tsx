
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AssetInput from "../components/inputs/AssetInput";

const AssetInputPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AssetInput />
      </main>
      <Footer />
    </div>
  );
};

export default AssetInputPage;
