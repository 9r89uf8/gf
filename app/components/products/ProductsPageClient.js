'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/app/store/store';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Stack, 
  Chip, 
  CircularProgress,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import ShieldIcon from '@mui/icons-material/Shield';
import CreditCardOffIcon from '@mui/icons-material/CreditCardOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RefreshIcon from '@mui/icons-material/Refresh';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
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
  '&:disabled': {
    background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
    color: '#ffffff',
  },
}));

const SecurityInfoCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  borderRadius: 16,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  border: '1px solid rgba(0, 0, 0, 0.05)',
  boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    color: '#10b981',
    fontSize: '1.5rem',
  },
}));

const PriceDisplay = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  color: 'rgba(15, 23, 42, 0.95)',
  lineHeight: 1,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  gap: theme.spacing(3),
}));

export default function ProductsPageClient({ products: initialProducts, userCountry, error: initialError }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [products] = useState(initialProducts || []);
  const [error] = useState(initialError);
  
  const {
    setSelectedProduct,
    setQuantity,
    createCheckoutSession,
  } = useStore();

  const handleBuyNow = async (productId) => {
    try {
      setIsLoading(true);
      setSelectedProduct(productId);
      setQuantity(1);
      await createCheckoutSession(productId, 1);
      router.push('/checkout');
    } catch (error) {
      console.error('Error starting checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Currency names mapping for Spanish
  const currencyNames = {
    USD: { singular: 'dólar', plural: 'dólares' },
    EUR: { singular: 'euro', plural: 'euros' },
    MXN: { singular: 'peso', plural: 'pesos' },
    COP: { singular: 'peso colombiano', plural: 'pesos colombianos' },
    CLP: { singular: 'peso chileno', plural: 'pesos chilenos' },
    ARS: { singular: 'peso argentino', plural: 'pesos argentinos' }
  };

  const formatPrice = (amount, currency) => {
    // Convert cents to units
    const price = amount / 100;
    
    // Get currency name or fallback to currency code
    const currencyInfo = currencyNames[currency.toUpperCase()];
    if (!currencyInfo) {
      // Fallback to standard format if currency not mapped
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: currency.toUpperCase(),
      }).format(price);
    }
    
    // Format number with Spanish locale (. for thousands, , for decimals)
    const formattedNumber = new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
    
    // Determine singular or plural
    const currencyName = price === 1 ? currencyInfo.singular : currencyInfo.plural;
    
    return `${formattedNumber} ${currencyName}`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <PageContainer>
        <Container maxWidth="sm">
          <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Typography variant="h4" sx={{ color: '#dc2626', fontWeight: 700 }}>
                  Error al cargar productos
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                  {error}
                </Typography>
                <GradientButton 
                  onClick={handleRefresh} 
                  startIcon={<RefreshIcon />}
                >
                  Intentar de Nuevo
                </GradientButton>
              </Stack>
            </CardContentWrapper>
          </ModernCard>
        </Container>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              color: 'rgba(15, 23, 42, 0.95)', 
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Premium
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'rgba(71, 85, 105, 0.8)',
              fontWeight: 400,
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            Desbloquea acceso completo a todas las funciones
          </Typography>
          {userCountry && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(71, 85, 105, 0.6)',
                fontSize: '0.9rem'
              }}
            >
              Precios para {userCountry === 'CO' ? 'Colombia' : userCountry}
            </Typography>
          )}
        </Box>

        {/* Security Info Section */}
        <SecurityInfoCard elevation={0}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureItem>
                <CheckCircleIcon />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                    Pago Único
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                    Sin suscripciones ni cobros mensuales
                  </Typography>
                </Box>
              </FeatureItem>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureItem>
                <ShieldIcon />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                    100% Seguro
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                    Procesado por Stripe
                  </Typography>
                </Box>
              </FeatureItem>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FeatureItem>
                <CreditCardOffIcon />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                    Privacidad Total
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                    No guardamos información de tarjetas
                  </Typography>
                </Box>
              </FeatureItem>
            </Grid>
          </Grid>
        </SecurityInfoCard>

        {/* Products Grid */}
        {products.length === 0 ? (
          <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
              <Typography 
                variant="h5" 
                textAlign="center" 
                sx={{ color: 'rgba(71, 85, 105, 0.8)' }}
              >
                No hay productos disponibles en este momento.
              </Typography>
            </CardContentWrapper>
          </ModernCard>
        ) : (
          <Grid container spacing={4}>
            {products.map((price) => (
              <Grid key={price.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ModernCard variant="elevated" animate={true}>
                  <CardContentWrapper>
                    <Stack spacing={3}>
                      {/* Product Image */}
                      {price.product.images && price.product.images.length > 0 && (
                        <Box
                          component="img"
                          src={price.product.images[0]}
                          alt={price.product.name}
                          sx={{
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: 2,
                            mb: 2,
                          }}
                        />
                      )}

                      {/* Product Name */}
                      <Box>
                        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 700,
                              color: 'rgba(15, 23, 42, 0.95)' 
                            }}
                          >
                            {price.product.name}
                          </Typography>
                          <Chip 
                            label="Pago Único" 
                            size="small"
                            sx={{
                              backgroundColor: '#10b981',
                              color: '#ffffff',
                              fontWeight: 600,
                            }}
                          />
                        </Stack>

                        {/* Product Description */}
                        {price.product.description && (
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: 'rgba(71, 85, 105, 0.8)',
                              lineHeight: 1.8,
                              mb: 2,
                            }}
                          >
                            {price.product.description}
                          </Typography>
                        )}
                      </Box>

                      {/* Features List */}
                      {price.product.features && price.product.features.length > 0 && (
                        <Stack spacing={1.5}>
                          {price.product.features.map((feature, index) => (
                            <FeatureItem key={index}>
                              <CheckCircleIcon sx={{ fontSize: '1.2rem !important' }} />
                              <Typography variant="body2" sx={{ color: 'rgba(51, 65, 85, 0.9)' }}>
                                {feature.name}
                              </Typography>
                            </FeatureItem>
                          ))}
                        </Stack>
                      )}

                      {/* Price Section */}
                      <Box sx={{ mt: 'auto', pt: 2 }}>
                        <PriceDisplay>
                          {formatPrice(price.unit_amount, price.currency)}
                        </PriceDisplay>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(71, 85, 105, 0.8)',
                            mt: 0.5,
                            mb: 3,
                          }}
                        >
                          Un solo pago, acceso completo
                        </Typography>

                        {/* Buy Button */}
                        <GradientButton
                          fullWidth
                          onClick={() => handleBuyNow(price.id)}
                          disabled={isLoading}
                          startIcon={!isLoading && <ShoppingCartIcon />}
                        >
                          {isLoading ? 'Procesando...' : 'Comprar Ahora'}
                        </GradientButton>
                      </Box>
                    </Stack>
                  </CardContentWrapper>
                </ModernCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </PageContainer>
  );
}