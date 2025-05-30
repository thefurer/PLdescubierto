
import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FAQ = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqData = [
    {
      category: "Viajes y Tours",
      questions: [
        {
          question: "¿Cuál es la mejor época para avistar ballenas?",
          answer: "La temporada de ballenas jorobadas es de junio a septiembre. Durante estos meses, las ballenas migran desde la Antártida para reproducirse en las cálidas aguas ecuatorianas."
        },
        {
          question: "¿Cuánto cuesta un tour a la Isla de la Plata?",
          answer: "Los tours a la Isla de la Plata cuestan entre $35-45 por persona, incluye transporte en bote, guía, snorkeling y almuerzo. Los tours con avistamiento de ballenas cuestan $40-55."
        },
        {
          question: "¿Necesito reservar con anticipación?",
          answer: "Se recomienda reservar con 1-2 días de anticipación, especialmente en temporada alta (junio-septiembre). Para grupos grandes, reserve con una semana de anticipación."
        },
        {
          question: "¿Qué incluyen los tours?",
          answer: "La mayoría de tours incluyen: transporte, guía certificado, equipo de snorkeling, almuerzo, agua y chalecos salvavidas. Algunos incluyen visita a comunidades locales."
        }
      ]
    },
    {
      category: "Hospedaje",
      questions: [
        {
          question: "¿Qué opciones de hospedaje hay en Puerto López?",
          answer: "Hay opciones para todos los presupuestos: hostales ($15-25/noche), hoteles boutique ($40-80/noche), cabañas frente al mar ($60-120/noche) y resorts de lujo ($150-300/noche)."
        },
        {
          question: "¿Hay hoteles frente al mar?",
          answer: "Sí, hoteles recomendados frente al mar: Hotel Mandala ($80-100/noche), Hostería Mandala ($60-80/noche), y Cabañas La Terraza ($70-90/noche)."
        },
        {
          question: "¿Puedo acampar en las playas?",
          answer: "El camping está permitido en algunas áreas del Parque Nacional Machalilla con permiso previo. En Playa Los Frailes hay áreas designadas que cuestan $5 por persona por noche."
        }
      ]
    },
    {
      category: "Costos y Precios",
      questions: [
        {
          question: "¿Cuánto dinero necesito para una estadía de 3 días?",
          answer: "Presupuesto económico: $60-80/día. Presupuesto medio: $100-150/día. Presupuesto alto: $200-300/día. Incluye hospedaje, comidas, tours y transporte local."
        },
        {
          question: "¿Dónde puedo cambiar dinero?",
          answer: "Hay cajeros automáticos en el centro del pueblo. También puede cambiar dólares en algunos hoteles y agencias de turismo. Se recomienda llevar efectivo."
        },
        {
          question: "¿Aceptan tarjetas de crédito?",
          answer: "Los hoteles y restaurantes principales aceptan tarjetas. Para tours y compras locales, es mejor llevar efectivo. Hay cajeros del Banco Pichincha y Banco Guayaquil."
        }
      ]
    },
    {
      category: "Transporte y Acceso",
      questions: [
        {
          question: "¿Cómo llego desde Quito?",
          answer: "Bus directo (6-8 horas, $8-12), vuelo a Manta + bus (2.5 horas total, $80-150), o auto propio (5-6 horas). Los buses salen desde Terminal Quitumbe."
        },
        {
          question: "¿Hay transporte público en Puerto López?",
          answer: "Sí, hay buses locales ($0.25) y taxis ($1-3 dentro del pueblo). Para ir a playas cercanas como Los Frailes, hay camionetas ($2-5) o tours organizados."
        },
        {
          question: "¿Puedo alquilar bicicletas o motos?",
          answer: "Sí, hay varios lugares que alquilan bicicletas ($5-8/día) y motos ($15-25/día). Se requiere licencia de conducir para las motos."
        }
      ]
    },
    {
      category: "Gastronomía",
      questions: [
        {
          question: "¿Qué platos típicos debo probar?",
          answer: "Ceviche de pescado, corvina frita, langostinos, cazuela de mariscos, encocado de camarón y la famosa 'corvina al ajillo'. Precios desde $8-15 por plato."
        },
        {
          question: "¿Hay opciones vegetarianas?",
          answer: "Sí, varios restaurantes ofrecen opciones vegetarianas como ensaladas, pasta, pizza y platos con quinoa. Restaurant Carmita y Café Ballena tienen buenas opciones."
        }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-ocean-dark">Preguntas Frecuentes</h1>
              <p className="text-gray-600 mt-2">Encuentra respuestas a las preguntas más comunes sobre Puerto López</p>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="space-y-6">
            {faqData.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-xl text-ocean-dark">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const globalIndex = categoryIndex * 100 + questionIndex;
                      const isOpen = openFAQ === globalIndex;
                      
                      return (
                        <div key={questionIndex} className="border border-gray-200 rounded-lg">
                          <button
                            className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                            onClick={() => toggleFAQ(globalIndex)}
                          >
                            <span className="font-medium text-gray-800">{faq.question}</span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-3 text-gray-600 border-t border-gray-200 pt-3">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Card */}
          <Card className="mt-8 bg-blue-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-ocean-dark mb-2">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-gray-600 mb-4">
                Contáctanos directamente para obtener información personalizada
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open('mailto:apincay@gmail.com', '_blank')}
                  variant="outline"
                >
                  Enviar Email
                </Button>
                <Button 
                  onClick={() => window.open('https://wa.me/593991995390?text=Hola, tengo una pregunta sobre Puerto López', '_blank')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Chat WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
