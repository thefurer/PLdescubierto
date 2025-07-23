
import { Facebook, Instagram, Twitter, Globe, Mail, Phone } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { useTranslations } from "@/hooks/useTranslations";

const Footer = () => {
  const { content } = useContentManager();
  const t = useTranslations();

  // Find footer content from database
  const footerContent = content.find(item => item.section_name === 'footer')?.content;

  // Default values with database content override
  const footerData = {
    companyName: footerContent?.companyName || "Puerto López Descubierto",
    description: footerContent?.description || "Descubre la belleza natural, riqueza cultural y aventuras sin fin del paraíso costero más encantador de Ecuador.",
    email: footerContent?.email || "apincay@gmail.com",
    phone: footerContent?.phone || "+593 99 199 5390",
    address: footerContent?.address || "Puerto López, Manabí, Ecuador"
  };

  return (
    <footer className="relative bg-gradient-to-br from-ocean-dark via-ocean to-ocean-dark text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="relative">
              <h3 className="text-2xl font-bold mb-4 text-white relative z-10">
                {footerData.companyName}
              </h3>
              <div className="absolute -top-2 -left-2 w-20 h-20 bg-coral/20 rounded-full blur-xl"></div>
            </div>
            <p className="text-blue-100 leading-relaxed text-sm">
              {footerData.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-coral group-hover:scale-110">
                  <Facebook size={18} className="text-white" />
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-coral group-hover:scale-110">
                  <Instagram size={18} className="text-white" />
                </div>
              </a>
              <a href="#" className="group">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-coral group-hover:scale-110">
                  <Twitter size={18} className="text-white" />
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-white">{t.quickLinks}</h3>
            <ul className="space-y-3">
              {[
                { text: t.home, href: "#home" },
                { text: t.attractions, href: "#attractions" },
                { text: t.virtualTour, href: "#virtual-tour" },
                { text: t.contact, href: "#contact" }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-blue-100 hover:text-white transition-all duration-300 relative group text-sm"
                  >
                    <span className="relative z-10">{item.text}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-coral transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-white">{t.resources}</h3>
            <ul className="space-y-3">
              {[
                { text: t.travelGuide, href: "/travel-guide" },
                { text: t.faq, href: "/faq" },
                { text: t.testimonials, href: "/testimonials" },
                { text: t.blog, href: "/blog" },
                { text: t.privacyPolicy, href: "#" },
                { text: t.termsOfService, href: "#" }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-blue-100 hover:text-white transition-all duration-300 relative group text-sm"
                  >
                    <span className="relative z-10">{item.text}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-coral transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-white">{t.contactUs}</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 mt-1 group-hover:bg-green-500/30 transition-colors">
                  <Globe size={16} className="text-green-400" />
                </div>
                <span className="text-blue-100 text-sm leading-relaxed">{footerData.address}</span>
              </li>
              <li className="flex items-start group">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 mt-1 group-hover:bg-green-500/30 transition-colors">
                  <Mail size={16} className="text-green-400" />
                </div>
                <span className="text-blue-100 text-sm">{footerData.email}</span>
              </li>
              <li className="flex items-start group">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 mt-1 group-hover:bg-green-500/30 transition-colors">
                  <Phone size={16} className="text-green-400" />
                </div>
                <a 
                  href={`https://wa.me/${footerData.phone.replace(/\D/g, '')}?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-100 hover:text-white transition-colors text-sm"
                >
                  {footerData.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
            <p className="text-blue-200 mb-2">
              &copy; {new Date().getFullYear()} {footerData.companyName}. {t.allRightsReserved}
            </p>
            <p className="text-blue-300/80 text-sm">
              Un escaparate del paraíso costero de Ecuador. Hecho por Abel Castillo - UNESUM (SmartCityCore - PL: smartcity-core.com)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
