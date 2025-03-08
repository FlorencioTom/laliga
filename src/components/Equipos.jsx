import {useEffect, useState } from 'react';
import {getAllTeams} from '../Api/Api';
import Item from './Item';
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
          <MiEquipo></MiEquipo>
          {equipos && equipos.map((equipo, equipoIndex) => (
            <Item
              key={equipoIndex}
              equipo={equipo}
              index={equipoIndex}
              setPreviousIndex={setPreviousIndex}
              previousIndex={previousIndex}
              enviarDatosAlPadre={getId}
              elAnterior = {itemPrevio}
              highlighted={prevItem === equipoIndex} 
            />
          ))}
        </ul>
  )
}

export default Equipos;