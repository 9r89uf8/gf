import React from 'react';
import styles from '../styles/LegalPages.module.css';

// Privacy Policy page component
export default function PoliticaPrivacidad() {
    return (
        <div className={styles.legalPageContainer}>
            <div className={styles.legalPageContent}>
                <h1 className={styles.pageTitle}>Política de Privacidad</h1>

                <div className={styles.lastUpdated}>
                    Última actualización: 8 de abril, 2025
                </div>

                <section className={styles.legalSection}>
                    <h2>1. Información que Recopilamos</h2>
                    <p>
                        Recopilamos información que proporcionas al registrarte y usar NoviaChat,
                        incluyendo tu correo electrónico, datos de perfil y el contenido de tus conversaciones
                        con nuestras IA.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>2. Uso de la Información</h2>
                    <p>
                        Utilizamos tu información para proporcionar, mantener y mejorar nuestros servicios,
                        personalizar tu experiencia, y desarrollar nuevas funciones. También usamos datos
                        anónimos para entrenar y mejorar nuestros modelos de IA.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>3. Protección de Datos</h2>
                    <p>
                        Implementamos medidas de seguridad para proteger tu información, incluyendo
                        encriptación de datos y acceso restringido a tus conversaciones. No
                        compartimos tus datos personales con terceros sin tu consentimiento.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>4. Almacenamiento de Conversaciones</h2>
                    <p>
                        Tus conversaciones se almacenan de forma privada y segura. Puedes solicitar la eliminación
                        de tu historial de conversaciones en cualquier momento desde la configuración de tu cuenta.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>5. Cookies y Tecnologías Similares</h2>
                    <p>
                        Utilizamos cookies para mejorar tu experiencia, recordar tus preferencias y
                        proporcionar contenido personalizado. Puedes configurar tu navegador para
                        rechazar todas las cookies o indicarte cuándo se envía una cookie.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>6. Derechos del Usuario</h2>
                    <p>
                        Tienes derecho a acceder, corregir o eliminar tus datos personales. También puedes
                        solicitar la portabilidad de tus datos u oponerte a ciertos procesamientos. Para
                        ejercer estos derechos, contáctanos por correo electrónico.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>7. Cambios en la Política</h2>
                    <p>
                        Podemos actualizar nuestra Política de Privacidad periódicamente. Te notificaremos
                        sobre cambios significativos mediante un aviso prominente en nuestro sitio o por
                        correo electrónico.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>8. Contacto</h2>
                    <p>
                        Si tienes preguntas sobre nuestra Política de Privacidad, contáctanos a:
                        <a href="mailto:privacidad@noviachat.com" className={styles.contactLink}>
                            privacidad@noviachat.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}