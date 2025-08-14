'use client';

import React from 'react';
import { 
    Box, 
    Skeleton, 
    Divider, 
    Avatar,
    Typography
} from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

const UserProfileSkeleton = () => {
    return (
        <ModernCard variant="elevated" animate={false}>
            <CardContentWrapper>
                {/* Profile header skeleton */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Skeleton variant="circular">
                        <Avatar sx={{ width: 80, height: 80 }} />
                    </Skeleton>
                    <Box sx={{ ml: 3, flex: 1 }}>
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="30%" height={16} />
                    </Box>
                </Box>

                {/* Action buttons skeleton */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={40} sx={{ borderRadius: 1 }} />
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                {/* Premium section skeleton */}
                <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ borderRadius: 2 }} />
                </Box>

                <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.1)' }} />

                {/* Posts section skeleton */}
                <Box>
                    <Skeleton variant="text" width="25%" height={28} sx={{ mb: 3 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 3 }}>
                        {[1, 2, 3].map((item) => (
                            <Box key={item}>
                                <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />
                                <Box sx={{ pt: 2 }}>
                                    <Skeleton variant="text" width="80%" />
                                    <Skeleton variant="text" width="40%" />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </CardContentWrapper>
        </ModernCard>
    );
};

export default UserProfileSkeleton;