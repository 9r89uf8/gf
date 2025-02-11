import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const staticGirls = [
    {
        id: 'BgHd9LWDnFFhS6BoaqwL',
        username: 'antonellaPerez1353',
        bio: 'No sean chismosos 😏😂',
        picture: '/arely.webp',
        texting: true
    },
    {
        id: 'uerQ5TMDanh1wex83HIE',
        username: 'andrea_5',
        bio: 'Hola....',
        picture: '/andrea.webp',
        texting: false
    },
    {
        id: 'CGj52Y66J4icn6qOqGJY',
        username: 'rocio4',
        bio: '👾',
        picture: '/rocio.webp',
        texting: false

    },
    {
        id: 'tvLbDSi7ZBDta81qwlKT',
        username: 'ariana2',
        bio: '💚',
        picture: '/ariana.webp',
        texting: false
    },
];

const styles = {
    container: {
        padding: '5px',
        marginBottom: 30,
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        marginBottom: '24px',
        marginTop: -5,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
    },
    card: {
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        width: '192px',
        height: '192px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '4px solid rgba(255, 255, 255, 0.5)',
        marginBottom: '16px',
    },
    skeleton: {
        position: 'absolute',
        inset: 0,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        backgroundColor: '#374151',
        // The skeleton sits behind the image. The loaded image covers it.
        zIndex: 1,
    },
    image: {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '2px',
    },
    username: {
        fontSize: '25px',
        fontWeight: 'bold',
        color: 'white',
    },
    bio: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '18px',
        marginBottom: '24px',
        marginTop: -5,
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
    },
    photoButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 24px',
        borderRadius: '9999px',
        backgroundColor: 'white',
        color: 'black',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none',
        fontSize: 20,
    },
    messageButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 24px',
        borderRadius: '9999px',
        backgroundColor: '#2563eb',
        color: 'white',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none',
        fontSize: 20,
    },
};

const PopularCreators = () => {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Creadoras Populares</h2>

            <div style={styles.grid}>
                {staticGirls.map((girl) => (
                    <div key={girl.id} style={styles.card}>
                        <div style={styles.imageContainer}>
                            {/* The skeleton is absolutely positioned behind the image */}
                            <div style={styles.skeleton}></div>
                            <Image
                                src={girl.picture}
                                alt="novia virtual foto"
                                width={200}
                                height={200}
                                style={styles.image}
                            />
                        </div>

                        <div style={styles.nameContainer}>
                            <h3 style={styles.username}>{girl.username}</h3>
                        </div>

                        <p style={styles.bio}>{girl.bio}</p>

                        <div style={styles.buttonContainer}>
                            <Link href={`/${girl.id}`} style={styles.photoButton}>
                                Fotos
                            </Link>
                            {girl.texting ? (
                                <Link href={`/chat/${girl.id}`} style={styles.messageButton}>
                                    Mensaje
                                </Link>
                            ) : (
                                <span
                                    style={{
                                        ...styles.messageButton,
                                        backgroundColor: 'gray',      // Change color to indicate disabled state
                                        cursor: 'not-allowed',        // Change cursor style
                                        pointerEvents: 'none',        // Prevent any pointer events
                                    }}
                                >
                                    Mensaje
                                </span>
                            )}
                        </div>

                    </div>
                ))}
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
        </div>
    );
};

export default PopularCreators;
