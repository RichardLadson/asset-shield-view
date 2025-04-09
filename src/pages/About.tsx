import { Shield, Clock, Users, Award, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <section className="bg-shield-navy py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Shield Your Assets</h1>
              <p className="text-xl text-gray-300 mb-8">
                We're dedicated to helping individuals and families protect their hard-earned assets
                while navigating the complex world of Medicaid planning.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/asset-input">
                  <Button className="bg-shield-teal hover:bg-shield-teal/90 text-white">
                    Start Your Plan
                  </Button>
                </Link>
                <a href="#contact">
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-shield-navy mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                Shield Your Assets is committed to empowering individuals and families to protect their financial legacy while ensuring access to essential long-term care through Medicaid. We believe everyone deserves to preserve what they've worked for throughout their lives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center rounded-full bg-shield-lightBlue p-3 mb-4">
                  <Shield className="h-6 w-6 text-shield-navy" />
                </div>
                <h3 className="text-xl font-semibold text-shield-navy mb-2">Protection</h3>
                <p className="text-gray-600">
                  We develop personalized strategies to shield your assets from being depleted by long-term care costs.
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center rounded-full bg-shield-lightBlue p-3 mb-4">
                  <BookOpen className="h-6 w-6 text-shield-navy" />
                </div>
                <h3 className="text-xl font-semibold text-shield-navy mb-2">Education</h3>
                <p className="text-gray-600">
                  We empower clients with knowledge about Medicaid regulations and asset protection strategies.
                </p>
              </div>

              <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center rounded-full bg-shield-lightBlue p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-shield-navy" />
                </div>
                <h3 className="text-xl font-semibold text-shield-navy mb-2">Compliance</h3>
                <p className="text-gray-600">
                  We ensure all strategies adhere to legal requirements while maximizing protection.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-16 bg-shield-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-shield-navy mb-6">Years of Experience in Medicaid Planning</h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Our team brings decades of combined experience in elder law, financial planning, and Medicaid regulations. We've helped thousands of clients successfully protect their assets while qualifying for needed benefits.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Award className="h-6 w-6 text-shield-teal mr-4 mt-1" />
                      <div>
                        <h3 className="text-lg font-medium text-shield-navy">Certified Experts</h3>
                        <p className="text-gray-600">Our team includes certified elder law attorneys and financial advisors specialized in Medicaid planning.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-6 w-6 text-shield-teal mr-4 mt-1" />
                      <div>
                        <h3 className="text-lg font-medium text-shield-navy">Personalized Approach</h3>
                        <p className="text-gray-600">We recognize that every client's situation is unique, requiring customized strategies.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-6 w-6 text-shield-teal mr-4 mt-1" />
                      <div>
                        <h3 className="text-lg font-medium text-shield-navy">Proactive Planning</h3>
                        <p className="text-gray-600">We help clients plan ahead, maximizing protection through early implementation of strategies.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-shield-teal">2,500+</div>
                      <p className="text-gray-600 mt-2">Clients Protected</p>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-shield-teal">$750M+</div>
                      <p className="text-gray-600 mt-2">Assets Shielded</p>
                    </div>
                    <div className="h-px bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-5xl font-bold text-shield-teal">15+</div>
                      <p className="text-gray-600 mt-2">Years of Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-shield-navy mb-4">Our Expert Team</h2>
              <p className="text-lg text-gray-600">
                Shield Your Assets brings together professionals with expertise in elder law, financial planning, and healthcare to provide comprehensive Medicaid planning services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-shield-lightBlue mb-4 flex items-center justify-center">
                  <span className="text-shield-navy text-xl font-bold">JD</span>
                </div>
                <h3 className="text-xl font-semibold text-shield-navy">Jonathan Daniels</h3>
                <p className="text-shield-teal font-medium">Elder Law Attorney</p>
                <p className="text-gray-600 mt-2">
                  Specializing in asset protection strategies and Medicaid eligibility for over 15 years.
                </p>
              </div>

              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-shield-lightBlue mb-4 flex items-center justify-center">
                  <span className="text-shield-navy text-xl font-bold">RM</span>
                </div>
                <h3 className="text-xl font-semibold text-shield-navy">Rebecca Martinez</h3>
                <p className="text-shield-teal font-medium">Financial Advisor</p>
                <p className="text-gray-600 mt-2">
                  Expert in retirement planning and long-term care financial strategies with 12 years experience.
                </p>
              </div>

              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-full bg-shield-lightBlue mb-4 flex items-center justify-center">
                  <span className="text-shield-navy text-xl font-bold">MS</span>
                </div>
                <h3 className="text-xl font-semibold text-shield-navy">Michael Stevens</h3>
                <p className="text-shield-teal font-medium">Medicaid Specialist</p>
                <p className="text-gray-600 mt-2">
                  Former state Medicaid caseworker with insider knowledge of eligibility requirements and processes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-shield-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-shield-navy mb-4">Get in Touch</h2>
                  <p className="text-lg text-gray-600">
                    Have questions about Medicaid planning or how we can help protect your assets? Contact us today for a free consultation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-shield-navy mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 text-shield-teal">📍</div>
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-gray-600">123 Financial Street, New York, NY 10001</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 text-shield-teal">📞</div>
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-gray-600">(555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 text-shield-teal">✉️</div>
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">info@shieldyourassets.com</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="mt-1 mr-3 text-shield-teal">🕒</div>
                        <div>
                          <p className="font-medium">Office Hours</p>
                          <p className="text-gray-600">Monday-Friday: 9am-5pm</p>
                          <p className="text-gray-600">Saturday: By appointment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-shield-navy mb-4">Request a Consultation</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-1" htmlFor="first-name">
                            First Name
                          </label>
                          <input
                            type="text"
                            id="first-name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-shield-teal"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-1" htmlFor="last-name">
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="last-name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-shield-teal"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-shield-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1" htmlFor="phone">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-shield-teal"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-1" htmlFor="message">
                          How can we help you?
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-shield-teal"
                        />
                      </div>
                      <Button className="w-full bg-shield-navy hover:bg-shield-navy/90">
                        Request Consultation
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
