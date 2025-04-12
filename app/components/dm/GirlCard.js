// components/GirlCard.js
import React from 'react';
import { Avatar, Typography, CardContent, CardActions } from '@mui/material';
import Link from 'next/link';
import LockIcon from "@mui/icons-material/Lock";
import {
    GirlCard as StyledGirlCard,
    AvatarWrapper,
    StatusIndicator,
    GradientButton,
    PremiumButton
} from './DMListStyled';

const GirlCard = ({ girl, isPremium, onMessageClick, onPremiumClick }) => {
    return (
        <StyledGirlCard>
            <AvatarWrapper>
                <Link href={`/${girl.id}`} passHref>
                    <Avatar
                        src={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down`}
                        alt={girl.name}
                        sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid white',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                </Link>
                <StatusIndicator isActive={girl.isActive} />
            </AvatarWrapper>

            <CardContent sx={{
                textAlign: 'center',
                p: 1,
                flex: '1 0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: -5,
                marginBottom: -5
            }}>
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#333',
                        mb: 0.5,
                    }}
                >
                    {girl.username}
                </Typography>
            </CardContent>

            <CardActions sx={{ width: '100%', p: 2, pt: 0 }}>
                {girl.premium && !isPremium ? (
                    <PremiumButton
                        onClick={onPremiumClick}
                        startIcon={<LockIcon />}
                    >
                        Premium
                    </PremiumButton>
                ) : (
                    <GradientButton
                        onClick={() => onMessageClick(girl.id)}
                    >
                        Mensaje
                    </GradientButton>
                )}
            </CardActions>
        </StyledGirlCard>
    );
};

export default GirlCard;