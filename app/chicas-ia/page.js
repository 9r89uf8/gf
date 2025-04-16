// page.jsx (Static Server Component)
import styles from '@/app/styles/Creators.module.css';
import CreatorsGrid from "@/app/components/chicas/CreatorsGrid";

// Server-side data fetching
export async function generateStaticParams() {
    // Fetch all girl IDs from your API or database
    const girls = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/girls`)
        .then(res => res.json())
        .catch(() => []);

    // Return an array of objects with the id parameter
    return girls
}

// Metadata for SEO and robots
export const metadata = {
    robots: {
        index: false,
        follow: false,
    }
};

export default async function Creators() {
    const girls = await generateStaticParams()
    return (
        <div className={styles.pageContainer}>
            <div className={styles.container}>
                <div>
                    <div className={styles.headerBox}>
                        <h2 className={styles.title}>
                            Selecciona a tu chica IA para hablar
                        </h2>
                        <p className={styles.subtitle}>
                            Elige a tu compañera perfecta: ¡la primera chica es completamente gratis para chatear!
                        </p>
                    </div>
                </div>

                {/* Client component for interactive elements */}
                <CreatorsGrid initialGirls={girls} />
            </div>
        </div>
    );
};
