import React from 'react';
import  './i18n'; // Ensure the correct file extension is used
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure the correct file extension is used
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
