'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  DentalSchema, 
  Treatment, 
  TreatmentPlan, 
  ClinicalNote, 
  Payment, 
  MedicalImage 
} from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  FiGrid, 
  FiCalendar, 
  FiList, 
  FiFileText, 
  FiDollarSign, 
  FiImage 
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface Tab {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'schema', title: 'Schéma dentaire', icon: <FiGrid className="w-5 h-5" /> },
  { id: 'soins', title: 'Historique des soins', icon: <FiCalendar className="w-5 h-5" /> },
  { id: 'plan', title: 'Plan de traitement', icon: <FiList className="w-5 h-5" /> },
  { id: 'notes', title: 'Notes cliniques', icon: <FiFileText className="w-5 h-5" /> },
  { id: 'paiements', title: 'Suivi des paiements', icon: <FiDollarSign className="w-5 h-5" /> },
  { id: 'images', title: 'Imagerie médicale', icon: <FiImage className="w-5 h-5" /> },
];

export default function MedicalRecord({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('schema');
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState<any>(null);
  const [dentalSchema, setDentalSchema] = useState<DentalSchema[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [medicalImages, setMedicalImages] = useState<MedicalImage[]>([]);

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      // Fetch patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', params.id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      // Fetch all medical record data
      const [
        dentalSchemaRes,
        treatmentsRes,
        treatmentPlanRes,
        clinicalNotesRes,
        paymentsRes,
        medicalImagesRes
      ] = await Promise.all([
        supabase.from('dental_schema').select('*').eq('patient_id', params.id),
        supabase.from('treatments').select('*').eq('patient_id', params.id),
        supabase.from('treatment_plans').select('*').eq('patient_id', params.id),
        supabase.from('clinical_notes').select('*').eq('patient_id', params.id),
        supabase.from('payments').select('*').eq('patient_id', params.id),
        supabase.from('medical_images').select('*').eq('patient_id', params.id)
      ]);

      if (dentalSchemaRes.error) throw dentalSchemaRes.error;
      if (treatmentsRes.error) throw treatmentsRes.error;
      if (treatmentPlanRes.error) throw treatmentPlanRes.error;
      if (clinicalNotesRes.error) throw clinicalNotesRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      if (medicalImagesRes.error) throw medicalImagesRes.error;

      setDentalSchema(dentalSchemaRes.data || []);
      setTreatments(treatmentsRes.data || []);
      setTreatmentPlan(treatmentPlanRes.data || []);
      setClinicalNotes(clinicalNotesRes.data || []);
      setPayments(paymentsRes.data || []);
      setMedicalImages(medicalImagesRes.data || []);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Impossible de charger les données du dossier médical');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schema':
        return <div>Schéma dentaire interactif à implémenter</div>;
      case 'soins':
        return <div>Historique des soins à implémenter</div>;
      case 'plan':
        return <div>Plan de traitement à implémenter</div>;
      case 'notes':
        return <div>Notes cliniques à implémenter</div>;
      case 'paiements':
        return <div>Suivi des paiements à implémenter</div>;
      case 'images':
        return <div>Galerie d'imagerie médicale à implémenter</div>;
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