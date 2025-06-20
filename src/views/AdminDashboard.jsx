import React, { useContext, useEffect, useRef } from 'react';
import AnalyticsContext from '../AnalyticsContext.jsx';
import './AdminDashboard.css';
import { Chart } from 'chart.js/auto';

export default function AdminDashboard() {
  const {
    analytics,
    recordPageView,
    resetAnalytics,
    getDailySummary,
  } = useContext(AnalyticsContext);
  const pageChartRef = useRef(null);
  const productChartRef = useRef(null);

  useEffect(() => {
    recordPageView('Admin');
    const pageCtx = pageChartRef.current.getContext('2d');
    const productCtx = productChartRef.current.getContext('2d');

    const dailySummary = getDailySummary();

    const pageChart = new Chart(pageCtx, {
      type: 'line',
      data: {
        labels: Object.keys(dailySummary),
        datasets: [{
          label: 'Views per Day',
          data: Object.values(dailySummary),
          fill: false,
          borderColor: 'rgba(123,97,255,0.8)',
        }],
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
        datasets: [{
          label: 'Product Views',
          data: Object.values(analytics.products),
          backgroundColor: 'rgba(255,105,97,0.6)',
        }],
      },
      options: {
        responsive: true,
      },
    });

    return () => {
      pageChart.destroy();
      productChart.destroy();
    };
  }, [analytics, recordPageView, getDailySummary]);

  return (
    <main className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <p>Analytics Overview</p>
        <button onClick={resetAnalytics} className="reset-btn">Reset</button>
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
          {analytics.events.slice(-5).reverse().map((e, idx) => (
            <li key={idx}>
              {new Date(e.timestamp).toLocaleString()} - {e.type}: {e.name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
