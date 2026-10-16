import { useEffect, useRef, useState } from 'react';
import { AVATAR_COUNT, NICKNAMES, PUEBLOS, ROLES, avatarSrc } from '../data';
import { currentUser, login, register, updateUser, useStore } from '../store';
import { nav, replace } from '../router';
import { Btn, Colibri, Icon, Overlay } from '../ui';

export function Splash() {
  const s = useStore();
  useEffect(() => {
    const t = setTimeout(() => {
      const u = currentUser(s);
      if (!u) replace({ name: 'login' });
      else if (!u.profileDone) replace({ name: 'setup' });
      else replace({ name: 'menu' });
    }, 1800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="scr bgimg splash" style={{ backgroundImage: 'url(img/bg_splash.jpg)' }}>
      <h1 className="splash-title">
        JUEGOS ANCESTRALES
        <br />E INTERCULTURALES
      </h1>
      <img className="splash-logo" src="img/logo.png" alt="" />
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
    nav(u && u.profileDone ? { name: 'menu' } : { name: 'setup' });
  };
  return (
    <div className="scr bgimg" style={{ backgroundImage: 'url(img/bg_login.jpg)' }}>
      <div className="auth">
        <div className="auth-av">
          <img src="img/avatar_base.png" alt="" />
        </div>
        <div className="auth-form">
          <label className="field">
            <Icon name="comunidad" size={18} />
            <input placeholder="Usuario o correo" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" />
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
        <Colibri
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
    replace({ name: 'ready' });
  };
  return (
    <div className="scr bgimg" style={{ backgroundImage: 'url(img/bg_registro.jpg)' }}>
      <button className="float-back" onClick={() => history.back()} aria-label="Atrás">
        <Icon name="back" size={24} />
      </button>
      <div className="auth">
        <div className="auth-av sm">
          <img src="img/avatar_base.png" alt="" />
        </div>
        <div className="auth-form">
          <label className="field">
            <input placeholder="Nombres y apellidos" value={f.name} onChange={(e) => up('name')(e.target.value)} autoComplete="name" />
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
  return (
    <div className="scr bgimg center" style={{ backgroundImage: 'url(img/bg_cielo.jpg)' }} onClick={() => replace({ name: 'setup' })}>
      <div className="ready">
        <div className="auth-av">
          <img src="img/avatar_base.png" alt="" />
        </div>
        <h1>¡Tu cuenta está lista!</h1>
        <p>Ya puedes explorar, aprender y vivenciar los juegos ancestrales.</p>
        <div className="ready-ok">
          <Icon name="check" size={40} />
        </div>
        <Btn onClick={() => replace({ name: 'setup' })}>CONTINUAR</Btn>
      </div>
    </div>
  );
}

export function Setup() {
  const s = useStore();
  const u = currentUser(s)!;
  const [avatar, setAvatar] = useState(u.avatar);
  const [nick, setNick] = useState(u.nickname);
  const [pueblo, setPueblo] = useState(u.pueblo);
  const [sheet, setSheet] = useState<'' | 'nick' | 'pueblo'>('');
  const [draft, setDraft] = useState('');
  const strip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = strip.current?.querySelector(`[data-n="${avatar}"]`) as HTMLElement | null;
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [avatar]);

  const save = () => {
    const first = !u.profileDone;
    updateUser((x) => ({ ...x, avatar, nickname: nick.trim() || 'Colibrí Azul', pueblo, profileDone: true }));
    if (first) replace({ name: 'welcome' });
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
        <img className="setup-big" src={avatarSrc(avatar)} alt={`Avatar ${avatar}`} />
      </div>
      <p className="setup-hint">“Desliza y selecciona”</p>
      <div className="setup-strip" ref={strip}>
        {Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1).map((n) => (
          <button key={n} data-n={n} className={'av-opt' + (n === avatar ? ' on' : '')} onClick={() => setAvatar(n)} aria-label={`Avatar ${n}`}>
            <img src={avatarSrc(n)} alt="" loading="lazy" />
          </button>
        ))}
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
        <button className="pfield" onClick={() => setSheet('pueblo')}>
          <span className="pfield-lb">“Selecciona tu pueblo”</span>
          <span className="pfield-v">{pueblo}</span>
          <Icon name="down" size={20} />
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
      {sheet === 'pueblo' && (
        <Overlay onClose={() => setSheet('')}>
          <div className="sheet">
            <h2>Selecciona tu pueblo</h2>
            <div className="list">
              {PUEBLOS.map((p) => (
                <button
                  key={p}
                  className={'list-it' + (p === pueblo ? ' on' : '')}
                  onClick={() => {
                    setPueblo(p);
                    setSheet('');
                  }}
                >
                  <span className="radio" />
                  {p}
                </button>
              ))}
            </div>
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
