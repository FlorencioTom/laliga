import { SetStateAction, useEffect, useState } from 'react';
import {Equipos} from './components/Equipos';
import { Jugadores } from './components/Jugadores';
import laliga from './images/laliga-2.png';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { BrowserRouter as Router, Routes, Route, useNavigate, Link} from 'react-router-dom';
import { Filtros } from './components/Filtros';
import MiInfo from './components/MiInfo';
import Cookies from 'js-cookie';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import Button from '@mui/material/Button';
import { useAuth } from './components/Contexto';

export const App = () => {

  const [id, setId] = useState(null);
  const [prevItem, setPrevItem] = useState(null); // Estado para manejar itemPrevio
  const NotFound = () => <h2>Error 404: Página no encontrada</h2>;
  const {setToken, setEquipo, equipo, token} = useAuth();

  

  useEffect( () => {
    
    const tk = Cookies.get('access_token') || null;
    setToken(tk);
    
  }, [id, token]);

  const IdEquipo = (value: SetStateAction<null>) => {
    //setId(value);
    //navigate(`/equipo/${value}`);
    //console.log("ID del equipo seleccionado:", value);
  }

  const noPrevio = () => {
    //setPrevItem();
  }

  const handleReset = () => {
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
      item.classList.remove('click-item-previo');
    });
  }

  const handleLogout = () => {
    Cookies.remove('access_token'); 
    setToken(null); 
  }; 

  return (
    <Router>
      <div className='total-frame'>
        <nav className='nav'>
          <Link to="/" onClick={handleReset}>
            <img className='logo' src={laliga} alt='laliga-mini-logo' />
          </Link>
          {token && (
            <Button
              onClick={handleLogout}
              className='submit clo'
              variant="contained"
              sx={{
                width: '40px',
                height: '40px',
                backgroundColor: '#FF4A42',
                '&:hover': {
                  backgroundColor: '#FF4A42',
                },
                color: 'white',
                marginRight: '20px',
              }}
              type="submit"
            >
              <PowerSettingsNewIcon />
            </Button>
          )}
        </nav>
        <section className='section'>
          <SimpleBar className='scroll-equipos'>
            <Equipos passId={IdEquipo}/>
          </SimpleBar>
          <div className='container-plantilla'>
              {/* <SimpleBar className='scroll-equipos'> */}
                  <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Filtros/>} />
                    <Route path="/equipo/:ids" element={<Jugadores origenMiEquipo={false}/>} />
                    <Route path="/miequipo" element={<MiInfo/>} />
                  </Routes>
              {/* </SimpleBar> */}
          </div>
        </section>  
      </div>
    </Router>
  )
}

export default App;

