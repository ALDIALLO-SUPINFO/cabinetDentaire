'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiSearch, FiUser, FiCalendar, FiFolder } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  telephone: string;
  email: string;
}

export default function DossiersMedicaux() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('nom');

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
      toast.error('Impossible de charger la liste des patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.nom} ${patient.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patientId: number) => {
    router.push(`/patients/${patientId}/dossier-medical`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dossiers Médicaux
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </motion.div>

        <div className="grid gap-4">
          {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePatientClick(patient.id)}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-rose-400 to-pink-600 text-white p-3 rounded-xl">
                    <FiFolder className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {patient.nom} {patient.prenom}
                    </h2>
                    <div className="flex items-center gap-4 mt-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          {format(new Date(patient.date_naissance), 'd MMMM yyyy', {
                            locale: fr,
                          })}
                        </span>
                      </div>
                      {patient.telephone && (
                        <div className="flex items-center gap-1">
                          <FiUser className="w-4 h-4" />
                          <span>{patient.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredPatients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-600">Aucun patient trouvé</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
