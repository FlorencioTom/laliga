import React, { useEffect, useState } from 'react';
import { getAllPlayersByTeam, addPlayer, addCoach } from '../Api/Api';
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',           
  flexDirection: 'column',   
  alignItems: 'center',      
  textAlign: 'center',      
};

export const Jugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [entrenador, setEntrenador] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [bandera, setBandera] = useState('');

  const [open, setOpen] = useState(false);
  const [openCoach, setOpenCoach] = useState(false);

  const handleOpen = async (jugador) => {
    console.log(jugador);
    setJugadorSeleccionado(jugador); // Almacenar el jugador seleccionado
    setOpen(true);
    await obtenerBandera(jugador.nacionalidad.toLowerCase()); // Obtener la bandera al abrir el modal
  };

  const handleOpenCoach = async (coach) => {
    console.log(coach);
    setJugadorSeleccionado(coach); // Almacenar el jugador seleccionado
    setOpenCoach(true);
    await obtenerBandera(coach.nacionalidad.toLowerCase()); // Obtener la bandera al abrir el modal
  };

  const handleClose = () => {
    setOpen(false);
    setJugadorSeleccionado(null); // Reiniciar el jugador seleccionado
    setBandera('');
  };

  const handleCloseCoach = () => {
    setOpenCoach(false);
    setJugadorSeleccionado(null); // Reiniciar el jugador seleccionado
    setBandera('');
  };

  const {ids} = useParams();

  useEffect(() => {
    console.log('ID del equipo en Jugadores:', ids);
    if (ids) {
      //getJugadores(idEquipo);
      getJugadores(ids);
    }
  }, [ids]);

  const getJugadores = async (value) => {
    setLoading(true); // Iniciar el loader cuando comienza la carga
    try {
      const respuesta = await getAllPlayersByTeam(value);
      //console.log('Respuesta de jugadores:', respuesta.plantilla.jugadores);
      setJugadores(respuesta.plantilla.jugadores);
      setEntrenador(respuesta.plantilla.entrenador);
      
    } catch (error) {
      console.error('Error al obtener jugadores:', error);
    } finally {
      setLoading(false); // Ocultar el loader cuando termina la carga
    }
  };

  const obtenerBandera = async (nacionalidad) => {
    try {
      // Convertir la nacionalidad a minúsculas
      const nacionalidadMin = nacionalidad.toLowerCase();
  
      // Hacer la solicitud a la API para obtener todos los países
      const response = await axios.get(`https://restcountries.com/v3.1/all`);
  
      // Buscar la bandera del país cuya traducción coincida con la nacionalidad
      const paisEncontrado = response.data.find(pais => {
        return pais.translations.spa && pais.translations.spa.common.toLowerCase() === nacionalidadMin;
      });
  
      if (paisEncontrado) {
        setBandera(paisEncontrado.flags.png); // Establecer la URL de la bandera
      } else {
        console.error('No se encontró el país para la nacionalidad:', nacionalidadMin);
      }
    } catch (error) {
      console.error('Error al obtener la bandera:', error);
    }
  };

  const fichar = async(jugador) => {
    const token = Cookies.get('access_token');
    /*console.log('-------------------------------------');
    for (const [key, value] of Object.entries(jugador)) {
      console.log(`Tipo de ${key}:`, typeof value); // 
    }
    console.log('-------------------------------------'); */
    if(token){
      //console.log(jugador);
      //const info = {token, jugador};
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
    }
  }

  const ficharCoach = async(coach) => {
    const token = Cookies.get('access_token');
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
    }
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
          </>
        )}
         </SimpleBar>
      </div>
      <Campo equipo={ids}></Campo>
    </div>
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition

    >
      <Fade in={open}>
        <Box sx={style}>
            {jugadorSeleccionado ? (
              <>
                <h2 id="transition-modal-title" style={{ marginTop: '0px' }}>{jugadorSeleccionado.nombre}</h2>
                <img src={jugadorSeleccionado.foto} alt={jugadorSeleccionado.nombre} style={{ width: '60px' }} />
                <p>Posición: {jugadorSeleccionado.posicion}</p>
                <p>Edad: {jugadorSeleccionado.nacimiento}</p>
                <p>Dorsal: {jugadorSeleccionado.dorsal}</p>
                <p>Altura: {jugadorSeleccionado.altura}</p>
                <div style={{display:'flex', gap:'10px', alignItems: 'center' }}>
                  País: {jugadorSeleccionado.nacionalidad}
                  <img src={bandera} style={{ width: '20px' }} />
                </div>
                {/* Aquí puedes añadir más información del jugador */}
                <div style={{display:'flex', gap:'10px', marginTop:'30px'}}>
                  <Button  variant="contained" onClick={handleClose}>Cerrar</Button>
                  <Button variant="contained" sx={{ 
                    backgroundColor: '#FF4A42',  // Color de fondo del botón
                    '&:hover': {
                      backgroundColor: '#FF4A42',  // Color de fondo al pasar el mouse (hover)
                    },
                    color: 'white',  // Color del texto
                  }} onClick={() => fichar(jugadorSeleccionado)}>Fichar</Button>
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

    >
      <Fade in={openCoach}>
        <Box sx={style}>
            {jugadorSeleccionado ? (
              <>
                <h2 id="transition-modal-title" style={{ marginTop: '0px' }}>{jugadorSeleccionado.nombre}</h2>
                <img src={jugadorSeleccionado.foto} alt={jugadorSeleccionado.nombre} style={{ width: '60px' }} />
                <p>Edad: {jugadorSeleccionado.nacimiento}</p>
                <div style={{display:'flex', gap:'10px', alignItems: 'center' }}>
                  País: {jugadorSeleccionado.nacionalidad}
                  <img src={bandera} style={{ width: '20px' }} />
                </div>
                {/* Aquí puedes añadir más información del jugador */}
                <div style={{display:'flex', gap:'10px', marginTop:'30px'}}>
                  <Button  variant="contained" onClick={handleCloseCoach}>Cerrar</Button>
                  <Button variant="contained" onClick={() => ficharCoach(jugadorSeleccionado)} sx={{ 
                    backgroundColor: '#FF4A42',  // Color de fondo del botón
                    '&:hover': {
                      backgroundColor: '#FF4A42',  // Color de fondo al pasar el mouse (hover)
                    },
                    color: 'white',  // Color del texto
                  }}>Fichar</Button>
                  
                </div>
                
              </>
            ) : (
              <p>Cargando información del jugador...</p>
            )}
        </Box>
      </Fade>
    </Modal>
  </>
  );
};



