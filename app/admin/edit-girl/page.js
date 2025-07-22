'use client';
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { getGirls } from "@/app/services/girlsService";
import { useStore } from '@/app/store/store';
import GirlSelector from '@/app/components/admin/edit-girl/GirlSelector';
import EditGirlForm from '@/app/components/admin/edit-girl/EditGirlForm';

export default function EditGirlPage() {
    const girls = useStore((state) => state.girls);
    const [selectedGirlId, setSelectedGirlId] = useState(null);
    const [selectedGirlData, setSelectedGirlData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch girls on component mount
    useEffect(() => {
        getGirls();
    }, []);

    const handleGirlSelect = async (girlId) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/v2/admin/get-girl?id=${girlId}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch girl data');
            }

            setSelectedGirlId(girlId);
            setSelectedGirlData(data.girl);
        } catch (error) {
            console.error('Error fetching girl data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedGirlId(null);
        setSelectedGirlData(null);
        setError('');
    };

    const handleUpdateSuccess = () => {
        // Refresh girls list
        getGirls();
        // Go back to list
        handleBackToList();
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                py: { xs: 2, sm: 3, md: 4 }
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h3"
                    sx={{
                        color: 'rgba(15, 23, 42, 0.95)',
                        fontWeight: 700,
                        mb: 4,
                        textAlign: 'center'
                    }}
                >
                    {selectedGirlId ? 'Edit Girl' : 'Select Girl to Edit'}
                </Typography>

                {!selectedGirlId ? (
                    <GirlSelector 
                        girls={girls} 
                        onSelectGirl={handleGirlSelect}
                        loading={loading}
                        error={error}
                    />
                ) : (
                    <EditGirlForm 
                        girlData={selectedGirlData}
                        onBack={handleBackToList}
                        onUpdateSuccess={handleUpdateSuccess}
                    />
                )}
            </Container>
        </Box>
    );
}