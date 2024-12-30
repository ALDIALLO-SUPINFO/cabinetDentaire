import { supabase } from '@/lib/supabase';
import { PatientDetails } from './components/PatientDetails';

interface PatientData {
  id: string;
  nom: string;
  prenom: string;
  date_naissance?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  numero_secu?: string;
  created_at: string;
}

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

async function getPatientData(id: string) {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Impossible de charger les données du patient');
  }

  return data;
}

export default async function PatientPage({ params }: PageProps) {
  let patient: PatientData;
  
  try {
    patient = await getPatientData(params.id);
  } catch (error) {
    return <div>Impossible de charger les données du patient</div>;
  }

  if (!patient) {
    return <div>Patient non trouvé</div>;
  }

  return <PatientDetails patient={patient} />;
}
