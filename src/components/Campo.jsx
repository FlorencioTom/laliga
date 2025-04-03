import axios from 'axios';
import { useEffect, useState } from "react";
import FocusLock from "react-focus-lock";
import { posiciones } from './posiciones';
import campo from '../images/campo.jpg';
import Loader from 'rsuite/Loader';
import "animate.css";


const API_BASE_URL = "https://laligaback-deploy.vercel.app";
  
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default function Campo({equipo}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/equipos/${equipo}`);
        console.log(response.data.data.plantilla['jugadores']);
        setData(response.data.data.plantilla['jugadores']);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [equipo]);

  const posicionaCampo = (jugador) => {
    let posicion = posiciones.find(x => jugador.posicion.toLowerCase() === x.posicion.toLowerCase() );
    console.log(posicion ? posicion.ubicacion : {});
    return posicion ? posicion.ubicacion : {};
  }

  const posicionaHTML = (jugador) => {
    let posicion = posiciones.find(x => jugador.posicion.toLowerCase() === x.posicion.toLowerCase() );
    console.log(posicion ? posicion.tabIndex : {});
    return posicion ? posicion.tabIndex : {};
  }

  return (
    <div className="centro">
      <div className="container-campo">
        <img src={campo}></img>  
        <FocusLock>
        {loading ? (
          // Loader mientras se cargan los datos
          <div className='loader-campo'>
            <Loader size="lg" speed="fast" />
          </div>
        ) : (
          data && data.map((jugador, index) => 
            jugador.titular && (
              <img 
                key={index} 
                tabIndex={posicionaHTML(jugador)} 
                className="jugador-poscion" 
                src={jugador.foto} 
                style={posicionaCampo(jugador)} 
              />
            )
          )
        )}
        </FocusLock>
      </div>
    </div>
  );
}