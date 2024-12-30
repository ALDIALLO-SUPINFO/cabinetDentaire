'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { FiCalendar, FiClock, FiUser, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';

export default function NewAppointment() {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date_heure: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    duree: '30 minutes',
    motif: '',
    notes: '',
    statut: 'planifié'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('appointments')
        .insert([formData]);

      if (error) throw error;
      toast.success('Rendez-vous créé avec succès');
      router.push('/rendez-vous');
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast.error('Impossible de créer le rendez-vous');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouveau Rendez-vous</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection du patient */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedPatient(null);
                    setShowPatientSearch(true);
                  }}
                  onClick={() => setShowPatientSearch(true)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rechercher un patient..."
                />
                <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {/* Liste des patients filtrés */}
              {showPatientSearch && !selectedPatient && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                  <div className="px-4 py-2 text-gray-500">
                    Aucun patient trouvé
                  </div>
                </div>
              )}
            </div>

            {/* Date et heure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.date_heure}
                    onChange={(e) => setFormData({ ...formData, date_heure: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                  <FiCalendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée
                </label>
                <div className="relative">
                  <select
                    value={formData.duree}
                    onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
                    required
                  >
                    <option value="15 minutes">15 minutes</option>
                    <option value="30 minutes">30 minutes</option>
                    <option value="45 minutes">45 minutes</option>
                    <option value="1 hour">1 heure</option>
                  </select>
                  <FiClock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Motif */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motif du rendez-vous
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.motif}
                  onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ex: Consultation de routine"
                  required
                />
                <FiFileText className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optionnel)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ajoutez des notes supplémentaires..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/rendez-vous')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Création...
                  </>
                ) : (
                  'Créer le rendez-vous'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
