import { useEffect, useRef, useState } from 'react';
import { GAMES, Game, GameId, gameById } from '../data';
import { currentUser, levelUnlocked, markSeen, saberes, useStore } from '../store';
import { nav, replace } from '../router';
import { Avatar, Btn, Colibri, GameIcon, Header, HelpButton, Icon, Progress, TabBar, themeStyle, speak, canSpeak } from '../ui';

// Muestra el mensaje del colibrí la primera vez que se entra a una sección.
function useTransition(key: string) {
  const s = useStore();
  const u = currentUser(s);
  const [open, setOpen] = useState(() => !!u && !u.seen.includes(key));
  return [open, () => (markSeen(key), setOpen(false))] as const;
}

export function Menu() {
  const s = useStore();
  const u = currentUser(s)!;
  return (
    <div className="scr menu bgimg" style={{ backgroundImage: 'url(img/bg_camino.jpg)' }}>
      <div className="menu-top">
        <button className="menu-av" onClick={() => nav({ name: 'perfil' })} aria-label="Mi perfil">
          <Avatar n={u.avatar} size={132} />
        </button>
        <div className="menu-name">{u.nickname}</div>
        <div className="menu-pueblo">{u.pueblo}</div>
      </div>
      <div className="menu-list">
        {GAMES.map((g) => {
          const d = u.done[g.id].length;
          return (
            <button key={g.id} className="menu-btn" onClick={() => nav({ name: 'map', g: g.id })}>
              <span className="menu-ic" style={{ background: g.theme.h1 }}>
                <GameIcon id={g.id} size={22} />
              </span>
              <span className="menu-tx">
                <b>{g.name.toUpperCase()}</b>
                <small>{d === 6 ? 'Completado' : d ? `${d} de 6 niveles` : 'Nuevo'}</small>
              </span>
              <Icon name="chev" size={22} />
            </button>
          );
        })}
      </div>
      <TabBar active="juegos" />
    </div>
  );
}

export function MapScreen({ g }: { g: GameId }) {
  const game = gameById(g);
  const [intro, close] = useTransition(g + ':mapa');
  return (
    <div className="scr themed" style={themeStyle(game)}>
      <Header title={game.name.toUpperCase()} />
      <div className="map" style={{ backgroundImage: `url(${game.map})` }}>
        <HelpButton text={`Este es el territorio donde se practica ${game.article}. Toca EXPLORAR para conocer el juego.`} />
        {game.map.includes('trompo') && g !== 'trompo' && <span className="tag-pend">Mapa por reemplazar</span>}
        <div className="map-cta">
          <Btn onClick={() => nav({ name: 'game', g })}>EXPLORAR</Btn>
        </div>
      </div>
      <TabBar active="juegos" />
      {intro && <Colibri title="¡Explora el territorio!" text={game.transitions.mapa} onAction={close} />}
    </div>
  );
}

const SECTIONS = [
  { key: 'origen', label: 'ORIGEN' },
  { key: 'creando', label: 'CREANDO' },
  { key: 'vivencia', label: 'VIVENCIA' },
  { key: 'retosaberes', label: 'RETOSABERES' },
] as const;

export function GameHome({ g }: { g: GameId }) {
  const game = gameById(g);
  const [pending, setPending] = useState<string | null>(null);
  const s = useStore();
  const u = currentUser(s)!;
  const go = (k: string) => {
    if (k === 'origen' || k === 'creando') nav({ name: 'video', g, part: k });
    else if (k === 'vivencia') nav({ name: 'vivencia', g });
    else nav({ name: 'levels', g });
  };
  const open = (k: string) => (u.seen.includes(`${g}:${k}`) ? go(k) : setPending(k));
  const titles: Record<string, string> = { origen: 'Origen', creando: 'Creando', vivencia: 'Vivencia', retosaberes: 'Retosaberes' };
  return (
    <div className="scr themed" style={themeStyle(game)}>
      <Header title={game.name.toUpperCase()} />
      <div className="ghome bgimg" style={{ backgroundImage: 'url(img/bg_cielo.jpg)' }}>
        <div className="ghome-hero">
          <img src={game.vivencia} alt="" />
        </div>
        <div className="ghome-list">
          {SECTIONS.map((sec) => (
            <Btn key={sec.key} kind="block" icon={<img src={`img/ic_${sec.key}_navy.png`} alt="" />} onClick={() => open(sec.key)}>
              {sec.label}
            </Btn>
          ))}
        </div>
      </div>
      <TabBar active="juegos" />
      {pending && (
        <Colibri
          title={titles[pending]}
          text={game.transitions[pending as keyof Game['transitions']]}
          onAction={() => {
            markSeen(`${g}:${pending}`);
            const k = pending;
            setPending(null);
            go(k);
          }}
        />
      )}
    </div>
  );
}

export function VideoScreen({ g, part }: { g: GameId; part: 'origen' | 'creando' }) {
  const game = gameById(g);
  const info = game[part];
  return (
    <div className="scr themed" style={themeStyle(game)}>
      <Header title={game.name.toUpperCase()} section={part === 'origen' ? 'Origen' : 'Creando'} icon={`img/ic_${part}.png`} />
      <div className="body">
        <HelpButton text="Toca el botón de reproducir para ver el video. Lo puedes volver a ver en la Mediateca." />
        <Player title={info.title} kind={part === 'origen' ? 'Narración animada' : 'Video pedagógico'} />
        <h2 className="vid-title">{info.title}</h2>
        <p className="vid-kind">({part === 'origen' ? 'Narración animada' : 'Video pedagógico'})</p>
        <p className="vid-text">{info.text}</p>
        {canSpeak() && (
          <button className="link-btn" onClick={() => speak(info.title + '. ' + info.text)}>
            <Icon name="speaker" size={18} /> Escuchar el texto
          </button>
        )}
      </div>
      <TabBar active="juegos" />
    </div>
  );
}

// Reproductor de video: muestra el avance mientras se graban los videos reales.
export function Player({ title, kind }: { title: string; kind: string }) {
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const timer = useRef<number>();
  const DUR = 20;
  useEffect(() => {
    if (!playing) return;
    timer.current = window.setInterval(() => setT((x) => (x >= DUR ? (setPlaying(false), DUR) : x + 0.25)), 250);
    return () => clearInterval(timer.current);
  }, [playing]);
  return (
    <div className="player">
      <div className="player-screen">
        {playing || t > 0 ? (
          <div className="player-pend">
            <b>{title}</b>
            <span>{kind} · el video se agregará cuando la comunidad lo grabe</span>
          </div>
        ) : null}
        <button className="player-play" onClick={() => (t >= DUR && setT(0), setPlaying(!playing))} aria-label={playing ? 'Pausar' : 'Reproducir'}>
          <Icon name={playing ? 'pause' : 'play'} size={30} />
        </button>
      </div>
      <div className="player-bar">
        <i style={{ width: `${(t / DUR) * 100}%` }} />
      </div>
      <div className="player-time">
        <span>0:{String(Math.floor(t)).padStart(2, '0')}</span>
        <span>0:{DUR}</span>
      </div>
    </div>
  );
}

export function Vivencia({ g }: { g: GameId }) {
  const game = gameById(g);
  const more = useRef<HTMLDivElement>(null);
  return (
    <div className="scr themed" style={themeStyle(game)}>
      <Header title={game.name.toUpperCase()} section="Vivencia" icon="img/ic_vivencia.png" />
      <div className="body viv">
        <div className="viv-hero" style={{ backgroundImage: `url(${game.vivencia})` }} />
        <div className="viv-card">
          <h2>¿Por qué y para qué se juega?</h2>
          <p>{game.vivenciaText}</p>
          {canSpeak() && (
            <button className="link-btn" onClick={() => speak(game.vivenciaText)}>
              <Icon name="speaker" size={18} /> Escuchar
            </button>
          )}
        </div>
        <button className="viv-more" onClick={() => more.current?.scrollIntoView({ behavior: 'smooth' })} aria-label="Ver más">
          <Icon name="down" size={28} />
        </button>
        <div className="viv-wip" ref={more}>
          <h3>Contenido en reestructuración</h3>
          <p>Esta sección de la vivencia se está ajustando con la comunidad. Muy pronto podrás explorarla.</p>
        </div>
      </div>
      <TabBar active="juegos" />
    </div>
  );
}

export function Levels({ g }: { g: GameId }) {
  const game = gameById(g);
  const s = useStore();
  const u = currentUser(s)!;
  const firstOpen = game.levels.find((l) => !u.done[g].includes(l.n))?.n ?? 1;
  const [sel, setSel] = useState(firstOpen);
  const highest = Math.max(0, ...u.done[g]);
  return (
    <div className="scr themed" style={themeStyle(game)}>
      <Header title={game.name.toUpperCase()} section="Retosaberes" icon="img/ic_retosaberes.png" />
      <div className="body">
        <HelpButton text="Selecciona un nivel y toca Aceptar. Los niveles se desbloquean a medida que completas el anterior." />
        <Progress level={highest} />
        <div className="lv-sum">
          <b>{saberes(u, g)}</b> de 21 saberes en {game.name}
        </div>
        <div className="lv-list">
          {game.levels.map((l) => {
            const done = u.done[g].includes(l.n);
            const open = levelUnlocked(u, g, l.n);
            return (
              <button key={l.n} className={'lv' + (done ? ' done' : '') + (sel === l.n ? ' sel' : '') + (!open ? ' locked' : '')} disabled={!open} onClick={() => setSel(l.n)}>
                <span className="lv-ic">{done ? <Icon name="check" size={18} /> : open ? <b>{l.n}</b> : <Icon name="lock" size={18} />}</span>
                <span className="lv-tx">
                  <b>{l.name}</b>
                  <small>{l.title}</small>
                </span>
                <span className="lv-pts">+{l.n}</span>
              </button>
            );
          })}
        </div>
        <p className="lv-hint">Selecciona nivel y dale aceptar</p>
        <Btn onClick={() => nav({ name: 'play', g, n: sel })}>ACEPTAR</Btn>
      </div>
      <TabBar active="juegos" />
    </div>
  );
}

export function Logro({ g }: { g: GameId }) {
  const game = gameById(g);
  const s = useStore();
  const u = currentUser(s)!;
  return (
    <div className="scr themed logro" style={themeStyle(game)}>
      <Header title={game.name.toUpperCase()} section="Retosaberes" icon="img/ic_retosaberes.png" />
      <div className="body center-col">
        <div className="hex big">
          <GameIcon id={g} size={64} />
        </div>
        <h1>¡Completaste {game.article}!</h1>
        <p className="logro-sub">Recorriste los seis niveles de Retosaberes.</p>
        <div className="score">
          <span>Aprendiz ancestral</span>
          <b>+{saberes(u, g)}</b>
          <small>saberes</small>
        </div>
        <Btn onClick={() => nav({ name: 'logros' })}>VER MIS LOGROS</Btn>
        <Btn kind="secondary" onClick={() => replace({ name: 'menu' })}>
          OTRO JUEGO
        </Btn>
      </div>
      <TabBar active="juegos" />
    </div>
  );
}
