import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../index.css';

// This line finds the <div id="root"></div> in your main index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// This line tells React to render your main <App /> component inside that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);