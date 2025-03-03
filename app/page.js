import React from 'react';
import PopularCreators from "@/app/components/landing/PopularCreators";
import Link from 'next/link';
import EnhancedAIFeaturesCard from "@/app/components/landing/EnhancedAIFeaturesCard"; // same note: rewrite if it uses MUI


const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '16px',
    },
    maxWidthContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
    },
    glassCard: {
        textAlign: 'center',
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
        padding: '16px',
        marginBottom: '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
    },
    headingCenter: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '16px',
        textAlign: 'center',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        justifyItems: 'center',
        marginTop: '24px',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    statIcon: {
        fontSize: '80px',
        color: '#4FC3F7',
        marginBottom: '8px',
    },
    statNumber: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '18px',
        fontWeight: 'normal',
    },
    chatSectionHeading: {
        fontSize: '26px',
        textAlign: 'center',
        marginBottom: '16px',
    },
    chatInputContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '16px',
    },
    chatInput: {
        width: '100%',
        maxWidth: '500px',
        borderRadius: '25px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '12px 16px',
        color: 'white',
        outline: 'none',
    },
    sendButton: {
        marginLeft: '-48px',
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '20px',
        padding: '8px',
        borderRadius: '50%',
        transition: 'background-color 0.3s ease',
    },
    footerLogo: {
        width: '45px',
        height: 'auto',
        marginBottom: '8px',
    },
    footerText: {
        color: 'white',
        fontSize: '18px',
    },
    // New styles for the Welcome component
    welcomeContainer: {
        marginBottom: '32px',
        textAlign: 'center',
    },
    welcomeTitle: {
        fontSize: '42px',
        fontWeight: 'bold',
        letterSpacing: '4px',
        marginBottom: '16px',
        color: 'white',
    },
    welcomeDescription: {
        fontSize: '18px',
        marginBottom: '24px',
        color: 'white',
        lineHeight: '1.4',    // increases the space between lines
        letterSpacing: '1px', // adds extra space between letters
    },
    startChatButton: {
        display: 'inline-block',
        padding: '10px 15px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#1a1a1a',
        borderRadius: '30px',
        fontWeight: '500',
        fontSize: '20px',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '2px',
    },
};

const GlassCard = ({ children }) => (
    <div style={styles.glassCard}>
        {children}
    </div>
);

const Welcome = () => {

    return (
        <GlassCard>
            <div style={styles.welcomeContainer}>
                <h1 style={styles.welcomeTitle}>hola</h1>
                <p style={styles.welcomeDescription}>
                    Descubre una experiencia única de compañía virtual. Explora nuestra plataforma y comienza a chatear para conectar de manera auténtica e innovadora.
                </p>
                <Link href="/creadoras" style={styles.startChatButton}>
                    Iniciar Chat
                </Link>
            </div>
        </GlassCard>
    );
};

const Home = () => {
    return (
        <div style={styles.pageContainer}>
            <div style={styles.maxWidthContainer}>
                {/* Welcome Section */}
                <Welcome />

                {/* Popular Creators Section */}
                <PopularCreators />

                {/* Company Stats Section */}
                <GlassCard>
                    <h1>Novia Virtual</h1>
                    <h2 style={styles.headingCenter}>
                        La app de más rápido crecimiento para hispanohablantes en Latinoamérica y Estados Unidos.
                    </h2>

                    <div style={styles.statsGrid}>
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>2M+</div>
                            <div style={styles.statLabel}>Usuarios satisfechos</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>Desde 2023</div>
                            <div style={styles.statLabel}>Ofreciendo compañía virtual</div>
                        </div>
                        <div style={styles.statItem}>
                            <div style={styles.statNumber}>93%</div>
                            <div style={styles.statLabel}>Tasa de satisfacción</div>
                        </div>
                    </div>
                </GlassCard>

                {/* Enhanced AI Features Section */}
                <EnhancedAIFeaturesCard />
                {/* Make sure EnhancedAIFeaturesCard is also purely CSS if you don't want MUI. */}

                {/* Footer Section */}
                <GlassCard>
                    <p style={styles.footerText}>
                        © 2025 - Todos los Derechos Reservados. Novia Virtual, NoviaChat.com
                    </p>
                </GlassCard>
            </div>
        </div>
    );
};

export default Home;

