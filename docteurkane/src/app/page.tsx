'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  FiCalendar,
  FiUsers,
  FiSettings,
  FiFolder,
  FiPlusCircle,
} from 'react-icons/fi';

const cards = [
  {
    id: 'agenda',
    title: 'Agenda',
    description: 'Gérez vos rendez-vous',
    icon: <FiCalendar className="w-8 h-8" />,
    color: 'from-sky-400 to-blue-600',
    textColor: 'text-blue-600',
    bgHover: 'hover:bg-blue-50',
    link: '/agenda'
  },
  {
    id: 'patients',
    title: 'Patients',
    description: 'Liste des patients',
    icon: <FiUsers className="w-8 h-8" />,
    color: 'from-emerald-400 to-teal-600',
    textColor: 'text-emerald-600',
    bgHover: 'hover:bg-emerald-50',
    link: '/patients'
  },
  {
    id: 'nouveau-rdv',
    title: 'Nouveau RDV',
    description: 'Planifier un rendez-vous',
    icon: <FiPlusCircle className="w-8 h-8" />,
    color: 'from-violet-400 to-purple-600',
    textColor: 'text-violet-600',
    bgHover: 'hover:bg-violet-50',
    link: '/rendez-vous/nouveau'
  },
  {
    id: 'dossier-medical',
    title: 'Dossier Médical',
    description: 'Accéder aux dossiers médicaux',
    icon: <FiFolder className="w-8 h-8" />,
    color: 'from-rose-400 to-pink-600',
    textColor: 'text-rose-600',
    bgHover: 'hover:bg-rose-50',
    link: '/dossiers-medicaux'
  },
  {
    id: 'settings',
    title: 'Paramètres',
    description: 'Configuration du cabinet',
    icon: <FiSettings className="w-8 h-8" />,
    color: 'from-amber-400 to-orange-600',
    textColor: 'text-amber-600',
    bgHover: 'hover:bg-amber-50',
    link: '/settings'
  }
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue dans votre cabinet
          </h1>
          <p className="text-xl text-gray-600">
            Que souhaitez-vous faire aujourd&apos;hui ?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => router.push(card.link)}
            >
              <div className={`relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${card.bgHover}`}>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {card.icon}
                </div>
                <h2 className={`text-xl font-bold ${card.textColor} mb-2`}>
                  {card.title}
                </h2>
                <p className="text-gray-600">{card.description}</p>
                
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
