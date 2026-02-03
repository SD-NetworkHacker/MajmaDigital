
import React from 'react';
import { Heart, Mail, Phone, MapPin, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-emerald-500 font-arabic text-lg pb-1">
                م
              </div>
              <h3 className="text-lg font-black text-slate-900">Majma<span className="text-emerald-600">Digital</span></h3>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Plateforme de gestion unifiée pour le Dahira Majmahoun Nourayni. 
              Au service de la communauté, par la grâce de Cheikh Ahmadou Bamba.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Liens Rapides</h4>
            <ul className="space-y-3">
              {['À propos', 'Règlement Intérieur', 'Faire un Don', 'Support Technique'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <MapPin size={16} className="text-emerald-500" /> Dakar, Sénégal
              </li>
              <li className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <Phone size={16} className="text-emerald-500" /> +221 77 000 00 00
              </li>
              <li className="flex items-center gap-3 text-xs font-medium text-slate-500">
                <Mail size={16} className="text-emerald-500" /> contact@majma.sn
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} MajmaDigital v3.1.0</p>
          <div className="flex items-center gap-2">
            Fait avec <Heart size={12} className="text-rose-500 fill-current" /> par la Commission Communication
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
