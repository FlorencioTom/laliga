import {useEffect, useState} from 'react';
import { Login } from './Login';
import { Registro } from './Registro';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Auth } from '../Api/Api';
import Cookies from 'js-cookie';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Button from '@mui/material/Button';
import Loader from 'rsuite/Loader';


const MiInfo = () => {
    const [value, setValue] = useState(0);
    const [ tk, setTk ] = useState(null);
    const [equipo, setEquipo] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const token = Cookies.get('access_token');
        if (token) {
          setTk(token); // Asume que tienes un estado `tk` donde lo guardas
          try {
            const respuesta = await Auth();  // Espera a que la promesa se resuelva
            console.log(respuesta.data);  // Imprime la respuesta resuelta
            setEquipo(respuesta.data);
          } catch (error) {
            console.error("Error fetching auth data:", error);
          }
        }
      };
    
      fetchData();  // Llama a la función asíncrona dentro de useEffect
    }, [tk]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const updateToken = (tkn) => {
      setTk(tkn);
      Cookies.set('access_token', tkn);
    }

    const CustomTabPanel = (props) => {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
          </div>
        );
    };

    const handleLogout = () => {
      Cookies.remove('access_token'); 
      setTk(null); 
    };    

    return (
      
      tk ? (
        <>
        <div className='jugadores'>

          <>
            {equipo && (
              <div className='card '>
                <img src={equipo.plantilla.entrenador.foto} alt={equipo.plantilla.entrenador.nombre} />
                <span key={equipo.plantilla.entrenador.nombre}>{equipo.plantilla.entrenador.nombre}</span>
              </div>
            )}
            {equipo &&
              equipo.plantilla.jugadores.map((x, index) => (
                <div className={`card`} key={index}>
                  <img src={x.foto} alt={x.nombre}/>
                  <span>{x.nombre}</span>
                </div>
              ))}
          </>
        
      </div>

        <Button onClick={handleLogout} className='submit clo'variant="contained" endIcon={<PowerSettingsNewIcon />}
        sx={{ 
          backgroundColor: '#FF4A42',  // Color de fondo del botón
          '&:hover': {
            backgroundColor: '#FF4A42',  // Color de fondo al pasar el mouse (hover)
          },
          color: 'white',  // Color del texto
          marginRight: '20px'
        }}
        type="submit"
        ></Button>
        </>
      ) : (
        <div className='miInfo'>
            <Box sx={{ width: '250px'}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                        sx={{
                          '& .MuiTabs-indicator': {
                            backgroundColor: '#FF4A42',  // Cambia el color del borde deslizante (indicator)
                          }
                        }}
                    >
                        <Tab label="Login" sx={{ color: 'gray', '&.Mui-selected': { color: '#FF4A42' } }} />
                        <Tab label="Registro" sx={{ color: 'gray', '&.Mui-selected': { color: '#FF4A42' } }} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Login func={updateToken}></Login>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Registro></Registro>
                </CustomTabPanel>
            </Box>
        </div>   
      )
    )
}

export default  MiInfo;