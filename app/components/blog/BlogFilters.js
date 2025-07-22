'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Box, Chip, InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ModernCard } from '@/app/components/ui/ModernCard';

export default function BlogFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');
    const currentSearch = searchParams.get('search');

    const handleCategoryClick = (category) => {
        const params = new URLSearchParams(searchParams);
        if (category === 'todos') {
            params.delete('category');
        } else {
            params.set('category', category.toLowerCase());
        }
        params.delete('page'); // Reset to page 1 when changing category
        router.push(`/blog?${params.toString()}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchValue = formData.get('search');
        const params = new URLSearchParams(searchParams);

        if (searchValue) {
            params.set('search', searchValue);
        } else {
            params.delete('search');
        }
        params.delete('page'); // Reset to page 1 when searching
        router.push(`/blog?${params.toString()}`);
    };

    const categories = [
        { label: 'Todos', value: 'todos' },
        { label: 'Relaciones IA', value: 'relaciones-ia' },
        { label: 'Guías', value: 'guias' },
        { label: 'Tecnología', value: 'tecnologia' },
        { label: 'Historias', value: 'historias' }
    ];

    return (
        <>
            {/* Search Bar */}
            <ModernCard variant="flat" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                <Paper
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: 'none',
                    }}
                >
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Buscar artículos..."
                        inputProps={{ 'aria-label': 'buscar artículos' }}
                        defaultValue={currentSearch}
                        name="search"
                    />
                    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </ModernCard>

            {/* Categories */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                {categories.map((cat) => (
                    <Chip
                        key={cat.value}
                        label={cat.label}
                        onClick={() => handleCategoryClick(cat.value)}
                        sx={{
                            m: 0.5,
                            backgroundColor: currentCategory === cat.value || (!currentCategory && cat.value === 'todos')
                                ? '#1a1a1a'
                                : 'rgba(255, 255, 255, 0.8)',
                            color: currentCategory === cat.value || (!currentCategory && cat.value === 'todos')
                                ? '#fff'
                                : 'rgba(51, 65, 85, 0.9)',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: currentCategory === cat.value || (!currentCategory && cat.value === 'todos')
                                    ? '#000'
                                    : 'rgba(241, 245, 249, 1)',
                            },
                        }}
                    />
                ))}
            </Box>
        </>
    );
}