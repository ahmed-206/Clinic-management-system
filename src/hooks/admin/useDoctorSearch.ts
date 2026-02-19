import { useState, useMemo } from 'react';
import { type UserProfile } from '../../types/types';

export const useDoctorSearch = (doctors: UserProfile[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All' || doc.specialty?.toLowerCase() === specialtyFilter?.toLowerCase();
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, specialtyFilter]);

  // استخراج قائمة التخصصات الفريدة من الدكاترة المتاحين
  const allSpecialties = useMemo(() => {
  const specs = doctors
    .map(d => d.specialty?.toLowerCase().trim())
    .filter((s): s is string => !!s); // هذا السطر يزيل أي قيمة undefined ويؤكد لـ TS أنها string
  return ['All', ...new Set(specs)];
}, [doctors]);

  return {
    searchTerm,
    setSearchTerm,
    specialtyFilter,
    setSpecialtyFilter,
    filteredDoctors,
    allSpecialties
  };
};