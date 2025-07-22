// page.jsx (Static Server Component)
import { Box, Container, Typography } from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import CreatorsGrid from "@/app/components/chicas/CreatorsGrid";
import { getAllGirlsCached } from '@/app/api/v2/services/girlsServerService';

// Get girls data using Redis cache
async function getGirlsData() {
    try {
        const girls = await getAllGirlsCached();
        return girls;
    } catch (error) {
        console.error('Error fetching girls:', error);
        return [];
    }
}

// Metadata for SEO and robots
export const metadata = {
    robots: {
        index: false,
        follow: false,
    }
};

export default async function Creators() {
    const girls = await getGirlsData();
    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 4,
            }}
        >
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                <ModernCard 
                    variant="elevated" 
                    animate={true}
                    sx={{ 
                        mb: 4, 
                        textAlign: 'center',
                        mx: { xs: 0, sm: 2 }
                    }}
                >
                    <CardContentWrapper>
                        <Typography 
                            variant="h4" 
                            component="h2"
                            sx={{ 
                                color: 'rgba(15, 23, 42, 0.95)',
                                fontWeight: 700,
                                mb: 2
                            }}
                        >
                            Selecciona a tu chica IA para hablar
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: 'rgba(71, 85, 105, 0.8)',
                                fontWeight: 500,
                                fontSize: '1.1rem'
                            }}
                        >
                            Elige a tu compañera perfecta: ¡la primera chica es completamente gratis para chatear!
                        </Typography>
                    </CardContentWrapper>
                </ModernCard>

                {/* Client component for interactive elements */}
                <CreatorsGrid initialGirls={girls} />
            </Container>
        </Box>
    );
};
