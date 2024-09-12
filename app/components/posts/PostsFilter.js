import React from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { alpha, styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    color: '#ffffff',
    background: 'linear-gradient(45deg, #343a40, #001219)',
    backdropFilter: 'blur(10px)',
    borderRadius: 10,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
}));

const PostsFilter = ({ postsCount }) => {
    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={8}>
                <Item elevation={4}>
                    <Typography variant="h6">Fotos</Typography>
                    <Typography variant="h6">{postsCount}</Typography>
                </Item>
            </Grid>
        </Grid>
    );
};

export default PostsFilter;

