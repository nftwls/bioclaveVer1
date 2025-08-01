import React, { useState } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { useLocalization } from '../context/LocalizationContext';
import { SubscriptionModal } from './SubscriptionModal';
import { StarIcon } from './Icons';

export const ProfileView: React.FC = () => {
    const { userProfile, logout, isSubscribed } = useSubscription();
    const { t } = useLocalization();
    const [isSubModalOpen, setSubModalOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            {isSubModalOpen && <SubscriptionModal onClose={() => setSubModalOpen(false)} />}
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <h2 className="text-2xl font-bold text-teal-700 mb-4">{t('profile_title')}</h2>
                <div className="w-24 h-24 rounded-full bg-teal-100 mx-auto mb-4 flex items-center justify-center">
                     <span className="text-4xl text-teal-600 font-bold">{userProfile.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{userProfile.name}</h3>
                <p className="text-gray-500">{userProfile.email}</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-4">{t('profile_subscription_title')}</h3>
                {isSubscribed ? (
                    <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <div className="flex justify-center items-center gap-2">
                           <StarIcon className="w-6 h-6 text-yellow-500"/>
                           <p className="text-lg font-semibold text-teal-800">{t('profile_status_premium')}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{t('profile_subscription_description_premium')}</p>
                    </div>
                ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-lg font-semibold text-gray-800">{t('profile_status_free')}</p>
                        <p className="text-sm text-gray-600 mt-1 mb-4">{t('profile_subscription_description_free')}</p>
                        <button 
                            onClick={() => setSubModalOpen(true)}
                            className="bg-teal-500 text-white font-bold py-2 px-5 rounded-full hover:bg-teal-600 transition-colors duration-300"
                        >
                            {t('profile_button_upgrade')}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-4">{t('profile_settings_title')}</h3>
                <button
                    onClick={logout}
                    className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-full hover:bg-red-600 transition-colors duration-300"
                >
                    {t('profile_logout_button')}
                </button>
                 <p className="text-xs text-gray-500 mt-2 text-center">{t('profile_logout_description')}</p>
            </div>
        </div>
    );
};