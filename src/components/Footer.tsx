
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
    <footer className="bg-ocean-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{footerData.companyName}</h3>
            <p className="text-gray-300 mb-4">
              {footerData.description}
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
            <h3 className="text-lg font-bold mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">{t.home}</a>
              </li>
              <li>
                <a href="#attractions" className="text-gray-300 hover:text-white transition-colors">{t.attractions}</a>
              </li>
              <li>
                <a href="#virtual-tour" className="text-gray-300 hover:text-white transition-colors">{t.virtualTour}</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">{t.contact}</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t.resources}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/travel-guide" className="text-gray-300 hover:text-white transition-colors">{t.travelGuide}</a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors">{t.faq}</a>
              </li>
              <li>
                <a href="/testimonials" className="text-gray-300 hover:text-white transition-colors">{t.testimonials}</a>
              </li>
              <li>
                <a href="/blog" className="text-gray-300 hover:text-white transition-colors">{t.blog}</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">{t.privacyPolicy}</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">{t.termsOfService}</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t.contactUs}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Globe size={20} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">{footerData.address}</span>
              </li>
              <li className="flex items-start">
                <Mail size={20} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">{footerData.email}</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <a href={`https://wa.me/${footerData.phone.replace(/\D/g, '')}?text=Hola,%20me%20gustaría%20obtener%20más%20información%20sobre%20los%20tours%20en%20Puerto%20López`} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                  {footerData.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {footerData.companyName}. {t.allRightsReserved}</p>
          <p className="mt-2 text-sm">Un escaparate del paraíso costero de Ecuador. Diseñado para amantes de la naturaleza y aventureros. Hecho por Abel Castillo - UNESUM</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
