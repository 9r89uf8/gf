'use client';
import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { getGirls } from "@/app/services/girlsService";
import { useStore } from '@/app/store/store';
import GalleryForm from '@/app/components/admin/gallery/GalleryForm';
import GalleryItemsTable from '@/app/components/admin/gallery/GalleryItemsTable';

export default function AdminGalleryPage() {
    const girls = useStore((state) => state.girls);
    const [selectedGirl, setSelectedGirl] = useState('');
    const [galleryItems, setGalleryItems] = useState([]);
    const [loadingItems, setLoadingItems] = useState(false);

    // Fetch girls on component mount
    useEffect(() => {
        getGirls()
    }, []);

    useEffect(() => {
        if (selectedGirl) {
            fetchGalleryItems();
        }
    }, [selectedGirl]);

    const fetchGalleryItems = async () => {
        setLoadingItems(true);
        try {
            const response = await fetch(`/api/v2/gallery/admin/list?girlId=${selectedGirl}`);
            const data = await response.json();
            if (response.ok) {
                setGalleryItems(data.items);
            }
        } catch (error) {
            console.error('Failed to fetch gallery items:', error);
        } finally {
            setLoadingItems(false);
        }
    };

    const handleItemCreated = () => {
        if (selectedGirl) {
            fetchGalleryItems();
        }
    };

    const handleDeleteSuccess = () => {
        fetchGalleryItems();
    };

    const handleGirlSelected = (girlId) => {
        setSelectedGirl(girlId);
        // Clear items when switching girls
        setGalleryItems([]);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                py: { xs: 2, sm: 3, md: 4 }
            }}
        >
            <Container maxWidth="xl">
                {/* Page Title */}
                <Typography
                    variant="h3"
                    sx={{
                        color: 'rgba(15, 23, 42, 0.95)',
                        fontWeight: 700,
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    Gallery Management
                </Typography>

                <Grid container spacing={3}>
                    <Grid item size={{ xs: 12, md: 5 }}>
                        <GalleryForm 
                            girls={girls} 
                            onItemCreated={handleItemCreated}
                            onGirlSelected={handleGirlSelected}
                            selectedGirl={selectedGirl}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, md: 7 }}>
                        <GalleryItemsTable 
                            items={galleryItems}
                            loading={loadingItems}
                            selectedGirl={selectedGirl}
                            onRefresh={fetchGalleryItems}
                            onDelete={handleDeleteSuccess}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}