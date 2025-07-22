import React from 'react';
import NavbarServer from './NavbarServer';
import dynamic from 'next/dynamic';
import Script from 'next/script';

// Lazy load the client enhancement
const NavbarClient = dynamic(
    () => import('./NavbarClient'),
    { 
        ssr: false,
        loading: () => null // No loading indicator needed
    }
);

const NavbarOptimized = () => {
    return (
        <>
            <NavbarServer />
            <NavbarClient />
            {/* Lazy load enhanced CSS after interaction */}
            <Script
                strategy="lazyOnload"
                id="navbar-enhanced-css"
                dangerouslySetInnerHTML={{
                    __html: `
                        // Load enhanced CSS after user interaction
                        const loadEnhancedCSS = () => {
                            if (!document.getElementById('navbar-enhanced-styles')) {
                                const link = document.createElement('link');
                                link.id = 'navbar-enhanced-styles';
                                link.rel = 'stylesheet';
                                link.href = '/components/nab/NavbarEnhanced.css';
                                document.head.appendChild(link);
                                
                                // Mark navbar as JS-enhanced
                                document.querySelector('.navbar-container')?.classList.add('js-enhanced');
                            }
                        };
                        
                        // Load on first interaction
                        ['click', 'touchstart', 'mouseover'].forEach(event => {
                            document.addEventListener(event, loadEnhancedCSS, { once: true });
                        });
                        
                        // Also load after 3 seconds if no interaction
                        setTimeout(loadEnhancedCSS, 3000);
                    `
                }}
            />
        </>
    );
};

export default NavbarOptimized;