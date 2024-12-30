export interface Patient {
  id?: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  numero_secu?: string | null;
  antecedents?: string | null;
  allergies?: string | null;
  traitements_actuels?: string | null;
  assurance?: string | null;
  mutuelle?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type NewPatient = Omit<Patient, 'id'>;

export interface RendezVous {
  id: string;
  patient_id: string;
  date_heure: string;
  duree: number;
  type: string;
  statut: 'en_attente' | 'confirme' | 'annule';
  notes: string;
  urgence: boolean;
  created_at: string;
  updated_at: string;
}

export interface DossierMedical {
  id: string;
  patient_id: string;
  date_consultation: string;
  diagnostic: string;
  traitement: string;
  notes_cliniques: string;
  created_at: string;
  updated_at: string;
}

export interface Traitement {
  id: string;
  dossier_id: string;
  type_traitement: string;
  description: string;
  cout: number;
  statut: 'planifié' | 'en_cours' | 'termine';
  date_debut: string;
  date_fin: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  patient_id: string;
  date_prescription: string;
  contenu: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  patient_id: string;
  type_document: string;
  titre: string;
  contenu: string;
  url_fichier: string;
  created_at: string;
  updated_at: string;
}

export interface ImageMedicale {
  id: string;
  patient_id: string;
  type_image: string;
  url_image: string;
  description: string;
  date_prise: string;
  created_at: string;
  updated_at: string;
}

export interface Inventaire {
  id: string;
  nom_produit: string;
  quantite: number;
  seuil_alerte: number;
  unite: string;
  prix_unitaire: number;
  created_at: string;
  updated_at: string;
}

export type AppointmentStatus = 'planifié' | 'confirmé' | 'annulé' | 'terminé';

export interface Appointment {
  id?: number;
  patient_id: number;
  date_heure: string;
  duree: string;
  motif: string;
  notes?: string;
  statut: AppointmentStatus;
  created_at?: string;
  updated_at?: string;
  // Relations
  patient?: Patient;
}

export type NewAppointment = Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;

export interface DentalSchema {
  id: number;
  patient_id: number;
  tooth_number: number;
  status: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Treatment {
  id: number;
  patient_id: number;
  date_traitement: string;
  type_traitement: string;
  description: string | null;
  tooth_number: number | null;
  cout: number | null;
  statut_paiement: string;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPlan {
  id: number;
  patient_id: number;
  date_creation: string;
  description: string;
  statut: string;
  priorité: string | null;
  cout_estimé: number | null;
  created_at: string;
  updated_at: string;
}

export interface ClinicalNote {
  id: number;
  patient_id: number;
  date_note: string;
  contenu: string;
  type_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  treatment_id: number;
  montant: number;
  date_paiement: string;
  mode_paiement: string;
  statut: string;
  created_at: string;
  updated_at: string;
}

export interface MedicalImage {
  id: number;
  patient_id: number;
  type_image: string;
  url: string;
  date_prise: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
