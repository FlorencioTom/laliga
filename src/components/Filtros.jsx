import {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSliders, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import {getAllTeams} from '../Api/Api';
import Loader from 'rsuite/Loader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import axios from 'axios';
import SimpleBar from 'simplebar-react';

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

export const Filtros = () => {
  const [age, setAge] = useState('');
  const [equipos, setEquipos] = useState('');
  const [nombre, setNombre] = useState('');
  const [dorsal, setDorsal] = useState('');
  const [posicion, setPosicion] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [nacionalidades, setNacionalidades] = useState('');
  const [filtro, setFiltro] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [bandera, setBandera] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getEquipos();
  }, []);

  const getEquipos = async() => {
    try {
      const teams = await getAllTeams();
      //console.log('equipos de filtros', teams);
      setEquipos(teams);

      const paises = [];

      teams.forEach((equipo) => {
        equipo.plantilla.jugadores.forEach((jugador) => {
          if(!paises.includes(jugador.nacionalidad)){
            paises.push(jugador.nacionalidad);
          }
        });
      });

      console.log(paises);

      setNacionalidades(paises);
    } catch (error) {
      console.log(error);
    }finally{
      
    }
  }

  const filtrar = (nombre, posicion, dorsal, nacionalidad) => {
    setLoading(true);

    const resultado = [];
    const paises = [];
  
    equipos.forEach((equipo) => {
      const nombreEquipo = equipo.nombre;

      equipo.plantilla.jugadores.forEach((jugador) => {
        if(nombre != ''){
          if(jugador.nombre && jugador.nombre.toLowerCase().includes(nombre)){
            resultado.push(jugador);
          }
        }

        if(dorsal != ''){
          if(jugador.dorsal && jugador.dorsal == dorsal){
            resultado.push(jugador);
          }
        }

        if(nacionalidad != ''){
          if(jugador.nacionalidad && jugador.nacionalidad.toLowerCase() === nacionalidad.toLowerCase()){
            resultado.push(jugador);
          }
        }

        if(posicion != ''){
          if (posicion === 'delanteros') {
            let palabrasClave = ['extremo izquierda', 'extremo derecha', 'delantero'];
            let pos = jugador.posicion.toLowerCase();
          
            if (palabrasClave.some(p => pos.includes(p))) {
              resultado.push(jugador);
            }
          }
  
          if(posicion === 'centrocampistas') {
            let palabrasClave = ['centrocampista izquierda', 'centrocampista derecha', 'centrocampista centro'];
            let pos = jugador.posicion.toLowerCase();
          
            if (palabrasClave.some(p => pos.includes(p))) {
              resultado.push(jugador);
            }
          }
  
          if (posicion === 'defensas') {
            let palabrasClave = ['lateral izquierda', 'lateral derecha', 'central derecha', 'central izquierda'];
            let pos = jugador.posicion.toLowerCase();
          
            if (palabrasClave.some(p => pos.includes(p))) {
              resultado.push(jugador);
            }
          }

          if(jugador.posicion.toLowerCase() === posicion.toLowerCase()){
            resultado.push(jugador);
          }
        }
      });
    });

    setFiltro(resultado);
    setLoading(false);
  };

  const handleChangePosicion = (event) => {
    setPosicion(event.target.value);
    console.log(event.target.value);
  };

  const handleChangeDorsal = (event) => {
    setDorsal(event.target.value);
    console.log(event.target.value);
  };

  const handleChangeNombre = (event) => {
    setNombre(event.target.value);
    console.log(event.target.value);
  };

  const handleChangeNacionalidad = (event) => {
    setNacionalidad(event.target.value);
    console.log(event.target.value);
  };

  const textFieldStyles = {
    '& .MuiFilledInput-root': {
      backgroundColor: '#f0f0f0', // Color de fondo para el variant "filled"
      '&:focus': {
          backgroundColor: '#fff', // Color de fondo al enfocar
      },
      color: '#FF4A42', // Cambia el color del texto
      '&::after': {
          borderBottomColor: '#FF4A42', // Cambia el color de la línea al enfocar
      },
  },
  '& .MuiInputLabel-root': {
      color: '#FF4A42', // Cambia el color de la etiqueta
      '&.Mui-focused': {
          color: '#FF4A42', // Cambia el color de la etiqueta al enfocar
      },
  },
  '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FF4A42', // Color del borde
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FF4A42', // Color del borde al pasar el mouse
  },
  width: '100px'
  }

  const handleOpen = async (jugador) => {
    console.log(jugador);
    setJugadorSeleccionado(jugador); // Almacenar el jugador seleccionado
    setOpen(true);
    await obtenerBandera(jugador.nacionalidad.toLowerCase()); // Obtener la bandera al abrir el modal
  };

  const handleClose = () => {
    setOpen(false);
    setJugadorSeleccionado(null); // Reiniciar el jugador seleccionado
    setBandera('');
  };

  const obtenerBandera = async (nacionalidad) => {
    try {
      const nacionalidadMin = nacionalidad.toLowerCase();

      const response = await axios.get(`https://restcountries.com/v3.1/all`);
 
      const paisEncontrado = response.data.find(pais => {
        return pais.translations.spa && pais.translations.spa.common.toLowerCase() === nacionalidadMin;
      });

      if(paisEncontrado){
        setBandera(paisEncontrado.flags.png);
      } else {
        console.error('No se encontró el país para la nacionalidad:', nacionalidadMin);
      }
      
    } catch (error) {
      console.error('Error al obtener la bandera:', error);
    }
  };

  return (
    <>
    <section className='filtros'>
          <FontAwesomeIcon className="filtro-i" icon={faSliders} />

          <TextField id="outlined-basic" label="Nombre" variant="filled" sx={textFieldStyles} onChange={handleChangeNombre}/>
          <FormControl sx={{ m: 1, width: 150 }}>
          <InputLabel id="demo-multiple-name-label">Nacionalidad</InputLabel>
          <Select
            input={<OutlinedInput label="Nacionalidad" />}
            labelId="Pais"
            id="demo-simple-select-filled"
            value={nacionalidad}
            onChange={handleChangeNacionalidad}
            sx={{
              '& .MuiFilledInput-root': {
                  backgroundColor: '#f0f0f0', // Color de fondo para el variant "filled"
                  '&:focus': {
                      backgroundColor: '#fff', // Color de fondo al enfocar
                  },
                  color: '#FF4A42', // Cambia el color del texto
                  '&:after': {
                    borderBottomColor: '#FF4A42', // Cambia el color de la línea al enfocar
                  },
              },
              '& .MuiSelect-icon': {
                color: '#FF4A42', // Cambia el color del ícono de selección
              },
              '&:hover .MuiFilledInput-root': {
                  backgroundColor: '#e0e0e0', // Color de fondo al pasar el mouse
              }
          }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {nacionalidades && nacionalidades.map((nacionalidad, index) => (
              <MenuItem key={index} value={nacionalidad}>
                {nacionalidad}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 150 }}>
          <InputLabel id="demo-multiple-name-label">Posicion</InputLabel>
          <Select
            input={<OutlinedInput label="Posicion" />}
            labelId="Posicion"
            id="demo-simple-select-filled"
            value={posicion}
            onChange={handleChangePosicion}
            sx={{
              '& .MuiFilledInput-root': {
                  backgroundColor: '#f0f0f0', // Color de fondo para el variant "filled"
                  '&:focus': {
                      backgroundColor: '#fff', // Color de fondo al enfocar
                  },
                  color: '#FF4A42', // Cambia el color del texto
                  '&:after': {
                      borderBottomColor: '#FF4A42', // Cambia el color de la línea al enfocar
                  },
              },
              '& .MuiSelect-icon': {
                  color: '#FF4A42', // Cambia el color del ícono de selección
              },
              '&:hover .MuiFilledInput-root': {
                  backgroundColor: '#e0e0e0', // Color de fondo al pasar el mouse
              }
          }}
          >
            <MenuItem value={''}>
              <em>None</em>
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

          <TextField id="outlined-basic" label="Dorsal" type="number" variant="filled" sx={textFieldStyles} onChange={handleChangeDorsal} />

          
          <div className="search-circle" onClick={() => filtrar(nombre, posicion, dorsal, nacionalidad)}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="filtro-s"/>
          </div>
        
    </section>
    <br />
    <section className='container-filtro'>
      <SimpleBar className='scroll-filtro'>
        {loading ? (
          // Loader mientras se cargan los datos
          <div className='loader'>
              <Loader size="lg" speed="fast" />
            </div>
          ) : (
            <>
              {filtro &&
                filtro.map((x, index) => (
                  <div className={`card`} key={index}>
                    <img src={x.foto} alt={x.nombre} onClick={() => handleOpen(x)}/>
                    <span>{x.nombre}</span>
                  </div>
                ))}
            </>
        )}
      </SimpleBar>
    </section>
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
                <p>Equipo: {jugadorSeleccionado.ne}</p>
                <p>Edad: {jugadorSeleccionado.nacimiento}</p>
                <p>Dorsal: {jugadorSeleccionado.dorsal}</p>
                <p>Altura: {jugadorSeleccionado.altura}</p>
                <p>Posicion: {jugadorSeleccionado.posicion}</p>
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

  )
}

