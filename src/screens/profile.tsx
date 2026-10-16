import { useRef, useState } from 'react';
import { GAMES, SAMPLE_POSTS, avatarSrc } from '../data';
import { TOTAL_LEVELS, currentAccount, currentUser, levelsDone, logout, saberes, today, uid, updateUser, useStore } from '../store';
import { nav, replace } from '../router';
import { Avatar, Btn, GameIcon, Header, Icon, Overlay, TabBar } from '../ui';
import { Player } from './games';
import { shrinkImage } from '../media';

function Hero() {
  const s = useStore();
  const u = currentUser(s)!;
  const pct = Math.round((levelsDone(u) / TOTAL_LEVELS) * 100);
  return (
    <div className="hero">
      <button className="hero-av" onClick={() => nav({ name: 'setup' })} aria-label="Editar perfil">
        <Avatar n={u.avatar} size={96} />
        <span className="hero-edit">
          <Icon name="pencil" size={14} />
        </span>
      </button>
      <div className="hero-tx">
        <b>{u.nickname}</b>
        <span>{u.pueblo}</span>
        <div className="hero-bar">
          <i style={{ width: pct + '%' }} />
        </div>
        <small>
          Recorrido {pct}% · {saberes(u)} saberes
        </small>
      </div>
    </div>
  );
}

export function Perfil() {
  const s = useStore();
  const acc = currentAccount(s);
  const items = [
    { key: 'misjuegos', label: 'MIS JUEGOS', icon: 'juegos' },
    { key: 'logros', label: 'LOGROS', icon: 'logros' },
    { key: 'mediateca', label: 'MEDIATECA', icon: 'mediateca' },
    { key: 'memoria', label: 'MEMORIA', icon: 'memoria' },
    { key: 'comunidad', label: 'COMUNIDAD', icon: 'comunidad' },
  ] as const;
  return (
    <div className="scr themed">
      <Header title="MI RECORRIDO" right={<span className="hdr-sp" />} />
      <div className="body">
        <Hero />
        <div className="grid2">
          {items.map((it) => (
            <button key={it.key} className="tile" onClick={() => nav({ name: it.key })}>
              <Icon name={it.icon} size={30} />
              <span>{it.label}</span>
            </button>
          ))}
        </div>
        {acc && (
          <p className="acc">
            Cuenta: {acc.name} · {acc.rol}
          </p>
        )}
        <button
          className="link-btn danger"
          onClick={() => {
            logout();
            replace({ name: 'login' });
          }}
        >
          <Icon name="logout" size={18} /> Cerrar sesión
        </button>
      </div>
      <TabBar />
    </div>
  );
}

export function MisJuegos() {
  const s = useStore();
  const u = currentUser(s)!;
  return (
    <div className="scr themed">
      <Header title="MIS JUEGOS" />
      <div className="body">
        <Hero />
        <div className="mosaic">
          {GAMES.map((g) => {
            const d = u.done[g.id].length;
            return (
              <button key={g.id} className="mos" style={{ background: `linear-gradient(160deg, ${g.theme.h2}, ${g.theme.h1})` }} onClick={() => nav({ name: 'map', g: g.id })}>
                <span className="mos-ic">
                  <GameIcon id={g.id} size={34} />
                </span>
                <b>{g.name.toUpperCase()}</b>
                <small>{d === 6 ? 'Completado' : `${d} de 6 niveles`}</small>
                <span className="mos-bar">
                  <i style={{ width: (d / 6) * 100 + '%' }} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <TabBar active="juegos" />
    </div>
  );
}

export function Logros() {
  const s = useStore();
  const u = currentUser(s)!;
  return (
    <div className="scr themed">
      <Header title="LOGROS" />
      <div className="body">
        <div className="score wide">
          <Avatar n={u.avatar} size={56} />
          <div>
            <span>{u.nickname}</span>
            <small>Aprendiz ancestral</small>
          </div>
          <b>+{saberes(u)}</b>
          <small>saberes</small>
        </div>
        <h3 className="sec-t">Insignias por juego</h3>
        <div className="badges">
          {GAMES.map((g) => {
            const d = u.done[g.id].length;
            const st = d === 6 ? 'Completado' : d ? 'En curso' : 'Nuevo';
            return (
              <button key={g.id} className={'badge ' + (d === 6 ? 'done' : d ? 'prog' : 'new')} onClick={() => nav({ name: 'levels', g: g.id })}>
                <span className="hex" style={d ? { background: `linear-gradient(160deg, ${g.theme.accL}, ${g.theme.acc})` } : undefined}>
                  <GameIcon id={g.id} size={34} />
                </span>
                <span className="badge-tx">
                  <b>{g.name.toUpperCase()}</b>
                  <span className={'pill ' + (d === 6 ? 'ok' : d ? 'mid' : '')}>{st}</span>
                  <small>
                    {st} · {d} de 6 niveles · {saberes(u, g.id)} de 21 saberes
                  </small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <TabBar active="logros" />
    </div>
  );
}

export function Mediateca() {
  const [f, setF] = useState<string>('todos');
  const [open, setOpen] = useState<{ title: string; kind: string } | null>(null);
  const items = GAMES.flatMap((g) => [
    { g, part: 'Origen', title: g.origen.title, kind: 'Narración animada' },
    { g, part: 'Creando', title: g.creando.title, kind: 'Video pedagógico' },
  ]).filter((x) => f === 'todos' || x.g.id === f);
  return (
    <div className="scr themed">
      <Header title="MEDIATECA" />
      <div className="body">
        <p className="lead">Videos y narraciones de cada juego. Toca uno para verlo de nuevo.</p>
        <div className="chips scroll">
          {[{ id: 'todos', short: 'Todos' }, ...GAMES].map((g) => (
            <button key={g.id} className={'chip' + (f === g.id ? ' on' : '')} onClick={() => setF(g.id)}>
              {g.short}
            </button>
          ))}
        </div>
        <div className="media-list">
          {items.map((it) => (
            <button key={it.title} className="media" onClick={() => setOpen(it)}>
              <span className="media-th" style={{ background: `linear-gradient(160deg, ${it.g.theme.h2}, ${it.g.theme.h1})` }}>
                <Icon name="play" size={26} />
              </span>
              <span className="media-tx">
                <b>{it.title}</b>
                <small>{it.kind}</small>
                <small>
                  {it.g.name} · {it.part}
                </small>
              </span>
            </button>
          ))}
        </div>
      </div>
      <TabBar active="mediateca" />
      {open && (
        <Overlay onClose={() => setOpen(null)}>
          <div className="sheet">
            <h2>{open.title}</h2>
            <Player title={open.title} kind={open.kind} />
            <Btn kind="secondary" chev={false} onClick={() => setOpen(null)}>
              CERRAR
            </Btn>
          </div>
        </Overlay>
      )}
    </div>
  );
}

export function Memoria() {
  const s = useStore();
  const u = currentUser(s)!;
  const input = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<string | null>(null);
  const item = u.memoria.find((m) => m.id === view);
  return (
    <div className="scr themed">
      <Header title="MEMORIA" />
      <div className="body">
        <p className="lead">Aquí se guardan tus creaciones del nivel Crear y las fotos que compartes con tu comunidad.</p>
        <Btn kind="block" icon={<Icon name="plus" size={22} />} onClick={() => input.current?.click()}>
          SUBIR UNA CREACIÓN
        </Btn>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const photo = await shrinkImage(file);
            updateUser((x) => ({ ...x, memoria: [{ id: uid(), title: 'Foto compartida', subtitle: 'Memoria', date: today(), photo }, ...x.memoria] }));
            e.target.value = '';
          }}
        />
        {u.memoria.length === 0 ? (
          <div className="empty">
            <Icon name="memoria" size={40} />
            <p>Todavía no tienes creaciones. Completa el nivel 6 de un juego o sube una foto.</p>
          </div>
        ) : (
          <div className="mem-grid">
            {u.memoria.map((m) => (
              <button key={m.id} className="mem" onClick={() => setView(m.id)}>
                <span className="mem-img" style={m.photo ? { backgroundImage: `url(${m.photo})` } : undefined}>
                  {!m.photo && <Icon name={m.audio ? 'mic' : 'pencil'} size={34} />}
                </span>
                <b>{m.title}</b>
                <small>{m.subtitle}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <TabBar />
      {item && (
        <Overlay onClose={() => setView(null)}>
          <div className="sheet">
            <h2>{item.title}</h2>
            <p className="muted">
              {item.subtitle} · {item.date}
            </p>
            {item.photo && <img className="mem-full" src={item.photo} alt="" />}
            {item.text && <p>{item.text}</p>}
            {item.audio && <audio controls src={item.audio} className="open-audio" />}
            <div className="row-btns">
              <Btn
                kind="secondary"
                chev={false}
                onClick={() => {
                  updateUser((x) => ({ ...x, posts: [{ id: uid(), text: `${item.title}${item.text ? ': ' + item.text : ''}`, game: 'Memoria', date: today(), likes: 0 }, ...x.posts] }));
                  setView(null);
                  nav({ name: 'comunidad' });
                }}
              >
                COMPARTIR
              </Btn>
              <Btn
                kind="ghost"
                chev={false}
                onClick={() => {
                  updateUser((x) => ({ ...x, memoria: x.memoria.filter((m) => m.id !== item.id) }));
                  setView(null);
                }}
              >
                Quitar
              </Btn>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

export function Comunidad() {
  const s = useStore();
  const u = currentUser(s)!;
  const [text, setText] = useState('');
  const [game, setGame] = useState('Bodoquera');
  const mine = u.posts.map((p) => ({ ...p, author: u.nickname, pueblo: u.pueblo, avatar: u.avatar, mine: true }));
  const all = [...mine, ...SAMPLE_POSTS.map((p) => ({ ...p, mine: false, date: '' }))];
  const toggle = (id: string) => updateUser((x) => ({ ...x, likes: x.likes.includes(id) ? x.likes.filter((l) => l !== id) : [...x.likes, id] }));
  return (
    <div className="scr themed">
      <Header title="COMUNIDAD" />
      <div className="body">
        <div className="composer">
          <Avatar n={u.avatar} size={40} />
          <div className="composer-in">
            <textarea placeholder="Comparte lo que aprendiste…" maxLength={280} value={text} onChange={(e) => setText(e.target.value)} />
            <div className="composer-bar">
              <select value={game} onChange={(e) => setGame(e.target.value)}>
                {GAMES.map((g) => (
                  <option key={g.id}>{g.name}</option>
                ))}
                <option>Memoria</option>
              </select>
              <button
                className="send"
                disabled={text.trim().length < 3}
                onClick={() => {
                  updateUser((x) => ({ ...x, posts: [{ id: uid(), text: text.trim(), game, date: today(), likes: 0 }, ...x.posts] }));
                  setText('');
                }}
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
        <p className="hint small">No publiques tu nombre completo, dirección ni teléfono. Pide permiso antes de subir fotos de otras personas.</p>
        <div className="posts">
          {all.map((p) => {
            const liked = u.likes.includes(p.id);
            return (
              <article key={p.id} className="post">
                <div className="post-h">
                  <span className="avatar ring" style={{ width: 40, height: 40 }}>
                    <img src={avatarSrc(p.avatar)} alt="" />
                  </span>
                  <div>
                    <b>{p.author}</b>
                    <small>
                      {p.pueblo}
                      {p.date ? ' · ' + p.date : ''}
                    </small>
                  </div>
                  {p.mine && (
                    <button className="post-del" onClick={() => updateUser((x) => ({ ...x, posts: x.posts.filter((q) => q.id !== p.id) }))} aria-label="Borrar publicación">
                      <Icon name="x" size={16} />
                    </button>
                  )}
                </div>
                <p>{p.text}</p>
                <div className="post-f">
                  <span className="pill">{p.game}</span>
                  <button className={'like' + (liked ? ' on' : '')} onClick={() => toggle(p.id)}>
                    <Icon name={liked ? 'heartFill' : 'heart'} size={18} /> {p.likes + (liked ? 1 : 0)}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="hint small center">Las publicaciones de otros jugadores son ejemplos. Para compartir entre teléfonos hace falta conectar un servidor.</p>
      </div>
      <TabBar active="comunidad" />
    </div>
  );
}
