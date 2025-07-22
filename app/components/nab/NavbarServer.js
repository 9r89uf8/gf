import React from 'react';
import Link from 'next/link';

const NavbarServer = () => {
    return (
        <header className="navbar-container">
            <nav className="navbar">
                <div className="navbar-brand">
                    <Link href="/" className="navbar-title">
                        Noviachat
                    </Link>
                </div>

                <div className="navbar-menu">
                    {/* Accessible dropdown that works with CSS only */}
                    <div className="dropdown-wrapper">
                        <button
                            type="button"
                            className="menu-toggle-button"
                            aria-expanded="false"
                            aria-controls="dropdown-menu"
                        >
                            Menu
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="menu-arrow">
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </button>

                        <div id="dropdown-menu" className="dropdown-menu">
                            <Link href="/dm" className="dropdown-link">
                                Mensajes
                            </Link>
                            <Link href="/user" className="dropdown-link">
                                Perfil
                            </Link>
                            <Link href="/chicas-ia" className="dropdown-link">
                                chicas
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavbarServer;