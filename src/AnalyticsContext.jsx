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
  events: [], // individual view events with timestamps
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
    const timestamp = Date.now();
    setAnalytics((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: (prev.pages[page] || 0) + 1,
      },
      events: [...prev.events, { type: 'page', name: page, timestamp }],
    }));
  };

  const recordProductView = (product) => {
    const timestamp = Date.now();
    setAnalytics((prev) => ({
      ...prev,
      products: {
        ...prev.products,
        [product]: (prev.products[product] || 0) + 1,
      },
      events: [...prev.events, { type: 'product', name: product, timestamp }],
    }));
  };

  const getDailySummary = () => {
    const summary = {};
    analytics.events.forEach((evt) => {
      const day = new Date(evt.timestamp).toLocaleDateString();
      summary[day] = (summary[day] || 0) + 1;
    });
    return summary;
  };

  const resetAnalytics = () => {
    setAnalytics(defaultAnalytics);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        recordPageView,
        recordProductView,
        resetAnalytics,
        getDailySummary,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export default AnalyticsContext;
