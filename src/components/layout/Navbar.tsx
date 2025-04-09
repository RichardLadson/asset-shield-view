
import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-shield-navy" />
              <span className="ml-2 text-xl font-semibold text-shield-navy">
                Medicaid Planning Pro
              </span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-shield-navy px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/asset-input"
                className="text-gray-600 hover:text-shield-navy px-3 py-2 rounded-md text-sm font-medium"
              >
                Asset Input
              </Link>
              <Link
                to="/results"
                className="text-gray-600 hover:text-shield-navy px-3 py-2 rounded-md text-sm font-medium"
              >
                Results
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-shield-navy px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
              <Button className="bg-shield-teal hover:bg-shield-teal/90 text-white">
                Get Started
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-shield-navy"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden",
          isMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className="text-gray-600 hover:bg-shield-navy hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/asset-input"
            className="text-gray-600 hover:bg-shield-navy hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Asset Input
          </Link>
          <Link
            to="/results"
            className="text-gray-600 hover:bg-shield-navy hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Results
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:bg-shield-navy hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Button 
            className="w-full mt-2 bg-shield-teal hover:bg-shield-teal/90 text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

