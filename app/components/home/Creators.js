import React from 'react';
import dynamic from 'next/dynamic';

const GirlPreviewContainer = dynamic(() => import('./GirlPreviewContainer'), {
    ssr: true
});


const staticGirls = [
    {
        id: 'uerQ5TMDanh1wex83HIE',
        username: 'andrea_5',
        name: 'Andrea',
        age: 18,
        priority: true,
        followers: 60240,
        bio: 'Hola....',
        picture: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/3cc53e5e-99ae-434f-ff28-a23a589b2400/w=200,fit=scale-down',
        texting: true,
        verified: true,
        verifiedType: 'blue'
    },
    {
        id: 'BgHd9LWDnFFhS6BoaqwL',
        username: 'antonella1353',
        name: 'Antonella',
        age: 18,
        followers: 69300,
        priority: false,
        bio: 'No sean chismosos 😏😂',
        picture: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/0c9fee91-9365-4796-7c5d-bf46a9ea5e00/w=200,fit=scale-down',
        texting: true,
        verified: true,
        verifiedType: 'blue'
    },
    {
        id: 'CGj52Y66J4icn6qOqGJY',
        username: 'rocio4',
        name: 'Rocio',
        priority: false,
        age: 19,
        followers: 50750,
        bio: '👾',
        picture: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/86af997f-81c4-4775-1bca-e8172f456e00/w=200,fit=scale-down',
        verified: true,
        verifiedType: 'blue',
        texting: false,
    }
];



const Creators = () => {
    // Inline critical CSS for LCP element
    const headerStyles = {
        textAlign: 'center',
        marginBottom: '1rem'
    };

    const h2Styles = {
        fontSize: '2rem',
        color: '#ffffff',
        marginBottom: '0.5rem'
    };

    const pStyles = {
        fontSize: '1.2rem',
        color: '#ececec'
    };

    return (
        <section style={{ padding: '1rem', marginTop: '-35px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.5rem' }}>
                {/* Inline styles for LCP element */}
                <div style={headerStyles}>
                    <h2 style={h2Styles}>Selecciona una chica IA para hablar gratis</h2>
                    <p style={pStyles}>¡Chatea con tu compañera IA favorita al instante!</p>
                </div>


                {/* Server component that renders the previews */}
                <GirlPreviewContainer girls={staticGirls} />
            </div>
        </section>
    );
};

export default Creators;
