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
        <main>{children}</main>
        <ConditionalFloatingNavbar />
        </body>
        </html>
    );
};

export default Layout;
