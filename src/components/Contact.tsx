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
            Contácta <span className="text-green-500">con nuestros asesores</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Obtenga asistencia personalizada para planificar sus vacaciones de ensueño en Puerto López. Nuestros asesores expertos están listos para ayudarle a crear el itinerario perfecto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulario de Contacto */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-ocean-dark mb-6">Contáctanos</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tu Nombre
            </label>
            <input
              id="name"
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
              placeholder="Juan Pérez"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
              placeholder="juan@ejemplo.com"
              required
            />
          </div>
              </div>

              <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Asunto
          </label>
          <input
            id="subject"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
            placeholder="Consulta sobre viaje"
            required
          />
              </div>

              <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Tu Mensaje
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean focus:border-ocean"
            placeholder="Estoy interesado en planear un viaje a Puerto López..."
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
            Acepto la política de privacidad y los términos de servicio
          </label>
              </div>

              <button
          type="submit"
          className="w-full py-3 bg-ocean text-white font-semibold rounded-lg hover:bg-ocean-dark transition-colors shadow-md"
              >
          Enviar Mensaje
              </button>
            </form>
          </div>

          {/* Contact Information & Security */}
          <div className="flex flex-col gap-6">
            <div className="bg-ocean-light/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-ocean-dark mb-6">Para más información</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-ocean-dark mb-1">Nuestro correo</h4>
                    <p className="text-gray-600">info@puertolopez.unveiled.com</p>
                    <p className="text-gray-600">bookings@puertolopez.unveiled.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-ocean-dark mb-1">Llámanos</h4>
                    <p className="text-gray-600">+593 2 123 4567</p>
                    <p className="text-gray-600">+593 9 876 5432</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center mr-4">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-ocean-dark mb-1">Chat en vivo</h4>
                    <p className="text-gray-600">Disponible 24/7 para asistencia inmediata</p>
                    <button className="mt-2 px-4 py-2 bg-ocean text-white text-sm rounded-lg hover:bg-ocean-dark transition-colors">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-ocean-light/30 rounded-2xl p-6 md:p-8"></div>
            <div className="bg-ocean-light/30 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-ocean-dark mb-4">Tu Seguridad Garantizada</h3>
              
              <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                <Lock size={18} />
                </div>
                <div>
                <h4 className="text-base font-semibold text-ocean-dark mb-1">Comunicaciones Seguras</h4>
                <p className="text-gray-600 text-sm">Todas las comunicaciones están cifradas y seguras</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                <Shield size={18} />
                </div>
                <div>
                <h4 className="text-base font-semibold text-ocean-dark mb-1">Protección de Datos</h4>
                <p className="text-gray-600 text-sm">Tu información personal está protegida por nuestra política de privacidad</p>
                </div>
              </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg">
              <h4 className="text-base font-semibold text-ocean-dark mb-2">Opciones de Personalización</h4>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                <span>Itinerarios personalizados</span>
                </li>
                <li className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                <span>Tours grupales y privados</span>
                </li>
                <li className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                <span>Preferencias de alojamiento</span>
                </li>
                <li className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-coral mr-2"></div>
                <span>Requisitos dietéticos especiales</span>
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
