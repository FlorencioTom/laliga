import axios from 'axios';
import { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { posiciones } from './posiciones';
import campo from '../images/campo.jpg';
import Loader from 'rsuite/Loader';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import "animate.css";


const API_BASE_URL = "https://laligaback-deploy.vercel.app";
  
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default function Campo({jugadores, enviarJugador, cambioPosicionTitulares, vaciarJugador}) {
  const [data, setData] = useState(jugadores);
  const [loading, setLoading] = useState(true);
  const [cambioJugador, setCambioJugador] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setLoading(false);
    };
    fetchData();
  }, [data, cambioJugador, jugadores]);

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
    <div className="centro">
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
                // <i class="fa-solid fa-arrow-rotate-right"></i>
              )
            )
          )}
        </FocusLock>
      </div>
    </div>
  );
}