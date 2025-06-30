import React, { useEffect, useState, useRef } from 'react';
import { getAllPlayersByTeam, addPlayer, addCoach, addPlayerToTeam } from '../Api/Api';
import Loader from 'rsuite/Loader';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import 'rsuite/Loader/styles/index.css';
import 'animate.css';
import { useParams} from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Campo from './Campo';
import {useForm} from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HeightIcon from '@mui/icons-material/Height';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import FlagCircleIcon from '@mui/icons-material/FlagCircle';
import PhotoIcon from '@mui/icons-material/Photo';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import {getAllTeams, uploadImageToCloudinary} from '../Api/Api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  bgcolor: '#FF4A42',
  border: '2px solidrgb(192, 56, 49)',
  boxShadow: 24,
  p: 4,
  display: 'flex',           
  flexDirection: 'column',   
  alignItems: 'center',      
  textAlign: 'center', 
  borderRadius: 10,
  color:'white'   
};

const nuevoJugador = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  padding:20,
  bgcolor: '#fff',
  border: '2px solidrgb(192, 56, 49)',
  boxShadow: 24,
  p: 4,
  display: 'flex',           
  flexDirection: 'column',   
  alignItems: 'center',      
  textAlign: 'center', 
  borderRadius: 10,
  color:'white'   
};

export const Jugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [entrenador, setEntrenador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [bandera, setBandera] = useState('');
  const [cambioJugador, setCambioJugador] = useState(null);
  const [open, setOpen] = useState(false);
  const [openCoach, setOpenCoach] = useState(false);
  const [openNuevo, setOpenNuevo] = useState(false);
  const [estadio, setEstadio] = useState(null);
  const inputRefCalendar = useRef();
  const [nacionalidades, setNacionalidades] = useState('');
  const [posicion, setPosicion] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [nuevaFotoJugador, setNuevaFotoJugador] = useState(['','']);
  const [jugadoresChanged, setJugadoresChanged] = useState(false);
  const [edicion, setEdicion] = useState([false, {}]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const getNacionalidades = async() => {
    try {
      const teams = await getAllTeams();
      const paises = [];
      teams.forEach((equipo) => {
        equipo.plantilla.jugadores.forEach((jugador) => {
          if(!paises.includes(jugador.nacionalidad)){
            paises.push(jugador.nacionalidad);
          }
        });
      });
      setNacionalidades(paises);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    const respuesta = await getAllPlayersByTeam(ids);
    const response = await uploadImageToCloudinary(nuevaFotoJugador[0], respuesta.carpeta);

    data.titular = false;
    data.foto = response;
    data.posicion = posicion;
    data.nacionalidad = nacionalidad;
    data.dorsal = Number(data.dorsal);

    console.log(data);
    const addPlayer = await addPlayerToTeam(ids, data);

    if(addPlayer.status === 200){
      setJugadoresChanged(prev => !prev);
    }

    reset();
    handleCloseNuevo();
  };

    const handleCalendarClick = () => {
    if (inputRefCalendar.current) {
      // En navegadores modernos
      inputRefCalendar.current.showPicker?.();
      // Fallback para otros
      inputRefCalendar.current.click();
    }
  };

  const handleOpen = async (jugador) => {
    //console.log(jugador.nacionalidad.toLowerCase());
    await obtenerBandera(jugador.nacionalidad.toLowerCase()); 
    if(cambioJugador === null){
      setJugadorSeleccionado(jugador); // Almacenar el jugador seleccionado
      setOpen(true);
    }else{
      //Tengo que camviar la titularidad y la posicion
      jugadores.forEach((x) => {
        if(x.nombre === jugador.nombre){
          x.posicion = cambioJugador.posicion;
          x.titular = true;
        }
        if(x.nombre === cambioJugador.nombre){
          x.titular = false;
        }
      });
      setCambioJugador(null);
    }
  };

  const handleOpenCoach = async (coach) => {
    await obtenerBandera(coach.nacionalidad.toLowerCase()); 
    setOpenCoach(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseCoach = () => {
    setOpenCoach(false);
  };

  const handleExited = () => {
    setJugadorSeleccionado(null);
    setBandera('');
  };

  const handleCloseNuevo = () => {
    setOpenNuevo(false);
    setNacionalidad('');
    setPosicion('');
    setNuevaFotoJugador(['','']);
    setBandera('');
    reset();
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNuevaFotoJugador([file, url]);
    }
  }

  const triggerFileSelect = () => {
    document.getElementById('file-upload').click();
  };

  const handleNuevo = () => {
    setOpenNuevo(false);
    setNacionalidad('');
    setPosicion('');
    setNuevaFotoJugador(['','']);
  };

  const siguienteJugador = async (num) => {
    for (const [index, x] of jugadores.entries()) {
      if (jugadorSeleccionado === x) {
        const nextIndex = index + num;
  
        let siguiente = null;
  
        if (nextIndex <= 0) {
          siguiente = jugadores[0];
        } else if (nextIndex >= jugadores.length) {
          siguiente = jugadores[jugadores.length - 1];
        } else {
          siguiente = jugadores[nextIndex];
        }
  
        setJugadorSeleccionado(siguiente);
        await obtenerBandera(siguiente.nacionalidad?.toLowerCase());
  
        break;
      }
    }
  };

  const {ids} = useParams();

  useEffect(() => {
    getNacionalidades();
    setCambioJugador(null);
    if (ids) {
      getJugadores(ids);
    }
  }, [ids, jugadoresChanged]);

  const getJugadores = async (value) => {
    setLoading(true); // Iniciar el loader cuando comienza la carga
    try {
      const respuesta = await getAllPlayersByTeam(value);
      setJugadores(respuesta.plantilla.jugadores);
      setEntrenador(respuesta.plantilla.entrenador);
      setEstadio(respuesta.estadio);
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
    } finally {
      setLoading(false); // Ocultar el loader cuando termina la carga
    }
  };

  const obtenerBandera = async (nacionalidad) => {
    try {
      // Convertir la nacionalidad a minúsculas
      //console.log(nacionalidad);
      const nacionalidadMin = nacionalidad.toLowerCase();
      // Hacer la solicitud a la API para obtener todos los países
      const response = await axios.get(`https://restcountries.com/v3.1/all?fields=name,translations,flags`);
      // Buscar la bandera del país cuya traducción coincida con la nacionalidad
      //console.log(response.data);
      const paisEncontrado = response.data.find(pais => {
        return pais.translations.spa && pais.translations.spa.common.toLowerCase() === nacionalidadMin;
      });
  
      if (paisEncontrado) {
        setBandera(paisEncontrado.flags.png); // Establecer la URL de la bandera
      } else {
        console.error('No se encontró el país para la nacionalidad:', nacionalidadMin);
        setBandera('');
      }
    } catch (error) {
      console.error('Error al obtener la bandera:', error);
      setBandera('');
    }
  };

  const fichar = async(jugador) => {
    /*const token = Cookies.get('access_token');
    console.log('-------------------------------------');
    for (const [key, value] of Object.entries(jugador)) {
      console.log(`Tipo de ${key}:`, typeof value); // 
    }
    console.log('-------------------------------------'); 
    if(token){
      console.log(jugador);
      const info = {token, jugador};
      console.log(jugador.nacimiento);
      const respuesta = await addPlayer(jugador);
      
      if(respuesta.status === 201){
        handleClose();
        Swal.fire({
          icon: `${respuesta.data}`,
          text: `${respuesta.message}`
        });
      }
    
    }else{
      handleClose();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Inicia sesion para añadir jugadores a tu plantilla`
      });
    }*/
  }

  const ficharCoach = async(coach) => {
    /*const token = Cookies.get('access_token');
    if(token){
      const respuesta = await addCoach(coach);
      if(respuesta.status === 201){
        handleCloseCoach();
        Swal.fire({
          icon: `${respuesta.data}`,
          text: `${respuesta.message}`
        });
      }
    
    }else{
      handleCloseCoach();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Inicia sesion para fichar a ${coach.nombre}`
      });
    }*/
  }

  const recibirJugador = (jugador) => {
    setCambioJugador(jugador);
  };

  const vaciarJugador = () => {
    setCambioJugador(null);
  };

  const cambioPosicionTitulares = (jugador1, jugador2) => {
      var nuevosJugadores = jugadores.map(x => {
        if (x.nombre === jugador1.nombre) {
          return { ...x, posicion: jugador2.posicion };
        }
        if (x.nombre === jugador2.nombre) {
          return { ...x, posicion: jugador1.posicion };
        }
        return x; 
      });
      setJugadores(nuevosJugadores);
  }

  const calculaEdad = (nacimiento) => {
    const [dia, mes, anio] = nacimiento.split('/').map(Number);
    const fechaNacimiento = new Date(anio, mes - 1, dia);
    const hoy = new Date();
  
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  
    if (hoy.getMonth() < fechaNacimiento.getMonth() ||
     (hoy.getMonth() === fechaNacimiento.getMonth() 
     && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
  
    return edad;
  };

  const nickNamePosition = (posicion) => {
    const posiciones = [
      { fullName: 'extremo izquierda', shortName: 'EI' },
      { fullName: 'extremo derecha', shortName: 'ED' },
      { fullName: 'delantero', shortName: 'DC' },
      { fullName: 'centrocampista izquierda', shortName: 'CI' },
      { fullName: 'centrocampista derecha', shortName: 'CD' },
      { fullName: 'centrocampista centro', shortName: 'CC' },
      { fullName: 'lateral izquierda', shortName: 'LI' },
      { fullName: 'lateral derecha', shortName: 'LD' },
      { fullName: 'central derecha', shortName: 'CD' },
      { fullName: 'central izquierda', shortName: 'CI' }
    ];

    const posicionEncontrada = posiciones.find(x => x.fullName.toLocaleLowerCase() === posicion.toLocaleLowerCase());
    return posicionEncontrada ? posicionEncontrada.shortName : posicion;
  }

  const handleChangePosicion = (event) => {
    setPosicion(event.target.value);
  }

  const handleChangeNacionalidad = (event) => {
    setNacionalidad(event.target.value);
    obtenerBandera(event.target.value);
  }

  return (
    <>
    <div className='container'>
      <div className='jugadores'>
       <SimpleBar className='scroll-suplentes'>
        {loading ? (
          // Loader mientras se cargan los datos
          <div className='loader'>
            <Loader size="lg" speed="fast" />
          </div>
        ) : (
          <>
            {entrenador && (
              <div className='card '>
                <img src={entrenador.foto} alt={entrenador.nombre} onClick={() => handleOpenCoach(entrenador)} />
                <span key={entrenador.nombre}>{entrenador.nombre}</span>
              </div>
            )}
            {jugadores && 
              jugadores.filter((x) => !x.titular).map((x, index) => (
                <div className={`card`} key={index}>
                  <img src={x.foto} alt={x.nombre} onClick={() => handleOpen(x)}/>
                  <span>{x.nombre}</span>
                </div>
            ))}
            {jugadores && entrenador && ( 
              <div className='addJugador'>
                <div className='circle-plus' onClick={() => setOpenNuevo(true)}>
                  <i className="fa-solid fa-plus"></i>
                </div>
              </div>
            )}
          </>
        )}
         </SimpleBar>
      </div>
      <Campo estadio={estadio} jugadores={jugadores} enviarJugador={recibirJugador} cambioPosicionTitulares={cambioPosicionTitulares} vaciarJugador={vaciarJugador}></Campo>
    </div>
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={open} onExited={handleExited}>
        <Box sx={style}>
            {jugadorSeleccionado ? (
              <>
                <h2 id="transition-modal-title" style={{ marginTop: '0px' }}>{jugadorSeleccionado.nombre}</h2>
                <div style={{display:'flex', gap:'20px', alignItems: 'center'}}>
                  <div className='nextPlayer' onClick={() => {siguienteJugador(-1)}}><i className="fa-solid fa-arrow-left"></i></div>
                  <img src={jugadorSeleccionado.foto} alt={jugadorSeleccionado.nombre} style={{ width: '100px' }} />
                  <div className='nextPlayer' onClick={() => {siguienteJugador(1)}}><i className="fa-solid fa-arrow-right"></i></div>
                </div>
                <img src={bandera} style={{ width: '60px', margin:'20px' }} />
                <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                  <div>
                    <p>Edad:</p>
                    <p>Dorsal:</p>
                    <p>Altura:</p>
                    <p>Posicion:</p> 
                    <p>País:</p>
                  </div>
                  <div>
                    <p>{calculaEdad(jugadorSeleccionado.nacimiento)} años</p>
                    <p>{jugadorSeleccionado.dorsal}</p>
                    <p>{jugadorSeleccionado.altura}</p>
                    <p>{nickNamePosition(jugadorSeleccionado.posicion)}</p>
                    <p>{jugadorSeleccionado.nacionalidad}</p>                   
                  </div>
                </div>
                <div style={{display:'flex', gap:'10px', marginTop:'15px'}}>
                  <Button  variant="contained" onClick={handleClose} sx={{ 
                    backgroundColor: 'white', 
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    color: 'black',
                    borderRadius: 10
                  }}>Cerrar</Button>
                  <Button variant="contained" sx={{ 
                    backgroundColor: 'white', 
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    color: 'black',
                    borderRadius: 10
                  }}>Fichar</Button>
                </div>
                <div style={{marginTop:'20PX'}}>
                  <IconButton aria-label="person add" edge="end" onClick={handleCloseNuevo} sx={{color:'red'}}>
                    <DeleteIcon sx={{ color: 'red', backgroundColor:'#c6c6c6', padding:'10px', borderRadius:'50%'  }}/>
                  </IconButton>
                </div>
              </>
            ) : (
              <p>Cargando información del jugador...</p>
            )}
        </Box>
      </Fade>
    </Modal>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openCoach}
      onClose={handleCloseCoach}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={openCoach} onExited={handleExited}>
        <Box sx={style}>
            {entrenador ? (
              <>
                <h2 id="transition-modal-title" style={{ marginTop: '0px' }}>{entrenador.nombre}</h2>
                <img src={entrenador.foto} alt={entrenador.nombre} style={{ width: '60px' }} />
                <img src={bandera} style={{ width: '60px', margin:'20px' }} />
                <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                  <div>
                    <p>Edad:</p>
                    <p>País:</p>
                  </div>
                  <div className='miembro-info'>
                    <p>{calculaEdad(entrenador.nacimiento)} años</p>
                    <p>{entrenador.nacionalidad}</p>                   
                  </div>
                </div>
                <div style={{display:'flex', gap:'10px', marginTop:'30px'}}>
                  <Button  variant="contained" onClick={handleCloseCoach} sx={{ 
                    backgroundColor: 'white', 
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    color: 'black',
                    borderRadius: 10
                  }}>Cerrar</Button>
                  <Button variant="contained" sx={{ 
                    backgroundColor: 'white', 
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                    color: 'black',
                    borderRadius: 10
                  }}>Fichar</Button>
                  
                </div>
                
              </>
            ) : (
              <p>Cargando información del Entrenador...</p>
            )}
        </Box>
      </Fade>
    </Modal>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openNuevo}
      onClose={handleCloseNuevo}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}>
      <Fade in={openNuevo} onExited={handleNuevo}>
        <Box sx={nuevoJugador}>
                <h2 id="transition-modal-title" style={{ marginTop: '0px', color:'#000' }}>Nuevo jugador</h2>
                {nuevaFotoJugador[1] && (
                  <img
                    src={nuevaFotoJugador[1]}
                    alt={nacionalidad}
                    style={{ width: '100px', marginBottom: '20px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                )}
                <img src={bandera} alt={nacionalidad} style={{ width: '60px', marginBottom:'20px' }} />
                <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                  <form className='formularioNuevoJugador' onSubmit={handleSubmit(onSubmit)}>
                    <div className='campos'>
                      <div>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-usuario" sx={{ color: 'gray','&.Mui-focused': {color: '#FF4A42'}, '&:hover': {color: '#FF4A42'}}}>
                              Nombre
                          </InputLabel>
                          <OutlinedInput id="outlined-adornment-usuario" type='text'
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="user icon" edge="end">
                                  <AccountCircleIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Nombre"
                            sx={{'&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                              '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                            }}
                            {...register("nombre", {required: true})}
                          />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-usuario" sx={{ color: 'gray','&.Mui-focused': {color: '#FF4A42'}, '&:hover': {color: '#FF4A42'}}}>
                              Apodo
                          </InputLabel>
                          <OutlinedInput id="outlined-adornment-usuario" type='text'
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="user icon" edge="end">
                                  <EmojiEmotionsIcon/>
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Apodo"
                            sx={{'&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                              '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                            }}
                            {...register("apodo", {required: false})}
                          />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-usuario" sx={{ color: 'gray','&.Mui-focused': {color: '#FF4A42'}, '&:hover': {color: '#FF4A42'}}}>
                              Dorsal
                          </InputLabel>
                          <OutlinedInput id="outlined-adornment-usuario" type='number'
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="user icon" edge="end">
                                  <CheckroomIcon/>
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Dorsal"
                            sx={{'&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                              '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                            }}
                            {...register("dorsal", {required: true})}
                          />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-usuario" sx={{ color: 'gray','&.Mui-focused': {color: '#FF4A42'}, '&:hover': {color: '#FF4A42'}}}>
                              Nacimiento
                          </InputLabel>
                          <OutlinedInput id="outlined-adornment-usuario" type='date' inputRef={inputRefCalendar} defaultValue="2000-01-01"
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="user icon" edge="end" onClick={handleCalendarClick}>
                                  <CalendarTodayIcon/>
                                </IconButton>
                              </InputAdornment>
                            }
                            label="AltNacimiento"
                            sx={{'&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                              '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                              '& input::-webkit-calendar-picker-indicator': {display: 'none', WebkitAppearance: 'none'}
                            }}
                            {...register("nacimiento", {required: true})}
                          />
                        </FormControl>
                      </div>
                      <div>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-usuario" sx={{ color: 'gray','&.Mui-focused': {color: '#FF4A42'}, '&:hover': {color: '#FF4A42'}}}>
                              Altura
                          </InputLabel>
                          <OutlinedInput id="outlined-adornment-usuario" type='number' step='0.1'
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="user icon" edge="end">
                                  <HeightIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Altura"
                            sx={{'&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                              '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                            }}
                            {...register("altura", {required: true})}
                          />
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel id="demo-multiple-name-label" htmlFor="outlined-adornment-usuario" sx={{ color: 'gray','&.Mui-focused': {color: '#FF4A42'}, '&:hover': {color: '#FF4A42'}}}>Posicion</InputLabel>
                          <Select
                            input={<OutlinedInput label="Posicion" 
                            sx={{'&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                                          '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                                        }}/>}
                            labelId="Posicion"
                            id="demo-simple-select-filled"
                            value={posicion || ''}
                            onChange={(e) => setPosicion(e.target.value)}
                          >
                            <MenuItem value={''}>
                              None
                            </MenuItem>
                            <MenuItem value={'portero'}>Portero</MenuItem>
                            <MenuItem value={'lateral derecha'}>lateral derecha</MenuItem>
                            <MenuItem value={'lateral izquierda'}>lateral izquierda</MenuItem>
                            <MenuItem value={'central izquierda'}>central izquierda</MenuItem>
                            <MenuItem value={'central derecha'}>central derecha</MenuItem>
                            <MenuItem value={'defensas'}>Defensas</MenuItem>
                            <MenuItem value={'centrocampista derecha'}>Centrocampista derecha</MenuItem>
                            <MenuItem value={'centrocampista izquierda'}>Centrocampista izquierda</MenuItem>
                            <MenuItem value={'centrocampista centro'}>Centrocampista centro</MenuItem>
                            <MenuItem value={'centrocampistas'}>Centrocampistas</MenuItem>
                            <MenuItem value={'delantero'}>Delantero centro</MenuItem>
                            <MenuItem value={'extremo izquierda'}>extremo izquierda</MenuItem>
                            <MenuItem value={'extremo derecha'}>extremo derecha</MenuItem>
                            <MenuItem value={'delanteros'}>Delanteros</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel id="demo-multiple-name-label" htmlFor="outlined-adornment-usuario" sx={{ color: 'gray','&.Mui-focused': {color: '#FF4A42'}, '&:hover': {color: '#FF4A42'}}}>Nacionalidad</InputLabel>
                          <Select
                            input={<OutlinedInput label="Nacionalidad" 
                            sx={{'&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                              '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                            }}/>}
                            labelId="Posicion"
                            id="demo-simple-select-filled"
                            value={nacionalidad}
                            onChange={handleChangeNacionalidad}
                          >
                            <MenuItem value={''}>
                              <em>None</em>
                            </MenuItem>
                            {nacionalidades && nacionalidades.map((x, index) => (
                              <MenuItem value={x} key={index}>
                                {x}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '200px' }} variant="outlined">
                          <InputLabel htmlFor="file-mock" sx={{color: 'gray','&.Mui-focused': { color: '#FF4A42' },'&:hover': { color: '#FF4A42' }}}>
                            Foto
                          </InputLabel>
                          <OutlinedInput
                            id="file-mock"
                            value={nuevaFotoJugador[0].name || ''}
                            readOnly
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton aria-label="seleccionar foto" edge="end" onClick={triggerFileSelect}>
                                  <PhotoIcon />
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Foto"
                            sx={{
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FF4A42' },
                              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FF4A42' },
                            }}
                          />

                          {/* Input oculto que realmente maneja el archivo */}
                          <input
                            type="file"
                            id="file-upload"
                            style={{ display: 'none' }}
                              {...register("foto", {
                                required: true,
                                onChange: handleFileChange,  // Aquí integras tu función
                              })}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div style={{display:'flex', gap:'30px', marginTop:'30px', justifyContent:'center'}}>
                        <IconButton aria-label="person add" edge="end" sx={{color:'green'}} type="submit">
                          <PersonAddIcon sx={{ color: 'green', backgroundColor:'#c6c6c6', padding:'10px', borderRadius:'50%'  }}/>
                        </IconButton>

                        <IconButton aria-label="person add" edge="end" onClick={handleCloseNuevo} sx={{color:'red'}}>
                          <CloseIcon sx={{ color: 'red', backgroundColor:'#c6c6c6', padding:'10px', borderRadius:'50%'  }}/>
                        </IconButton>
                    </div>
                  </form>
                </div>

        </Box>
      </Fade>      
    </Modal>
  </>
  );
};



