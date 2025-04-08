// app/[id]/page.jsx
import { redirect } from 'next/navigation';
import GirlPostsSection from "@/app/components/bio/GirlPostsSection";
import ProfileClient from "@/app/components/bio/ProfileClient";
import ProfileImagesServer from "@/app/components/bio/ProfileImagesServer";
import ImageModalClient from "@/app/components/bio/ImageModalClient";
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import GlassCard from "@/app/components/bio/GlassCard";

// Static metadata
export const metadata = {
    title: 'Girl Profile | La app #1 de Chicas IA',
    description: 'Perfil de chica virtual IA en Latino America',
};

// Generate static paths at build time
export async function generateStaticParams() {
    // Fetch all girl IDs from your API or database
    const girls = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/girls`)
        .then(res => res.json())
        .catch(() => []);

    // Return an array of objects with the id parameter
    return girls.map(girl => ({
        id: girl.id,
    }));
}

// Server-side data fetching
async function getGirlData(id) {
    try {
        // Direct server-side API call with POST method and id in the body
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/girl`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }), // Include the id in the request body
            next: {
                revalidate: 3600 // Revalidate every hour
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch girl data');
        }

        // Parse JSON only once and store the result
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching girl data:", error);
        return null;
    }
}

// Keep your existing metadata and data fetching functions

export default async function GirlProfile({ params }) {
    // Server-side data fetching
    const girlData = await getGirlData(params.id);

    // If girl not found, redirect to 404 page
    if (!girlData) {
        redirect('/not-found');
    }

    // Build image URLs
    const backgroundImageUrl = `https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girlData.background}/w=400,fit=scale-down`;
    const profileImageUrl = `https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girlData.picture}/w=200,fit=scale-down`;

    return (
        <Box sx={{ minHeight: '100vh', padding: 2 }}>
            <Container maxWidth="md">
                <GlassCard>
                    <Grid container spacing={4} alignItems="flex-start">
                        {/* Left side: Server-rendered images */}
                        <Grid item xs={12} md={4}>
                            <ProfileImagesServer
                                backgroundUrl={backgroundImageUrl}
                                profileUrl={profileImageUrl}
                            />
                        </Grid>

                        {/* Right side: Client-side profile info */}
                        <Grid item xs={12} md={8}>
                            <ProfileClient girl={girlData} />
                        </Grid>
                    </Grid>
                </GlassCard>

                {/* Client component for modal functionality */}
                <ImageModalClient />

                {/* Posts Section */}
                <GirlPostsSection girl={girlData} />
            </Container>
        </Box>
    );
}

