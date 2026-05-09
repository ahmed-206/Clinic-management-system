import { LuSearch } from "react-icons/lu";
import { useCommonT } from "../../../hooks/useT";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchInput = ({ value, onChange, className }: Props) => {
  const tc = useCommonT();
  return (
    <div className={`relative flex-1 max-w-md group ${className}`}>
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <LuSearch
          className="text-gray-400 group-focus-within:text-primary transition-colors"
          size={20}
        />
      </div>
      <input
        type="text"
        placeholder={tc('searchHolder')}
        className="w-full pl-12 pr-4 py-3 border border-gray-400 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};