import React from 'react';
import styles from '../styles/LegalPages.module.css';

// Terms of Service page component
export default function TerminosServicio() {
    return (
        <div className={styles.legalPageContainer}>
            <div className={styles.legalPageContent}>
                <h1 className={styles.pageTitle}>Términos de Servicio</h1>

                <div className={styles.lastUpdated}>
                    Última actualización: 8 de abril, 2025
                </div>

                <section className={styles.legalSection}>
                    <h2>1. Aceptación de los Términos</h2>
                    <p>
                        Al utilizar NoviaChat, aceptas estos términos en su totalidad.
                        Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>2. Descripción del Servicio</h2>
                    <p>
                        NoviaChat proporciona una plataforma de compañía virtual basada en inteligencia artificial
                        que permite a los usuarios interactuar con chicas IA a través de texto, imágenes y mensajes de voz.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>3. Registros y Cuentas</h2>
                    <p>
                        Para utilizar ciertos aspectos del servicio, debes crear una cuenta. Eres responsable de mantener
                        la confidencialidad de tu información de inicio de sesión y de todas las actividades bajo tu cuenta.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>4. Uso Aceptable</h2>
                    <p>
                        Al utilizar NoviaChat, aceptas no utilizar el servicio para actividades ilegales, acoso,
                        distribuir contenido ofensivo, o cualquier actividad que pueda dañar a otros usuarios
                        o a la plataforma.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>5. Contenido del Usuario</h2>
                    <p>
                        NoviaChat puede almacenar tus conversaciones para mejorar el servicio. No compartiremos
                        tu contenido con terceros excepto según lo descrito en nuestra Política de Privacidad.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>6. Suscripciones y Pagos</h2>
                    <p>
                        Ofrecemos planes gratuitos y premium. Los detalles de cada plan, incluyendo precios y
                        funcionalidades, están disponibles en nuestra página de precios. Puedes cancelar tu
                        suscripción en cualquier momento.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>7. Cancelación de Servicio</h2>
                    <p>
                        Nos reservamos el derecho de terminar o suspender cuentas por violaciones a estos términos,
                        sin previo aviso y a nuestra discreción.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>8. Cambios en los Términos</h2>
                    <p>
                        Nos reservamos el derecho de modificar estos términos en cualquier momento.
                        Las modificaciones entrarán en vigor inmediatamente después de su publicación.
                    </p>
                </section>

                <section className={styles.legalSection}>
                    <h2>9. Contacto</h2>
                    <p>
                        Si tienes alguna pregunta sobre estos Términos de Servicio, contáctanos a:
                        <a href="mailto:legal@noviachat.com" className={styles.contactLink}>
                            legal@noviachat.com
                        </a>
                    </p>
                </section>
            </div>
        </div>
    );
}