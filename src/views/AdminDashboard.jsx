import React, { useContext, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import AnalyticsContext from '../AnalyticsContext.jsx';
import './AdminDashboard.css';

/*
  NEXT STEP #4 (Analytics maturity roadmap):
  Add conversion and revenue metrics to make this dashboard useful for business decisions.

  Why here?
  - This file already visualizes analytics and is the natural place to expose KPIs.

  Educational implementation example:
  1) Extend the context event schema with checkout events (see AnalyticsContext.jsx comment).
  2) Derive funnel metrics here via memoization.

  Example:
  const funnel = useMemo(() => {
    const viewed = analytics.events.filter((e) => e.type === 'product').length;
    const added = analytics.events.filter((e) => e.type === 'cart_add').length;
    const purchased = analytics.events.filter((e) => e.type === 'purchase').length;
    return {
      viewToCart: viewed ? ((added / viewed) * 100).toFixed(1) : '0.0',
      cartToPurchase: added ? ((purchased / added) * 100).toFixed(1) : '0.0',
    };
  }, [analytics.events]);
*/
export default function AdminDashboard() {
  const { analytics, recordPageView, resetAnalytics, getDailySummary } = useContext(AnalyticsContext);
  const pageChartRef = useRef(null);
  const productChartRef = useRef(null);

  useEffect(() => {
    recordPageView('Admin');
  }, [recordPageView]);

  useEffect(() => {
    if (!pageChartRef.current || !productChartRef.current) {
      return undefined;
    }

    const pageCtx = pageChartRef.current.getContext('2d');
    const productCtx = productChartRef.current.getContext('2d');

    const dailySummary = getDailySummary(analytics.events);

    const pageChart = new Chart(pageCtx, {
      type: 'line',
      data: {
        labels: Object.keys(dailySummary),
        datasets: [
          {
            label: 'Views per Day',
            data: Object.values(dailySummary),
            fill: false,
            borderColor: 'rgba(123,97,255,0.8)',
          },
        ],
      },
      options: {
        responsive: true,
        tension: 0.3,
      },
    });

    const productChart = new Chart(productCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(analytics.products),
        datasets: [
          {
            label: 'Product Views',
            data: Object.values(analytics.products),
            backgroundColor: 'rgba(255,105,97,0.6)',
          },
        ],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      pageChart.destroy();
      productChart.destroy();
    };
  }, [analytics.events, analytics.products, getDailySummary]);

  return (
    <main className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <p>Analytics Overview</p>
        <button onClick={resetAnalytics} className="reset-btn">
          Reset
        </button>
      </header>
      <section className="charts">
        <div className="chart-container">
          <canvas ref={pageChartRef} aria-label="Page view chart" />
        </div>
        <div className="chart-container">
          <canvas ref={productChartRef} aria-label="Product view chart" />
        </div>
      </section>
      <section className="events">
        <h2>Recent Events</h2>
        <ul>
          {analytics.events
            .slice(-5)
            .reverse()
            .map((eventItem, idx) => (
              <li key={`${eventItem.timestamp}-${idx}`}>
                {new Date(eventItem.timestamp).toLocaleString()} - {eventItem.type}: {eventItem.name}
              </li>
            ))}
        </ul>
      </section>
    </main>
  );
}
