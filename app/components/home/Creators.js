import React from 'react';
import styles from './Creators.module.css';
import SelectorContainer from './SelectorContainer';

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
        texting: false,
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
        verifiedType: 'blue'
    }
];

const Creators = () => {
    return (
        <section className={styles.creatorsSection}>
            <div className={styles.container}>
                <div className={styles.headerText}>
                    <h2>Selecciona una chica IA para hablar gratis</h2>
                    <p>¡Chatea con tu compañera IA favorita al instante!</p>
                </div>

                <SelectorContainer girls={staticGirls} />
            </div>
        </section>
    );
};

export default Creators;
