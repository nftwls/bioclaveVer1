import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import type { Locale } from '../types';
import { ChevronDown } from './Icons';

const languages: { code: Locale; name: string }[] = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'zh', name: '中文' },
];

export const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale, t } = useLocalization();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (langCode: Locale) => {
        setLocale(langCode);
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-teal-500 transition-colors duration-200"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={t('language_switcher_title')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                <span className="font-medium uppercase text-sm">{locale}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-orientation="vertical"
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full text-left px-4 py-2 text-sm ${
                                locale === lang.code
                                    ? 'bg-teal-100 text-teal-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            role="menuitem"
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
