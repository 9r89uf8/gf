// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import FloatingNavbar from "@/app/components/nab/FloatingNavbar";
import './styles/globals.css';


const Layout = ({ children }) => {
  return (
      <html lang="es">
      <body>
      <Navbar/>
      <main style={{ paddingBottom: '90px' }}>{children}</main>
      {/*<FloatingNavbar/>*/}
      </body>
      </html>
  );
};

export default Layout;
