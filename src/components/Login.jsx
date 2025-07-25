import {useState} from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import {useForm} from 'react-hook-form';
import {login} from '../Api/Api';
import Cookies from 'js-cookie';

export const Login = ({func}) => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    const onSubmit = async (data) => {
      try {
        const log = await login(data);
        //console.log("Datos enviados:", data);         // Imprimir los datos del formulario
        console.log("token:", log);
        Cookies.set('access_token', log.tk, { 
          expires: 1, // La cookie expirará en 1 día
          path: '/', // Habilita el acceso a la cookie en toda la aplicación
          secure: process.env.NODE_ENV === 'production', // Usa cookies seguras en producción
        });     // Imprimir la respuesta completa del servidor
        func(log.tk, log.equipo);
        //navigate('/');
        //setToken(log.tk);
      } catch (error) {
        console.log("Error en la petición:", error);  // Imprimir el error si lo hubiera
      }
      //console.log("Errores del formulario:", errors); // Imprimir los errores de validación
    };
    
    return (
        <form className='formulario' onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                <InputLabel 
                    htmlFor="outlined-adornment-usuario"
                    sx={{
                        color: 'gray', // Color del label por defecto
                        '&.Mui-focused': {
                          color: '#FF4A42', // Color del label cuando el input tiene focus
                        },
                        '&:hover': {
                          color: '#FF4A42', // Color del label cuando el input está en hover
                        },
                      }}
                >Nombre</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-usuario"
                    type='text'
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="user icon"
                                edge="end"
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Nombre"
                    sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FF4A42', // Cambia el color del borde al hacer focus
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#FF4A42', // Cambia el color del borde al hacer hover
                        },
                      }}
                      {...register("nombre", {required: true})}
                />
            </FormControl>
            <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password"
                    sx={{
                        color: 'gray', // Color del label por defecto
                        '&.Mui-focused': {
                          color: '#FF4A42', // Color del label cuando el input tiene focus
                        },
                        '&:hover': {
                          color: '#FF4A42', // Color del label cuando el input está en hover
                        },
                    }}
                >Contraseña</InputLabel>
                <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'}
                {...register("password", {required: true})}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                }
                label="Contraseña"
                sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF4A42', // Cambia el color del borde al hacer focus
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF4A42', // Cambia el color del borde al hacer hover
                    },
                  }}
                />
            </FormControl>
            <div className='container-submit'>
                <Button className='submit log'variant="contained" endIcon={<LoginIcon />}
                  sx={{ 
                    backgroundColor: '#FF4A42',  // Color de fondo del botón
                    '&:hover': {
                      backgroundColor: '#FF4A42',  // Color de fondo al pasar el mouse (hover)
                    },
                    color: 'white',  // Color del texto
                  }}
                  type="submit"
                >
                    Iniciar Sesion
                </Button>
            </div>
        </form>
    )
}
