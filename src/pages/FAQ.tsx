import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const FAQ = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      category: "Viajes y Tours",
      icon: "🚢",
      color: "from-blue-500 to-cyan-500",
      questions: [
        {
          question: "¿Cuál es la mejor época para avistar ballenas?",
          answer: "La temporada de ballenas jorobadas es de junio a septiembre. Durante estos meses, las ballenas migran desde la Antártida para reproducirse en las cálidas aguas ecuatorianas.",
          tags: ["ballenas", "temporada", "avistamiento"]
        },
        {
          question: "¿Cuánto cuesta un tour a la Isla de la Plata?",
          answer: "Los tours a la Isla de la Plata cuestan entre $35-45 por persona, incluye transporte en bote, guía, snorkeling y almuerzo. Los tours con avistamiento de ballenas cuestan $40-55.",
          tags: ["precio", "isla", "tour"]
        },
        {
          question: "¿Necesito reservar con anticipación?",
          answer: "Se recomienda reservar con 1-2 días de anticipación, especialmente en temporada alta (junio-septiembre). Para grupos grandes, reserve con una semana de anticipación.",
          tags: ["reserva", "anticipación", "grupos"]
        },
        {
          question: "¿Qué incluyen los tours?",
          answer: "La mayoría de tours incluyen: transporte, guía certificado, equipo de snorkeling, almuerzo, agua y chalecos salvavidas. Algunos incluyen visita a comunidades locales.",
          tags: ["incluido", "servicios", "equipamiento"]
        }
      ]
    },
    {
      category: "Hospedaje",
      icon: "🏨",
      color: "from-green-500 to-emerald-500",
      questions: [
        {
          question: "¿Qué opciones de hospedaje hay en Puerto López?",
          answer: "Hay opciones para todos los presupuestos: hostales ($15-25/noche), hoteles boutique ($40-80/noche), cabañas frente al mar ($60-120/noche) y resorts de lujo ($150-300/noche).",
          tags: ["alojamiento", "precios", "opciones"]
        },
        {
          question: "¿Hay hoteles frente al mar?",
          answer: "Sí, hoteles recomendados frente al mar: Hotel Mandala ($80-100/noche), Hostería Mandala ($60-80/noche), y Cabañas La Terraza ($70-90/noche).",
          tags: ["frente al mar", "hoteles", "recomendaciones"]
        },
        {
          question: "¿Puedo acampar en las playas?",
          answer: "El camping está permitido en algunas áreas del Parque Nacional Machalilla con permiso previo. En Playa Los Frailes hay áreas designadas que cuestan $5 por persona por noche.",
          tags: ["camping", "playas", "permisos"]
        }
      ]
    },
    {
      category: "Costos y Precios",
      icon: "💰",
      color: "from-yellow-500 to-orange-500",
      questions: [
        {
          question: "¿Cuánto dinero necesito para una estadía de 3 días?",
          answer: "Presupuesto económico: $60-80/día. Presupuesto medio: $100-150/día. Presupuesto alto: $200-300/día. Incluye hospedaje, comidas, tours y transporte local.",
          tags: ["presupuesto", "costos", "estadía"]
        },
        {
          question: "¿Dónde puedo cambiar dinero?",
          answer: "Hay cajeros automáticos en el centro del pueblo. También puede cambiar dólares en algunos hoteles y agencias de turismo. Se recomienda llevar efectivo.",
          tags: ["dinero", "cajeros", "cambio"]
        },
        {
          question: "¿Aceptan tarjetas de crédito?",
          answer: "Los hoteles y restaurantes principales aceptan tarjetas. Para tours y compras locales, es mejor llevar efectivo. Hay cajeros del Banco Pichincha y Banco Guayaquil.",
          tags: ["tarjetas", "pago", "efectivo"]
        }
      ]
    },
    {
      category: "Transporte y Acceso",
      icon: "🚌",
      color: "from-purple-500 to-indigo-500",
      questions: [
        {
          question: "¿Cómo llego desde Quito?",
          answer: "Bus directo (6-8 horas, $8-12), vuelo a Manta + bus (2.5 horas total, $80-150), o auto propio (5-6 horas). Los buses salen desde Terminal Quitumbe.",
          tags: ["transporte", "quito", "opciones"]
        },
        {
          question: "¿Hay transporte público en Puerto López?",
          answer: "Sí, hay buses locales ($0.25) y taxis ($1-3 dentro del pueblo). Para ir a playas cercanas como Los Frailes, hay camionetas ($2-5) o tours organizados.",
          tags: ["transporte local", "buses", "taxis"]
        },
        {
          question: "¿Puedo alquilar bicicletas o motos?",
          answer: "Sí, hay varios lugares que alquilan bicicletas ($5-8/día) y motos ($15-25/día). Se requiere licencia de conducir para las motos.",
          tags: ["alquiler", "bicicletas", "motos"]
        }
      ]
    },
    {
      category: "Gastronomía",
      icon: "🍤",
      color: "from-red-500 to-pink-500",
      questions: [
        {
          question: "¿Qué platos típicos debo probar?",
          answer: "Ceviche de pescado, corvina frita, langostinos, cazuela de mariscos, encocado de camarón y la famosa 'corvina al ajillo'. Precios desde $8-15 por plato.",
          tags: ["comida", "platos típicos", "mariscos"]
        },
        {
          question: "¿Hay opciones vegetarianas?",
          answer: "Sí, varios restaurantes ofrecen opciones vegetarianas como ensaladas, pasta, pizza y platos con quinoa. Restaurant Carmita y Café Ballena tienen buenas opciones.",
          tags: ["vegetariano", "opciones", "restaurantes"]
        }
      ]
    }
  ];

  const categories = ['all', ...faqData.map(cat => cat.category)];

  const filteredFAQs = faqData.filter(category => {
    if (selectedCategory !== 'all' && category.category !== selectedCategory) return false;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return category.questions.some(q => 
        q.question.toLowerCase().includes(searchLower) ||
        q.answer.toLowerCase().includes(searchLower) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  const toggleFAQ = (categoryIndex: number, questionIndex: number) => {
    const globalIndex = categoryIndex * 100 + questionIndex;
    setOpenFAQ(openFAQ === globalIndex ? null : globalIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Enhanced Header */}
          <div className="flex items-center mb-12 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-6 glass-card hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToHome}
            </Button>
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <HelpCircle className="h-10 w-10 text-ocean mr-4 animate-pulse" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-ocean bg-clip-text text-transparent">
                  {t.faqTitle}
                </h1>
              </div>
              <p className="text-xl text-gray-600">{t.faqSubtitle}</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <Card className="mb-8 glass-card border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder={t.searchQuestions}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-ocean focus:ring-4 focus:ring-ocean/20 transition-all duration-300"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    className="pl-12 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:border-ocean focus:ring-4 focus:ring-ocean/20 transition-all duration-300 min-w-[200px]"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">{t.allCategories}</option>
                    {faqData.map((cat) => (
                      <option key={cat.category} value={cat.category}>{cat.category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Content */}
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="glass-card border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in">
                <div className={`bg-gradient-to-r ${category.color} text-white rounded-t-lg p-6`}>
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="text-3xl mr-3">{category.icon}</span>
                    {category.category}
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {category.questions.map((faq, questionIndex) => {
                      const globalIndex = categoryIndex * 100 + questionIndex;
                      const isOpen = openFAQ === globalIndex;
                      
                      return (
                        <div key={questionIndex} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                          <button
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group"
                            onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                          >
                            <span className="font-semibold text-gray-800 text-lg group-hover:text-ocean transition-colors duration-300">
                              {faq.question}
                            </span>
                            <div className={`transform transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                              {isOpen ? (
                                <ChevronUp className="h-6 w-6 text-ocean" />
                              ) : (
                                <ChevronDown className="h-6 w-6 text-gray-500 group-hover:text-ocean" />
                              )}
                            </div>
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-6 text-gray-600 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 animate-fade-in">
                              <div className="pt-4">
                                <p className="text-lg leading-relaxed mb-4">{faq.answer}</p>
                                <div className="flex flex-wrap gap-2">
                                  {faq.tags.map((tag, tagIndex) => (
                                    <span 
                                      key={tagIndex}
                                      className="px-3 py-1 bg-ocean/10 text-ocean rounded-full text-sm font-medium hover:bg-ocean/20 transition-colors duration-200"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
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

          {/* Enhanced Contact Card */}
          <Card className="mt-12 glass-card border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 p-1">
              <CardContent className="bg-white p-8 text-center">
                <div className="mb-6">
                  <MessageCircle className="h-16 w-16 mx-auto text-ocean mb-4 animate-bounce" />
                  <h3 className="text-3xl font-bold text-ocean-dark mb-2">
                    {t.notFound}
                  </h3>
                  <p className="text-xl text-gray-600 mb-6">
                    {t.contactDirectly}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button 
                    onClick={() => window.open('mailto:apincay@gmail.com', '_blank')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    {t.sendEmail}
                  </Button>
                  <Button 
                    onClick={() => window.open('https://wa.me/593991995390?text=Hola, tengo una pregunta sobre Puerto López', '_blank')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {t.chatWhatsapp}
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Results Info */}
          {searchTerm && (
            <div className="mt-6 text-center text-gray-600">
              {t.showingResults} {filteredFAQs.reduce((total, cat) => total + cat.questions.length, 0)} {t.resultsFor} "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default FAQ;
