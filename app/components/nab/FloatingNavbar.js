'use client'
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MessageIcon from '@/app/components/nab/MessageIcon';
import ProfileIcon from '@/app/components/nab/ProfileIcon';
import UsersIcon from "@/app/components/nab/UsersIcon";

import './floating-navbar.css';

export default function FloatingNavbar() {
    const router = useRouter();

    const routes = [
        { name: 'HOME', path: '/chicas-ia', icon: <UsersIcon /> },
        { name: 'TOP', path: '/dm', icon: <MessageIcon /> },
        { name: 'USER', path: '/user', icon: <ProfileIcon /> }
    ];

    useEffect(() => {
        // Prefetch all routes when the component mounts
        routes.forEach(route => {
            router.prefetch(route.path);
        });
    }, []);

    return (
        <nav className="floating-navbar">
            {routes.map((route, index) => {
                return (
                    <Link
                        key={index}
                        href={route.path}
                        className={`nav-item`}
                        aria-label={route.name}
                        prefetch={true}
                    >
                        <span className="icon">{route.icon}</span>
                        <span className="label">{route.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}



