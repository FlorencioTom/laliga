import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Contexto } from './components/Contexto'; // Asegúrate de que la ruta sea correcta

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Contexto>       {/* ✅ Aquí envolvemos toda la app */}
      <App />
    </Contexto>
  </React.StrictMode>
);

reportWebVitals();
