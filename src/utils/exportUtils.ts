// src/utils/exportUtils.ts
import * as XLSX from 'xlsx';
import { type AppointmentData } from '../types/types';
export const exportToExcel = (data: AppointmentData[], fileName: string) => {

  // 1. تنظيف البيانات (نختار فقط الأعمدة التي تهم المستخدم)
  const cleanData = data.map((item) => ({
   'Patient Name': item.patient?.name ||  'N/A', 
    'Doctor': item.doctor?.name || 'N/A',
    'Specialty': item.doctor?.specialty || 'N/A',
    'Date': item.appointment_date,
    'Status': item.status.toUpperCase(),
  }));

  // 2. إنشاء "ورقة عمل" (Worksheet)
  const worksheet = XLSX.utils.json_to_sheet(cleanData);

  // 3. إنشاء "كتاب عمل" (Workbook)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments');

  // 4. تحميل الملف
  XLSX.writeFile(workbook, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
};