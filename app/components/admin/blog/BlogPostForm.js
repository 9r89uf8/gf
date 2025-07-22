import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    LinearProgress,
    Alert,
    Chip,
    IconButton,
    FormControlLabel,
    Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiInputBase-input': {
        color: 'rgba(15, 23, 42, 0.95)',
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(71, 85, 105, 0.8)',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(203, 213, 225, 0.5)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(148, 163, 184, 0.7)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'rgba(15, 23, 42, 0.8)',
        },
    },
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const categories = [
    'Inteligencia Artificial',
    'Relaciones Virtuales',
    'Tecnología',
    'Consejos',
    'Novedades'
];

export default function BlogPostForm({ onPostSaved, editingPost, onCancelEdit }) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        tags: [],
        featuredImage: '',
        published: false,
        author: {
            name: 'NoviaChat Team',
            avatar: '/team-avatar.jpg'
        }
    });
    const [tagInput, setTagInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (editingPost) {
            setFormData({
                ...editingPost,
                tags: editingPost.tags || []
            });
            setImagePreview(editingPost.featuredImage);
        }
    }, [editingPost]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from title
        if (name === 'title' && !editingPost) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({
                ...prev,
                slug
            }));
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return readTime;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.slug || !formData.excerpt || !formData.content || !formData.category) {
            setError('Por favor, completa todos los campos requeridos');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            // Calculate read time
            const readTime = calculateReadTime(formData.content);

            // Prepare the blog post data
            const postData = {
                ...formData,
                readTime,
                updatedAt: new Date().toISOString()
            };

            // If editing, include the post ID
            if (editingPost) {
                postData.id = editingPost.id;
            } else {
                postData.publishedAt = formData.published ? new Date().toISOString() : null;
            }

            // Create or update the blog post
            const endpoint = editingPost ? '/api/v2/blog/admin/update' : '/api/v2/blog/admin/create';
            const response = await fetch(endpoint, {
                method: editingPost ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to save blog post');
            }

            // If there's a new image, upload it
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const uploadResponse = await fetch(data.uploadURL, {
                    method: 'POST',
                    body: formData
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                // Complete the upload
                await fetch('/api/v2/blog/admin/upload-complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        postId: data.postId,
                        uploadId: data.uploadId
                    })
                });
            }

            setSuccess(editingPost ? 'Artículo actualizado exitosamente' : 'Artículo creado exitosamente');
            
            // Reset form if creating new post
            if (!editingPost) {
                setFormData({
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    category: '',
                    tags: [],
                    featuredImage: '',
                    published: false,
                    author: {
                        name: 'NoviaChat Team',
                        avatar: '/team-avatar.jpg'
                    }
                });
                setImageFile(null);
                setImagePreview(null);
            }

            onPostSaved();
        } catch (error) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                        {editingPost ? 'Editar Artículo' : 'Crear Nuevo Artículo'}
                    </Typography>
                    {editingPost && (
                        <Button
                            onClick={onCancelEdit}
                            sx={{ color: 'rgba(71, 85, 105, 0.8)' }}
                        >
                            Cancelar Edición
                        </Button>
                    )}
                </Box>

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <StyledTextField
                            fullWidth
                            label="Título"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />

                        <StyledTextField
                            fullWidth
                            label="Slug (URL)"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            required
                            helperText="URL amigable para el artículo"
                        />

                        <StyledTextField
                            fullWidth
                            label="Resumen"
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            multiline
                            rows={3}
                            required
                            helperText="Breve descripción del artículo (máx. 160 caracteres)"
                        />

                        <FormControl fullWidth>
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                label="Categoría"
                                required
                            >
                                {categories.map(cat => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <StyledTextField
                            fullWidth
                            label="Contenido"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            multiline
                            rows={10}
                            required
                            helperText="Puedes usar formato Markdown"
                        />

                        {/* Tags Input */}
                        <Box>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <StyledTextField
                                    label="Etiquetas"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <Button
                                    onClick={handleAddTag}
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                        color: '#ffffff',
                                    }}
                                >
                                    <AddIcon />
                                </Button>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {formData.tags.map((tag, index) => (
                                    <Chip
                                        key={index}
                                        label={tag}
                                        onDelete={() => handleRemoveTag(tag)}
                                        sx={{
                                            backgroundColor: 'rgba(241, 245, 249, 0.8)',
                                            color: 'rgba(71, 85, 105, 0.9)',
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        {/* Featured Image Upload */}
                        <Box>
                            <Button
                                component="label"
                                variant="outlined"
                                startIcon={<CloudUploadIcon />}
                                sx={{
                                    borderColor: 'rgba(203, 213, 225, 0.5)',
                                    color: 'rgba(71, 85, 105, 0.9)',
                                    '&:hover': {
                                        borderColor: 'rgba(148, 163, 184, 0.7)',
                                    }
                                }}
                            >
                                Subir Imagen Destacada
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </Button>
                            {imagePreview && (
                                <Box sx={{ mt: 2, position: 'relative' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        style={{
                                            width: '100%',
                                            maxHeight: 200,
                                            objectFit: 'cover',
                                            borderRadius: 8
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            color: '#ffffff',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            }
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.published}
                                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                                    name="published"
                                />
                            }
                            label="Publicar inmediatamente"
                            sx={{ color: 'rgba(71, 85, 105, 0.9)' }}
                        />

                        {error && <Alert severity="error">{error}</Alert>}
                        {success && <Alert severity="success">{success}</Alert>}

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={uploading}
                            sx={{
                                background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
                                color: '#ffffff',
                                borderRadius: 25,
                                py: 1.5,
                                fontWeight: 600,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 100%)',
                                },
                                '&:disabled': {
                                    background: 'rgba(0, 0, 0, 0.3)',
                                }
                            }}
                        >
                            {uploading ? 'Guardando...' : (editingPost ? 'Actualizar Artículo' : 'Crear Artículo')}
                        </Button>

                        {uploading && <LinearProgress />}
                    </Box>
                </form>
            </CardContentWrapper>
        </ModernCard>
    );
}