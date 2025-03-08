import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

// Hook para facilitar el uso del contexto
export const useAuth = () => {
    return useContext(AuthContext);
};

export const Contexto = ({children}) => {

    const [token, setToken] = useState(null);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    )
}
