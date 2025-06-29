import axios from 'axios';
import Equipo from '../Interfaces/interfaces'; // Importa la interfaz Equipo, que representa la estructura completa
const cloudName = 'demhp5yfg';
// URL base de la API
const API_BASE_URL = "https://laligaback-deploy.vercel.app"; // Reemplaza con tu URL
  
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

export const uploadImageToCloudinary = async (file:any, folder:string) => {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  //que el preset lo genere apartir del nomre del equipo
  formData.append('upload_preset', 'default');
  formData.append('folder', `laliga/${folder}`);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Retorna la URL pública de la imagen subida
    return response.data.secure_url;
  } catch (error) {
    console.error('Error subiendo imagen a Cloudinary:', error);
    throw error;
  }
};

export const addPlayerToTeam = async(idEquipo:string, jugador:any) => {
  const formData = new FormData();

  // Adjuntas los campos del jugador al FormData
  for (const key in jugador) {
    formData.append(key, jugador[key]);
  }

  const response = await api.post(
    `equipos/${idEquipo}`,
    formData,
    {
      withCredentials: true,
      headers: {
        
      }
    }
  );

  return response;

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





