
import { Facebook, Instagram, Twitter, Globe, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ocean-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Puerto Lopez <span className="text-coral">Unveiled</span></h3>
            <p className="text-gray-300 mb-4">
              Discover the natural beauty, cultural richness, and endless adventures of Ecuador's most enchanting coastal paradise.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-coral transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-coral transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-coral transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#attractions" className="text-gray-300 hover:text-white transition-colors">Attractions</a>
              </li>
              <li>
                <a href="#activities" className="text-gray-300 hover:text-white transition-colors">Activities</a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Gallery</a>
              </li>
              <li>
                <a href="#virtual-tour" className="text-gray-300 hover:text-white transition-colors">Virtual Tour</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Travel Guide</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Globe size={20} className="mr-2 mt-0.5 text-coral flex-shrink-0" />
                <span className="text-gray-300">Puerto Lopez, Manabí, Ecuador</span>
              </li>
              <li className="flex items-start">
                <Mail size={20} className="mr-2 mt-0.5 text-coral flex-shrink-0" />
                <span className="text-gray-300">info@puertolopez.unveiled.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 mt-0.5 text-coral flex-shrink-0" />
                <span className="text-gray-300">+593 2 123 4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Puerto Lopez Unveiled. All rights reserved.</p>
          <p className="mt-2 text-sm">
            A showcase of Ecuador's coastal paradise. Designed with ❤️ for nature lovers and adventure seekers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
