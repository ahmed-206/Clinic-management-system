import { useState } from 'react';
import { GeneralSettings } from '../../../features/admin/settings/components/GeneralSettings';
import { FinancialSettings } from '../../../features/admin/settings/components/FinancialSettings';
import { SecuritySettings } from '../../../features/admin/settings/components/SecuritySettings';
import {
  LuSettings,
  LuLockKeyhole,
  LuCircleDollarSign
  
} from "react-icons/lu";
import {  useDashboardT } from '../../../hooks/useT';
const SettingsPage = () => {
 
  const td = useDashboardT();
  const [activeTab, setActiveTab] = useState('general');

  // قائمة التبويبات   
  const tabs = [
    { id: 'general', label: 'General Settings', icon: <LuSettings />},
    { id: 'financial', label: 'Financials', icon: <LuCircleDollarSign /> },
    { id: 'security', label: 'Security', icon: <LuLockKeyhole /> },
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <h1 className="text-xl md:text-2xl font-bold text-primary mb-6 md:mb-8 text-center md:text-start">{td('dashboard.admin.systemSettings')}</h1>

      <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Sidebar Tabs */}
        <aside className="w-full lg:w-64 bg-white p-4 border-r border-gray-100">
          <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 lg:w-full flex items-center justify-center lg:justify-start gap-3 px-4 py-3 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-blue-200' 
                  : 'text-secondary hover:bg-neutral-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 p-4 md:p-8 ">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'financial' && <FinancialSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;