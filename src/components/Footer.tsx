import { Facebook, Instagram, Twitter, Globe, Mail, Phone } from "lucide-react";
import { useContentManager } from "@/hooks/useContentManager";
import { useTranslations } from "@/hooks/useTranslations";
const Footer = () => {
  const {
    content
  } = useContentManager();
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
  return <footer className="relative bg-gradient-to-br from-ocean-dark via-ocean to-ocean-dark text-white overflow-hidden">
      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-400 to-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tr from-coral to-orange-400 rounded-full blur-3xl"></div>
      </div>
      
      {/* Wave decoration */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/5 to-transparent">
        <svg viewBox="0 0 1200 120" className="absolute bottom-0 w-full h-full" style={{
        transform: 'rotateX(180deg)'
      }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white/5" />
        </svg>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
                {footerData.companyName}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {footerData.description}
              </p>
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-coral/20 transition-all duration-300 hover:scale-110">
                <Facebook size={20} className="text-white group-hover:text-coral transition-colors" />
              </a>
              <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-coral/20 transition-all duration-300 hover:scale-110">
                <Instagram size={20} className="text-white group-hover:text-coral transition-colors" />
              </a>
              <a href="#" className="group p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-coral/20 transition-all duration-300 hover:scale-110">
                <Twitter size={20} className="text-white group-hover:text-coral transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-green-300 mb-4 text-center">{t.quickLinks}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.home}
                </a>
              </li>
              <li>
                <a href="#attractions" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.attractions}
                </a>
              </li>
              <li>
                <a href="#virtual-tour" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.virtualTour}
                </a>
              </li>
              <li>
                <a href="#contact" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-green-300 mb-4 text-center">{t.resources}</h3>
            <ul className="space-y-3">
              <li>
                <a href="/travel-guide" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.travelGuide}
                </a>
              </li>
              <li>
                <a href="/faq" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.faq}
                </a>
              </li>
              <li>
                <a href="/testimonials" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.testimonials}
                </a>
              </li>
              <li>
                <a href="/blog" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.blog}
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.privacyPolicy}
                </a>
              </li>
              <li>
                <a href="#" className="group flex items-center text-gray-300 hover:text-white transition-all duration-300">
                  <span className="w-0 group-hover:w-2 h-0.5 bg-coral mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  {t.termsOfService}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-green-300 mb-4 text-center">{t.contactUs}</h3>
            <ul className="space-y-6">
              <li className="flex items-start group">
                <div className="p-2 bg-green-500/20 rounded-lg mr-4 group-hover:bg-green-500/30 transition-colors">
                  <Globe size={20} className="text-green-400 flex-shrink-0" />
                </div>
                <div>
                  <span className="text-gray-300 leading-relaxed">{footerData.address}</span>
                  <p className="text-xs text-gray-400 mt-1">Ubicación</p>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="p-2 bg-blue-500/20 rounded-lg mr-4 group-hover:bg-blue-500/30 transition-colors">
                  <Mail size={20} className="text-blue-400 flex-shrink-0" />
                </div>
                <div>
                  <span className="text-gray-300">{footerData.email}</span>
                  <p className="text-xs text-gray-400 mt-1">Correo electrónico</p>
                </div>
              </li>
              <li className="flex items-start group">
                <div className="p-2 bg-coral/20 rounded-lg mr-4 group-hover:bg-coral/30 transition-colors">
                  <Phone size={20} className="text-coral flex-shrink-0" />
                </div>
                <div>
                  <a href={`https://wa.me/${footerData.phone.replace(/\D/g, '')}?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    {footerData.phone}
                  </a>
                  <p className="text-xs text-gray-400 mt-1">WhatsApp disponible</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-300">
                &copy; {new Date().getFullYear()} 
                <span className="font-semibold text-white"> {footerData.companyName}</span>. 
                {t.allRightsReserved}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Un escaparate del paraíso costero de Ecuador. 
                <span className="text-green-300"> Hecho por Abel Castillo - UNESUM</span>
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <a href="https://www.smartcity-core.com" target="_blank" rel="noopener noreferrer" className="text-xs text-green-300 hover:text-green-400 transition-colors">
                    SmartCityCore - PL
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;