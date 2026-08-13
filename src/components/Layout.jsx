import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Aapki Sidebar component

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar - Fixed width */}
      <div className="w-64 fixed inset-y-0">
        <Sidebar />
      </div>

      {/* Main Content - Sidebar ki width ke barabar margin left pe */}
      <main className="flex-1 ml-64 p-8">
        <Outlet /> {/* Yahan har screen (Profile, Assessment etc.) load hogi */}
      </main>
    </div>
  );
};

export default Layout;