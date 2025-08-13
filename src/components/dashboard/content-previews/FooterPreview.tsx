
import { Card } from "@/components/ui/card";
import { Facebook, Instagram, Twitter, Globe, Mail, Phone } from "lucide-react";
import { useVisualConfig } from "@/hooks/useVisualConfig";

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
  const { config } = useVisualConfig();

  return (
    <Card className="overflow-hidden border border-border">
      <div 
        className="p-4"
        style={{ 
          backgroundColor: config.colorPalette.background || '#1e293b',
          color: config.colorPalette.text || '#ffffff',
          fontFamily: config.typography.fontFamily
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Company Info */}
          <div>
            <h3 
              className="font-bold mb-2 text-sm"
              style={{ color: config.colorPalette.primary || '#ffffff' }}
            >
              {content.companyName || "Puerto López Descubierto"}
            </h3>
            <p 
              className="mb-2 text-xs leading-relaxed opacity-80"
              style={{ color: config.colorPalette.text || '#e2e8f0' }}
            >
              {content.description || "Descubre las maravillas naturales y culturales de Puerto López"}
            </p>
            <div className="flex space-x-2">
              <Facebook size={14} style={{ color: config.colorPalette.accent || '#60a5fa' }} />
              <Instagram size={14} style={{ color: config.colorPalette.accent || '#60a5fa' }} />
              <Twitter size={14} style={{ color: config.colorPalette.accent || '#60a5fa' }} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 
              className="font-bold mb-2 text-sm"
              style={{ color: config.colorPalette.primary || '#ffffff' }}
            >
              Enlaces Rápidos
            </h3>
            <ul className="space-y-1 text-xs">
              {config.navbarSettings.items.filter(item => item.visible).map((item, index) => (
                <li 
                  key={index}
                  className="opacity-80 hover:opacity-100 cursor-pointer transition-opacity"
                  style={{ color: config.colorPalette.text || '#e2e8f0' }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 
              className="font-bold mb-2 text-sm"
              style={{ color: config.colorPalette.primary || '#ffffff' }}
            >
              Contáctanos
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start">
                <Globe size={12} className="mr-1 mt-0.5 flex-shrink-0" style={{ color: config.colorPalette.accent || '#10b981' }} />
                <span className="opacity-80" style={{ color: config.colorPalette.text || '#e2e8f0' }}>
                  {content.address || "Puerto López, Manabí, Ecuador"}
                </span>
              </li>
              <li className="flex items-start">
                <Mail size={12} className="mr-1 mt-0.5 flex-shrink-0" style={{ color: config.colorPalette.accent || '#10b981' }} />
                <span className="opacity-80" style={{ color: config.colorPalette.text || '#e2e8f0' }}>
                  {content.email || "info@puertolopez.com"}
                </span>
              </li>
              <li className="flex items-start">
                <Phone size={12} className="mr-1 mt-0.5 flex-shrink-0" style={{ color: config.colorPalette.accent || '#10b981' }} />
                <span className="opacity-80" style={{ color: config.colorPalette.text || '#e2e8f0' }}>
                  {content.phone || "+593 5 230 0123"}
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div 
          className="border-t mt-3 pt-2 text-center text-xs opacity-60"
          style={{ 
            borderColor: config.colorPalette.border || '#475569',
            color: config.colorPalette.text || '#cbd5e1'
          }}
        >
          <p>&copy; {new Date().getFullYear()} {content.companyName || "Puerto López Descubierto"}. Todos los derechos reservados.</p>
        </div>
      </div>
    </Card>
  );
};

export default FooterPreview;
