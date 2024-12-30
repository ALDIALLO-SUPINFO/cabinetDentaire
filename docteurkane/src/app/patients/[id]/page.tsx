import { supabase } from '@/lib/supabase';

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

'use client';

import { motion } from 'framer-motion';
import { FiEdit2, FiCalendar, FiPhone, FiMail, FiMapPin, FiFileText } from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

function PatientDetails({ patient }: { patient: PatientData }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {patient.prenom} {patient.nom}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/patients/${patient.id}/modifier`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiEdit2 className="mr-2" />
              Modifier
            </Link>
            <Link
              href={`/rendez-vous/nouveau?patient=${patient.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiCalendar className="mr-2" />
              Nouveau RDV
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informations personnelles
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date de naissance</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {patient.date_naissance ? format(new Date(patient.date_naissance), 'dd/MM/yyyy') : 'Non renseignée'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <FiPhone className="mr-2" />
                      Téléphone
                    </div>
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {patient.telephone || 'Non renseigné'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <FiMail className="mr-2" />
                      Email
                    </div>
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {patient.email || 'Non renseigné'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <FiMapPin className="mr-2" />
                      Adresse
                    </div>
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {patient.adresse || 'Non renseignée'}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    <div className="flex items-center">
                      <FiFileText className="mr-2" />
                      Numéro d&apos;assurance sociale
                    </div>
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {patient.numero_secu || 'Non renseigné'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Dossier médical
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                <Link
                  href={`/patients/${patient.id}/dossier-medical`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiFileText className="mr-2" />
                  Voir le dossier médical
                </Link>
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Rendez-vous
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5">
                <Link
                  href={`/rendez-vous?patient=${patient.id}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiCalendar className="mr-2" />
                  Voir les rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
