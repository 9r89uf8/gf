'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useStore from '../../store/store';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  Stack,
  Divider,
  Chip,
  Fade,
  Grow,
  useTheme,
  alpha
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { styled, keyframes } from '@mui/material/styles';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 650,
  width: '100%',
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
  background: 'rgba(255, 255, 255, 0.98)',
  backdropFilter: 'blur(10px)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeIn} 0.6s ease-out`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4),
    margin: theme.spacing(2),
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: ({ success }) =>
        success
            ? 'linear-gradient(90deg, #4caf50 0%, #81c784 100%)'
            : 'linear-gradient(90deg, #f44336 0%, #e57373 100%)',
  },
}));

const IconWrapper = styled(Box)(({ theme, success }) => ({
  marginBottom: theme.spacing(4),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 100,
  height: 100,
  borderRadius: '50%',
  '& svg': {
    fontSize: 56,
    color: success ? theme.palette.success.main : theme.palette.error.main,
  },
}));

const DetailsBox = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.03),
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  textAlign: 'left',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.08)}`,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(45deg, transparent, rgba(99, 91, 255, 0.1), transparent)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s',
  },
  '&:hover::after': {
    transform: 'translateX(100%)',
  },
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  gap: theme.spacing(2),
  '&:not(:last-child)': {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  },
  '& > :first-of-type': {
    flexShrink: 0,
    minWidth: '140px',
  },
  '& > :last-child': {
    textAlign: 'right',
    wordBreak: 'break-word',
    maxWidth: 'calc(100% - 160px)',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(1),
    '& > :first-of-type': {
      minWidth: 'auto',
    },
    '& > :last-child': {
      textAlign: 'left',
      maxWidth: '100%',
    },
  },
}));

const SessionIdChip = styled(Chip)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: '0.75rem',
  maxWidth: '100%',
  height: 'auto',
  '& .MuiChip-label': {
    padding: theme.spacing(1, 1.5),
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    transform: 'scale(1.02)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(2, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: theme.spacing(2),
  background: 'linear-gradient(135deg, #635bff 0%, #4f46e5 100%)',
  boxShadow: '0 4px 20px rgba(99, 91, 255, 0.25)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #5245cc 0%, #4338ca 100%)',
    boxShadow: '0 6px 30px rgba(99, 91, 255, 0.35)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}));

export default function CheckoutReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const theme = useTheme();
  const setUser = useStore((state) => state.setUser);


  const [sessionData, setSessionData] = useState(null);
  const [copied, setCopied] = useState(false);
  const { fetchSessionStatus, resetPaymentCheckout, paymentLoading, paymentError } = useStore();

  useEffect(() => {
    if (!sessionId) {
      router.push('/products');
      return;
    }

    const loadSessionStatus = async () => {
      try {
        const session = await fetchSessionStatus(sessionId);
        setSessionData(session);
        console.log(session)

        if (session.payment_status === 'paid') {
          try {
            const response = await fetch('/api/v2/payments/upgrade-to-premium', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sessionId: sessionId,
                paymentDetails: {
                  amount: session.amount_total,
                  currency: session.currency,
                  metadata: session.metadata || {},
                }
              }),
            });

            if (!response.ok) {
              console.error('Failed to upgrade user to premium');
            } else {
              const result = await response.json();
              console.log(result.user)
              setUser(result.user)
              if (result.alreadyProcessed) {
                console.log('Payment already processed - skipping duplicate');
              } else {
                console.log('User successfully upgraded to premium');
              }
            }
          } catch (error) {
            console.error('Error upgrading user:', error);
          }
        }
      } catch (error) {
        console.error('Error loading session status:', error);
      }
    };

    loadSessionStatus();
  }, [sessionId, fetchSessionStatus, router]);

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleCopySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (paymentLoading) {
    return (
        <StyledContainer>
          <ContentPaper>
            <Stack spacing={3} alignItems="center">
              <CircularProgress size={48} thickness={4} />
              <Typography variant="h6" color="text.secondary">
                Verificando tu pago...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Esto solo tomará un momento
              </Typography>
            </Stack>
          </ContentPaper>
        </StyledContainer>
    );
  }

  if (paymentError) {
    return (
        <StyledContainer>
          <ContentPaper>
            <Alert
                severity="error"
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: 28,
                  },
                }}
            >
              <AlertTitle sx={{ fontWeight: 600 }}>Error al procesar el pago</AlertTitle>
              {paymentError}
            </Alert>
            <StyledButton
                variant="contained"
                onClick={() => {
                  resetPaymentCheckout();
                  router.push('/products');
                }}
                fullWidth
            >
              Volver a Productos
            </StyledButton>
          </ContentPaper>
        </StyledContainer>
    );
  }

  if (!sessionData) {
    return null;
  }

  const isSuccessful = sessionData.payment_status === 'paid';

  return (
      <StyledContainer>
        <ContentPaper success={isSuccessful}>
          <Box>
            {isSuccessful ? (
                <>
                  <IconWrapper success={true}>
                    <CheckCircleOutlineIcon />
                  </IconWrapper>
                  <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      fontWeight="700"
                      sx={{
                        background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2,
                      }}
                  >
                    ¡Pago Exitoso!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Tu transacción se ha completado correctamente. Recibirás un correo de confirmación en breve.
                  </Typography>

                  <DetailsBox>
                    <DetailRow>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        Monto pagado
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        {formatAmount(sessionData.amount_total, sessionData.currency)}
                      </Typography>
                    </DetailRow>
                    {sessionData.customer_email && (
                        <DetailRow>
                          <Typography variant="body2" color="text.secondary" fontWeight="500">
                            Correo electrónico
                          </Typography>
                          <Typography variant="body1" fontWeight="600" sx={{ wordBreak: 'break-word' }}>
                            {sessionData.customer_email}
                          </Typography>
                        </DetailRow>
                    )}
                    <DetailRow>
                      <Typography variant="body2" color="text.secondary" fontWeight="500">
                        ID de transacción
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SessionIdChip
                            label={copied ? '¡Copiado!' : sessionId}
                            onClick={handleCopySessionId}
                            icon={<ContentCopyIcon />}
                            color={copied ? 'success' : 'default'}
                        />
                      </Box>
                    </DetailRow>
                  </DetailsBox>
                </>
            ) : (
                <>
                  <IconWrapper success={false}>
                    <ErrorOutlineIcon />
                  </IconWrapper>
                  <Typography
                      variant="h4"
                      component="h1"
                      gutterBottom
                      fontWeight="700"
                      color="error.main"
                      sx={{ mb: 2 }}
                  >
                    Pago No Completado
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    No pudimos procesar tu pago. Por favor, verifica tu información e intenta nuevamente.
                  </Typography>
                </>
            )}

            <Box sx={{ mt: 4 }}>
              <StyledButton
                  variant="contained"
                  onClick={() => {
                    resetPaymentCheckout();
                    router.push('/products');
                  }}
                  fullWidth
              >
                {isSuccessful ? 'Continuar Comprando' : 'Intentar Nuevamente'}
              </StyledButton>
            </Box>
          </Box>
        </ContentPaper>
      </StyledContainer>
  );
}