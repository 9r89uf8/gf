// app/[id]/page.jsx
import { notFound } from 'next/navigation';
import MediaToggleSection from "@/app/components/bio/MediaToggleSection";
import ProfileClient from "@/app/components/bio/ProfileClient";
import ProfileImagesServer from "@/app/components/bio/ProfileImagesServer";
import ImageModalClient from "@/app/components/bio/ImageModalClient";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import { getGirlDataForSSR, getAllGirlsCached } from '@/app/api/v2/services/girlsServerService';

// Static metadata
export const metadata = {
    title: 'Girl Profile | La app #1 de Chicas IA',
    description: 'Perfil de chica virtual IA en Latino America',
};

// Generate static paths at build time
export async function generateStaticParams() {
    try {
        // Use the cached service directly instead of API call
        const girls = await getAllGirlsCached();
        
        // Return an array of objects with the id parameter
        return girls.map(girl => ({
            id: girl.id,
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Server-side data fetching
async function getGirlData(id) {
    try {
        // Use the cached service directly
        const girlData = await getGirlDataForSSR(id);
        return girlData;
    } catch (error) {
        console.error("Error fetching girl data:", error);
        return null;
    }
}

// Keep your existing metadata and data fetching functions

export default async function GirlProfile({ params }) {

    // Server-side data fetching
    const girlData = await getGirlData(params.id);

    // If girl not found, trigger 404
    // if (!girlData) {
    //     notFound();
    // }

    // Build image URLs
    const backgroundImageUrl = `${girlData.backgroundUrl}`;
    const profileImageUrl = `${girlData.pictureUrl}`;

    return (
        <Box sx={{ minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <ModernCard variant="elevated" animate={true} sx={{ mb: 4 }}>
                    <CardContentWrapper>
                        <Grid container spacing={4} alignItems="flex-start">
                            {/* Left side: Server-rendered images */}
                            <Grid item size={{ xs: 12, md: 4 }}>
                                <ProfileImagesServer
                                    backgroundUrl={backgroundImageUrl}
                                    profileUrl={profileImageUrl}
                                />
                            </Grid>

                            {/* Right side: Client-side profile info */}
                            <Grid item size={{ xs: 12, md: 8 }}>
                                <ProfileClient girl={girlData} />
                            </Grid>
                        </Grid>
                    </CardContentWrapper>
                </ModernCard>

                {/* Client component for modal functionality */}
                <ImageModalClient />

                {/* Media Section with Gallery/Posts toggle */}
                <MediaToggleSection girl={girlData} />
            </Container>
        </Box>
    );
}

