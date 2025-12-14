import React from 'react';
import AdminSidebar from './AdminSidebar';
import './SideBar.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <AdminSidebar />
            <main className="content-area">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;

