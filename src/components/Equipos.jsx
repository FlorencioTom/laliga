import {useEffect, useState } from 'react';
import {getAllTeams} from '../Api/Api';
import Item from './Item';
import Skeleton from '@mui/material/Skeleton';
import MiEquipo from './MiEquipo';

export const Equipos = ({passId}) => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [prevItem, setPrevItemState] = useState(null);

  useEffect(() => {
    getEquipos();
  },[]);

  const getId = (theId) => {
    passId(theId); //envia dato al conponente app
    //setId(theId);
    //console.log('id desde equipos: '+ theId);
  };

  const getEquipos = async() => {
    try {
      const teams = await getAllTeams();
      //console.log(teams);
      setEquipos(teams);
      // Esperar a que se carguen todas las imágenes de los equipos
      const imagePromises = equipos.map(equipo => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = equipo.escudo; 
          img.onload = () => {
            resolve();
          };
          img.onload = () => {
            resolve();
          };
          img.onerror = resolve; // Continúa aunque alguna falle
        });
      });
      await Promise.all(imagePromises);
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  const itemPrevio = (num) => {
    console.log('item previo indice: ' + num);
      setPrevItemState(num);
  }
  
  return (
    <ul className='list'>
      <li className='fade'></li>
      <MiEquipo />

      {loading ? (
        // Mostrar 6 ítems de esqueleto como placeholder
        [...Array(20)].map((_, i) => (
          <li key={i} className="item-skeleton">
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(92, 63, 63, 0.18)', height:'100px'}}>
              <Skeleton variant="circular" width={50} height={50} sx={{margin:'25px'}} />
              <Skeleton variant="text" width={80} height={20} />
            </div>
          </li>
        ))
      ) : (
        equipos.map((equipo, equipoIndex) => (
          <Item
            key={equipoIndex}
            equipo={equipo}
            index={equipoIndex}
            setPreviousIndex={setPreviousIndex}
            previousIndex={previousIndex}
            enviarDatosAlPadre={getId}
            elAnterior={itemPrevio}
            highlighted={prevItem === equipoIndex}
          />
        ))
      )}
    </ul>
  )
}

export default Equipos;