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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SeedIcon from '@mui/icons-material/Agriculture';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import { useRouter } from 'next/navigation';

const categories = ['relaciones-ia', 'guias', 'tecnologia', 'historias'];

export default function BlogAdminPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
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

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', py: 4 }}>
      <Container maxWidth="lg">
        <ModernCard variant="elevated">
          <CardContentWrapper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'rgba(15, 23, 42, 0.95)' }}>
                Administrar Blog
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={seeding ? <CircularProgress size={20} /> : <SeedIcon />}
                  onClick={handleSeedArticles}
                  disabled={seeding}
                  sx={{
                    borderColor: '#1a1a1a',
                    color: '#1a1a1a',
                    borderRadius: 25,
                    px: 3,
                    '&:hover': {
                      borderColor: '#000',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {seeding ? 'Sembrando...' : 'Sembrar Artículos'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    resetForm();
                    setOpenDialog(true);
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                    color: '#fff',
                    borderRadius: 25,
                    px: 3,
                  }}
                >
                  Nuevo Artículo
                </Button>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid rgba(203, 213, 225, 0.5)' }}>
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