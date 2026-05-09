// Single Source of Truth
import { useState, useRef, useEffect } from 'react';
import { LuChevronDown, LuSearch, LuCheck } from 'react-icons/lu';
import { MEDICAL_SPECIALTIES } from '../../constants/medicalSpecialties';
import { useSpecialtyTranslation } from '../../hooks/language/useSpecialtyTranslation';

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

export const SpecialtySelect = ({ value, onChange, error, className }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { translateSpecialty } = useSpecialtyTranslation();
  // إغلاق لما تضغط برا
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // focus على الـ search لما يفتح
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = MEDICAL_SPECIALTIES.filter((s) => {
    const translatedLabel = translateSpecialty(s).toLowerCase();
    const originalLabel = s.toLowerCase();
    const query = search.toLowerCase();
    return translatedLabel.includes(query) || originalLabel.includes(query);
  });

  const handleSelect = (specialty: string) => {
    onChange(specialty);
    setOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-11 rounded-xl border px-4 text-sm flex items-center justify-between transition-all duration-200
          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
          ${error ? 'border-red-400' : 'border-secondary/30'}
          ${value ? 'text-secondary' : 'text-secondary/40'}
          bg-white`}
      >
        <span>{value ? translateSpecialty(value) : 'Select specialty...'}</span>
        <LuChevronDown
          size={16}
          className={`text-secondary/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
          {/* Search inside dropdown */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <LuSearch
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search specialty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 rounded-lg outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* List */}
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">
                No specialties found
              </li>
            ) : (
              filtered.map((specialty) => (
                <li
                  key={specialty}
                  onClick={() => handleSelect(specialty)}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                    ${value === specialty
                      ? 'bg-primary/5 text-primary font-medium'
                      : 'text-secondary hover:bg-gray-50'
                    }`}
                >
                  <span>{translateSpecialty(specialty)}</span>
                  {value === specialty && (
                    <LuCheck size={14} className="text-primary" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};