import React, { useState, useEffect } from 'react';
import { SearchIcon, BookOpen, HeartHandshake, Info, UserIcon } from './components/Icons';
import { SymptomView } from './components/SymptomView';
import { Journal } from './components/Journal';
import { Techniques } from './components/Techniques';
import { ProfileView } from './components/ProfileView';
import { DisclaimerModal } from './components/Disclaimer';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLocalization } from './context/LocalizationContext';

type Tab = 'search' | 'journal' | 'techniques' | 'profile';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('search');
    const [showDisclaimer, setShowDisclaimer] = useState<boolean>(false);
    const { t } = useLocalization();

    useEffect(() => {
        const disclaimerShown = localStorage.getItem('disclaimerShown');
        if (!disclaimerShown) {
            setShowDisclaimer(true);
        }
    }, []);

    const handleAcceptDisclaimer = () => {
        localStorage.setItem('disclaimerShown', 'true');
        setShowDisclaimer(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'search':
                return <SymptomView />;
            case 'journal':
                return <Journal />;
            case 'techniques':
                return <Techniques />;
            case 'profile':
                return <ProfileView />;
            default:
                return <SymptomView />;
        }
    };

    const NavButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex flex-col items-center justify-center space-y-1 w-full py-2 px-1 transition-colors duration-200 ${
                activeTab === tab 
                ? 'text-teal-500 border-t-2 border-teal-500' 
                : 'text-gray-500 hover:text-teal-400'
            }`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-teal-50/50 flex flex-col">
            {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}

            <header className="bg-white shadow-md w-full sticky top-0 z-20">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                           <HeartHandshake className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-teal-600">BioClave</h1>
                    </div>
                     <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        <button onClick={() => setShowDisclaimer(true)} className="text-gray-500 hover:text-teal-500">
                            <Info className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-6">
                {renderContent()}
            </main>

            <footer className="bg-white shadow-up w-full sticky bottom-0 z-20 border-t border-gray-200 md:hidden">
                <nav className="flex justify-around items-center">
                    <NavButton tab="search" icon={<SearchIcon className="w-6 h-6" />} label={t('nav_search')} />
                    <NavButton tab="journal" icon={<BookOpen className="w-6 h-6" />} label={t('nav_journal')} />
                    <NavButton tab="techniques" icon={<HeartHandshake className="w-6 h-6" />} label={t('nav_techniques')} />
                    <NavButton tab="profile" icon={<UserIcon className="w-6 h-6" />} label={t('nav_profile')} />
                </nav>
            </footer>
             <footer className="hidden md:block bg-white p-4 text-center text-sm text-gray-500 border-t">
                <p>{t('footer_text')}</p>
            </footer>
        </div>
    );
};

export default App;