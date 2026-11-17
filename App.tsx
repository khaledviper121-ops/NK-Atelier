
import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Rentals } from './pages/Rentals';
import { Returns } from './pages/Returns';
import { Customers } from './pages/Customers';
import { Employees } from './pages/Employees';
import { Accounts } from './pages/Accounts';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Shift } from './pages/Shift';
import { Login } from './pages/Login';
import { TRANSLATIONS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Globe, Bell, BellOff, CalendarCheck, Clock } from 'lucide-react';
import { DressAvailabilityModal } from './components/DressAvailabilityModal';
import { NotificationCenter } from './components/NotificationCenter';
import { NotificationToast } from './components/NotificationToast';

const AppContent: React.FC = () => {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isGlobalAvailabilityOpen, setIsGlobalAvailabilityOpen] = useState(false);
  const t = TRANSLATIONS[state.language];

  const unreadNotifs = (state.notifications || []).filter(n => !n.read).length;

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotifPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'rentals': return <Rentals />;
      case 'returns': return <Returns />;
      case 'shift': return <Shift onNavigateToReturns={() => setActiveTab('returns')} />;
      case 'customers': return <Customers />;
      case 'employees': return <Employees />;
      case 'accounts': return <Accounts />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  // Auth Guard
  if (!state.currentUser) {
    return <Login />;
  }

  // Active open shift check for header badge
  const activeOpenShift = (state.shifts || []).find(s => s.status === 'open');

  return (
    <div className="flex min-h-screen font-sans selection:bg-indigo-100" dir={state.language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 p-8 flex flex-col gap-8 overflow-x-hidden">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
              {t[activeTab as keyof typeof t]}
            </h2>
            <p className="text-gray-500 mt-1">
              {activeTab === 'settings' 
                ? 'تخصيص خصائص النظام والعملات وطرق الدفع.' 
                : activeTab === 'shift'
                ? 'إدارة الوردية، تقفيل اليوم، ورصيد تأمينات الفساتين المسلّمة.'
                : t.welcomeBack + '، ' + state.currentUser.name}
            </p>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Shift Button / Indicator */}
            <button
              onClick={() => setActiveTab('shift')}
              title={activeOpenShift ? `الوردية #${activeOpenShift.shiftNumber} مفتوحة ومباشرة - اضغط لتقفيل اليوم أو متابعة التأمينات` : 'لا توجد وردية مفتوحة - اضغط لفتح وردية جديدة'}
              className={`px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl transition-all flex items-center gap-2 border shadow-sm ${
                activeOpenShift
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Clock size={19} className={activeOpenShift ? "text-emerald-600 animate-pulse" : "text-amber-600"} />
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-black leading-tight">
                  {activeOpenShift ? `وردية #${activeOpenShift.shiftNumber} (مفتوحة)` : 'الوردية مقفلة'}
                </span>
                <span className="hidden sm:inline text-[9px] text-gray-500 font-semibold">
                  {activeOpenShift ? 'تقفيل اليوم والجرد' : 'فتح وردية جديدة'}
                </span>
              </div>
            </button>

            <button 
              onClick={() => setIsGlobalAvailabilityOpen(true)}
              title="استعلام عن تواريخ حجز أي فستان (بحث بالاسم أو الكود)"
              className="px-3.5 py-2.5 sm:py-3 glass rounded-2xl hover:bg-purple-50 text-purple-600 transition-all flex items-center gap-2 border border-purple-200/50 shadow-sm"
            >
              <CalendarCheck size={20} />
              <span className="hidden md:inline text-xs font-bold">استعلام حجز فستان</span>
            </button>
            <button 
              onClick={() => setIsNotificationCenterOpen(true)}
              title={`مركز التنبيهات والإشعارات (${unreadNotifs} إشعار غير مقروء)`}
              className={`relative p-3 glass rounded-2xl transition-all ${
                unreadNotifs > 0 ? 'text-indigo-600 bg-white shadow-sm' : 'text-gray-500 hover:bg-white/40'
              }`}
            >
              <Bell size={20} className={unreadNotifs > 0 ? "text-indigo-600 animate-pulse" : "text-gray-500"} />
              {unreadNotifs > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                  {unreadNotifs > 99 ? '99+' : unreadNotifs}
                </span>
              ) : (
                <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${notifPermission === 'granted' ? 'bg-emerald-500' : 'bg-transparent'}`} />
              )}
            </button>
            <button 
              onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'ar' ? 'en' : 'ar' })}
              className="p-3 glass rounded-2xl hover:bg-white/40 transition-all flex items-center gap-2"
            >
              <Globe size={20} className="text-indigo-600" />
              <span className="text-sm font-bold">{state.language === 'ar' ? 'English' : 'عربي'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`p-3 glass rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-indigo-500 text-white' : 'hover:bg-white/40 text-gray-600'}`}
            >
              <SettingsIcon size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* @ts-ignore - Suppressing motion props mismatch for route transitions */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        <DressAvailabilityModal
          isOpen={isGlobalAvailabilityOpen}
          onClose={() => setIsGlobalAvailabilityOpen(false)}
        />

        <NotificationCenter
          isOpen={isNotificationCenterOpen}
          onClose={() => setIsNotificationCenterOpen(false)}
          onNavigate={(tab) => {
            setActiveTab(tab);
          }}
          notifPermission={notifPermission}
          onRequestPermission={requestNotifPermission}
        />

        <NotificationToast
          onNavigate={(tab) => {
            setActiveTab(tab);
          }}
        />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
