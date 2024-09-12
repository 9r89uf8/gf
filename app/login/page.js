// app/login/page.jsx
'use client'
import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import {alpha, styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import { useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { loginUser } from '@/app/services/authService';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: 'black',
    marginBottom: 10,
    background: '#ffffff', // semi-transparent white
    backdropFilter: 'blur(10px)', // apply blur
    borderRadius: 10, // rounded corners
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'black',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: 'white',
    cursor: 'pointer',
    padding: '6px 16px',
    margin: '4px',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    fontWeight: '500',
    backdropFilter: 'blur(10px)',
    '&.selected': {
        background: 'rgba(255, 255, 255, 0.5)',
    },
}));

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const setUser = useStore((state) => state.setUser);

    const handleLogin = async (e) => {
        e.preventDefault()
        const { user, error } = await loginUser(email, password, setUser);
        if (user) {
            router.push('/chat');
        }
    };

    const handleReset = async (e) => {
        e.preventDefault()
        router.push('/reset-password');
    };

    return (
        <>
            <div style={{textAlign: "center", margin: '-25px auto -25px auto'}}>
                <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Quinielas+(3).png" alt="logo" style={{width: 230, height: "auto"}}/>
            </div>

            <Box sx={{ flexGrow: 1, height:"100vh" }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <Typography variant="h4" gutterBottom style={{margin: 18}}>
                                Ingrese a su cuenta
                            </Typography>


                            <form onSubmit={handleLogin} style={{marginTop: 20}}>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField
                                                variant="outlined"
                                                id="standard-basic"
                                                label="Correo electrónico"
                                                name="email"
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                                InputLabelProps={{
                                                    sx: { color: 'black', fontSize:22 } // Apply white color to label
                                                }}
                                                sx={{
                                                    '& label.Mui-focused': {
                                                        color: 'black', // Color of the label when the TextField is focused
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        '& fieldset': {
                                                            borderColor: 'black', // Color of the border in normal state
                                                        },
                                                        '&.Mui-focused fieldset': {
                                                            borderColor: 'black', // Color of the border when the TextField is focused
                                                        },
                                                        '& input': {
                                                            color: 'black', // Color of the input text
                                                        }
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <FormControl>
                                            <TextField style={{marginBottom: 15}} label="Contraseña" name="password" value={password} onChange={e => setPassword(e.target.value)} variant="outlined" type="password" fullWidth required
                                                       InputLabelProps={{
                                                           sx: { color: 'black', fontSize:22 } // Apply white color to label
                                                       }}
                                                       sx={{
                                                           '& label.Mui-focused': {
                                                               color: 'black', // Color of the label when the TextField is focused
                                                           },
                                                           '& .MuiOutlinedInput-root': {
                                                               '& fieldset': {
                                                                   borderColor: 'black', // Color of the border in normal state
                                                               },
                                                               '&.Mui-focused fieldset': {
                                                                   borderColor: 'black', // Color of the border when the TextField is focused
                                                               },
                                                               '& input': {
                                                                   color: 'black', // Color of the input text
                                                               }
                                                           }
                                                       }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={11} lg={7} xs={11}>
                                        <GradientButton style={{margin: 10, fontSize:22}} type="submit" variant="contained">Entrar</GradientButton>
                                    </Grid>

                                    {/*<Typography variant="h6" gutterBottom style={{marginBottom: 10, color: '#ffffff'}}>*/}
                                    {/*    no registrado?*/}
                                    {/*    <Link to='/register' style={{textDecoration: 'none', color: 'whitesmoke'}}> Crear Cuenta*/}
                                    {/*    </Link>*/}
                                    {/*</Typography>*/}


                                    <Button size='medium' style={{ marginTop: '15px', color: 'black' }} variant="outlined" onClick={handleReset}>
                                        ¿Olvidaste tu contraseña?
                                    </Button>

                                </Grid>
                            </form>


                        </Item>
                    </Grid>

                    <Grid item sm={11} lg={7} xs={11}>
                        <Item elevation={4}>
                            <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Quinielas+(1).png" alt="logo" style={{width: 45, height: "auto"}}/>
                            <Typography style={{color: 'black', fontSize:'14px'}}>
                                © 2024 - Todos los Derechos Reservados LIGA MX. Quinielas liga mx 2024-2025.
                            </Typography>


                        </Item>
                    </Grid>
                </Grid>
            </Box>

        </>
    );
};

export default LoginPage;

