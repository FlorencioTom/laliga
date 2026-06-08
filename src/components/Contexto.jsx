import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTeamUser } from '../Api/Api';
import Cookies from 'js-cookie';
const AuthContext = createContext();

// Hook para facilitar el uso del contexto
export const useAuth = () => {
    return useContext(AuthContext);
};

export const Contexto = ({children}) => {

    const [token, setToken] = useState(null);
    const [equipo, setEquipo] = useState(null);

    useEffect(() => {
        equipoUsuario();
    }, []);

    //ESTO ES PARA CUANDO SE REFRESQUE LA PAGINA NO PERDER EL FRON DEL USUARIO LOGADO
    const equipoUsuario = async() => {
        const tk = Cookies.get('access_token') || null;
        if(tk !== null){
            const response = await getTeamUser(tk);
            setEquipo(response.data);
        }
    }

    return (
        <AuthContext.Provider value={{ token, setToken, equipo, setEquipo}}>
            {children}
        </AuthContext.Provider>
    )
}
