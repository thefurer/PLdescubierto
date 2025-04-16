
import { Mail, Phone, MessageSquare, Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type ContactProps = {
  className?: string;
};

const Contact = ({ className }: ContactProps) => {
  return (
    <section 
      id="contact" 
      className={cn("py-20 bg-white", className)}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-dark mb-4">
            Contact <span className="text-coral">Our Advisors</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get personalized assistance to plan your dream vacation to Puerto Lopez. Our expert advisors are ready to help you create the perfect itinerary.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-ocean-dark mb-6">Get in Touch</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
                  placeholder="Trip Inquiry"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
                  placeholder="I'm interested in planning a trip to Puerto Lopez..."
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-ocean focus:ring-ocean"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  I agree to the privacy policy and terms of service
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-ocean text-white font-semibold rounded-lg hover:bg-ocean-dark transition-colors shadow-md"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information & Security */}
          <div className="flex flex-col gap-6">
            <div className="bg-ocean-light/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-ocean-dark mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-ocean-dark mb-1">Email Us</h4>
                    <p className="text-gray-600">info@puertolopez.unveiled.com</p>
                    <p className="text-gray-600">bookings@puertolopez.unveiled.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-ocean-dark mb-1">Call Us</h4>
                    <p className="text-gray-600">+593 2 123 4567</p>
                    <p className="text-gray-600">+593 9 876 5432</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center mr-4">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-ocean-dark mb-1">Live Chat</h4>
                    <p className="text-gray-600">Available 24/7 for immediate assistance</p>
                    <button className="mt-2 px-4 py-2 bg-ocean text-white text-sm rounded-lg hover:bg-ocean-dark transition-colors">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ocean-light/30 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-ocean-dark mb-4">Your Security Guaranteed</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                    <Lock size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-ocean-dark mb-1">Secure Communications</h4>
                    <p className="text-gray-600 text-sm">All communications are encrypted and secure</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-ocean-dark mb-1">Data Protection</h4>
                    <p className="text-gray-600 text-sm">Your personal information is protected by our privacy policy</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
                <h4 className="text-base font-semibold text-ocean-dark mb-2">Customization Options</h4>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                    <span>Personalized itineraries</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                    <span>Group and private tours</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                    <span>Accommodation preferences</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                    <span>Special dietary requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
