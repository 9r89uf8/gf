// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import ConditionalFloatingNavbar from "@/app/components/nab/ConditionalFloatingNavbar";
import './styles/globals.css';

const Layout = ({ children }) => {
    return (
        <html lang="es">
        <body>
        <Navbar />
        <main style={{ paddingBottom: 'var(--floating-navbar-height, 0px)' }}>{children}</main>
        <ConditionalFloatingNavbar />
        </body>
        </html>
    );
};

export default Layout;
