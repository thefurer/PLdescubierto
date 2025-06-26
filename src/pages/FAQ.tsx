
import { useState } from 'react';
import { ArrowLeft, Search, HelpCircle, ChevronDown, ChevronUp, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useTranslations } from '@/hooks/useTranslations';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const FAQ = () => {
  const navigate = useNavigate();
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqItems = [
    {
      id: '1',
      question: '¿Cuál es la mejor época para visitar Puerto López?',
      answer: 'La mejor época para visitar Puerto López es durante la temporada seca (junio a noviembre) y especialmente durante la temporada de ballenas (junio a septiembre), cuando las ballenas jorobadas migran a estas aguas para reproducirse.',
      category: 'general'
    },
    {
      id: '2',
      question: '¿Cómo llegar a Puerto López desde Guayaquil?',
      answer: 'Desde Guayaquil puedes tomar un bus hacia Jipijapa y luego otro hacia Puerto López. El viaje total dura aproximadamente 3-4 horas. También puedes alquilar un carro o tomar un tour organizado.',
      category: 'transporte'
    },
    {
      id: '3',
      question: '¿Cuánto cuesta el tour de avistamiento de ballenas?',
      answer: 'Los tours de avistamiento de ballenas cuestan entre $25-40 USD por persona, dependiendo de la duración del tour y los servicios incluidos. Algunos tours incluyen desayuno y snorkeling.',
      category: 'tours'
    },
    {
      id: '4',
      question: '¿Necesito reservar los tours con anticipación?',
      answer: 'Es recomendable reservar con 1-2 días de anticipación, especialmente durante la temporada alta (julio-septiembre). Los fines de semana y feriados se llenan más rápido.',
      category: 'tours'
    },
    {
      id: '5',
      question: '¿Qué incluye el tour a Isla de la Plata?',
      answer: 'El tour incluye transporte en bote, guía naturalista, entrada al parque nacional, y generalmente snorkeling. La duración es de 6-8 horas aproximadamente.',
      category: 'tours'
    },
    {
      id: '6',
      question: '¿Hay opciones de hospedaje en Puerto López?',
      answer: 'Sí, hay diversas opciones desde hostales económicos ($10-20/noche) hasta hoteles boutique ($50-100/noche). También hay cabañas en la playa y casas de huéspedes.',
      category: 'hospedaje'
    },
    {
      id: '7',
      question: '¿Es seguro nadar en las playas de Puerto López?',
      answer: 'Sí, las playas principales son seguras para nadar. Sin embargo, siempre mantente en áreas vigiladas y sigue las recomendaciones de los salvavidas locales.',
      category: 'seguridad'
    },
    {
      id: '8',
      question: '¿Qué documentos necesito para visitar?',
      answer: 'Para ciudadanos ecuatorianos solo necesitas tu cédula. Los extranjeros necesitan pasaporte válido. Para algunos tours al Parque Nacional Machalilla se requiere registrarse.',
      category: 'documentos'
    }
  ];

  const categories = [
    { value: 'all', label: 'Todas', color: 'bg-blue-100 text-blue-800' },
    { value: 'general', label: 'General', color: 'bg-green-100 text-green-800' },
    { value: 'tours', label: 'Tours', color: 'bg-purple-100 text-purple-800' },
    { value: 'transporte', label: 'Transporte', color: 'bg-orange-100 text-orange-800' },
    { value: 'hospedaje', label: 'Hospedaje', color: 'bg-pink-100 text-pink-800' },
    { value: 'seguridad', label: 'Seguridad', color: 'bg-red-100 text-red-800' },
    { value: 'documentos', label: 'Documentos', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-ocean via-blue-600 to-green-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8 animate-fade-in">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mr-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </div>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <HelpCircle className="h-12 w-12 text-white mr-4 animate-pulse" />
                <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                  Preguntas Frecuentes
                </h1>
              </div>
              <p className="text-2xl text-white/90 drop-shadow-md mb-8">
                Encuentra respuestas a las preguntas más comunes sobre Puerto López
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Clock className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-medium">Respuestas Rápidas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-ocean-light focus:border-ocean rounded-xl"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant="outline"
                  size="sm"
                  className={`rounded-full transition-all duration-300 ${
                    selectedCategory === category.value
                      ? 'bg-ocean text-white hover:bg-ocean-dark border-ocean'
                      : 'text-gray-600 hover:bg-gray-100 border-gray-300'
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFAQs.map((item) => (
              <Card key={item.id} className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader 
                  className="cursor-pointer flex flex-row items-center justify-between pb-2 space-y-0"
                  onClick={() => toggleItem(item.id)}
                >
                  <CardTitle className="text-xl font-bold text-ocean-dark flex-1 text-left">
                    {item.question}
                  </CardTitle>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-ocean-dark" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-ocean-dark" />
                  )}
                </CardHeader>
                {openItems.includes(item.id) && (
                  <CardContent className="pt-2 animate-fade-in">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {item.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <HelpCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl">No se encontraron preguntas que coincidan con tu búsqueda</p>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="glass-card border-0 shadow-xl bg-gradient-to-r from-ocean-light to-green-light text-white">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold mb-4">
                  ¿No encontraste tu respuesta?
                </CardTitle>
                <p className="text-xl text-blue-100">
                  Contáctanos directamente y te ayudaremos con cualquier duda
                </p>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6 justify-center">
                <div className="flex items-center justify-center">
                  <Phone className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-semibold">Teléfono</p>
                    <p className="text-blue-100">+593 99 199 5390</p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="h-6 w-6 mr-3" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-blue-100">apincay@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default FAQ;
