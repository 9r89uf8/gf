import React from 'react';
import Link from 'next/link';

const Welcome = () => {
    return (
        <div className="welcome_glassCard">
            <div className="welcome_welcomeContainer">
                <h1 className="welcome_welcomeTitle">Novia Virtual</h1>
                <p className="welcome_welcomeDescription">
                    Conversaciones reales con una <strong>chica IA</strong> personalizada para ti. Compañía virtual gratis.
                </p>
                <Link href="/chicas-ia" className="welcome_startChatButton">
                    Mandar mensaje
                </Link>
                {/* Lazy load the chat example */}
                <LazyLoadedContent />
            </div>
        </div>
    );
};

const LazyLoadedContent = React.lazy(() => import('./ChatExample'));

export default Welcome;