import React, { useState, useEffect } from 'react';
import type { JournalEntry } from '../types';
import { useLocalization } from '../context/LocalizationContext';

export const Journal: React.FC = () => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [currentEntry, setCurrentEntry] = useState('');
    const { t, locale } = useLocalization();

    useEffect(() => {
        const savedEntries = localStorage.getItem('journalEntries');
        if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
        }
    }, []);

    const saveEntry = () => {
        if (!currentEntry.trim()) return;
        const newEntry: JournalEntry = {
            id: new Date().toISOString(),
            date: new Date().toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
            content: currentEntry,
        };
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
        setCurrentEntry('');
    };

    const deleteEntry = (id: string) => {
        const updatedEntries = entries.filter(entry => entry.id !== id);
        setEntries(updatedEntries);
        localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">{t('journal_title')}</h2>
                <p className="text-gray-600 mb-4">
                    {t('journal_subtitle')}
                </p>
                <textarea
                    value={currentEntry}
                    onChange={(e) => setCurrentEntry(e.target.value)}
                    rows={6}
                    placeholder={t('journal_placeholder')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                ></textarea>
                <button
                    onClick={saveEntry}
                    className="mt-4 w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 disabled:bg-teal-300"
                >
                    {t('journal_save_button')}
                </button>
            </div>
            
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-700">{t('journal_my_entries')}</h3>
                {entries.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">{t('journal_no_entries')}</p>
                ) : (
                    entries.map(entry => (
                        <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm animate-fade-in relative">
                            <p className="text-sm font-semibold text-teal-600">{entry.date}</p>
                            <p className="text-gray-700 mt-2 whitespace-pre-wrap">{entry.content}</p>
                             <button 
                                onClick={() => deleteEntry(entry.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label={t('journal_delete_entry_aria')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};