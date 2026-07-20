import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

export const ClientsSection: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const defaultLogos = [
    { name: 'Tesla Energy', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png' },
    { name: 'SpaceX', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/SpaceX-Logo.svg' },
    { name: 'Autodesk', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Autodesk_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
    { name: 'IBM Quantum', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg' }
  ];

  const list = clients.length > 0 ? clients : defaultLogos;

  return (
    <section className="py-16 bg-slate-950 border-y border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Empresas e Instituciones que Confían en ARIONS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-75 grayscale hover:grayscale-0 transition-all duration-500">
          {list.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 group">
              {item.logoWebp || item.logo ? (
                <img
                  src={item.logoWebp || item.logo}
                  alt={item.name}
                  className="h-8 md:h-10 object-contain filter invert opacity-60 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="font-display font-bold text-lg text-slate-400 group-hover:text-white transition-colors">{item.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
