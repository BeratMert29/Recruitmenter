import React from 'react';
import Sidebar from './Sidebar';
import './Sidebar.css'; 

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="content-area">
        {/* Your page content will be rendered here */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;