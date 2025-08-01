import { useState, useEffect, useCallback } from 'react';
import type { UserProfile } from '../types';

const JOURNAL_ENTRIES_KEY = 'journalEntries';
const DISCLAIMER_SHOWN_KEY = 'disclaimerShown';
const LOCALE_KEY = 'bioclave_locale';
const SUBSCRIPTION_STATUS_KEY = 'bioclave_subscription_status';
const SEARCH_COUNT_KEY = 'bioclave_search_count';
const FREE_SEARCH_LIMIT = 1;

export const useSubscription = () => {
    const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
        return localStorage.getItem(SUBSCRIPTION_STATUS_KEY) === 'true';
    });

    const [searchCount, setSearchCount] = useState<number>(() => {
        const count = localStorage.getItem(SEARCH_COUNT_KEY);
        return count ? parseInt(count, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem(SUBSCRIPTION_STATUS_KEY, String(isSubscribed));
    }, [isSubscribed]);

    useEffect(() => {
        localStorage.setItem(SEARCH_COUNT_KEY, String(searchCount));
    }, [searchCount]);

    const userProfile: UserProfile = {
        name: 'Alex Ríos',
        email: 'alex.rios@email.com',
    };
    
    const isAllowedToSearch = isSubscribed || searchCount < FREE_SEARCH_LIMIT;

    const incrementSearchCount = useCallback(() => {
        if (!isSubscribed) {
            setSearchCount(current => current + 1);
        }
    }, [isSubscribed]);

    const subscribe = useCallback(() => {
        setIsSubscribed(true);
    }, []);

    const logout = useCallback(() => {
        // Clear all app-related data from localStorage
        localStorage.removeItem(JOURNAL_ENTRIES_KEY);
        localStorage.removeItem(DISCLAIMER_SHOWN_KEY);
        localStorage.removeItem(LOCALE_KEY);
        localStorage.removeItem(SUBSCRIPTION_STATUS_KEY);
        localStorage.removeItem(SEARCH_COUNT_KEY);
        window.location.reload();
    }, []);

    return {
        isSubscribed,
        isAllowedToSearch,
        searchCount,
        freeSearchLimit: FREE_SEARCH_LIMIT,
        subscribe,
        incrementSearchCount,
        logout,
        userProfile
    };
};