'use client';
import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, Chip, TextField, Dialog, DialogTitle, 
  DialogContent, DialogActions, Snackbar, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
  color: '#ffffff',
  borderRadius: 25,
  padding: '10px 24px',
  fontWeight: 600,
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const NewsContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(15, 23, 42, 0.02)',
  borderRadius: 12,
  border: '1px solid rgba(15, 23, 42, 0.1)',
  minHeight: 400,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.8,
  fontSize: '0.95rem',
  color: 'rgba(15, 23, 42, 0.9)',
}));

// Updated countries - only 4 countries now
const COUNTRIES = {
  mx: { name: 'México', flag: '🇲🇽' },
  ar: { name: 'Argentina', flag: '🇦🇷' },
  es: { name: 'España', flag: '🇪🇸' },
  us: { name: 'Estados Unidos', flag: '🇺🇸' }
};

export default function NewsManagement() {
  const [selectedCountry, setSelectedCountry] = useState('mx');
  const [newsData, setNewsData] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingNews, setFetchingNews] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, newsText: '' });
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchNewsData();
  }, []);

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v2/news/get');
      const result = await response.json();
      
      if (result.success) {
        setNewsData(result.data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      showNotification('Error al cargar las noticias', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchNews = async () => {
    setFetchingNews(true);
    try {
      const response = await fetch('/api/v2/news/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: selectedCountry }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Update local state with the new data
        setNewsData(prev => ({
          ...prev,
          [selectedCountry]: result.data
        }));
        showNotification(`Noticias de ${COUNTRIES[selectedCountry].name} actualizadas exitosamente`, 'success');
      } else {
        showNotification('Error al actualizar las noticias', 'error');
      }
    } catch (error) {
      console.error('Error fetching news from X.AI:', error);
      showNotification('Error al conectar con X.AI', 'error');
    } finally {
      setFetchingNews(false);
    }
  };

  const handleEditNews = () => {
    const currentNews = newsData[selectedCountry]?.newsText || '';
    setEditDialog({
      open: true,
      newsText: currentNews
    });
  };

  const handleSaveNews = async () => {
    try {
      const response = await fetch('/api/v2/news/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountry,
          newsText: editDialog.newsText
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local state
        setNewsData(prev => ({
          ...prev,
          [selectedCountry]: {
            ...prev[selectedCountry],
            newsText: editDialog.newsText,
            lastUpdated: new Date()
          }
        }));
        
        setEditDialog({ open: false, newsText: '' });
        showNotification('Noticias actualizadas exitosamente', 'success');
      } else {
        showNotification('Error al actualizar las noticias', 'error');
      }
    } catch (error) {
      console.error('Error updating news:', error);
      showNotification('Error al guardar los cambios', 'error');
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Nunca';
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentCountryNews = newsData[selectedCountry];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <ModernCard variant="elevated" sx={{ mb: 3 }}>
          <CardContentWrapper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700, mb: 1 }}>
                  Gestión de Noticias
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                  Administra noticias en tiempo real por país
                </Typography>
              </Box>
            </Box>
          </CardContentWrapper>
        </ModernCard>

        {/* Country Selector and Actions */}
        <ModernCard variant="flat" sx={{ mb: 3 }}>
          <CardContentWrapper>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Seleccionar País</InputLabel>
                <Select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  label="Seleccionar País"
                >
                  {Object.entries(COUNTRIES).map(([code, info]) => (
                    <MenuItem key={code} value={code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{info.flag}</span>
                        <span>{info.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 'auto' }}>
                {currentCountryNews?.lastUpdated && (
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={`Actualizado: ${formatTimestamp(currentCountryNews.lastUpdated)}`}
                    size="small"
                    sx={{ backgroundColor: 'rgba(15, 23, 42, 0.1)' }}
                  />
                )}
                <GradientButton
                  startIcon={<RefreshIcon />}
                  onClick={handleFetchNews}
                  disabled={fetchingNews}
                >
                  {fetchingNews ? <CircularProgress size={20} color="inherit" /> : 'Actualizar Noticias'}
                </GradientButton>
              </Box>
            </Box>
          </CardContentWrapper>
        </ModernCard>

        {/* News Content */}
        <ModernCard variant="elevated">
          <CardContentWrapper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NewspaperIcon sx={{ color: 'rgba(15, 23, 42, 0.7)' }} />
                <Typography variant="h6" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600 }}>
                  Noticias de {COUNTRIES[selectedCountry].name}
                </Typography>
              </Box>
              <Button
                startIcon={<EditIcon />}
                onClick={handleEditNews}
                variant="outlined"
                size="small"
                sx={{ borderColor: 'rgba(15, 23, 42, 0.3)' }}
              >
                Editar
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : currentCountryNews?.newsText ? (
              <NewsContent elevation={0}>
                {currentCountryNews.newsText}
              </NewsContent>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No hay noticias disponibles para {COUNTRIES[selectedCountry].name}. 
                Haz clic en "Actualizar Noticias" para obtener información actual.
              </Alert>
            )}
          </CardContentWrapper>
        </ModernCard>

        {/* Edit Dialog */}
        <Dialog 
          open={editDialog.open} 
          onClose={() => setEditDialog({ open: false, newsText: '' })} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle>
            Editar Noticias de {COUNTRIES[selectedCountry].name}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={15}
              value={editDialog.newsText}
              onChange={(e) => setEditDialog({ ...editDialog, newsText: e.target.value })}
              variant="outlined"
              sx={{ mt: 2 }}
              placeholder="Ingresa las noticias aquí..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, newsText: '' })}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveNews} 
              variant="contained" 
              sx={{ backgroundColor: '#1a1a1a' }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}