import { createRoot } from 'react-dom/client';
import App from './App';
import { nav } from './router';
import { GAMES } from './data';
import './styles.css';

// Atajo para pruebas automáticas: window.__nav({ name: 'play', g: 'trompo', n: 2 })
Object.assign(window, { __nav: nav, __games: GAMES });

createRoot(document.getElementById('root')!).render(<App />);
