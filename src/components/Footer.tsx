
import { Facebook, Instagram, Twitter, Globe, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-ocean-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Puerto López <span className="text-green-500">Descubierto</span></h3>
            <p className="text-gray-300 mb-4">
              Descubre la belleza natural, riqueza cultural y aventuras sin fin del paraíso costero más encantador de Ecuador.
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
            <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Inicio</a>
              </li>
              <li>
                <a href="#attractions" className="text-gray-300 hover:text-white transition-colors">Atracciones</a>
              </li>
              <li>
                <a href="#activities" className="text-gray-300 hover:text-white transition-colors">Actividades</a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">Galería</a>
              </li>
              <li>
                <a href="#virtual-tour" className="text-gray-300 hover:text-white transition-colors">Tour Virtual</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contacto</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Guía de Viaje</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Preguntas Frecuentes</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Testimonios</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Política de Privacidad</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Términos de Servicio</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contáctanos</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Globe size={20} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">Puerto López, Manabí, Ecuador</span>
              </li>
              <li className="flex items-start">
                <Mail size={20} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">info@puertolopez.descubierto.com</span>
              </li>
              <li className="flex items-start">
                <Phone size={20} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                <span className="text-gray-300">+593 2 123 4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Puerto López Descubierto. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Un escaparate del paraíso costero de Ecuador. Diseñado con ❤️ para amantes de la naturaleza y aventureros. Hecho por Abel Castillo
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
