import { useEffect, useState } from 'react';
import { useRoute, replace } from './router';
import { currentUser, useStore } from './store';
import { Colibri } from './ui';
import { Login, Ready, Register, Setup, Splash, Welcome } from './screens/onboarding';
import { GameHome, Levels, Logro, MapScreen, Menu, VideoScreen, Vivencia } from './screens/games';
import { Play } from './screens/play';
import { Comunidad, Logros, Mediateca, Memoria, MisJuegos, Perfil } from './screens/profile';

const PUBLIC = ['splash', 'login', 'register'];

export default function App() {
  const r = useRoute();
  const s = useStore();
  const u = currentUser(s);
  const [help, setHelp] = useState<string | null>(null);

  useEffect(() => {
    const h = (e: Event) => setHelp((e as CustomEvent<string>).detail);
    window.addEventListener('ayuda', h);
    return () => window.removeEventListener('ayuda', h);
  }, []);

  useEffect(() => {
    if (!u && !PUBLIC.includes(r.name)) replace({ name: 'login' });
  }, [u, r.name]);

  if (!u && !PUBLIC.includes(r.name)) return null;

  let screen;
  switch (r.name) {
    case 'splash': screen = <Splash />; break;
    case 'login': screen = <Login />; break;
    case 'register': screen = <Register />; break;
    case 'ready': screen = <Ready />; break;
    case 'setup': screen = <Setup />; break;
    case 'welcome': screen = <Welcome />; break;
    case 'menu': screen = <Menu />; break;
    case 'map': screen = <MapScreen g={r.g} />; break;
    case 'game': screen = <GameHome g={r.g} />; break;
    case 'video': screen = <VideoScreen g={r.g} part={r.part} />; break;
    case 'vivencia': screen = <Vivencia key={r.g} g={r.g} />; break;
    case 'levels': screen = <Levels g={r.g} />; break;
    case 'play': screen = <Play key={r.g + r.n} g={r.g} n={r.n} />; break;
    case 'logro': screen = <Logro g={r.g} />; break;
    case 'perfil': screen = <Perfil />; break;
    case 'misjuegos': screen = <MisJuegos />; break;
    case 'logros': screen = <Logros />; break;
    case 'mediateca': screen = <Mediateca />; break;
    case 'memoria': screen = <Memoria />; break;
    case 'comunidad': screen = <Comunidad />; break;
    default: screen = <Menu />;
  }

  return (
    <div className="phone">
      {screen}
      {help && <Colibri title="Ayuda" text={help} action="ENTENDIDO" onAction={() => setHelp(null)} />}
    </div>
  );
}
