import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { CheckCircle, Users, Award, Hammer } from 'lucide-react';
import { useAdminSyncListener } from '../../hooks/useAdminSync';

export const StatsSection: React.FC = () => {
  const { data: statsData, refetch } = useQuery({
    queryKey: ['public-stats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/public-stats');
      return res.data.data;
    }
  });

  useAdminSyncListener(refetch);

  const stats = [
    { label: 'Proyectos Realizados', value: statsData?.totalProjects || 120, suffix: '+', icon: CheckCircle, color: 'text-blue-400' },
    { label: 'Clientes Satisfechos', value: statsData?.totalClients || 85, suffix: '+', icon: Users, color: 'text-emerald-400' },
    { label: 'Años de Experiencia', value: statsData?.yearsExperience || 12, suffix: ' Años', icon: Award, color: 'text-amber-400' },
    { label: 'Obras Ejecutadas', value: statsData?.executedObras || 95, suffix: '+', icon: Hammer, color: 'text-purple-400' }
  ];

  return (
    <section className="py-16 bg-slate-900/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((st, idx) => {
            const IconComp = st.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 text-center space-y-3">
                <IconComp className={`w-8 h-8 mx-auto ${st.color}`} />
                <div className="text-3xl sm:text-5xl font-black text-white font-display">
                  <AnimatedCounter end={st.value} suffix={st.suffix} />
                </div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{st.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
