import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Chip,
    Box,
    CircularProgress,
    Tooltip
} from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function BlogPostsTable({ posts, loading, onRefresh, onEdit, onDelete }) {
    const formatDate = (timestamp) => {
        if (!timestamp) return 'No publicado';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const handleDelete = async (postId, postTitle) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${postTitle}"?`)) {
            return;
        }

        try {
            const response = await fetch('/api/v2/blog/admin/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId })
            });

            if (response.ok) {
                onDelete();
            } else {
                const data = await response.json();
                alert(data.error || 'Error al eliminar el artículo');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error al eliminar el artículo');
        }
    };

    const handleView = (slug) => {
        window.open(`/blog/${slug}`, '_blank');
    };

    return (
        <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 700 }}>
                        Artículos del Blog
                    </Typography>
                    <IconButton 
                        onClick={onRefresh}
                        sx={{ color: 'rgba(71, 85, 105, 0.8)' }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : posts.length === 0 ? (
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            textAlign: 'center', 
                            color: 'rgba(71, 85, 105, 0.8)',
                            py: 4
                        }}
                    >
                        No hay artículos creados aún
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        Título
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        Categoría
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        Estado
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        Fecha
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        Vistas
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {posts.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'rgba(15, 23, 42, 0.95)',
                                                    fontWeight: 500,
                                                    maxWidth: 300,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {post.title}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'rgba(71, 85, 105, 0.8)',
                                                    display: 'block'
                                                }}
                                            >
                                                /{post.slug}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={post.category}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(241, 245, 249, 0.8)',
                                                    color: 'rgba(71, 85, 105, 0.9)',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={post.published ? 'Publicado' : 'Borrador'}
                                                size="small"
                                                sx={{
                                                    backgroundColor: post.published 
                                                        ? 'rgba(34, 197, 94, 0.1)' 
                                                        : 'rgba(251, 191, 36, 0.1)',
                                                    color: post.published 
                                                        ? 'rgb(34, 197, 94)' 
                                                        : 'rgb(251, 191, 36)',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                                                {formatDate(post.publishedAt)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                                                {post.viewCount || 0}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                {post.published && (
                                                    <Tooltip title="Ver artículo">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleView(post.slug)}
                                                            sx={{ color: 'rgba(71, 85, 105, 0.8)' }}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onEdit(post)}
                                                        sx={{ color: 'rgba(71, 85, 105, 0.8)' }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(post.id, post.title)}
                                                        sx={{ color: '#ef4444' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContentWrapper>
        </ModernCard>
    );
}