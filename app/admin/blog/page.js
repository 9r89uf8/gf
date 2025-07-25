'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  CircularProgress,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SeedIcon from '@mui/icons-material/Agriculture';
import RedditIcon from '@mui/icons-material/Reddit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import { useRouter } from 'next/navigation';

const categories = ['relaciones-ia', 'guias', 'tecnologia', 'historias'];

export default function BlogAdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [postingToReddit, setPostingToReddit] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAIDialog, setOpenAIDialog] = useState(false);
  const [aiGenerating, setAIGenerating] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: [],
    author: {
      name: 'Admin',
      avatar: '/admin-avatar.png',
    },
    published: false,
  });

  const [aiFormData, setAIFormData] = useState({
    topic: '',
    category: 'guias',
    autoPublish: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/v2/blog/posts?limit=100');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      showNotification('Error al cargar los artículos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editingPost 
        ? '/api/v2/blog/admin/update' 
        : '/api/v2/blog/admin/create';
      
      const method = editingPost ? 'PUT' : 'POST';
      const body = editingPost 
        ? { id: editingPost.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar el artículo');
      }

      showNotification(
        editingPost ? 'Artículo actualizado' : 'Artículo creado',
        'success'
      );
      
      setOpenDialog(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;

    try {
      const response = await fetch(`/api/v2/blog/admin/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el artículo');
      }

      showNotification('Artículo eliminado', 'success');
      fetchPosts();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || '',
      category: post.category,
      tags: post.tags || [],
      author: post.author,
      published: post.published,
    });
    setOpenDialog(true);
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      category: '',
      tags: [],
      author: {
        name: 'Admin',
        avatar: '/admin-avatar.png',
      },
      published: false,
    });
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSeedArticles = async () => {
    if (!confirm('¿Estás seguro de que quieres sembrar los artículos iniciales? Los artículos existentes no se duplicarán.')) return;
    
    setSeeding(true);
    try {
      const response = await fetch('/api/v2/blog/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al sembrar artículos');
      }

      const result = await response.json();
      showNotification(
        `Siembra completada: ${result.results.created.length} creados, ${result.results.skipped.length} omitidos, ${result.results.errors.length} errores`,
        'success'
      );
      
      // Refresh posts list
      fetchPosts();
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setSeeding(false);
    }
  };

  const handleBulkRedditPost = async () => {
    if (!confirm('¿Estás seguro de que quieres publicar TODOS los artículos publicados en Reddit? Esto puede tomar varios minutos.')) return;
    
    setPostingToReddit(true);
    try {
      const response = await fetch('/api/v2/blog/admin/reddit-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al publicar en Reddit');
      }

      const result = await response.json();
      
      // Show detailed results
      let message = result.message;
      if (result.results.failed.length > 0) {
        message += '\n\nErrores:';
        result.results.failed.forEach(fail => {
          message += `\n- ${fail.title}: ${fail.error}`;
        });
      }
      
      showNotification(message, result.results.failed.length > 0 ? 'warning' : 'success');
      
      // Log successful posts
      if (result.results.successful.length > 0) {
        console.log('Posts publicados exitosamente en Reddit:');
        result.results.successful.forEach(success => {
          console.log(`- ${success.title}: ${success.redditUrl}`);
        });
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setPostingToReddit(false);
    }
  };

  const handleAIGenerate = async () => {
    setAIGenerating(true);
    try {
      const response = await fetch('/api/v2/blog/admin/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiFormData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al generar artículo con IA');
      }

      const result = await response.json();
      
      let successMessage = result.message;
      if (result.redditUrl) {
        successMessage += `\n\nReddit URL: ${result.redditUrl}`;
      }
      
      showNotification(successMessage, 'success');
      setOpenAIDialog(false);
      
      // Reset AI form
      setAIFormData({
        topic: '',
        category: 'guias',
        autoPublish: false,
      });
      
      // Refresh posts list
      fetchPosts();
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setAIGenerating(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <ModernCard variant="elevated">
          <CardContentWrapper>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'stretch', md: 'center' }, 
              gap: { xs: 2, md: 0 },
              mb: 4 
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'rgba(15, 23, 42, 0.95)',
                  textAlign: { xs: 'center', md: 'left' },
                  mb: { xs: 2, md: 0 }
                }}
              >
                Administrar Blog
              </Typography>
              <Grid container spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-end' } }}>
                {/*<Grid size={{ xs: 6, sm: 3, md: 'auto' }}>*/}
                {/*  <Button*/}
                {/*    variant="outlined"*/}
                {/*    startIcon={seeding ? <CircularProgress size={20} /> : <SeedIcon />}*/}
                {/*    onClick={handleSeedArticles}*/}
                {/*    disabled={seeding}*/}
                {/*    fullWidth*/}
                {/*    sx={{*/}
                {/*      borderColor: '#1a1a1a',*/}
                {/*      color: '#1a1a1a',*/}
                {/*      borderRadius: 25,*/}
                {/*      px: { xs: 2, sm: 3 },*/}
                {/*      fontSize: { xs: '0.75rem', sm: '0.875rem' },*/}
                {/*      '&:hover': {*/}
                {/*        borderColor: '#000',*/}
                {/*        backgroundColor: 'rgba(0, 0, 0, 0.04)',*/}
                {/*      },*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    {seeding ? 'Sembrando...' : 'Sembrar Artículos'}*/}
                {/*  </Button>*/}
                {/*</Grid>*/}
                {/*<Grid item size={{ xs: 6, sm: 3, md: 'auto' }}>*/}
                {/*  <Button*/}
                {/*    variant="outlined"*/}
                {/*    color="error"*/}
                {/*    startIcon={postingToReddit ? <CircularProgress size={20} /> : <RedditIcon />}*/}
                {/*    onClick={handleBulkRedditPost}*/}
                {/*    disabled={postingToReddit}*/}
                {/*    fullWidth*/}
                {/*    sx={{*/}
                {/*      borderRadius: 25,*/}
                {/*      px: { xs: 2, sm: 3 },*/}
                {/*      fontSize: { xs: '0.75rem', sm: '0.875rem' },*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    {postingToReddit ? 'Publicando...' : 'Publicar Todo en Reddit'}*/}
                {/*  </Button>*/}
                {/*</Grid>*/}
                <Grid size={{ xs: 6, sm: 3, md: 'auto' }}>
                  <Button
                    variant="contained"
                    startIcon={aiGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                    onClick={() => setOpenAIDialog(true)}
                    disabled={aiGenerating}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                      color: '#fff',
                      borderRadius: 25,
                      px: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                      },
                    }}
                  >
                    {aiGenerating ? 'Generando...' : 'Generar con IA'}
                  </Button>
                </Grid>
                <Grid size={{ xs: 6, sm: 3, md: 'auto' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      resetForm();
                      setOpenDialog(true);
                    }}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                      color: '#fff',
                      borderRadius: 25,
                      px: { xs: 2, sm: 3 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    Nuevo Artículo
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <TableContainer 
              component={Paper} 
              sx={{ 
                boxShadow: 'none', 
                border: '1px solid rgba(203, 213, 225, 0.5)',
                overflowX: 'auto',
                '& .MuiTable-root': {
                  minWidth: { xs: 650, md: 'auto' }
                }
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>
                        <Chip 
                          label={post.category} 
                          size="small" 
                          sx={{ backgroundColor: '#1a1a1a', color: '#fff' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={post.published ? 'Publicado' : 'Borrador'}
                          size="small"
                          color={post.published ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/blog/${post.slug}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(post)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(post.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContentWrapper>
        </ModernCard>

        {/* Create/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {editingPost ? 'Editar Artículo' : 'Nuevo Artículo'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Título"
                fullWidth
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (!editingPost) {
                    setFormData(prev => ({ 
                      ...prev, 
                      slug: generateSlug(e.target.value) 
                    }));
                  }
                }}
              />
              
              <TextField
                label="Slug (URL)"
                fullWidth
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
              
              <TextField
                label="Extracto"
                fullWidth
                multiline
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              />
              
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  label="Categoría"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Imagen Destacada (URL)"
                fullWidth
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
              />
              
              <TextField
                label="Etiquetas (separadas por comas)"
                fullWidth
                value={formData.tags.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) 
                })}
              />
              
              <TextField
                label="Contenido (HTML)"
                fullWidth
                multiline
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  />
                }
                label="Publicar"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                color: '#fff',
              }}
            >
              {editingPost ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* AI Generation Dialog */}
        <Dialog
          open={openAIDialog}
          onClose={() => setOpenAIDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Generar Artículo con IA
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Tema (opcional)"
                fullWidth
                value={aiFormData.topic}
                onChange={(e) => setAIFormData({ ...aiFormData, topic: e.target.value })}
                placeholder="Ej: Beneficios de tener una novia virtual para personas tímidas"
                helperText="Deja vacío para que la IA elija un tema relevante"
              />
              
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={aiFormData.category}
                  onChange={(e) => setAIFormData({ ...aiFormData, category: e.target.value })}
                  label="Categoría"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={aiFormData.autoPublish}
                    onChange={(e) => setAIFormData({ ...aiFormData, autoPublish: e.target.checked })}
                  />
                }
                label="Publicar automáticamente y enviar a Reddit"
              />
              
              <Alert severity="info">
                La IA generará un artículo de 1000-1400 palabras optimizado para SEO en español.
                {aiFormData.autoPublish && ' El artículo será publicado inmediatamente y compartido en Reddit.'}
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAIDialog(false)} disabled={aiGenerating}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAIGenerate} 
              variant="contained"
              disabled={aiGenerating}
              startIcon={aiGenerating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
              sx={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                color: '#fff',
              }}
            >
              {aiGenerating ? 'Generando...' : 'Generar Artículo'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}