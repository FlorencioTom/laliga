import balon from '../images/balon.png';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

const MiEquipo = () => {
  return (
    <NavLink to={`/miequipo`} className={`item `}>
        <img className='escudo miEquipo' src={balon} alt={'Mi equipo'} />
        <span>Mi equipo</span>
    </NavLink>
  )
}

export default MiEquipo;
