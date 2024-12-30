'use client';

import PatientList from '@/components/patients/PatientList';
import { motion } from 'framer-motion';

export default function PatientsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Patients</h1>
          <p className="text-gray-600 mt-2">Consultez et gérez vos patients</p>
        </motion.div>

        <PatientList />
      </div>
    </div>
  );
}
