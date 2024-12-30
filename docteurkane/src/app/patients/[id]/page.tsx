import { supabase } from '@/lib/supabase';
import { PatientDetails } from './components/PatientDetails';
import { PostgrestError } from '@supabase/supabase-js';

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

class PatientError extends Error {
  constructor(message: string, public cause?: PostgrestError) {
    super(message);
    this.name = 'PatientError';
  }
}

async function getPatientData(id: string): Promise<PatientData | null> {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new PatientError('Impossible de charger les données du patient', error);
  }

  return data;
}

interface Props {
  params: { id: string };
}

export default async function PatientPage({ params }: Props) {
  let patient: PatientData | null;
  
  try {
    patient = await getPatientData(params.id);
  } catch (error) {
    if (error instanceof PatientError) {
      return (
        <div className="text-red-600">
          {error.message}
          {error.cause && (
            <div className="text-sm text-red-500">
              {error.cause.message}
            </div>
          )}
        </div>
      );
    }
    return <div className="text-red-600">Une erreur inattendue est survenue</div>;
  }

  if (!patient) {
    return <div>Patient non trouvé</div>;
  }

  return <PatientDetails patient={patient} />;
}
