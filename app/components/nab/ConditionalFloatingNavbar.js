'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import FloatingNavbar from "./FloatingNavbar";

const ConditionalFloatingNavbar = () => {
    const pathname = usePathname();

    // Check if pathname starts with '/chat/' or equals '/clips'
    const showFloatingNavbar = !(pathname.startsWith('/chat/') || pathname === '/chat' || pathname === '/clips');

    if (!showFloatingNavbar) {
        return null;
    }

    return <FloatingNavbar />;
};

export default ConditionalFloatingNavbar;