import {useState} from 'react';
import Box from '@mui/material/Box';
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
import {registro} from '../Api/Api';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';


export const Registro = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFail, setOpenFail] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    const handleMouseDownPassword2 = (event) => {
      event.preventDefault();
    };
  
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    };

    const handleMouseUpPassword2 = (event) => {
      event.preventDefault();
    };

    const onSubmit = async (data) => {
      try {
        const reg = await registro(data);
        console.log("info:", reg);
        if(reg.status === 200){
          setOpenSuccess(true);
        }else{
          setOpenFail(true);
        }     
      } catch (error) {
        console.log("Error en la petición:", error);  
        setOpenFail(true);
      }finally{
        reset();
      }
      console.log("Errores del formulario:", errors); 
    };
    
    return (
      <>
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
                  {...register("password", {required: true})}
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
                <OutlinedInput id="outlined-adornment-password" type={showPassword2 ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword2}
                        onMouseDown={handleMouseDownPassword2}
                        onMouseUp={handleMouseUpPassword2}
                        edge="end"
                    >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
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
                  {...register("password2", {required: true})}
                />
            </FormControl>
            <div className='container-submit'>
                <Button className='submit reg' variant="contained" endIcon={<LoginIcon />}
                  sx={{ 
                    backgroundColor: '#FF4A42',  // Color de fondo del botón
                    '&:hover': {
                      backgroundColor: '#FF4A42',  // Color de fondo al pasar el mouse (hover)
                    },
                    color: 'white',  // Color del texto
                  }}
                  type="submit"
                >
                    Registrarse
                </Button>
            </div>
            <Box sx={{ width: '100%' }}>
              <Collapse in={openSuccess}>
                <Alert
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setOpenSuccess(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ mb: 2 }}
                >
                  Registro completado con éxito!, <br></br>Ya puedes iniciar sesion en la pestaña de login
                </Alert>
              </Collapse>
            </Box>
            <Collapse in={openFail}>
              <Alert
                severity='error'
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenFail(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Error en la creacion del usuario
              </Alert>
            </Collapse>
        </form>
      </>
    )
}
