import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { useAuth } from './Contexto';

const Item = ({ equipo, index, setPreviousIndex, previousIndex, elAnterior, highlighted}) => {
  const {setAnimacion} = useAuth();

  const handleMouseOver = () => {
    setPreviousIndex(index - 2);
  };

  const handleMouseOut = () => {
    setPreviousIndex(null);
  };

  const handleTeam = (elm) => {
    elAnterior(elm);
    setAnimacion(true);
  };
  

  return (
    <NavLink to={`/equipo/${equipo._id}`}
      className={`item ${index - 1 === previousIndex ? 'item-previous' : ''} ${highlighted ? 'click-item-previo' : ''} `}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={() => handleTeam(index-1)}
    >
      <img className='escudo' src={equipo.escudo} alt={equipo.nombre} />
      <span>{equipo.nombre}</span>
    </NavLink>
  );
};

export default Item;