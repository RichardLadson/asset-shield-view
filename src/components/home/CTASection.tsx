
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <div className="bg-shield-navy">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to protect your assets?</span>
          <span className="block text-shield-teal">Start your Medicaid planning today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Link to="/asset-input">
              <Button className="flex items-center justify-center rounded-md border border-transparent bg-shield-teal px-5 py-3 text-base font-medium text-white hover:bg-shield-teal/90">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Link to="/about">
              <Button variant="outline" className="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-shield-navy hover:bg-gray-50">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
