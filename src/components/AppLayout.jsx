
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-area">
        <Header />

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AppLayout;
