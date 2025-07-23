
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
      {/* Enhanced Background Pattern with Cultural Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-coral/10 to-transparent"></div>
        <div className="absolute inset-0 bg-repeat animate-pulse" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M40 40c8.837 0 16-7.163 16-16S48.837 8 40 8s-16 7.163-16 16 7.163 16 16 16zm0-4c6.627 0 12-5.373 12-12S46.627 16 40 16s-12 5.373-12 12 5.373 12 12 12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-green-500/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Decorative Wave Elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-coral via-green-500 to-ocean animate-gentle-wave"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info - Enhanced */}
          <div className="space-y-8">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-coral/20 to-green-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <h3 className="relative text-2xl font-bold text-white mb-6 tracking-wide">
                {footerData.companyName}
              </h3>
            </div>
            <p className="text-blue-100 leading-relaxed text-sm backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10">
              {footerData.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-coral to-pink-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Facebook size={20} className="text-white" />
                </div>
              </a>
              <a href="#" className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-coral to-pink-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Instagram size={20} className="text-white" />
                </div>
              </a>
              <a href="#" className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-coral to-pink-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Twitter size={20} className="text-white" />
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur"></div>
              <h3 className="relative text-xl font-bold text-white mb-6 tracking-wide">
                {t.quickLinks}
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { text: t.home, href: "#home" },
                { text: t.attractions, href: "#attractions" },
                { text: t.virtualTour, href: "#virtual-tour" },
                { text: t.contact, href: "#contact" }
              ].map((item, index) => (
                <li key={index} className="group">
                  <a 
                    href={item.href} 
                    className="relative text-blue-100 hover:text-white transition-all duration-300 text-sm flex items-center py-2 px-4 rounded-lg hover:bg-white/5 backdrop-blur-sm"
                  >
                    <div className="absolute left-0 w-0 h-0.5 bg-gradient-to-r from-coral to-green-500 transition-all duration-300 group-hover:w-full bottom-0"></div>
                    <span className="relative z-10">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources - Enhanced */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur"></div>
              <h3 className="relative text-xl font-bold text-white mb-6 tracking-wide">
                {t.resources}
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { text: t.travelGuide, href: "/travel-guide" },
                { text: t.faq, href: "/faq" },
                { text: t.testimonials, href: "/testimonials" },
                { text: t.blog, href: "/blog" },
                { text: t.privacyPolicy, href: "#" },
                { text: t.termsOfService, href: "#" }
              ].map((item, index) => (
                <li key={index} className="group">
                  <a 
                    href={item.href} 
                    className="relative text-blue-100 hover:text-white transition-all duration-300 text-sm flex items-center py-2 px-4 rounded-lg hover:bg-white/5 backdrop-blur-sm"
                  >
                    <div className="absolute left-0 w-0 h-0.5 bg-gradient-to-r from-coral to-green-500 transition-all duration-300 group-hover:w-full bottom-0"></div>
                    <span className="relative z-10">{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-coral/20 rounded-lg blur"></div>
              <h3 className="relative text-xl font-bold text-white mb-6 tracking-wide">
                {t.contactUs}
              </h3>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-green-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-105 transition-all duration-300 border border-green-500/20">
                  <Globe size={18} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <span className="text-blue-100 text-sm leading-relaxed backdrop-blur-sm bg-white/5 p-3 rounded-lg border border-white/10 block">
                    {footerData.address}
                  </span>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-green-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-105 transition-all duration-300 border border-green-500/20">
                  <Mail size={18} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <span className="text-blue-100 text-sm backdrop-blur-sm bg-white/5 p-3 rounded-lg border border-white/10 block">
                    {footerData.email}
                  </span>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/30 to-green-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 mt-1 group-hover:scale-105 transition-all duration-300 border border-green-500/20">
                  <Phone size={18} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <a 
                    href={`https://wa.me/${footerData.phone.replace(/\D/g, '')}?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-100 hover:text-white transition-colors text-sm backdrop-blur-sm bg-white/5 p-3 rounded-lg border border-white/10 block hover:bg-white/10"
                  >
                    {footerData.phone}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Footer Bottom */}
        <div className="border-t border-white/20 mt-16 pt-10">
          <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-coral/5 via-transparent to-green-500/5 rounded-3xl"></div>
            <div className="relative z-10 text-center">
              <p className="text-blue-200 mb-3 font-medium">
                &copy; {new Date().getFullYear()} {footerData.companyName}. {t.allRightsReserved}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-coral to-green-500 rounded-full mx-auto mb-4"></div>
              <p className="text-blue-300/80 text-sm leading-relaxed">
                Un escaparate del paraíso costero de Ecuador. Hecho por Abel Castillo - UNESUM (SmartCityCore - PL: smartcity-core.com)
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
