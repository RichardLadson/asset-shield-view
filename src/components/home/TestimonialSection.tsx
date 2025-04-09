
import { cn } from "@/lib/utils";

const testimonials = [
  {
    content:
      "Shield Your Assets helped me protect my life savings while qualifying for Medicaid. Their expertise in navigating complex regulations was invaluable.",
    author: "James Wilson",
    role: "Retired Teacher",
  },
  {
    content:
      "After trying to understand Medicaid planning on my own, I turned to Shield Your Assets. Their guidance saved us thousands and gave us peace of mind.",
    author: "Rebecca Johnson",
    role: "Family Caregiver",
    featured: true,
  },
  {
    content:
      "The team at Shield Your Assets made a complicated process seem simple. They created a personalized strategy that protected our family home.",
    author: "Michael Rodriguez",
    role: "Small Business Owner",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-shield-navy sm:text-4xl">
            Client Success Stories
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
            Hear from clients who have successfully protected their assets while qualifying for Medicaid.
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                "rounded-2xl bg-white p-6 shadow-lg border",
                testimonial.featured
                  ? "border-shield-teal ring-1 ring-shield-teal relative"
                  : "border-gray-200"
              )}
            >
              {testimonial.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-shield-teal text-white text-xs font-semibold py-1 px-3 rounded-full">
                  Featured
                </div>
              )}
              <div className="relative">
                <p className="text-lg font-medium text-gray-900 before:content-['"'] before:text-5xl before:text-shield-teal/30 before:absolute before:-top-4 before:-left-2 before:opacity-70 before:leading-none">
                  {testimonial.content}
                </p>
                <footer className="mt-6">
                  <p className="text-base font-bold text-shield-navy">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
