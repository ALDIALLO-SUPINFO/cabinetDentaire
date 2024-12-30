'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Patient } from '@/types';
import { toast } from 'react-hot-toast';
import { FiEye, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

export default function PatientList() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('nom', { ascending: true });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
      toast.error('Impossible de charger la liste des patients');
    } finally {
      setLoading(false);
    }
  };

  const deletePatient = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) return;

    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPatients(patients.filter(p => p.id !== id));
      toast.success('Patient supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Impossible de supprimer le patient');
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.nom} ${patient.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.numero_secu?.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <button
          onClick={() => router.push('/patients/nouveau')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          Nouveau Patient
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de naissance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  N° Sécu
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.nom} {patient.prenom}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(patient.date_naissance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {patient.telephone && (
                        <div>{patient.telephone}</div>
                      )}
                      {patient.email && (
                        <div className="text-xs">{patient.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {patient.numero_secu || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => router.push(`/patients/${patient.id}`)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Voir la fiche"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/patients/${patient.id}/edit`)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Modifier"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => patient.id && deletePatient(patient.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Supprimer"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun patient trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}
