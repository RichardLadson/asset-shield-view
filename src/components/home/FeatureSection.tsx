
import { 
  Shield, 
  Coins, 
  FileText, 
  Clock, 
  Briefcase, 
  UserCheck 
} from "lucide-react";

const features = [
  {
    name: 'Asset Protection',
    description:
      'Strategic planning to shield your assets from being counted against Medicaid eligibility requirements.',
    icon: Shield,
  },
  {
    name: 'Financial Analysis',
    description:
      'Comprehensive analysis of your financial situation to identify opportunities for protection.',
    icon: Coins,
  },
  {
    name: 'Legal Documentation',
    description:
      'Preparation of all necessary legal documents to ensure your assets are properly protected.',
    icon: FileText,
  },
  {
    name: 'Long-term Planning',
    description:
      'Future-focused strategies that consider both immediate needs and long-term care requirements.',
    icon: Clock,
  },
  {
    name: 'Trust Creation',
    description:
      'Establishment of appropriate trusts to protect assets while maintaining Medicaid eligibility.',
    icon: Briefcase,
  },
  {
    name: 'Eligibility Guidance',
    description:
      'Expert guidance through the complex Medicaid eligibility process to ensure approval.',
    icon: UserCheck,
  },
];

const FeatureSection = () => {
  return (
    <div className="bg-shield-gray py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-lg font-semibold text-shield-teal">Medicaid Planning</h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-shield-navy sm:text-4xl">
            Comprehensive Asset Protection
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our services are designed to help you navigate the complex world of Medicaid planning while protecting what you've worked so hard to build.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root rounded-lg bg-white px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-shield-teal p-3 shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-shield-navy">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
