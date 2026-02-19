import { useState } from 'react';
import { GeneralSettings } from '../../../features/admin/settings/components/GeneralSettings';
import { FinancialSettings } from '../../../features/admin/settings/components/FinancialSettings';
import { SecuritySettings } from '../../../features/admin/settings/components/SecuritySettings';
import {
  LuSettings,
  LuLockKeyhole,
  LuCircleDollarSign
  
} from "react-icons/lu";
const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  // قائمة التبويبات   
  const tabs = [
    { id: 'general', label: 'General Settings', icon: <LuSettings />},
    { id: 'financial', label: 'Financials', icon: <LuCircleDollarSign /> },
    { id: 'security', label: 'Security', icon: <LuLockKeyhole /> },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-700 mb-8">System Settings</h1>

      <div className="flex flex-col md:flex-row gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-100">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-primary text-white shadow-md shadow-blue-200' 
                  : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Tab Content */}
        <main className="flex-1 p-8 ">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'financial' && <FinancialSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;