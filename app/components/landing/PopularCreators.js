import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Modified the staticGirls array to include age, followers and verified status
const staticGirls = [
    {
        id: 'uerQ5TMDanh1wex83HIE',
        username: 'andrea_5',
        age: 18,
        priority: true,
        followers: 60240,
        bio: 'Hola....',
        picture: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/3cc53e5e-99ae-434f-ff28-a23a589b2400/w=200,fit=scale-down',
        videos: [
            'https://customer-6smvuu0v7hu7e2r2.cloudflarestream.com/968e0cd899e526e6d41569da9b871f62/watch',
            'https://customer-6smvuu0v7hu7e2r2.cloudflarestream.com/37bd43633ce622b6760534d46f1094d3/watch'
        ],
        texting: true,
        verified: true,
        verifiedType: 'blue'
    },
    // {
    //     id: 'BgHd9LWDnFFhS6BoaqwL',
    //     username: 'antonella1353',
    //     age: 18,
    //     followers: 69300,
    //     priority: false,
    //     bio: 'No sean chismosos 😏😂',
    //     picture: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/0c9fee91-9365-4796-7c5d-bf46a9ea5e00/w=200,fit=scale-down',
    //     videos: [
    //         'https://customer-6smvuu0v7hu7e2r2.cloudflarestream.com/968e0cd899e526e6d41569da9b871f62/watch',
    //         'https://customer-6smvuu0v7hu7e2r2.cloudflarestream.com/37bd43633ce622b6760534d46f1094d3/watch'
    //     ],
    //     texting: false,
    //     verified: true, // Adding verified status
    //     verifiedType: 'blue' // 'gold' or 'blue'
    // }
];

const styles = {
    container: {
        padding: '15px',
        marginBottom: 40,
        maxWidth: '1200px',
        margin: '0 auto',
    },
    titleContainer: {
        textAlign: 'center',
        marginBottom: '32px',
        position: 'relative',
    },
    title: {
        fontSize: '43px',
        fontWeight: '800',
        color: 'white',
        letterSpacing: '3px',
        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
        margin: '0 0 4px 0',
        fontFamily: "'Montserrat', sans-serif",
    },
    subtitle: {
        fontSize: '16px',
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
        marginBottom: '24px',
    },
    creatorsButton: {
        display: 'inline-block',
        padding: '10px 30px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#1a1a1a',
        borderRadius: '30px',
        fontWeight: '600',
        fontSize: '16px',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '2px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
    },
    card: {
        borderRadius: '16px',
        backgroundColor: '#f8f9fa',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    imageContainer: {
        position: 'relative',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '4px solid rgba(255, 255, 255, 0.15)',
        marginBottom: '20px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 1,
    },
    skeleton: {
        position: 'absolute',
        inset: 0,
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        backgroundColor: '#374151',
        zIndex: 1,
    },
    image: {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    profileInfo: {
        width: '100%',
        textAlign: 'center',
    },
    nameContainer: {
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
    },
    username: {
        fontSize: '25px',
        fontWeight: 'bold',
        color: 'black',
        margin: '0 0 2px 0',
    },
    verificationBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        marginLeft: '4px',
    },
    goldBadge: {
        backgroundColor: '#FFD700',
        boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
    },
    blueBadge: {
        backgroundColor: '#1DA1F2',
        boxShadow: '0 0 8px rgba(29, 161, 242, 0.6)',
    },
    checkmark: {
        width: '12px',
        height: '12px',
        display: 'block',
        color: 'black',
    },
    ageFollowers: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        fontSize: '18px', // Increased from 14px
        color: 'black',
        marginBottom: '12px',
        fontWeight: '500', // Added to make it more prominent
    },
    bio: {
        color: 'black',
        fontSize: '18px',
        marginBottom: '24px',
        lineHeight: '1.4',
        fontStyle: 'italic',
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
        width: '100%',
        justifyContent: 'center',
    },
    photoButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '30px',
        backgroundColor: 'black',
        color: 'white',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        fontSize: '16px',
        flex: '1',
        maxWidth: '110px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    messageButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        borderRadius: '30px',
        backgroundColor: '#01428c',
        color: 'white',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textDecoration: 'none',
        fontSize: '16px',
        flex: '1',
        maxWidth: '110px',
        boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)',
    },
    videoWrapper: {
        /* pushes videos tight under the avatar */
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        marginTop: '12px',
        marginBottom: '8px',
    },
    video: {
        width: '100%',
        /* vertical 9 : 16 aspect ratio */
        aspectRatio: '9 / 16',
        borderRadius: '16px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
    },
};

// CheckMark SVG component
const CheckMark = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={styles.checkmark}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const formatFollowers = (followers) => {
    if (followers >= 1000) {
        return (followers / 1000).toFixed(1) + 'k';
    }
    return followers.toString();
};

const PopularCreators = () => {

    return (
        <div style={styles.container}>
            <div style={styles.grid}>
                {staticGirls.map((girl) => (
                    <div
                        key={girl.id}
                        style={styles.card}
                    >
                        <div
                            style={styles.imageContainer}
                        >
                            <div style={styles.skeleton}></div>
                            <Link
                                href={`/${girl.id}`}
                            >
                                <Image
                                    src={girl.picture}
                                    alt="Chica IA, novia virtual sonriendo"
                                    width={200}
                                    height={200}
                                    style={styles.image}
                                    priority={girl.priority}
                                />
                            </Link>


                        </div>

                        <div style={styles.profileInfo}>
                            <div style={styles.nameContainer}>
                                <h3 style={styles.username}>{girl.username}</h3>
                                {girl.verified && (
                                    <div
                                        style={{
                                            ...styles.verificationBadge,
                                            ...(girl.verifiedType === 'gold' ? styles.goldBadge : styles.blueBadge)
                                        }}
                                    >
                                        <CheckMark/>
                                    </div>
                                )}
                            </div>

                            <div style={styles.ageFollowers}>
                                <span>{girl.age} años</span>
                            </div>
                            <div style={styles.ageFollowers}>
                                <span>{formatFollowers(girl.followers)} seguidores</span>
                            </div>

                            <p style={styles.bio}>{girl.bio}</p>

                            <div style={styles.videoWrapper}>
                                {girl.videos.map((src, i) => (
                                    <video
                                        key={i}
                                        src={src}
                                        style={styles.video}
                                        muted
                                        controls
                                    />
                                ))}
                            </div>

                            <div style={styles.buttonContainer}>
                                {girl.texting ? (
                                    <Link
                                        href={`/chat/${girl.id}`}
                                        style={styles.messageButton}
                                    >
                                        Mensaje
                                    </Link>
                                ) : (
                                    <span
                                        style={{
                                            ...styles.messageButton,
                                            backgroundColor: '#718096',
                                            cursor: 'not-allowed',
                                            pointerEvents: 'none',
                                            boxShadow: '0 4px 12px rgba(113, 128, 150, 0.3)',
                                        }}
                                    >
                                        Mensaje
                                    </span>
                                )}
                                <Link
                                    href={`/${girl.id}`}
                                    style={styles.photoButton}
                                >
                                    Perfil
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PopularCreators;
