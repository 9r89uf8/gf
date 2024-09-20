'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import FloatingNavbar from "./FloatingNavbar";

const ConditionalFloatingNavbar = () => {
    const pathname = usePathname();
    const hiddenPaths = ['/chat', '/clips'];
    const showFloatingNavbar = !hiddenPaths.includes(pathname);

    if (!showFloatingNavbar) {
        return null;
    }

    return <FloatingNavbar />;
};

export default ConditionalFloatingNavbar;