
import { Card } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Globe, Mail, Phone } from "lucide-react";

interface FooterPreviewProps {
  content: {
    companyName?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
}

const FooterPreview = ({ content }: FooterPreviewProps) => {
  return (
    <Card className="overflow-hidden border border-blue-200">
      <div className="bg-ocean-dark text-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Company Info */}
          <div>
            <h3 className="font-bold mb-2 text-sm">{content.companyName || "Puerto López Descubierto"}</h3>
            <p className="text-gray-300 mb-2 text-xs leading-relaxed">
              {content.description || "Descripción de la empresa"}
            </p>
            <div className="flex space-x-2">
              <Facebook size={14} className="text-white hover:text-coral" />
              <Instagram size={14} className="text-white hover:text-coral" />
              <Twitter size={14} className="text-white hover:text-coral" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-2 text-sm">Enlaces Rápidos</h3>
            <ul className="space-y-1 text-xs">
              <li className="text-gray-300">Inicio</li>
              <li className="text-gray-300">Atracciones</li>
              <li className="text-gray-300">Metaverso</li>
              <li className="text-gray-300">Contacto</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold mb-2 text-sm">Contáctanos</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start">
                <Globe size={12} className="mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">{content.address || "Dirección"}</span>
              </li>
              <li className="flex items-start">
                <Mail size={12} className="mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">{content.email || "Email"}</span>
              </li>
              <li className="flex items-start">
                <Phone size={12} className="mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">{content.phone || "Teléfono"}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-3 pt-2 text-center text-gray-400 text-xs">
          <p>&copy; {new Date().getFullYear()} {content.companyName || "Puerto López Descubierto"}. Todos los derechos reservados.</p>
        </div>
      </div>
    </Card>
  );
};

export default FooterPreview;
