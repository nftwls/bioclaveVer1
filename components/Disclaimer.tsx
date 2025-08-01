import React from 'react';
import { Info } from './Icons';
import { useLocalization } from '../context/LocalizationContext';


interface DisclaimerModalProps {
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  const { t } = useLocalization();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-teal-100">
          <Info className="h-6 w-6 text-teal-600" />
        </div>
        <h3 className="text-lg leading-6 font-bold text-gray-900 mt-4">{t('disclaimer_title')}</h3>
        <div className="mt-2 px-2 py-3">
          <p className="text-sm text-gray-600">
            {t('disclaimer_p1')}
          </p>
          <p className="text-sm text-gray-700 font-semibold mt-3">
            {t('disclaimer_p2')}
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={onAccept}
            className="w-full bg-teal-500 text-white font-bold py-2 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300"
          >
            {t('disclaimer_button')}
          </button>
        </div>
      </div>
    </div>
  );
};