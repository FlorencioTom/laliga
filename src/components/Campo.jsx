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
import { Virtual } from 'swiper/modules';
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import Swiper styles
import 'swiper/css/virtual';
import "animate.css";

const API_BASE_URL = "https://laligaback-deploy.vercel.app";
  
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


export default function Campo({jugadores, enviarJugador, cambioPosicionTitulares, vaciarJugado, estadio}) {
  const [data, setData] = useState(jugadores);
  const [loading, setLoading] = useState(true);
  const [cambioJugador, setCambioJugador] = useState(null);
  const [open, setOpen] = useState(false);
  //const [estadio, setEstadio] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoading(false);
      //setEstadio(estadio);
    };
    fetchData();
  }, [data, cambioJugador, jugadores]);

  const handleClose = () => {
    setOpen(false);
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

  return (
    <>
      <div className="centro">
        <Button className='submit log estadio'variant="contained"
          sx={{ backgroundColor: '#FF4A42','&:hover': {backgroundColor: '#FF4A42'},color: 'white', width:'auto'}}
          onClick={() => handleOpen()}
          >
          {estadio && estadio.nombre}
        </Button>
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
      <Fade in={open}>
        <Box sx={style}>
            {estadio ? (
              <>
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1} // Muestra 1 slide a la vez, puedes usar 2 si quieres ambas visibles
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
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