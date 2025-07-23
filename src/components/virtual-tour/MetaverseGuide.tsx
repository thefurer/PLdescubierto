
import { Headset, Smartphone, Monitor, Gamepad2, Users, Settings } from "lucide-react";

type MetaverseGuideProps = {
  texts: {
    tips: string;
    tip1: string;
    tip2: string;
    tip3: string;
  };
};

const MetaverseGuide = ({ texts }: MetaverseGuideProps) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          {texts.tips}
        </h3>
        <p className="text-white/70 text-lg">
          Aprovecha al máximo tu experiencia virtual con estos consejos esenciales
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Tip 1 - VR Experience */}
        <div className="group relative p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-white/20 backdrop-blur-sm hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
              <Headset className="text-white" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Experiencia VR/AR</h4>
            <p className="text-white/80 leading-relaxed">{texts.tip1}</p>
          </div>
        </div>

        {/* Tip 2 - Social Interaction */}
        <div className="group relative p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/20 backdrop-blur-sm hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
              <Users className="text-white" size={24} />
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Interacción Social</h4>
            <p className="text-white/80 leading-relaxed">{texts.tip2}</p>
          </div>
        </div>     
      </div>

      {/* Multi-device section */}
      <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-3xl p-8 border border-white/20 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold text-white mb-3">
            🌐 Experiencia Multidispositivo
          </h4>
          <p className="text-white/80 text-lg">
            Accede desde cualquier dispositivo y disfruta de una experiencia optimizada
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="group text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-6 transition-transform duration-300">
              <Monitor className="text-white" size={28} />
            </div>
            <h5 className="text-white font-semibold mb-1">Desktop</h5>
            <p className="text-white/60 text-sm">Experiencia completa</p>
          </div>

          <div className="group text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-6 transition-transform duration-300">
              <Smartphone className="text-white" size={28} />
            </div>
            <h5 className="text-white font-semibold mb-1">Móvil</h5>
            <p className="text-white/60 text-sm">Táctil optimizado</p>
          </div>

          <div className="group text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-6 transition-transform duration-300">
              <Headset className="text-white" size={28} />
            </div>
            <h5 className="text-white font-semibold mb-1">VR/AR</h5>
            <p className="text-white/60 text-sm">Inmersión total</p>
          </div>

          <div className="group text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-6 transition-transform duration-300">
              <Gamepad2 className="text-white" size={28} />
            </div>
            <h5 className="text-white font-semibold mb-1">Consola</h5>
            <p className="text-white/60 text-sm">Control gaming</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <span className="text-white font-semibold">Sincronización Automática</span>
          </div>
          <p className="text-white/70">
            Tu progreso y preferencias se sincronizan automáticamente entre todos tus dispositivos. 
            Comienza en tu móvil y continúa en VR sin perder tu experiencia.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MetaverseGuide;
