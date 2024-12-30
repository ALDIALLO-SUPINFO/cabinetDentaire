'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { NewPatient } from '@/types';

const steps = [
  { id: 'personal', title: 'Informations Personnelles' },
  { id: 'medical', title: 'Informations Médicales' },
  { id: 'insurance', title: 'Assurance & Mutuelle' },
];

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {children} <span className="text-red-500">*</span>
  </label>
);

const OptionalLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {children}
  </label>
);

export default function NewPatient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewPatient>({
    nom: '',
    prenom: '',
    date_naissance: '',
    telephone: '',
    email: '',
    adresse: '',
    numero_secu: '',
    antecedents: '',
    allergies: '',
    traitements_actuels: '',
    assurance: '',
    mutuelle: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        if (!formData.nom || !formData.prenom || !formData.date_naissance) {
          toast.error('Veuillez remplir tous les champs obligatoires');
          return false;
        }
        return true;
      case 1:
        // Pas de validation obligatoire pour l'étape médicale
        return true;
      case 2:
        // Pas de validation obligatoire pour l'étape Assurance & Mutuelle
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation de l'étape finale
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const patientData = {
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        date_naissance: new Date(formData.date_naissance).toISOString().split('T')[0],
        telephone: formData.telephone?.trim() || null,
        email: formData.email?.trim() || null,
        adresse: formData.adresse?.trim() || null,
        numero_secu: formData.numero_secu?.trim() || null,
        antecedents: formData.antecedents?.trim() || null,
        allergies: formData.allergies?.trim() || null,
        traitements_actuels: formData.traitements_actuels?.trim() || null,
        assurance: formData.assurance?.trim() || null,
        mutuelle: formData.mutuelle?.trim() || null,
        notes: formData.notes?.trim() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(error.message || 'Erreur lors de l\'enregistrement du patient');
      }

      if (!data) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }

      console.log('Patient créé avec succès:', data);
      toast.success('Patient ajouté avec succès !');
      router.push('/patients');
      router.refresh();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <RequiredLabel>Nom</RequiredLabel>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <RequiredLabel>Prénom</RequiredLabel>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <RequiredLabel>Date de naissance</RequiredLabel>
              <input
                type="date"
                name="date_naissance"
                value={formData.date_naissance}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <OptionalLabel>Téléphone</OptionalLabel>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <OptionalLabel>Email</OptionalLabel>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <OptionalLabel>Adresse</OptionalLabel>
              <textarea
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <OptionalLabel>Numéro de sécurité sociale</OptionalLabel>
              <input
                type="text"
                name="numero_secu"
                value={formData.numero_secu}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <OptionalLabel>Antécédents médicaux</OptionalLabel>
              <textarea
                name="antecedents"
                value={formData.antecedents}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <OptionalLabel>Allergies</OptionalLabel>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <OptionalLabel>Traitements actuels</OptionalLabel>
              <textarea
                name="traitements_actuels"
                value={formData.traitements_actuels}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <OptionalLabel>Assurance</OptionalLabel>
              <input
                type="text"
                name="assurance"
                value={formData.assurance}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <OptionalLabel>Mutuelle</OptionalLabel>
              <input
                type="text"
                name="mutuelle"
                value={formData.mutuelle}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <OptionalLabel>Notes supplémentaires</OptionalLabel>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Nouveau Patient</h1>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-4">
              Les champs marqués d'un <span className="text-red-500">*</span> sont obligatoires
            </p>
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 ${index !== steps.length - 1 ? 'mr-2' : ''}`}
                >
                  <div className="relative">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                    <span className="absolute -bottom-6 left-0 text-sm font-medium text-gray-500">
                      {step.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-12">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className={`px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200 ${
                  currentStep === 0 ? 'invisible' : ''
                }`}
              >
                Précédent
              </button>

              <button
                type={currentStep === steps.length - 1 ? 'submit' : 'button'}
                onClick={currentStep === steps.length - 1 ? undefined : nextStep}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {currentStep === steps.length - 1 
                  ? (isSubmitting ? 'Enregistrement en cours...' : 'Enregistrer')
                  : 'Suivant'
                }
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
