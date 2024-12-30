'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Patient } from '@/types';
import { toast } from 'react-hot-toast';
import { FiEdit2, FiCalendar, FiPhone, FiMail, FiMapPin, FiFileText } from 'react-icons/fi';

export default function PatientDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatient() {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setPatient(data);
      } catch (error) {
        console.error('Erreur lors du chargement du patient:', error);
        toast.error('Impossible de charger les informations du patient');
      } finally {
        setLoading(false);
      }
    }

    fetchPatient();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient non trouvé</h1>
          <button
            onClick={() => router.push('/patients')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-6"
        >
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.prenom} {patient.nom}
            </h1>
            <button
              onClick={() => router.push(`/patients/${params.id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              Modifier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Informations personnelles */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
              
              <div className="flex items-center gap-3 text-gray-600">
                <FiCalendar className="w-5 h-5 text-blue-500" />
                <span>Né(e) le {formatDate(patient.date_naissance)}</span>
              </div>

              {patient.telephone && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiPhone className="w-5 h-5 text-blue-500" />
                  <a href={`tel:${patient.telephone}`} className="hover:text-blue-500">
                    {patient.telephone}
                  </a>
                </div>
              )}

              {patient.email && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiMail className="w-5 h-5 text-blue-500" />
                  <a href={`mailto:${patient.email}`} className="hover:text-blue-500">
                    {patient.email}
                  </a>
                </div>
              )}

              {patient.adresse && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiMapPin className="w-5 h-5 text-blue-500" />
                  <span>{patient.adresse}</span>
                </div>
              )}

              {patient.numero_secu && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FiFileText className="w-5 h-5 text-blue-500" />
                  <span>N° Sécu: {patient.numero_secu}</span>
                </div>
              )}
            </motion.section>

            {/* Informations médicales */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations médicales</h2>
              
              {patient.antecedents && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Antécédents médicaux</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{patient.antecedents}</p>
                </div>
              )}

              {patient.allergies && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Allergies</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{patient.allergies}</p>
                </div>
              )}

              {patient.traitements_actuels && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-700 mb-2">Traitements actuels</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{patient.traitements_actuels}</p>
                </div>
              )}
            </motion.section>
          </div>

          {/* Assurance et Mutuelle */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assurance & Mutuelle</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {patient.assurance && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Assurance</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{patient.assurance}</p>
                </div>
              )}

              {patient.mutuelle && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Mutuelle</h3>
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-3">{patient.mutuelle}</p>
                </div>
              )}
            </div>
          </motion.section>

          {patient.notes && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{patient.notes}</p>
            </motion.section>
          )}
        </motion.div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push('/patients')}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Retour à la liste
          </button>
        </div>
      </div>
    </div>
  );
}
