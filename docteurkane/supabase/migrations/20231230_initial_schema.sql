-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    numero_secu VARCHAR(15) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255),
    antecedents TEXT,
    assurance VARCHAR(100),
    mutuelle VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE rendez_vous (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    date_heure TIMESTAMP WITH TIME ZONE NOT NULL,
    duree INTEGER NOT NULL, -- durée en minutes
    type VARCHAR(50) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'en_attente',
    notes TEXT,
    urgence BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create medical records table
CREATE TABLE dossier_medical (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    date_consultation TIMESTAMP WITH TIME ZONE NOT NULL,
    diagnostic TEXT,
    traitement TEXT,
    notes_cliniques TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create treatments table
CREATE TABLE traitements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dossier_id UUID REFERENCES dossier_medical(id),
    type_traitement VARCHAR(100) NOT NULL,
    description TEXT,
    cout DECIMAL(10,2),
    statut VARCHAR(20) NOT NULL DEFAULT 'planifié',
    date_debut DATE,
    date_fin DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create prescriptions table
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    date_prescription TIMESTAMP WITH TIME ZONE NOT NULL,
    contenu TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    type_document VARCHAR(50) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    contenu TEXT,
    url_fichier VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create medical images table
CREATE TABLE images_medicales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id),
    type_image VARCHAR(50) NOT NULL,
    url_image VARCHAR(255) NOT NULL,
    description TEXT,
    date_prise TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create inventory table
CREATE TABLE inventaire (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom_produit VARCHAR(255) NOT NULL,
    quantite INTEGER NOT NULL,
    seuil_alerte INTEGER,
    unite VARCHAR(50),
    prix_unitaire DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rendez_vous_updated_at
    BEFORE UPDATE ON rendez_vous
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dossier_medical_updated_at
    BEFORE UPDATE ON dossier_medical
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_traitements_updated_at
    BEFORE UPDATE ON traitements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_images_medicales_updated_at
    BEFORE UPDATE ON images_medicales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventaire_updated_at
    BEFORE UPDATE ON inventaire
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
