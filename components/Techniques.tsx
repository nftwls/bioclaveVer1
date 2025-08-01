import React, { useState } from 'react';
import type { Technique } from '../types';
import { getTechniqueExplanation } from '../services/geminiService';
import { useLocalization } from '../context/LocalizationContext';

const techniquesList: Omit<Technique, 'description'>[] = [
    { id: 'circulo_excelencia', name: 'Círculo de la Excelencia', category: 'PNL' },
    { id: 'anclaje_cinestesico', name: 'Anclaje Cinestésico', category: 'PNL' },
    { id: 'reencuadre', name: 'Cambiar el Significado (Reencuadre)', category: 'PNL' },
    { id: 'linea_tiempo', name: 'Línea del Tiempo', category: 'PNL' },
    { id: 'psicomagia', name: 'Psicomagia', category: 'Actos Simbólicos' },
    { id: 'nino_interno', name: 'Recuperación del Niño Interno', category: 'Sanación Emocional' },
    { id: 'protocolo_duelo', name: 'Protocolo de Duelo', category: 'Sanación Emocional' },
];

export const Techniques: React.FC = () => {
    const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t, locale } = useLocalization();

    const handleSelectTechnique = async (techniqueName: string, techniqueId: string) => {
        setIsLoading(true);
        setError(null);
        setSelectedTechnique(null);
        try {
            const description = await getTechniqueExplanation(techniqueName, locale);
            const fullTechnique = techniquesList.find(t => t.id === techniqueId);
            if(fullTechnique) {
                setSelectedTechnique({ ...fullTechnique, description });
            }
        } catch (err) {
            setError(t('techniques_error_fetch'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold text-teal-700 mb-2">{t('techniques_title')}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    {t('techniques_subtitle')}
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techniquesList.map(tech => (
                    <button 
                        key={tech.id}
                        onClick={() => handleSelectTechnique(tech.name, tech.id)}
                        className="bg-white p-4 rounded-lg shadow-sm text-left hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                        <p className="text-xs font-semibold text-teal-500 uppercase">{t(`technique_category_${tech.category.replace(' ', '_').toLowerCase()}`)}</p>
                        <h3 className="text-lg font-bold text-gray-800 mt-1">{t(`technique_name_${tech.id}`)}</h3>
                    </button>
                ))}
            </div>
            
            {(isLoading || error || selectedTechnique) && (
                <div className="mt-6 p-6 bg-white rounded-xl shadow-lg">
                    {isLoading && (
                        <div className="flex justify-center items-center">
                            <svg className="animate-spin h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="ml-3 text-gray-600">{t('techniques_loading')}</p>
                        </div>
                    )}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {selectedTechnique && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-2xl font-bold text-teal-700">{t(`technique_name_${selectedTechnique.id}`)}</h3>
                            <p className="text-sm font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-full inline-block">{t(`technique_category_${selectedTechnique.category.replace(' ', '_').toLowerCase()}`)}</p>
                            <div className="text-gray-700 space-y-3 whitespace-pre-wrap">{selectedTechnique.description}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};