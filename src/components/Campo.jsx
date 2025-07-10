import axios from 'axios';
import { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { posiciones } from './posiciones';
import campo from '../images/campo.jpg';
import Loader from 'rsuite/Loader';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { Virtual } from 'swiper/modules';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {Controller, useForm} from 'react-hook-form';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import InputLabel from '@mui/material/InputLabel';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import Swiper styles
import 'swiper/css/virtual';
import "animate.css";

const API_BASE_URL = "https://laligaback-deploy.vercel.app";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const alineaciones = [
  '4-3-3',
  '4-4-2'
];
  
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw'  
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};


export default function Campo({jugadores, enviarJugador, cambioPosicionTitulares, vaciarJugado, estadio, idTeam}) {
  const [data, setData] = useState(jugadores);
  const [loading, setLoading] = useState(true);
  const [cambioJugador, setCambioJugador] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({open: false, Transition: Slide});
  const { control, handleSubmit } = useForm({
    defaultValues: {
      Alineacion: '4-3-3', // valor inicial
    },
  });
  const [alineacion, setAlineacion] = useState(null)
  //const [estadio, setEstadio] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoading(false);
      //setEstadio(estadio);
    };
    fetchData();
  }, [data, cambioJugador, jugadores, alineacion]);

  const handleClose = () => {
    setOpen(false);
    closeSnack();
  };

  const handleOpen = async () => {
    setOpen(true);
  };

  const posicionaCampo = (jugador) => {
    let posicion = posiciones.find(x => jugador.posicion.toLowerCase() === x.posicion.toLowerCase() );
    return posicion ? posicion.ubicacion : {};
  }

  const posicionaHTML = (jugador) => {
    let posicion = posiciones.find(x => jugador.posicion.toLowerCase() === x.posicion.toLowerCase() );
    return posicion ? posicion.tabIndex : {};
  }

  const cambio = (jugador) => {
    if (cambioJugador === jugador) {
      // Si haces clic en el mismo jugador, lo deseleccionas
      setCambioJugador(null);
      enviarJugador(null);
    } else {
      // Si ambos jugadores son titulares
      if (cambioJugador && cambioJugador.titular && jugador.titular) {
        cambioPosicionTitulares(jugador, cambioJugador)
        // console.log('Ambos jugadores seleccionados son titulares');
        // var nuevosJugadores = jugadores.map(x => {
        //   if (x.nombre === cambioJugador.nombre) {
        //     return { ...x, posicion: jugador.posicion };
        //   }
        //   if (x.nombre === jugador.nombre) {
        //     return { ...x, posicion: cambioJugador.posicion };
        //   }
        //   return x; 
        // });
        // setData(nuevosJugadores);
        setCambioJugador(null);
        enviarJugador(null);
      } else {
        // Si no son ambos titulares, puedes seleccionar al nuevo jugador
        setCambioJugador(jugador);
        enviarJugador(jugador);
      }
    }
  };

  const closeSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return; // Evita que se cierre si se hace click fuera
    }
    setSnackbar({open:false})
  }

  const openSnack = () => {
    setSnackbar({open:true})
  }

  const cambioAlineacion = (alineacion) => {
    console.log('Alineacion seleccionada: ', alineacion);
    setAlineacion(alineacion);
  }

  return (
    <>
      <div className="centro">
        <div style={{display:'flex', alignItems:'center'}}>
          <Button className='submit log estadio'variant="contained"
            sx={{ backgroundColor: '#FF4A42','&:hover': {backgroundColor: '#FF4A42'},color: 'white', width:'auto'}}
            onClick={() => handleOpen()}
            >
            {estadio && estadio.nombre}
          </Button>
          <FormControl sx={{ m: 1, width: '140px', height:'40px' }} variant="outlined">
            <InputLabel 
              htmlFor="outlined-adornment-usuario"
              sx={{
                color: '#FF4A42 !important',
                '&.Mui-focused': { color: '#FF4A42 !important' },
                '&.MuiFormLabel-root': { color: '#FF4A42 !important' },
                '&.MuiInputLabel-root': { color: '#FF4A42 !important' },
                '&.MuiInputLabel-shrink': { color: '#FF4A42 !important' },
                '&:hover': { color: '#FF4A42 !important' }
              }}
          >
            Alineaciones
          </InputLabel>
          <Controller
            name="Alineacion"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
            <Select
              {...field}
              value={field.value || ''}
              input={<OutlinedInput label="Alineaciones" 
              sx={{height:'40px' ,color:'#FF4A42','&.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
                '&:hover .MuiOutlinedInput-notchedOutline': {borderColor: '#FF4A42'},
              }}/>}
              labelId="Alineaciones"
              id="demo-simple-select-filled"
              onChange={(event) => {
                field.onChange(event);
                cambioAlineacion(event.target.value);
              }}
            >
              <MenuItem>
                None
              </MenuItem>
              {alineaciones && alineaciones.map((alineacion) => (
                <MenuItem key={alineacion} value={alineacion}>
                  {alineacion}
                </MenuItem>
              ))}
            </Select>
          )}/>
          </FormControl>
        </div>
        <div className="container-campo">
          <img src={campo}></img>  
          <FocusLock autoFocus={false} disabled={true}>
            {loading ? (
              <div className='loader-campo'>
                <Loader size="lg" speed="fast" />
              </div>
            ) : (
              jugadores && jugadores.map((jugador, index) => 
                jugador.titular && (
                  <img 
                  key={index} 
                  tabIndex={posicionaHTML(jugador)} 
                  className={`jugador-poscion ${cambioJugador === jugador ? "jugador-seleccionado" : ""}`}
                    src={jugador.foto} 
                    style={posicionaCampo(jugador)} 
                    onClick={() => {
                      cambio(jugador);
                    }}
                    alt={jugador.nombre}
                    />
                )
              )
            )}
          </FocusLock>
        </div>
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
      <Fade in={open} onEnter={() => openSnack()} onExit={() => closeSnack()}>
        <Box sx={style}>
            {estadio ? (
              <>
                <Snackbar open={snackbar.open}
                  onClose={closeSnack}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                  key='snackbar'>
                  <Alert
                    onClose={closeSnack}
                    variant="info"
                    icon={false}
                    sx={{ width: '100%' }}
                  >
                    <audio src={`/sounds/${idTeam}.mp3`} autoPlay controls onLoadedMetadata={(e) => {e.target.volume = 0.5}}/>
                  </Alert>
                </Snackbar>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1} // Muestra 1 slide a la vez, puedes usar 2 si quieres ambas visibles
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                  }}
                  loop={true}
                >
                  <SwiperSlide
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '60vh'
                    }}>
                    <img 
                      src={estadio.fotos['dentro']} 
                      alt="Interior del estadio" 
                      style={{ width: '100%', height: 'auto'}} 
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img 
                      src={estadio.fotos['fuera']} 
                      alt="Exterior del estadio" 
                      style={{ width: '100%', height: 'auto'}} 
                    />
                  </SwiperSlide>
                </Swiper>
              </>
            ) : (
              <p>Cargando fotos del estadio...</p>
            )}
        </Box>
      </Fade>
    </Modal>
    </>
  );
}