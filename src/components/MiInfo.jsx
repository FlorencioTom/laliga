import {useEffect, useState} from 'react';
import { Login } from './Login';
import { Registro } from './Registro';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Auth } from '../Api/Api';
import Cookies from 'js-cookie';
import {Jugadores} from './Jugadores';
import { useAuth } from './Contexto';
import Loader from 'rsuite/Loader';

const MiInfo = () => {
    const [value, setValue] = useState(0);
    const {setToken, setEquipo, equipo, token} = useAuth();
    const [ tk, setTk ] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const token = Cookies.get('access_token');
        if (token) {
          setTk(token); // Asume que tienes un estado `tk` donde lo guardas
          try {
            //const respuesta = await Auth();  // Espera a que la promesa se resuelva
            //console.log(respuesta.data);  // Imprime la respuesta resuelta
            //setEquipo(respuesta.data);
          } catch (error) {
            console.error("Error fetching auth data:", error);
          }
        }
      };
    
      fetchData();  // Llama a la función asíncrona dentro de useEffect
    }, [token]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const updateToken = (tkn, equipo) => {
      setTk(tkn);
      setToken(tkn);
      setEquipo(equipo);
      Cookies.set('access_token', tkn);
      console.log('eQUIPO IMPRESO DESDE MI iNFO: ', equipo); //Guardar mi equipo en el contexto
      
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
      setToken(null);
      setTk(null); 
    };    

    return (
      
      token ? (
        <>
          <Jugadores origenMiEquipo={true}></Jugadores>
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