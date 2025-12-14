import React from 'react';
import RecruiterSidebar from './RSidebar';
import './Sidebar.css';

const RecruiterLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <RecruiterSidebar />
      <main className="content-area">
        {children}
      </main>
    </div>
  );
};

export default RecruiterLayout;
