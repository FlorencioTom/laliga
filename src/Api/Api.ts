import axios from 'axios';
import Equipo  from '../Interfaces/interfaces'; // Importa la interfaz Equipo, que representa la estructura completa

// URL base de la API
const API_BASE_URL = "http://localhost:3002"; // Reemplaza con tu URL
  
// Instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Auth = async (cookie:string) => {
  const response = await api.post(
    '/login/info',
    {},  // Pasa un objeto vacío como payload si no necesitas enviar datos adicionales.
    {
      withCredentials: true,  // Para enviar cookies.
      /*headers: {
        Cookie: `access_token=${cookie}`, // Puedes enviar la cookie manualmente si no se está enviando automáticamente.
      }*/
    }
  );
  return response.data;
};

export const login = async(info: { nombre: string; password: string }) => {
  const response = await api.post('/login', info);
  return response.data;
};

export const registro = async(info: { nombre: string; password: string; password2: string }) => {
  const response = await api.post('/login/register', info);
  return response.data;
};
  
// Función para obtener todos los datos de los equipos
export const getAllTeams = async() => {
  const response = await api.get('/equipos');
  return response.data.data;
};

export const getAllPlayersByTeam = async(equipo:string) => {
  const response = await api.get(`/equipos/${equipo}`);
  return response.data.data;
};

export const addPlayer = async(jugador:any) => {
  const response = await api.post(
    'login/add',
    {jugador},  // Pasa un objeto vacío como payload si no necesitas enviar datos adicionales.
    {
      withCredentials: true,  // Para enviar cookies.
      /*headers: {
        Cookie: `access_token=${cookie}`, // Puedes enviar la cookie manualmente si no se está enviando automáticamente.
      }*/
    }
  );
  return response.data;

};

export const addCoach = async(coach:any) => {
  const response = await api.post(
    'login/addCoach',
    {coach},  // Pasa un objeto vacío como payload si no necesitas enviar datos adicionales.
    {
      withCredentials: true,  // Para enviar cookies.
      /*headers: {
        Cookie: `access_token=${cookie}`, // Puedes enviar la cookie manualmente si no se está enviando automáticamente.
      }*/
    }
  );
  return response.data;

};





