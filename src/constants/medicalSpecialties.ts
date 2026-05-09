
export const MEDICAL_SPECIALTIES = [
  
  "General Practice",
  "Family Medicine",
  "Internal Medicine",
  "Emergency Medicine",
  
 
  "General Surgery",
  "Orthopedic Surgery",
  "Neurosurgery",
  "Cardiothoracic Surgery",
  "Plastic Surgery",
  "Vascular Surgery",
  "Pediatric Surgery",

  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Hematology",
  "Infectious Disease",
  "Nephrology",
  "Neurology",
  "Oncology",
  "Pulmonology",
  "Rheumatology",
  "Urology",

  // Women & Children
  "Obstetrics & Gynecology",
  "Pediatrics",
  "Neonatology",

 
  "Psychiatry",
  "Psychology",

 
  "Ophthalmology",
  "Otolaryngology (ENT)",
  "Audiology",

 
  "Dentistry",
  "Orthodontics",
  "Oral & Maxillofacial Surgery",


  "Radiology",
  "Pathology",
  "Nuclear Medicine",


  "Physical Medicine & Rehabilitation",
  "Physical Therapy",
  "Occupational Therapy",


  "Anesthesiology",
  "Geriatrics",
  "Sports Medicine",
  "Nutrition & Dietetics",
] as const;

export type MedicalSpecialty = typeof MEDICAL_SPECIALTIES[number];