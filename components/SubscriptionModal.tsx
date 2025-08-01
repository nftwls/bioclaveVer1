import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { useSubscription } from '../hooks/useSubscription';
import { createSubscriptionPreference } from '../services/mercadoPagoService';
import { StarIcon, XIcon } from './Icons';

interface SubscriptionModalProps {
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  const { t } = useLocalization();
  const { subscribe } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    // Simulate API call to a payment provider
    const result = await createSubscriptionPreference();
    if (result.success) {
      subscribe();
      // In a real app, you might redirect to a payment page or use a payment widget.
      // Here, we just mark the user as subscribed.
      onClose();
    } else {
      // Handle payment initiation failure
      alert('Could not initiate subscription. Please try again.');
    }
    setIsLoading(false);
  };

  const Benefit = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start">
      <div className="flex-shrink-0">
        <StarIcon className="h-5 w-5 text-teal-400" />
      </div>
      <p className="ml-3 text-sm text-gray-600">{children}</p>
    </li>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 text-center animate-fade-in-up relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <XIcon className="w-6 h-6" />
        </button>
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg">
          <StarIcon className="h-8 w-8" />
        </div>
        <h3 className="text-2xl leading-6 font-bold text-gray-900 mt-5">{t('subscription_modal_title')}</h3>
        <div className="mt-2 px-2 py-3">
          <p className="text-base text-gray-600">
            {t('subscription_modal_subtitle')}
          </p>
        </div>
        <ul className="mt-4 mb-6 space-y-3 text-left">
            <Benefit>{t('subscription_benefit_1')}</Benefit>
            <Benefit>{t('subscription_benefit_2')}</Benefit>
            <Benefit>{t('subscription_benefit_3')}</Benefit>
        </ul>
        <div className="mt-5 space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-teal-500 text-white font-bold py-3 px-4 rounded-full hover:bg-teal-600 transition-colors duration-300 shadow-md hover:shadow-lg disabled:bg-teal-300"
          >
             {isLoading && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
             )}
            {isLoading ? t('subscription_loading') : t('subscription_button_subscribe')}
          </button>
           <button
            onClick={onClose}
            className="w-full text-gray-600 font-medium py-2 px-4 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            {t('subscription_button_later')}
          </button>
        </div>
      </div>
    </div>
  );
};
