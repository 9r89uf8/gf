'use client';

import { CircularProgress, Box, Paper, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 650,
  width: '100%',
  padding: theme.spacing(6),
  textAlign: 'center',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
}));

export default function LoadingFallback() {
  return (
    <StyledContainer>
      <ContentPaper>
        <Stack spacing={3} alignItems="center">
          <CircularProgress size={48} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Cargando resultado...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esto solo tomará un momento.
          </Typography>
        </Stack>
      </ContentPaper>
    </StyledContainer>
  );
}
