import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Aapki Sidebar component

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-64 pt-20 lg:pt-8 p-4 md:p-8 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;