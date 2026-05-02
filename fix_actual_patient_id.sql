-- ============================================================
-- STEP 1: Fix appointments with actual_patient_id = NULL
-- Links each appointment to the patient record that was 
-- self-booked by the same auth user (is_self = true).
-- ============================================================
UPDATE appointments a
SET actual_patient_id = p.id
FROM patients p
WHERE a.actual_patient_id IS NULL
  AND p.booked_by = a.patient_id
  AND p.is_self = true;

-- ============================================================
-- STEP 2: Fix prescriptions with actual_patient_id = NULL
-- Copies the actual_patient_id from the linked appointment.
-- Run AFTER Step 1 so appointments are already fixed.
-- ============================================================
UPDATE prescriptions pr
SET actual_patient_id = a.actual_patient_id
FROM appointments a
WHERE pr.actual_patient_id IS NULL
  AND pr.appointment_id = a.id
  AND a.actual_patient_id IS NOT NULL;

-- ============================================================
-- VERIFY: Check how many rows still have NULL after the fix
-- (should be 0 for both if all patients have a self record)
-- ============================================================
SELECT COUNT(*) AS remaining_null_appointments
FROM appointments
WHERE actual_patient_id IS NULL;

SELECT COUNT(*) AS remaining_null_prescriptions
FROM prescriptions
WHERE actual_patient_id IS NULL;
