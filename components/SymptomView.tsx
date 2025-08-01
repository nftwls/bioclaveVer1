import React, { useState, useCallback } from 'react';
import type { SymptomData } from '../types';
import { getSymptomInfo } from '../services/geminiService';
import { SearchIcon, ChevronDown } from './Icons';
import { useLocalization } from '../context/LocalizationContext';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionModal } from './SubscriptionModal';

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-t border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-4 text-left font-semibold text-gray-700 hover:bg-gray-50"
            >
                <span>{title}</span>
                <ChevronDown className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="pb-4 text-gray-600">{children}</div>}
        </div>
    );
};


export const SymptomView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [symptomData, setSymptomData] = useState<SymptomData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSubModal, setShowSubModal] = useState(false);

    const { t, locale } = useLocalization();
    const { isAllowedToSearch, incrementSearchCount } = useSubscription();

    const handleSearch = useCallback(async () => {
        if (!searchTerm.trim()) return;

        if (!isAllowedToSearch) {
            setShowSubModal(true);
            return;
        }

        setIsLoading(true);
        setError(null);
        setSymptomData(null);
        try {
            const result = await getSymptomInfo(searchTerm, locale);
            setSymptomData(result);
            incrementSearchCount();
        } catch (err) {
            setError(t('symptom_error_fetch'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, locale, t, isAllowedToSearch, incrementSearchCount]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    
    const IntroMessage = () => (
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-teal-700 mb-2">{t('symptom_intro_title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
                {t('symptom_intro_subtitle')}
            </p>
        </div>
    );

    return (
        <div className="space-y-6">
            {showSubModal && <SubscriptionModal onClose={() => setShowSubModal(false)} />}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t('symptom_placeholder')}
                    className="w-full pl-14 pr-6 py-4 text-lg bg-white shadow-sm border-2 border-gray-200 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-300"
                    disabled={isLoading}
                />
                <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <SearchIcon className="w-6 h-6 text-gray-500" />
                </div>
            </div>
            
            <button
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-teal-500 text-white font-bold py-4 px-6 text-lg rounded-full hover:bg-teal-600 transition-all duration-300 disabled:bg-teal-300 flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('symptom_button_loading')}
                    </>
                ) : t('symptom_button_search')}
            </button>

            <div className="mt-6">
                {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
                {!symptomData && !isLoading && !error && <IntroMessage />}
                
                {symptomData && (
                    <div className="bg-white rounded-xl shadow-lg animate-fade-in p-6 space-y-4">
                        <h2 className="text-3xl font-bold text-teal-700 border-b-2 border-teal-100 pb-2">{symptomData.symptomTitle}</h2>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('symptom_definition')}</h3>
                            <p className="text-gray-600">{symptomData.definition}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('symptom_bio_meaning')}</h3>
                            <p className="text-gray-600 italic bg-teal-50 p-3 rounded-md">{symptomData.biologicalMeaning}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('symptom_conflicts')}</h3>
                            <ul className="space-y-2 list-disc list-inside text-gray-600">
                                {symptomData.conflicts.map((conflict, index) => (
                                    <li key={index}>{conflict}</li>
                                ))}
                            </ul>
                        </div>

                        {symptomData.technicalInfo && (
                            <Accordion title={t('symptom_tech_info_title')}>
                                <div className="space-y-2 text-sm">
                                    {symptomData.technicalInfo.embryonicLayer && <p><strong>{t('symptom_tech_info_layer')}:</strong> {symptomData.technicalInfo.embryonicLayer}</p>}
                                    {symptomData.technicalInfo.conflictType && <p><strong>{t('symptom_tech_info_conflict_type')}:</strong> {symptomData.technicalInfo.conflictType}</p>}
                                    {symptomData.technicalInfo.diseasePhaseBehavior && <p><strong>{t('symptom_tech_info_phases')}:</strong> {symptomData.technicalInfo.diseasePhaseBehavior}</p>}
                                </div>
                            </Accordion>
                        )}
                         <div className="pt-4 text-xs text-gray-500 italic">
                            <p>{t('symptom_reminder')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};