'use client';

import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
  border: 0,
  borderRadius: 25,
  color: '#ffffff',
  fontSize: '1.1rem',
  height: 48,
  padding: '0 32px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
  },
}));

const OutlineButton = styled(Button)(({ theme }) => ({
  borderRadius: 25,
  fontSize: '1.1rem',
  height: 48,
  padding: '0 32px',
  textTransform: 'none',
  fontWeight: 600,
  border: '2px solid #1a1a1a',
  color: '#1a1a1a',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    transform: 'translateY(-2px)',
  },
}));

export default function LoginPrompt() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <PageContainer>
      <Container maxWidth="sm">
        <ModernCard variant="elevated" animate={true}>
          <CardContentWrapper>
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.2)',
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 40, color: 'white' }} />
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: 'rgba(15, 23, 42, 0.95)',
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Acceso Premium
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(71, 85, 105, 0.8)',
                    fontSize: '1.1rem',
                    lineHeight: 1.6,
                  }}
                >
                  Inicia sesión para ver los precios y opciones de pago disponibles en tu región
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ width: '100%', maxWidth: 300 }}>
                <GradientButton
                  fullWidth
                  onClick={handleLogin}
                  startIcon={<LockOutlinedIcon />}
                >
                  Iniciar Sesión
                </GradientButton>
                <OutlineButton
                  fullWidth
                  onClick={handleRegister}
                  startIcon={<PersonAddIcon />}
                >
                  Crear Cuenta
                </OutlineButton>
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(71, 85, 105, 0.6)',
                  fontSize: '0.9rem',
                  mt: 2,
                }}
              >
                Los precios se mostrarán en tu moneda local después de iniciar sesión
              </Typography>
            </Stack>
          </CardContentWrapper>
        </ModernCard>
      </Container>
    </PageContainer>
  );
}