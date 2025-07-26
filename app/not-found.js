import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Button } from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

export default function NotFound() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <ModernCard variant="elevated" animate={true}>
                    <CardContentWrapper>
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography
                                variant="h1"
                                sx={{
                                    fontSize: '6rem',
                                    fontWeight: 800,
                                    color: 'rgba(15, 23, 42, 0.95)',
                                    mb: 2,
                                }}
                            >
                                404
                            </Typography>
                            
                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'rgba(15, 23, 42, 0.95)',
                                    fontWeight: 700,
                                    mb: 2,
                                }}
                            >
                                Página no encontrada
                            </Typography>
                            
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'rgba(71, 85, 105, 0.8)',
                                    mb: 4,
                                    fontSize: '1.1rem',
                                }}
                            >
                                Lo sentimos, la página que buscas no existe o ha sido movida.
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link href="/" passHref style={{ textDecoration: 'none' }}>
                                    <Button
                                        sx={{
                                            background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                            color: '#ffffff',
                                            borderRadius: '25px',
                                            fontWeight: 600,
                                            padding: '12px 32px',
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
                                            },
                                        }}
                                    >
                                        Volver al inicio
                                    </Button>
                                </Link>
                                
                                <Link href="/dm" passHref style={{ textDecoration: 'none' }}>
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            borderRadius: '25px',
                                            padding: '12px 32px',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            borderColor: 'rgba(0, 0, 0, 0.2)',
                                            color: 'rgba(15, 23, 42, 0.95)',
                                            '&:hover': {
                                                borderColor: 'rgba(0, 0, 0, 0.4)',
                                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            },
                                        }}
                                    >
                                        Ver chicas
                                    </Button>
                                </Link>
                            </Box>
                        </Box>
                    </CardContentWrapper>
                </ModernCard>
            </Container>
        </Box>
    );
}