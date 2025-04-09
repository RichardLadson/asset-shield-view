
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pt-14 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 lg:max-w-2xl lg:w-full">
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-shield-navy sm:text-5xl md:text-6xl">
                <span className="block">Protect Your Assets</span>
                <span className="block text-shield-teal">For Medicaid Eligibility</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Strategic planning to protect your wealth while ensuring you qualify for the care you need. Shield Your Assets provides comprehensive Medicaid planning services.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/asset-input">
                    <Button className="flex w-full items-center justify-center rounded-md border border-transparent bg-shield-navy px-8 py-3 text-base font-medium text-white hover:bg-shield-navy/90 md:px-10 md:py-4 md:text-lg">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link to="/about">
                    <Button className="flex w-full items-center justify-center rounded-md border border-transparent bg-shield-teal px-8 py-3 text-base font-medium text-white hover:bg-shield-teal/90 md:px-10 md:py-4 md:text-lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full bg-shield-lightBlue flex items-center justify-center">
          <Shield className="h-48 w-48 text-shield-navy opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
