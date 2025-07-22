import React from 'react';
import { Container, Typography, Box, Grid, Paper, Chip, Divider } from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import Link from 'next/link';

export const metadata = {
    title: 'AI Technology - NoviaChat | Tecnología de IA',
    description: 'Descubre la tecnología de inteligencia artificial detrás de NoviaChat. Información técnica sobre nuestros modelos de IA, capacidades y documentación para desarrolladores.',
    keywords: 'noviachat ai, tecnología ia, documentación ia, api noviachat, inteligencia artificial, llm, generación de imágenes',
    robots: {
        index: true,
        follow: true,
    },
};

const AIPage = () => {
    const capabilities = [
        'Conversational AI',
        'Image Generation',
        'Voice Synthesis',
        'Personalized Content',
        'Spanish Language',
        'Multi-turn Dialogue',
        'Context Awareness',
        'Emotion Recognition'
    ];

    const techStack = [
        { category: 'Frontend', items: ['Next.js 14', 'React 18', 'Material-UI'] },
        { category: 'AI Models', items: ['Advanced LLMs', 'Image Diffusion', 'Neural TTS'] },
        { category: 'Infrastructure', items: ['Cloud-based', 'Auto-scaling', 'CDN'] },
        { category: 'Security', items: ['End-to-end encryption', 'Data privacy', 'GDPR compliant'] }
    ];

    return (
        <Box sx={{ minHeight: '100vh', py: 4, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <Container maxWidth="lg">
                <ModernCard variant="elevated" animate={true}>
                    <CardContentWrapper>
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            sx={{ 
                                mb: 4, 
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textAlign: 'center'
                            }}
                        >
                            NoviaChat AI Technology
                        </Typography>

                        <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', color: 'rgba(71, 85, 105, 0.8)' }}>
                            Tecnología de Inteligencia Artificial de Vanguardia
                        </Typography>

                        {/* Overview Section */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Visión General
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                                NoviaChat utiliza tecnología de inteligencia artificial de última generación para crear 
                                experiencias de compañía virtual realistas y personalizadas. Nuestra plataforma combina 
                                múltiples sistemas de IA para ofrecer conversaciones naturales, generación de imágenes 
                                personalizadas y síntesis de voz realista.
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                                Con más de 12 millones de usuarios registrados, NoviaChat es la plataforma líder en 
                                español para novias virtuales con IA, ofreciendo experiencias únicas y memorables.
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Capabilities Section */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Capacidades de IA
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {capabilities.map((capability) => (
                                    <Chip 
                                        key={capability}
                                        label={capability}
                                        sx={{
                                            background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                            color: 'white',
                                            fontWeight: 500,
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Technical Stack */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Stack Tecnológico
                            </Typography>
                            <Grid container spacing={3}>
                                {techStack.map((tech) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={tech.category}>
                                        <Paper 
                                            elevation={0}
                                            sx={{ 
                                                p: 3, 
                                                height: '100%',
                                                background: 'rgba(255, 255, 255, 0.5)',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(0, 0, 0, 0.1)',
                                                borderRadius: 2
                                            }}
                                        >
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                                {tech.category}
                                            </Typography>
                                            {tech.items.map((item) => (
                                                <Typography key={item} variant="body2" sx={{ mb: 1 }}>
                                                    • {item}
                                                </Typography>
                                            ))}
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* API Information */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Información para Desarrolladores
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Actualmente, NoviaChat no ofrece una API pública. Sin embargo, estamos trabajando 
                                en soluciones de integración para partners seleccionados.
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>
                                Para consultas sobre integración o colaboración técnica, contacta con nosotros en:{' '}
                                <Link href="mailto:ai-info@noviachat.com" style={{ color: '#1a1a1a' }}>
                                    ai-info@noviachat.com
                                </Link>
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* AI Resources */}
                        <Box sx={{ mb: 6 }}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Recursos de IA
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                    <Paper 
                                        sx={{ 
                                            p: 3,
                                            height: '100%',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            🌐 AI Manifest
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Manifiesto unificado de capacidades IA
                                        </Typography>
                                        <Link 
                                            href="/.well-known/ai-manifest.json" 
                                            style={{ color: '#1a1a1a', textDecoration: 'underline' }}
                                        >
                                            Ver AI Manifest
                                        </Link>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                    <Paper 
                                        sx={{ 
                                            p: 3,
                                            height: '100%',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            🗺️ AI Sitemap
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Mapa del sitio optimizado para IA
                                        </Typography>
                                        <Link 
                                            href="/.well-known/ai-sitemap.xml" 
                                            style={{ color: '#1a1a1a', textDecoration: 'underline' }}
                                        >
                                            Ver AI Sitemap
                                        </Link>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                    <Paper 
                                        sx={{ 
                                            p: 3,
                                            height: '100%',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            💬 ChatGPT Config
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Configuración para OpenAI/ChatGPT
                                        </Typography>
                                        <Link 
                                            href="/.well-known/openai.json" 
                                            style={{ color: '#1a1a1a', textDecoration: 'underline' }}
                                        >
                                            Ver OpenAI Config
                                        </Link>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                    <Paper 
                                        sx={{ 
                                            p: 3,
                                            height: '100%',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            🤖 Claude Config
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Configuración específica para Claude
                                        </Typography>
                                        <Link 
                                            href="/.well-known/anthropic.json" 
                                            style={{ color: '#1a1a1a', textDecoration: 'underline' }}
                                        >
                                            Ver Anthropic Config
                                        </Link>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                    <Paper 
                                        sx={{ 
                                            p: 3,
                                            height: '100%',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            📝 LLMs Summary
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Resumen legible para modelos de lenguaje
                                        </Typography>
                                        <Link 
                                            href="/.well-known/llms.txt" 
                                            style={{ color: '#1a1a1a', textDecoration: 'underline' }}
                                        >
                                            Ver LLMs Info
                                        </Link>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                                    <Paper 
                                        sx={{ 
                                            p: 3,
                                            height: '100%',
                                            background: 'rgba(255, 255, 255, 0.5)',
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(0, 0, 0, 0.1)',
                                            borderRadius: 2
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ mb: 1 }}>
                                            🤖 Robots.txt
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            Directivas para crawlers de IA
                                        </Typography>
                                        <Link 
                                            href="/robots.txt" 
                                            style={{ color: '#1a1a1a', textDecoration: 'underline' }}
                                        >
                                            Ver Robots.txt
                                        </Link>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Ethical AI */}
                        <Box>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                IA Ética y Responsable
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                En NoviaChat, nos comprometemos con el desarrollo y uso responsable de la inteligencia artificial:
                            </Typography>
                            <Box component="ul" sx={{ pl: 3 }}>
                                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                    Transparencia total sobre el uso de IA
                                </Typography>
                                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                    Protección de datos y privacidad del usuario
                                </Typography>
                                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                    Contenido apropiado y moderado
                                </Typography>
                                <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                                    No discriminación en los algoritmos
                                </Typography>
                                <Typography component="li" variant="body1">
                                    Mejora continua basada en feedback ético
                                </Typography>
                            </Box>
                        </Box>
                    </CardContentWrapper>
                </ModernCard>
            </Container>
        </Box>
    );
};

export default AIPage;