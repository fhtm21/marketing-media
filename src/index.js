import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import OrbitQuiz from './OrbitQuiz.jsx';
import OrbitRocketAdventure from './OrbitRocketAdventure.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
const appVariant = process.env.REACT_APP_VARIANT;

root.render(
  <React.StrictMode>
    {appVariant === 'rocket' ? <OrbitRocketAdventure /> : <OrbitQuiz />}
  </React.StrictMode>
);