'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { 
  FiGrid, 
  FiCalendar, 
  FiList, 
  FiFileText, 
  FiDollarSign, 
  FiImage 
} from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Patient {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  numero_secu: string;
}

interface Tab {
  id: string;
  title: string;
  icon: JSX.Element;
}

const tabs: Tab[] = [
  { id: 'schema', title: 'Schéma dentaire', icon: <FiGrid className="w-5 h-5" /> },
  { id: 'traitements', title: 'Traitements', icon: <FiCalendar className="w-5 h-5" /> },
  { id: 'plan', title: 'Plan de traitement', icon: <FiList className="w-5 h-5" /> },
  { id: 'notes', title: 'Notes cliniques', icon: <FiFileText className="w-5 h-5" /> },
  { id: 'paiements', title: 'Paiements', icon: <FiDollarSign className="w-5 h-5" /> },
  { id: 'images', title: 'Imagerie médicale', icon: <FiImage className="w-5 h-5" /> },
];

export default function DossierMedical() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('schema');
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<Patient | null>(null);

  const fetchPatientData = useCallback(async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', params.id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Impossible de charger les données du dossier médical');
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'schema':
        return <div>Schéma dentaire interactif à implémenter</div>;
      case 'traitements':
        return <div>Traitements à implémenter</div>;
      case 'plan':
        return <div>Plan de traitement à implémenter</div>;
      case 'notes':
        return <div>Notes cliniques à implémenter</div>;
      case 'paiements':
        return <div>Paiements à implémenter</div>;
      case 'images':
        return <div>Galerie d&apos;imagerie médicale à implémenter</div>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Dossier Médical - {patient?.nom} {patient?.prenom}
          </h1>
          <p className="text-gray-600 mt-2">
            Né(e) le {format(new Date(patient?.date_naissance), 'd MMMM yyyy', { locale: fr })}
          </p>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.title}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
