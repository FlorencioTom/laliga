import axios from 'axios';
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import FocusLock from "react-focus-lock";
import { alineaciones } from './alineaciones';
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
import { motion, AnimatePresence } from 'framer-motion';
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {uploadTeamAnthemStadiumToCloudinary} from '../Api/Api';
import {uploadNewAnthemOrStadiumToCloudinary} from '../Api/Api';
import { useAuth } from './Contexto';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StadiumIcon from '@mui/icons-material/Stadium';
import Typography from '@mui/material/Typography';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

// Import Swiper styles
import 'swiper/css/virtual';
import "animate.css";
import { Padding } from '@mui/icons-material';
import { TextAlignment } from '@cloudinary/url-gen/qualifiers';

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

const alineacionesNombre = [
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

const styleNoPics = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor:'white',
  borderRadius:'20px',
  display:'flex',
  justifyContent:'space-between',
  cursor:'pointer',
  padding:'20px',
  gap:'20px'
};

const styleNoPics2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor:'white',
  borderRadius:'20px',
  display:'flex',
  justifyContent:'center',
  cursor:'pointer',
  padding:'20px',
  gap:'20px'
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

const acceptMap = {
  estadio: ".jpg,.jpeg,.png,image/jpeg,image/png",
  himno: ".mp3,audio/mpeg",
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

const Campo = forwardRef(({
  nombre,
  jugadores,
  enviarJugador,
  cambioPosicionTitulares,
  vaciarJugado,
  estadio,
  idTeam,
  himno,
  onUpdateStadiumAnthem,
  origen
}, ref) => {
  const {token, setEquipo, equipo, animacion} = useAuth();
  const [data, setData] = useState(jugadores);
  const [info, setInfo] = useState({himno:false, nombreAudio:null, estadio:false, nombreImagen:null}); //aqui almacenamos si el equipo tiene himno y estadio
  const [newFile, setNewFile] = useState({file:false, nameFile:null, wichFile:null}); //aqui almacenamos si el equipo tiene un nuevo himno o estadio
  const [loading, setLoading] = useState(true);
  const [cambioJugador, setCambioJugador] = useState(null);
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPic, setOpenPic] = useState(false); //Este estado es para cuando no hay imagenes de estadio
  const [snackbar, setSnackbar] = useState({open: false, Transition: Slide});
  const [notificacion, setNotificacion] = useState({open: false, message: '', severity: '', Transition: Slide}); //es un snackbar
  const [titulares, setTitulares] = [{}];
  const [alineacion, setAlineacion] = useState('4-3-3');
  const [inputEstadio, setInputEstadio] = useState(false);
  const [inputHimno, setInputHimno] = useState(false);
  const [openUpdateFiles, setOpenUpdateFiles] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const {register, handleSubmit, control, setValue, getValues, trigger
  } = useForm({
    defaultValues: {
      Alineacion: "4-3-3"
    }
  });
  const {register:registerNewFile, handleSubmit:handleSubmitNewFile, control:controlNewFile} = useForm();

  useImperativeHandle(ref, () => ({
    jugadorCambioDeVueltaANull,
  }));

  useEffect(() => {
    const precargarImagenes = async () => {
      setLoading(true);
      const imagenesTitulares = jugadores
        .filter(j => j.titular && j.foto)
        .map(jugador => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = jugador.foto;
            img.onload = () => resolve(jugador.foto);
            img.onerror = () => resolve(jugador.foto); // Resuelve incluso si falla la imagen para no bloquear
          });
        });

      try {
        await Promise.all(imagenesTitulares);
      } catch (error) {
        console.error('Error cargando imágenes:', error);
      }
      setLoading(false);
    };
    precargarImagenes();
    setRenderKey(k => k + 1);
  }, [jugadores, alineacion]);

  // CADA VEZ QUE CAMBIA EL EQUIPO HAY QUE PONER LA ANIMACION A FALSE DE MUEVO

  const handleClose = () => {
    setOpen(false);
    setOpenPic(false);
    setOpenUpdateFiles(false);
    setNewFile({file:false, nameFile:null});
    closeSnack();
  };

  const handleOpenUpdateFiles = async(wichFile) => {
    setOpenUpdateFiles(true);
    setNewFile({file:false, nameFile:null, wichFile:wichFile})
  }

  const handleOpen = async () => {
    if (estadio.fotos['fuera'] === "" && estadio.fotos['dentro'] === "" ){
      //console.log(estadio.fotos.dentro, estadio.fotos.fuera);
      console.log("No hay fotos");
      setOpenPic(true);
    }else{
      console.log("hay fotos");
      console.log("Este es el himno: ",himno);
      setOpen(true);
    }
  };

  const posicionaCampo = (jugador) => {
    //console.log('posicionar jugador en alinacion: '+ alineacion);
    const alineacionActual = alineaciones.find(a => a.nombre === alineacion);
    //console.log('Alineacion actual: '+ alineacionActual);
    const posicion = alineacionActual?.posiciones.find(
      x => jugador.posicion.toLowerCase() === x.posicion.toLowerCase()
    );
    return posicion ? posicion.ubicacion : {};
  };

  const posicionaHTML = (jugador) => {
    const alineacionActual = alineaciones.find(a => a.nombre === alineacion);
    const posicion = alineacionActual?.posiciones.find(
      x => jugador.posicion.toLowerCase() === x.posicion.toLowerCase()
    );
    return posicion ? posicion.tabIndex : {};
  };

  const cambio = (jugador) => {
    if (cambioJugador === jugador) {
      // Si haces clic en el mismo jugador, lo deseleccionas
      setCambioJugador(null);
      enviarJugador(null);
    } else {
      // Si ambos jugadores son titulares
      if (cambioJugador && cambioJugador.titular && jugador.titular) {
        cambioPosicionTitulares(jugador, cambioJugador);
        setCambioJugador(null);
        enviarJugador(null);
      } else {
        setCambioJugador(jugador);
        enviarJugador(jugador);

        //setCambioJugador(null);
        console.log('jugador enviado');
      }
    }
  };

  const jugadorCambioDeVueltaANull = () => {
    setCambioJugador(null);
  }

  const handleNotificacion = (mensaje, severity) => {
    setNotificacion({ open: true, message: mensaje, severity: severity});
  };

  const closeNotificaion = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotificacion({ open: false, message: '', severity: ''});
  }

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

  const onSubmit = async(data) => {
    console.log(data);

    if(info.estadio && info.himno){
      const response = await uploadTeamAnthemStadiumToCloudinary(token, data, nombre); 
      if(response.status == 200){
        handleClose();
        handleNotificacion('Enhorabuena! ya tienes nuevo himno y estadio', 'success');
        onUpdateStadiumAnthem(response.himno, response.estadio);
      }
      console.log(response); 
    }else{
      handleNotificacion('Has de seleccionar una foto y un himno para tu equipo', 'warning');
    }
  }

  const onSubmitNewFile = async(data) => {

    const response = await uploadNewAnthemOrStadiumToCloudinary(token, data, newFile.wichFile, nombre); 
    console.log(data, response, nombre);
    if(response.status === 200){
      handleClose();
      handleNotificacion(`Enhorabuena! ya tienes nuevo ${newFile.wichFile}`, 'success');
      //tengo que actualizar en el front el estado del usuario, para no tener que recargar la pagina
      setEquipo(response.user);
      console.log(response.user);
    }
  }

  const actualizaInfo = (info, e) => {
    //Esto es para actualizar solo una propiedad del estado
    console.log(e)
    if(info == 'estadio'){
      setInfo((prev) => ({
        ...prev,
        estadio: true,
        nombreImagen:e.target.files?.[0]?.name || null                                          
      }));
      //setInputEstadio(!!(e.target.files && e.target.files.length > 0));
    }
    if(info == 'himno'){
      setInfo((prev) => ({
        ...prev,
        himno: true,
        nombreAudio:e.target.files?.[0]?.name || null
      }));
      //setInputHimno(!!(e.target.files && e.target.files.length > 0));
    }
  }

  const updateNewFile = (e) => {
    //Esto es para actualizar solo una propiedad del estado
    console.log(e)
    setNewFile((prev) => ({
      ...prev,
      file: true,
      nameFile:e.target.files?.[0]?.name || null                                          
    }));
  }

  return (
    <>    
      <Snackbar open={notificacion.open}
        autoHideDuration={4000}
        onClose={closeNotificaion}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        key='snackbar'>
          <Alert
            onClose={closeNotificaion}
            severity={notificacion.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notificacion.message}
          </Alert>
      </Snackbar>
      <div className="centro">
        <div style={{display:'flex', alignItems:'center'}}>
          {token !== null && origen === true && himno?.length > 0 && estadio?.fotos?.dentro?.length > 0 &&  (
            <div style={{display:'flex', gap:'10px', marginRight:'20px'}}>
              
              <IconButton onClick={() => handleOpenUpdateFiles('himno')} component="span" sx={{
                    backgroundColor: '#ff4b4223',
                    borderRadius: '50%',
                    transition: '0.2s',
                    '&:hover': {
                      backgroundColor: '#ff4b4254',
                      transform: 'scale(1.1)',
                      '& .MuiSvgIcon-root': {
                        color: '#FF4A42',
                      }
                    },
                  }}>
                <MusicNoteIcon
                  sx={{
                    fontSize: 30,
                    color:'#ff4b429a'
                  }}
                />
              </IconButton>
              <IconButton onClick={() => handleOpenUpdateFiles('estadio')} component="span" sx={{
                    backgroundColor: '#ff4b4223',
                    borderRadius: '50%',
                    transition: '0.2s',
                    '&:hover': {
                      backgroundColor: '#ff4b4254',
                      transform: 'scale(1.1)',
                      '& .MuiSvgIcon-root': {
                        color: '#FF4A42',
                      }
                    },
                  }}>
                <StadiumIcon
                  sx={{
                    fontSize: 30,
                    color:'#ff4b429a'
                  }}
                />
              </IconButton>
            </div>
          )}
          <Button className='submit log estadio'variant="contained"
            sx={{ backgroundColor: '#FF4A42','&:hover': {backgroundColor: '#FF4A42'},color: 'white', width:'auto'}}
            onClick={() => handleOpen()}
            >
            {estadio && 'Estadio'}
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
              {alineacionesNombre && alineacionesNombre.map((alineacion) => (
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
            <AnimatePresence mode="wait">
              <motion.div
                             // cambia este valor cuando cambias de equipo
                variants={item}
                initial="hidden"
                animate="show"
              >
                {jugadores
                  .filter((jugador) => jugador.titular)
                  .map((jugador) => (
                    <motion.img
                      key={jugador.nombre}
                      layout
                      variants={item}
                      whileHover={{
                        scale: 0.9,
                        transition: { duration: 0.3 },
                      }}
                      transition={{ duration: 0.25 }}
                      tabIndex={posicionaHTML(jugador)}
                      className={`jugador-poscion ${
                        cambioJugador === jugador ? "jugador-seleccionado" : ""
                      }`}
                      src={jugador.foto}
                      style={posicionaCampo(jugador)}
                      onClick={() => cambio(jugador)}
                      alt={jugador.nombre}
                    />
                  ))}
              </motion.div>
            </AnimatePresence>
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
                    <audio src={himno} autoPlay controls onLoadedMetadata={(e) => {e.target.volume = 0.5}}/>
                  </Alert>
                </Snackbar>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1} // Muestra 1 slide a la vez, puedes usar 2 si quieres ambas visibles `/sounds/${idTeam}.mp3`
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
                      height: '100vh'
                    }}>
                    <img 
                      src={estadio.fotos['dentro']} 
                      alt="Interior del estadio" 
                      style={{ width: '100%', height: '100%', objectFit:'contain'}} 
                    />
                  </SwiperSlide>
                  <SwiperSlide>
                    <img 
                      src={estadio.fotos['fuera']} 
                      alt="Exterior del estadio" 
                      style={{ width: '100%', height: '100%', objectFit:'contain'}} 
                    />
                  </SwiperSlide>
                </Swiper>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '10%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1000,
                      bgcolor: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      pointerEvents: 'none',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      {`${estadio.nombre}, ${estadio.ciudad}`}
                    </Typography>
                  </Box>
              </>
            ) : (
              <p>Cargando fotos del estadio...</p>
            )}
        </Box>
      </Fade>
    </Modal>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openPic}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={openPic} onEnter={() => openSnack()} onExit={() => closeSnack()}>
        <Box sx={styleNoPics}>
          <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleSubmit(onSubmit)}>
            <div style={{display:'flex' }}>
              <FormControl variant="outlined">
                <IconButton disabled={!info?.estadio} component="span" sx={{width: 40, height: 40, borderRadius: '50%', display:'flex', justifyContent:'center'}}>
                  <CancelIcon
                    onClick={() => {
                      setInfo((prev) => ({
                        ...prev,
                        estadio: false,
                        nombreImagen:null                                           
                      }));
                    }}
                    sx={{
                      fontSize: 30,
                      color: info?.estadio ? '#ff0d00ff' : '#e6a4a16b',
                      transition: '0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
              </IconButton> 
                <label htmlFor="fotos-estadio">
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <IconButton component="span">
                      <ImageIcon
                        sx={{
                          fontSize: 100,
                          color: info.estadio ? '#FF4A42' : '#e6a4a16b',
                          transition: '0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            color: info.estadio ? '#ff8b85b9' : '#e6a4a16b',
                          },
                        }}
                      />
                    </IconButton>
                    <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize:'10px' }}>{info?.nombreImagen || 'Selecciona estadio'}</span>
                  </div>
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  id="fotos-estadio"
                  style={{ display: 'none' }}
                    {...register("foto", {
                      required: false,
                      onChange: (e) => {
                        actualizaInfo('estadio', e);
                        return e;
                      }
                    })}
                />
              </FormControl>
              <FormControl variant="outlined">
                <IconButton disabled={!info?.himno} component="span" sx={{width: 40, height: 40, borderRadius: '50%', padding: 0}}>
                  <CancelIcon
                    onClick={() => {
                      setInfo((prev) => ({
                        ...prev,
                        himno: false,
                        nombreAudio:null,                                       
                      }));
                    }}
                    sx={{
                      fontSize: 30,
                      color: info?.himno ? '#ff0d00ff' : '#e6a4a16b',
                      transition: '0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
                </IconButton>
                <label htmlFor="himno">
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <IconButton component="span">
                      <AudioFileIcon
                        sx={{
                          fontSize: 100,
                          color: info.himno ? '#FF4A42' : '#e6a4a16b',
                          transition: '0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            color: info.himno ? '#ff8b85b9' : '#e6a4a16b',
                          },
                        }}
                      />
                    </IconButton>
                    <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize:'10px'}}>{info?.nombreAudio || 'Selecciona audio'}</span>
                  </div>
                </label>
                <input
                  type="file"
                  accept=".mp3,audio/mpeg"
                  id="himno"
                  style={{ display: 'none' }}
                    {...register("himno", {              
                      required: false,
                      onChange: (e) => { 
                        actualizaInfo('himno', e);
                        return e;
                      }
                    })}
                />
              </FormControl>
            </div>
            <Button className='submit log estadio'variant="contained" type="submit" disabled={!(info.estadio && info.himno)}
              sx={{ marginTop:'15px', backgroundColor: '#FF4A42','&:hover': {backgroundColor: '#FF4A42'},color: 'white', width:'auto'}}>
              Enviar archivos
            </Button>
          </form>
        </Box>   
      </Fade>
    </Modal>
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openUpdateFiles}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={openUpdateFiles} onEnter={() => openSnack()} onExit={() => closeSnack()}>
        <Box sx={styleNoPics}>
          <form style={{display:'flex', flexDirection:'column'}} onSubmit={handleSubmitNewFile(onSubmitNewFile)}>
            <div style={{display:'flex', justifyContent:'center'}}>
              <FormControl variant="outlined" sx={{display:'flex', justifyContent:'center'}}>
                <IconButton disabled={!newFile?.file} component="span" sx={{width: 40, height: 40, borderRadius: '50%', display:'flex', justifyContent:'center'}}>
                  <CancelIcon
                    onClick={() => {
                      setNewFile((prev) => ({
                        ...prev,
                        file: false,
                        nameFile:null                                           
                      }));
                    }}
                    sx={{
                      fontSize: 30,
                      color: newFile?.file ? '#ff0d00ff' : '#e6a4a16b',
                      transition: '0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  />
              </IconButton> 
                <label htmlFor="new-file">
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <IconButton component="span">
                      {newFile?.wichFile === "estadio" ? (
                        <StadiumIcon
                          sx={{
                            fontSize: 100,
                            color: newFile?.file ? '#FF4A42' : '#e6a4a16b',
                            transition: '0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              color: newFile?.file ? '#ff8b85b9' : '#e6a4a16b',
                            },
                          }}
                        />
                      ) : (
                        <MusicNoteIcon
                          sx={{
                            fontSize: 100,
                            color: newFile?.file ? '#FF4A42' : '#e6a4a16b',
                            transition: '0.2s',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              color: newFile?.file ? '#ff8b85b9' : '#e6a4a16b',
                            },
                          }}
                        />
                      )}
                    </IconButton>
                    <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize:'10px' }}>{newFile?.nameFile || 'Selecciona archivo'}</span>
                  </div>
                </label>
                <input
                  type="file"
                  accept={acceptMap[newFile?.wichFile]}
                  id="new-file"
                  style={{ display: 'none' }}
                    {...registerNewFile("file", {
                      required: false,
                      onChange: (e) => {
                        updateNewFile(e);
                        return e;
                      }
                    })}
                />
              </FormControl>
            </div>
            <Button className='submit log estadio'variant="contained" type="submit" disabled={!(newFile?.file)}
              sx={{ marginTop:'15px', backgroundColor: '#FF4A42','&:hover': {backgroundColor: '#FF4A42'},color: 'white', width:'auto'}}>
              Actualizar {newFile.wichFile}
            </Button>
          </form>
        </Box>   
      </Fade>
    </Modal>
    </>
  );
});

export default Campo;