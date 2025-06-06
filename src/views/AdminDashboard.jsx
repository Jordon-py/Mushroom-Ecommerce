import React, { useContext, useEffect, useRef } from 'react';
import AnalyticsContext from '../AnalyticsContext.jsx';
import './AdminDashboard.css';
import { Chart } from 'chart.js/auto';

export default function AdminDashboard() {
  const { analytics, recordPageView } = useContext(AnalyticsContext);
  const pageChartRef = useRef(null);
  const productChartRef = useRef(null);

  useEffect(() => {
    recordPageView('Admin');
    const pageCtx = pageChartRef.current.getContext('2d');
    const productCtx = productChartRef.current.getContext('2d');

    const pageChart = new Chart(pageCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(analytics.pages),
        datasets: [{
          label: 'Page Views',
          data: Object.values(analytics.pages),
          backgroundColor: 'rgba(123,97,255,0.6)',
        }],
      },
      options: {
        responsive: true,
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
  }, [analytics, recordPageView]);

  return (
    <main className="admin-dashboard">
      <header>
        <h1>Admin Dashboard</h1>
        <p>Analytics Overview</p>
      </header>
      <section className="charts">
        <div className="chart-container">
          <canvas ref={pageChartRef} aria-label="Page view chart" />
        </div>
        <div className="chart-container">
          <canvas ref={productChartRef} aria-label="Product view chart" />
        </div>
      </section>
    </main>
  );
}
