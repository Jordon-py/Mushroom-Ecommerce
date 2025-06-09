import React from "react";
import "./AdminDashboard.css";

function CustomerInfo() {
  return (
    <section className="admin-section" id="customer-info">
      <h2>Customer Info</h2>
      <form className="customer-form">
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <button type="submit">Add</button>
      </form>
    </section>
  );
}

function SalesData() {
  return (
    <section className="admin-section" id="sales-data">
      <h2>Sales Data</h2>
      <p>Coming soon: graphs and metrics.</p>
    </section>
  );
}

function InventoryStatus() {
  return (
    <section className="admin-section" id="inventory-status">
      <h2>Inventory Status</h2>
      <p>Current inventory overview will appear here.</p>
    </section>
  );
}

export default function AdminDashboard() {
  return (
    <main className="main-content admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage store insights and data</p>
      </header>
      <CustomerInfo />
      <SalesData />
      <InventoryStatus />
    </main>
  );
}
