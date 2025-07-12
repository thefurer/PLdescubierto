
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageSquare } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "¿Cuál es la mejor época para visitar Puerto López?",
      answer: "La mejor época para visitar Puerto López es de junio a septiembre, durante la temporada de avistamiento de ballenas jorobadas. El clima es seco y las condiciones del mar son ideales para actividades acuáticas."
    },
    {
      question: "¿Cómo puedo llegar a Puerto López?",
      answer: "Puedes llegar a Puerto López por vía terrestre desde Guayaquil (3 horas) o Quito (6 horas) en bus o vehículo particular. También hay vuelos domésticos hasta Manta y desde ahí tomar transporte terrestre (1.5 horas)."
    },
    {
      question: "¿Qué actividades puedo realizar en Puerto López?",
      answer: "Las principales actividades incluyen avistamiento de ballenas, snorkeling, buceo, visita a la Isla de la Plata, senderismo en el Parque Nacional Machalilla, y disfrutar de las hermosas playas."
    },
    {
      question: "¿Necesito reservar con anticipación para el avistamiento de ballenas?",
      answer: "Sí, se recomienda reservar con anticipación, especialmente durante la temporada alta (junio-septiembre). Las excursiones son populares y los cupos se llenan rápidamente."
    },
    {
      question: "¿Qué debo llevar para las excursiones marinas?",
      answer: "Recomendamos llevar protector solar, sombrero, ropa cómoda, traje de baño, toalla, cámara resistente al agua, y medicamentos para el mareo si eres propenso."
    },
    {
      question: "¿Es seguro nadar en las playas de Puerto López?",
      answer: "Sí, las playas de Puerto López son generalmente seguras para nadar. Sin embargo, siempre es recomendable seguir las indicaciones de los salvavidas locales y respetar las banderas de seguridad."
    },
    {
      question: "¿Hay opciones de alojamiento en Puerto López?",
      answer: "Sí, Puerto López cuenta con diversas opciones de alojamiento desde hostales económicos hasta hoteles boutique frente al mar, adaptándose a diferentes presupuestos."
    },
    {
      question: "¿Qué es la Isla de la Plata y cómo puedo visitarla?",
      answer: "La Isla de la Plata es conocida como las 'Galápagos de los pobres' por su rica fauna marina. Se puede visitar mediante tours organizados que incluyen snorkeling y observación de aves."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-ocean">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <HelpCircle className="h-12 w-12 text-white mr-4" />
                <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                  Preguntas Frecuentes
                </h1>
              </div>
              <p className="text-2xl text-white/90 drop-shadow-md mb-8">
                Encuentra respuestas a las preguntas más comunes sobre Puerto López
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <MessageSquare className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">¿Tienes más preguntas? Usa nuestro chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact Section */}
            <div className="mt-12 text-center">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <HelpCircle className="h-16 w-16 text-ocean mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿No encontraste tu respuesta?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nuestro asistente virtual está disponible 24/7 para ayudarte con cualquier consulta específica.
                </p>
                <button
                  onClick={() => {
                    const chatButton = document.querySelector('[aria-label="Abrir chat de soporte"]') as HTMLButtonElement;
                    if (chatButton) {
                      chatButton.click();
                    }
                  }}
                  className="bg-ocean hover:bg-ocean-dark text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Abrir Chat de Soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default FAQ;
