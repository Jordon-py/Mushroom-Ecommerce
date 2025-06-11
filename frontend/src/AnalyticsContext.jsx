import React, { createContext, useState, useEffect } from 'react';

const AnalyticsContext = createContext();

const defaultAnalytics = {
    pages: {
        Home: 0,
        Shop: 0,
        Mycology101: 0,
        About: 0,
        Admin: 0,
    },
    products: {},
};

export function AnalyticsProvider({ children }) {
    const [analytics, setAnalytics] = useState(() => {
        try {
            const stored = localStorage.getItem('analytics');
            return stored ? JSON.parse(stored) : defaultAnalytics;
        } catch {
            return defaultAnalytics;
        }
    });

    useEffect(() => {
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }, [analytics]);

    const recordPageView = (page) => {
        setAnalytics((prev) => ({
            ...prev,
            pages: {
                ...prev.pages,
                [page]: (prev.pages[page] || 0) + 1,
            },
        }));
    };

    const recordProductView = (product) => {
        setAnalytics((prev) => ({
            ...prev,
            products: {
                ...prev.products,
                [product]: (prev.products[product] || 0) + 1,
            },
        }));
    };

    return (
        <AnalyticsContext.Provider value={{ analytics, recordPageView, recordProductView }}>
            {children}
        </AnalyticsContext.Provider>
    );
}

export default AnalyticsContext;
