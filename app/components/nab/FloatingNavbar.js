'use client'
import React, { useCallback, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MessageIcon from '@/app/components/nab/MessageIcon';
import ProfileIcon from '@/app/components/nab/ProfileIcon';
import UsersIcon from "@/app/components/nab/UsersIcon";

import './floating-navbar.css';

// Move routes outside component to prevent recreation
const routes = [
    { name: 'HOME', path: '/chicas-ia', icon: <UsersIcon /> },
    { name: 'TOP', path: '/dm', icon: <MessageIcon /> },
    { name: 'USER', path: '/user', icon: <ProfileIcon /> }
];

export default function FloatingNavbar() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [activeRoute, setActiveRoute] = useState(null);

    // Use callback to prevent recreation on every render
    const handleClick = useCallback((e, path, index) => {
        e.preventDefault();

        // Show immediate visual feedback
        setActiveRoute(index);

        // Use transition API for non-blocking navigation
        startTransition(() => {
            router.push(path);
        });
    }, [router]);

    return (
        <nav className="floating-navbar">
            {routes.map((route, index) => {
                return (
                    <Link
                        key={route.path} // Use path as key instead of index
                        href={route.path}
                        className={`nav-item ${activeRoute === index ? 'active' : ''} ${isPending ? 'pending' : ''}`}
                        aria-label={route.name}
                        // prefetch={false} // Disable automatic prefetching
                        onClick={(e) => handleClick(e, route.path, index)}
                    >
                        <span className="icon">{route.icon}</span>
                        <span className="label">{route.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}


