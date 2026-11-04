import { useEffect, useRef, useState } from 'react';
import { AVATAR_GENERO, AVATAR_PUEBLO, AVATAR_PUEBLOS, NICKNAMES, PUEBLOS, ROLES, avatarSrc, avataresDe } from '../data';
import { currentUser, login, register, updateUser, useStore } from '../store';
import { nav, replace } from '../router';
import { Avatar, Btn, Icon, Overlay } from '../ui';
import { InfoCard } from '../overlays';

export function Splash() {
  const s = useStore();
  // Como en Figma: se avanza tocando la espiral (o cualquier parte de la pantalla).
  const go = () => {
    const u = currentUser(s);
    if (!u) replace({ name: 'login' });
    else if (!u.profileDone) replace({ name: 'setup' });
    else replace({ name: 'menu' });
  };
  const [logo, setLogo] = useState(true);
  return (
    <div className="scr bgimg splash" style={{ backgroundImage: 'url(img/bg_splash.jpg)' }} onClick={go}>
      {logo ? (
        <img className="splash-wordmark" src="img/logo_juegos.png" alt="Juegos ancestrales e interculturales" onError={() => setLogo(false)} />
      ) : (
        <h1 className="splash-title">
          JUEGOS ANCESTRALES
          <br />E INTERCULTURALES
        </h1>
      )}
      <button className="splash-go" aria-label="Entrar" onClick={go}>
        <img src="img/boton_espiral.svg" alt="" />
      </button>
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <label className="field">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={value ? '' : 'ph'}>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [hello, setHello] = useState(false);
  const go = async () => {
    const e = await login(user, pass);
    if (e) return setErr(e);
    const u = currentUser();
    nav(u && u.profileDone ? { name: 'ready' } : { name: 'setup' });
  };
  return (
    <div className="scr bgimg" style={{ backgroundImage: 'url(img/bg_login.jpg)' }}>
      <div className="auth">
        <img className="auth-sil" src="img/silueta.svg" alt="" />
        <div className="auth-form">
          <label className="field">
            <Icon name="comunidad" size={18} />
            <input placeholder="Usuario" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" />
          </label>
          <label className="field">
            <Icon name="lock" size={18} />
            <input placeholder="Contraseña" type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" onKeyDown={(e) => e.key === 'Enter' && go()} />
          </label>
          {err && <p className="err">{err}</p>}
          <Btn onClick={go} disabled={!user || !pass}>
            INGRESA
          </Btn>
          <Btn kind="secondary" onClick={() => setHello(true)}>
            REGÍSTRATE
          </Btn>
        </div>
      </div>
      {hello && (
        <InfoCard
          icon="user"
          title="¡Hola, semilla!"
          text="Para empezar el camino, cuéntanos quién eres."
          action="REGÍSTRATE"
          onAction={() => {
            setHello(false);
            nav({ name: 'register' });
          }}
        />
      )}
    </div>
  );
}

export function Register() {
  const [f, setF] = useState({ name: '', birth: '', pueblo: '', rol: '', email: '', pass: '' });
  const [err, setErr] = useState('');
  const up = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v });
  const valid = f.name.trim().length > 2 && f.birth && f.pueblo && f.rol && /\S+@\S+\.\S+/.test(f.email) && f.pass.length >= 4;
  const go = async () => {
    const e = await register(f);
    if (e) return setErr(e);
    replace({ name: 'setup' });
  };
  return (
    <div className="scr bgimg" style={{ backgroundImage: 'url(img/bg_registro.jpg)' }}>
      <button className="float-back" onClick={() => history.back()} aria-label="Atrás">
        <Icon name="back" size={24} />
      </button>
      <div className="auth">
        <img className="auth-sil sm" src="img/silueta.svg" alt="" />
        <div className="auth-form">
          <label className="field">
            <input placeholder="Nombres y Apellidos" value={f.name} onChange={(e) => up('name')(e.target.value)} autoComplete="name" />
          </label>
          <label className="field">
            <span className="field-lb">Fecha de nacimiento</span>
            <input type="date" value={f.birth} onChange={(e) => up('birth')(e.target.value)} max={new Date().toISOString().slice(0, 10)} />
          </label>
          <SelectField value={f.pueblo} onChange={up('pueblo')} options={PUEBLOS} placeholder="Pueblo" />
          <SelectField value={f.rol} onChange={up('rol')} options={ROLES} placeholder="Rol" />
          <label className="field">
            <input placeholder="Correo" type="email" value={f.email} onChange={(e) => up('email')(e.target.value)} autoComplete="email" />
          </label>
          <label className="field">
            <input placeholder="Crea una contraseña (mínimo 4)" type="password" value={f.pass} onChange={(e) => up('pass')(e.target.value)} autoComplete="new-password" />
          </label>
          {err && <p className="err">{err}</p>}
          <Btn onClick={go} disabled={!valid}>
            INGRESA
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function Ready() {
  const s = useStore();
  const u = currentUser(s);
  const go = () => replace({ name: 'welcome' });
  // Como en Figma: pasa sola a la bienvenida a los 3 segundos, o al tocar el botón.
  useEffect(() => {
    const t = setTimeout(go, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="scr bgimg" style={{ backgroundImage: 'url(img/bg_cielo.jpg)' }} onClick={go}>
      <div className="ready">
        <h1>¡Tu cuenta está lista!</h1>
        <div className="ready-av">
          <Avatar n={u?.avatar ?? 1} size={174} />
        </div>
        <div className="ready-name">
          <b>{u?.nickname}</b>
          <span>{u?.pueblo}</span>
        </div>
        <p>Ya puedes explorar, aprender y vivenciar los juegos ancestrales.</p>
        <button className="ready-ok" aria-label="Continuar" onClick={go}>
          <img src="img/boton_ok.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export function Setup() {
  const s = useStore();
  const u = currentUser(s)!;
  const [avatar, setAvatar] = useState(() => {
    if (u.profileDone) return u.avatar;
    const alias: Record<string, string> = { 'Totoró': 'Totoroez', 'Ambaló': 'Ampiuile', 'Otro pueblo': 'Urbano' };
    const a = avataresDe(alias[u.pueblo] ?? u.pueblo);
    return a.H ?? a.M ?? u.avatar;
  });
  const [nick, setNick] = useState(u.nickname);
  const [sheet, setSheet] = useState<'' | 'nick'>('');
  const [draft, setDraft] = useState('');
  const strip = useRef<HTMLDivElement>(null);
  const pueblo = AVATAR_PUEBLO[avatar - 1] ?? AVATAR_PUEBLOS[0];
  const genero = AVATAR_GENERO[avatar - 1] ?? 'H';
  const pareja = avataresDe(pueblo);

  useEffect(() => {
    const el = strip.current?.querySelector(`[data-p="${pueblo}"]`) as HTMLElement | null;
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [pueblo]);

  // Al cambiar de pueblo se conserva el género elegido si ese pueblo lo tiene.
  const elegirPueblo = (p: string) => {
    const a = avataresDe(p);
    setAvatar((a[genero] ?? a.H ?? a.M)!);
  };

  const save = () => {
    const first = !u.profileDone;
    updateUser((x) => ({ ...x, avatar, nickname: nick.trim() || 'Colibrí Azul', pueblo, profileDone: true }));
    if (first) replace({ name: 'ready' });
    else history.back();
  };

  return (
    <div className="scr setup">
      {u.profileDone && (
        <button className="float-back dark" onClick={() => history.back()} aria-label="Atrás">
          <Icon name="back" size={24} />
        </button>
      )}
      <div className="setup-top">
        <img className="setup-big" src={avatarSrc(avatar)} alt={`Avatar ${AVATAR_PUEBLO[avatar - 1] ?? avatar}`} />
        <span className="setup-pueblo">{AVATAR_PUEBLO[avatar - 1]}</span>
      </div>
      <p className="setup-step">1. Selecciona tu pueblo</p>
      <div className="setup-pueblos" ref={strip}>
        {AVATAR_PUEBLOS.map((p) => (
          <button key={p} data-p={p} className={'chip' + (p === pueblo ? ' on' : '')} onClick={() => elegirPueblo(p)}>
            {p}
          </button>
        ))}
      </div>
      <p className="setup-step">2. Selecciona tu género</p>
      <div className="setup-gen">
        {(['H', 'M'] as const).map((g) => {
          const n = pareja[g];
          return (
            <button key={g} className={'gen-opt' + (n === avatar ? ' on' : '')} disabled={n == null} onClick={() => n && setAvatar(n)} aria-pressed={n === avatar}>
              <span className="av-opt">{n ? <img src={avatarSrc(n)} alt="" /> : null}</span>
              <span className="gen-lb">{g === 'H' ? 'Hombre' : 'Mujer'}</span>
            </button>
          );
        })}
      </div>
      <div className="setup-fields">
        <button
          className="pfield"
          onClick={() => {
            setDraft(nick);
            setSheet('nick');
          }}
        >
          <span className="pfield-lb">“Crea tu nombre”</span>
          <span className="pfield-v">{nick}</span>
          <Icon name="pencil" size={20} />
        </button>
      </div>
      <div className="setup-save">
        <Btn onClick={save}>GUARDAR</Btn>
      </div>

      {sheet === 'nick' && (
        <Overlay onClose={() => setSheet('')}>
          <div className="sheet">
            <h2>Crea tu nombre</h2>
            <p>Elige un nombre para el camino. Evita usar tu nombre completo.</p>
            <label className="field">
              <input value={draft} maxLength={24} onChange={(e) => setDraft(e.target.value)} placeholder="Escribe tu nombre" autoFocus />
            </label>
            <div className="chips">
              {NICKNAMES.map((n) => (
                <button key={n} className={'chip' + (draft === n ? ' on' : '')} onClick={() => setDraft(n)}>
                  {n}
                </button>
              ))}
            </div>
            <Btn
              disabled={!draft.trim()}
              onClick={() => {
                setNick(draft.trim());
                setSheet('');
              }}
            >
              LISTO
            </Btn>
          </div>
        </Overlay>
      )}
    </div>
  );
}

export function Welcome() {
  return (
    <div className="scr bgimg welcome" style={{ backgroundImage: 'url(img/bg_bienvenida.jpg)' }}>
      <div className="welcome-tx">
        <h1>¡Bienvenidos al camino de los juegos ancestrales!</h1>
        <p>Cuatro juegos, una experiencia y un territorio por descubrir</p>
      </div>
      <div className="welcome-cta">
        <Btn onClick={() => replace({ name: 'menu' })}>INICIO</Btn>
      </div>
    </div>
  );
}
