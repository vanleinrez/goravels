import React from 'react';
import Icon from '../components/Icon';

interface HostDashboardProps {
  onLogout: () => void;
}

const HostDashboardScreen: React.FC<HostDashboardProps> = ({ onLogout }) => {
  return (
    <div className="h-full bg-stone-50 flex flex-col">
      <div className="bg-stone-900 text-white p-6 pb-12 rounded-b-3xl">
          <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Host Dashboard</h1>
              <button onClick={onLogout} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                  <Icon className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>
              </button>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-center">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white mr-4 shadow-lg">
                  <Icon className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>
              </div>
              <div>
                  <p className="text-sm text-stone-300 uppercase tracking-wide font-bold">Status</p>
                  <p className="text-lg font-bold">Pending Review</p>
              </div>
          </div>
      </div>

      <div className="flex-1 p-6 -mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h3 className="font-bold text-stone-800 mb-4">Application Checklist</h3>
              <div className="space-y-4">
                  <CheckItem label="Registration Form" checked={true} />
                  <CheckItem label="Email Verification" checked={true} />
                  <CheckItem label="LGU Recommendation" checked={false} />
                  <CheckItem label="Ocular Inspection" checked={false} />
              </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
              <h3 className="font-bold text-emerald-800 mb-2">Need Help?</h3>
              <p className="text-sm text-emerald-600 mb-4">Contact the Gora Team support if you have questions about your LGU requirements.</p>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Contact Support</button>
          </div>
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
    <div className="flex items-center justify-between">
        <span className={checked ? 'text-stone-700 font-medium' : 'text-stone-400'}>{label}</span>
        {checked ? (
             <Icon className="w-5 h-5 text-green-500"><polyline points="20 6 9 17 4 12"/></Icon>
        ) : (
             <div className="w-5 h-5 rounded-full border-2 border-stone-200"></div>
        )}
    </div>
);

export default HostDashboardScreen;