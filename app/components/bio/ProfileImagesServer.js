// app/components/bio/ProfileImagesServer.jsx
import Image from 'next/image';
import Box from '@mui/material/Box';

export default function ProfileImagesServer({ backgroundUrl, profileUrl }) {
    // Use regular sx props instead of styled components
    return (
        <Box
            sx={{
                height: { xs: 170, sm: 200, md: 250 },
                position: 'relative',
                overflow: 'visible',
            }}
            id="profile-images-container"
            data-background-url={backgroundUrl}
            data-profile-url={profileUrl}
        >
            {/* Background Image */}
            <Box
                id="profile-background-image"
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Image
                    src={backgroundUrl}
                    alt="Background"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                />
            </Box>

            {/* Profile Avatar */}
            <Box
                id="profile-avatar-image"
                sx={{
                    position: 'absolute',
                    bottom: -75,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'translateX(-50%) scale(1.05)',
                    },
                }}
            >
                <Image
                    src={profileUrl}
                    alt="Profile"
                    fill
                    priority
                    sizes="150px"
                    style={{ objectFit: 'cover' }}
                />
            </Box>
        </Box>
    );
}