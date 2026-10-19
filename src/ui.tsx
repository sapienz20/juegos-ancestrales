import { ReactNode, CSSProperties, useEffect } from 'react';
import { Game, GameId, avatarSrc } from './data';
import { useStore, currentUser } from './store';
import { nav, back, Route } from './router';

// ---------- íconos ----------
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

export const GameIcon = ({ id, size = 24 }: { id: GameId; size?: number }) => {
  const s = { width: size, height: size, viewBox: '0 0 24 24' };
  if (id === 'bodoquera')
    return (
      <svg {...s} fill="none">
        <circle cx="13" cy="11" r="9" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="13" cy="11" r="5.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="13" cy="11" r="1.6" fill="currentColor" />
        <path d="M1.5 21.5L12.2 11.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  if (id === 'trompo')
    return (
      <svg {...s} fill="none">
        <path d="M5 3.5C5 2.5 8.1 1.7 12 1.7S19 2.5 19 3.5L17.8 9 12.6 19.5h-1.2L6.2 9 5 3.5Z" fill="currentColor" />
        <path d="M12 19.5v2.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <ellipse cx="12" cy="22" rx="5" ry="1.3" stroke="currentColor" />
      </svg>
    );
  if (id === 'palmo')
    return (
      <svg {...s} fill="none">
        <rect x="7" y="1.5" width="3.2" height="18" rx="1.6" fill="currentColor" />
        <ellipse cx="8.6" cy="21" rx="3.4" ry="1.2" fill="currentColor" />
        <path d="M13.5 18C13.5 13 17 8.7 22 7.5 21.4 12.9 18.2 17.1 13.5 18Z" fill="currentColor" />
      </svg>
    );
  return (
    <svg {...s} fill="none">
      <circle cx="16" cy="7" r="5" fill="currentColor" />
      <path d="M13 10 4 21.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M17.5 1.8c1.5.8 2.6 2 3 3.6M19.4.6c1.8 1.1 3 2.6 3.4 4.6" stroke="currentColor" strokeLinecap="round" />
      <ellipse cx="4.5" cy="22" rx="3" ry="1" stroke="currentColor" />
    </svg>
  );
};

export const Icon = ({ name, size = 22 }: { name: string; size?: number }) => {
  const s = { width: size, height: size, viewBox: '0 0 24 24', ...P };
  switch (name) {
    case 'back':
      return <svg {...s} strokeWidth={2.6}><path d="M14.5 6 8.5 12l6 6" /></svg>;
    case 'chev':
      return <svg {...s} strokeWidth={2.6}><path d="M9.5 6l6 6-6 6" /></svg>;
    case 'down':
      return <svg {...s} strokeWidth={2.6}><path d="M6 9.5l6 6 6-6" /></svg>;
    case 'help':
      return <svg {...s}><circle cx="12" cy="12" r="10" /><path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.2-2.5 3.8" /><circle cx="12" cy="17.3" r=".6" fill="currentColor" /></svg>;
    case 'juegos':
      return <svg {...s}><path d="M3 20 12 4l9 16H3Z" /><path d="M8.5 20 12 14l3.5 6" /></svg>;
    case 'logros':
      return <svg {...s}><path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3L12 2.5Z" /><path d="m8.5 12 2.4 2.4 4.6-4.8" /></svg>;
    case 'mediateca':
      return <svg {...s}><rect x="3" y="4.5" width="18" height="15" rx="3" /><path d="M10 9.2v5.6l4.8-2.8L10 9.2Z" fill="currentColor" /></svg>;
    case 'comunidad':
      return <svg {...s}><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19.5c.6-3.3 3-5.2 6-5.2s5.4 1.9 6 5.2" /><circle cx="17" cy="9.5" r="2.4" /><path d="M16.5 14.4c2.4.2 4 1.8 4.5 4.6" /></svg>;
    case 'memoria':
      return <svg {...s}><path d="M12 3 1.5 12 12 21 22.5 12 12 3Z" /><path d="M12 3v18" /></svg>;
    case 'play':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" /></svg>;
    case 'pause':
      return <svg width={size} height={size} viewBox="0 0 24 24"><rect x="6.5" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="13.5" y="5" width="4" height="14" rx="1" fill="currentColor" /></svg>;
    case 'mic':
      return <svg {...s}><rect x="9" y="2.5" width="6" height="12" rx="3" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5" /></svg>;
    case 'stop':
      return <svg width={size} height={size} viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" /></svg>;
    case 'pencil':
      return <svg {...s}><path d="M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16v4Z" /><path d="m14 6 4 4" /></svg>;
    case 'image':
      return <svg {...s}><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="9.5" r="1.8" /><path d="m3.5 18 5.5-5.5 4 4 2.5-2.5 5 5" /></svg>;
    case 'video':
      return <svg {...s}><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="m15.5 10.5 6-3.5v10l-6-3.5" /></svg>;
    case 'speaker':
      return <svg {...s}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Z" /><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" /></svg>;
    case 'lock':
      return <svg {...s}><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></svg>;
    case 'check':
      return <svg {...s} strokeWidth={3}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>;
    case 'x':
      return <svg {...s} strokeWidth={3}><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></svg>;
    case 'heart':
      return <svg {...s}><path d="M12 20s-8-4.8-8-10.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.6C20 15.2 12 20 12 20Z" /></svg>;
    case 'heartFill':
      return <svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 20s-8-4.8-8-10.4A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.6C20 15.2 12 20 12 20Z" fill="currentColor" /></svg>;
    case 'plus':
      return <svg {...s} strokeWidth={2.4}><path d="M12 5v14M5 12h14" /></svg>;
    case 'tree':
      return <svg {...s}><path d="M12 21v-6" /><path d="M12 3c-3.5 0-6 2.7-6 6 0 3.2 2.7 6 6 6s6-2.8 6-6c0-3.3-2.5-6-6-6Z" /></svg>;
    case 'palm':
      return <svg {...s}><path d="M12 21c0-5 .5-9 1-12" /><path d="M13 9c-2-3-5.5-3.5-8-2 2.7.2 5 1 8 2Zm0 0c1-3.5 4.5-5 7.5-4-2.5.8-5 2-7.5 4Zm0 0c3 0 6 1.5 7 4.5-2.5-1.6-4.5-2.8-7-4.5Zm0 0c-3 .5-5.5 3-6 6 2-2.2 4-4 6-6Z" /></svg>;
    case 'trueno':
      return <svg {...s}><path d="M7 15.5a4.5 4.5 0 1 1 1.2-8.8A5.5 5.5 0 0 1 18.6 9 3.5 3.5 0 0 1 17.5 15.5" /><path d="m12.5 12-2.5 4.5h3L11 21" /></svg>;
    case 'logout':
      return <svg {...s}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" /></svg>;
    default:
      return null;
  }
};

// ---------- piezas ----------
export function themeStyle(g?: Game): CSSProperties {
  if (!g) return {};
  const t = g.theme;
  return { ['--h1' as string]: t.h1, ['--h2' as string]: t.h2, ['--t1' as string]: t.t1, ['--t2' as string]: t.t2, ['--acc' as string]: t.acc, ['--accL' as string]: t.accL, ['--press' as string]: t.press };
}

export function Avatar({ n, size = 44, ring = true }: { n: number; size?: number; ring?: boolean }) {
  return (
    <span className={'avatar' + (ring ? ' ring' : '')} style={{ width: size, height: size }}>
      <img src={avatarSrc(n)} alt="" />
    </span>
  );
}

export function Header({ title, section, icon, onBack, right }: { title: string; section?: string; icon?: string; onBack?: () => void; right?: ReactNode }) {
  const s = useStore();
  const u = currentUser(s);
  return (
    <header className="hdr">
      <button className="hdr-back" aria-label="Atrás" onClick={onBack ?? back}>
        <Icon name="back" size={24} />
      </button>
      <div className="hdr-title">
        {icon && <img src={icon} alt="" className="hdr-ic" />}
        <div>
          <div className="hdr-game">{title}</div>
          {section && <div className="hdr-sec">{section}</div>}
        </div>
      </div>
      {right ?? (
        <button className="hdr-av" aria-label="Mi perfil" onClick={() => nav({ name: 'perfil' })}>
          {u && <Avatar n={u.avatar} size={42} />}
        </button>
      )}
    </header>
  );
}

const TABS: { key: string; label: string; route: Route }[] = [
  { key: 'juegos', label: 'Juegos', route: { name: 'menu' } },
  { key: 'logros', label: 'Logros', route: { name: 'logros' } },
  { key: 'mediateca', label: 'Mediateca', route: { name: 'mediateca' } },
  { key: 'comunidad', label: 'Comunidad', route: { name: 'comunidad' } },
];

export function TabBar({ active }: { active?: string }) {
  return (
    <nav className="tabs">
      {TABS.map((t) => (
        <button key={t.key} className={'tab' + (active === t.key ? ' on' : '')} onClick={() => active !== t.key && nav(t.route)} aria-current={active === t.key}>
          <Icon name={t.key} size={24} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

export function Btn({ children, onClick, kind = 'primary', disabled, icon, chev = true, className = '' }: { children: ReactNode; onClick?: () => void; kind?: 'primary' | 'secondary' | 'block' | 'ghost'; disabled?: boolean; icon?: ReactNode; chev?: boolean; className?: string }) {
  return (
    <button className={`btn btn-${kind} ${className}`} onClick={onClick} disabled={disabled}>
      {icon && <span className="btn-ic">{icon}</span>}
      <span className="btn-tx">{children}</span>
      {chev && <span className="btn-ch"><Icon name="chev" size={20} /></span>}
    </button>
  );
}

export function Progress({ level, label = 'Aprendiz ancestral' }: { level: number; label?: string }) {
  return (
    <div className="prog">
      <div className="prog-lb">
        <span>{label}</span>
        <span>Nivel {level}</span>
      </div>
      <div className="prog-bar">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <i key={i} className={i <= level ? 'on' : ''} />
        ))}
      </div>
    </div>
  );
}

export function Overlay({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="ov" onClick={onClose}>
      <div className="ov-card" onClick={(e) => e.stopPropagation()} role="dialog">
        {children}
      </div>
    </div>
  );
}

export function Colibri({ title, text, action = 'CONTINUAR', onAction }: { title: string; text: string; action?: string; onAction: () => void }) {
  return (
    <Overlay onClose={onAction}>
      <div className="coli">
        <div className="coli-bird">
          <img src="img/colibri.png" alt="" />
        </div>
        <h2>{title}</h2>
        <p>{text}</p>
        <Btn onClick={onAction}>{action}</Btn>
      </div>
    </Overlay>
  );
}

export function HelpButton({ text }: { text: string }) {
  return (
    <button className="help" aria-label="Ayuda" onClick={() => window.dispatchEvent(new CustomEvent('ayuda', { detail: text }))}>
      <Icon name="help" size={26} />
    </button>
  );
}

export function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return false;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-CO';
    u.rate = 0.95;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
