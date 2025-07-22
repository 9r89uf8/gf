'use client';

import { useEffect, useRef } from 'react';

const NavbarClient = () => {
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        // Only enhance if elements exist
        const menu = menuRef.current;
        const button = buttonRef.current;
        
        if (!menu || !button) {
            // Find elements if refs not passed
            const navbar = document.querySelector('.navbar-container');
            if (navbar) {
                menuRef.current = navbar.querySelector('.dropdown-menu');
                buttonRef.current = navbar.querySelector('.menu-toggle-button');
            }
        }

        if (!menuRef.current || !buttonRef.current) return;

        let isOpen = false;

        // Toggle menu function
        const toggleMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isOpen = !isOpen;
            
            menuRef.current.classList.toggle('js-open', isOpen);
            buttonRef.current.setAttribute('aria-expanded', isOpen);
            
            // Add rotation to arrow
            const arrow = buttonRef.current.querySelector('.menu-arrow');
            if (arrow) {
                arrow.classList.toggle('js-rotate', isOpen);
            }
        };

        // Close menu function
        const closeMenu = () => {
            if (isOpen) {
                isOpen = false;
                menuRef.current.classList.remove('js-open');
                buttonRef.current.setAttribute('aria-expanded', 'false');
                
                const arrow = buttonRef.current.querySelector('.menu-arrow');
                if (arrow) {
                    arrow.classList.remove('js-rotate');
                }
            }
        };

        // Click outside handler
        const handleClickOutside = (e) => {
            const wrapper = menuRef.current.closest('.dropdown-wrapper');
            if (wrapper && !wrapper.contains(e.target)) {
                closeMenu();
            }
        };

        // Add event listeners
        buttonRef.current.addEventListener('click', toggleMenu);
        document.addEventListener('click', handleClickOutside);

        // Close on link click
        const links = menuRef.current.querySelectorAll('.dropdown-link');
        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Cleanup
        return () => {
            if (buttonRef.current) {
                buttonRef.current.removeEventListener('click', toggleMenu);
            }
            document.removeEventListener('click', handleClickOutside);
            links.forEach(link => {
                link.removeEventListener('click', closeMenu);
            });
        };
    }, []);

    // This component doesn't render anything, just adds behavior
    return null;
};

export default NavbarClient;