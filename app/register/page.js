// app/register/page.jsx
'use client'
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {registerUser} from "@/app/services/authService";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import {alpha, styled} from '@mui/material/styles';

const GlassCard = styled(Card)({
    textAlign: 'center',
    color: 'black',
    background: '#ffffff', // semi-transparent white
    backdropFilter: 'blur(10px)', // apply blur
    borderRadius: 10, // rounded corners
    marginBottom: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
});

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

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');
    const [disableRegister, setDisableRegister] = useState(false);
    const router = useRouter();
    let data = { email, password, phoneNumber, username, country }


    useEffect(() => {
        fetch('https://ipinfo.io/json?token=5a17bbfded96f7')
            .then(response => response.json())
            .then(data => {
                setCountry(data.country);
            });
    }, []);


    const handleRegister = async (e) => {
        e.preventDefault();
        setDisableRegister(true);
        const { user, error } = await registerUser(data);
        setDisableRegister(false);
        if (user) {
            router.push('/');
        } else {
            console.error(error);
        }
    };

    return (
        <>
            <div style={{textAlign: "center", margin: '-25px auto -25px auto'}}>
                <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Quinielas+(3).png" alt="logo" style={{width: 230, height: "auto"}}/>
            </div>

            <Box style={{height:"100vh"}} display="flex" justifyContent="start" alignItems="center" flexDirection="column">
                <GlassCard sx={{ width: '330px', maxWidth: '500px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', p: 1 }}>
                    <CardContent style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>

                        <Box textAlign="center">
                            <Typography variant="h4" style={{marginBottom:20}}>Crear una cuenta</Typography>

                            <form onSubmit={handleRegister}>
                                <TextField style={{marginBottom: 15}} label="Usuario" name="name" value={username} onChange={e => setUsername(e.target.value)} variant="outlined" fullWidth required
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

                                <TextField style={{marginBottom: 15}} label="Teléfono" name="phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} variant="outlined" fullWidth required
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


                                <TextField style={{marginBottom: 15}} label="Correo electrónico" name="email" value={email} onChange={e => setEmail(e.target.value)} variant="outlined" fullWidth required
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


                                <GradientButton style={{marginBottom: 15, fontSize:22, marginTop:15}} type="submit" variant="contained" disabled={disableRegister}>
                                    Crear Cuenta
                                </GradientButton>

                                {/*<Link to="/login" style={{textDecoration: "none"}}>*/}
                                {/*    <GradientButton style={{marginBottom: 15}} >*/}
                                {/*        Entrar*/}
                                {/*    </GradientButton>*/}
                                {/*</Link>*/}
                            </form>
                        </Box>
                    </CardContent>
                </GlassCard>

                <GlassCard elevation={4} style={{margin:18}}>
                    <img src="https://chicagocarhelp.s3.us-east-2.amazonaws.com/Quinielas+(1).png" alt="logo" style={{width: 45, height: "auto"}}/>
                    <Typography style={{fontSize:'14px'}}>
                        © 2024 - Todos los Derechos Reservados LIGA MX. Quinielas liga mx 2024-2025.
                    </Typography>


                </GlassCard>
            </Box>
        </>
    );
};

export default RegisterPage;
