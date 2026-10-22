import { ReactNode, CSSProperties } from 'react';
import { GameId } from './data';
import { Overlay, KitIcon } from './ui';

// Diseño de los overlays (transiciones, resultados y ayuda), según los PDF ajustados.
// Las medidas están en px sobre la tarjeta de 352 × 426 del diseño en Figma.

type Box = [number, number, number, number];
type Kind = 'explora' | 'secciones' | 'feliz' | 'animo';

const MARCO: Record<GameId | 'gris', [string, string, string]> = {
  bodoquera: ['#1B81E8', '#4B92EA', '#79A3EB'],
  trompo: ['#3A9A71', '#5DA075', '#82A679'],
  palmo: ['#BDA23C', '#C9B559', '#D4C775'],
  zumbambico: ['#B88A56', '#C7A066', '#D4B575'],
  gris: ['#CCCCCC', '#DBDBDB', '#ECECEC'],
};

const POS: Record<GameId, Record<Kind, Box>> = {
  bodoquera: { explora: [9.16, 23.36, 116, 119.1], secciones: [9.16, 23.36, 116, 119.1], feliz: [127.08, 34.56, 125, 128.3], animo: [126.57, 39.24, 121.5, 124.7] },
  trompo: { explora: [4.6, 15.57, 135, 138.6], secciones: [4.6, 15.57, 135, 138.6], feliz: [115.87, 31.53, 128.6, 132], animo: [121.65, 33.54, 112.1, 115.1] },
  palmo: { explora: [5.08, 38.48, 108.2, 111.1], secciones: [5.08, 38.48, 108.2, 111.1], feliz: [123.51, 66.06, 102.6, 105.3], animo: [132.45, 64.53, 103.2, 105.9] },
  zumbambico: { explora: [21, 26.58, 131, 152.3], secciones: [6.52, 23.52, 141.5, 141.5], feliz: [101.84, 12.12, 159.8, 159.8], animo: [101.84, 12.12, 159.8, 159.8] },
};

const at = ([x, y, w, h]: Box): CSSProperties => ({ left: x, top: y, width: w, height: h });

function Character({ g, kind }: { g: GameId; kind: Kind }) {
  return <img className="ovx-char" src={`img/personajes/${g}_${kind}.png`} alt="" style={at(POS[g][kind])} />;
}

const grad = (c: string[], id: string) => (
  <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stopColor={c[0]} />
    <stop offset="0.57" stopColor={c[1]} />
    <stop offset="1" stopColor={c[2]} />
  </linearGradient>
);
const CREMA = ['#F2E9D3', '#F9EBCE', '#FFECC9'];

const CHEV_W = 'M 180.01 359.75 L 167.40 372.36 C 166.84 372.92 166.52 373.68 166.52 374.47 C 166.52 377.12 169.73 378.46 171.61 376.58 L 188.44 359.75 C 189.60 358.58 189.60 356.70 188.44 355.54 L 171.61 338.71 C 169.73 336.83 166.52 338.16 166.52 340.82 C 166.52 341.61 166.84 342.37 167.40 342.92 L 180.01 355.54 C 181.17 356.70 181.17 358.58 180.01 359.75 Z';
const CHEV_S = 'M 255.00 357.82 L 246.25 366.58 C 245.86 366.97 245.64 367.49 245.64 368.04 C 245.64 369.89 247.87 370.81 249.17 369.50 L 260.85 357.82 C 261.66 357.01 261.66 355.70 260.85 354.89 L 249.17 343.21 C 247.87 341.91 245.64 342.83 245.64 344.67 C 245.64 345.23 245.86 345.75 246.25 346.14 L 255.00 354.89 C 255.81 355.70 255.81 357.01 255.00 357.82 Z';

function Pill({ label, onClick, tone }: { label: string; onClick: () => void; tone: 'cafe' | 'naranja' | 'gris' }) {
  return (
    <button className={`ovx-pill ${tone}`} onClick={onClick}>
      <span>{label}</span>
      <svg width="17" height="29" viewBox="244.6 341.2 17.5 30" aria-hidden="true">
        <path d={CHEV_S} fill="currentColor" />
      </svg>
    </button>
  );
}

// ---------- transición ----------
const SECTION_ICON: Record<string, string> = { Origen: 'origen', Creando: 'creando', Vivencia: 'vivencia', Retosaberes: 'retosaberes' };

export function TransitionCard({ g, title, text, onAction }: { g: GameId; title: string; text: string; onAction: () => void }) {
  const icon = SECTION_ICON[title];
  const m = MARCO[g];
  return (
    <Overlay onClose={onAction} bare>
      <div className="ovx" role="dialog" aria-label={title}>
        <svg className="ovx-bg" viewBox="0 0 352 426" aria-hidden="true">
          <defs>
            {grad(m, 'tm')}
            {grad(CREMA, 'tc')}
          </defs>
          <rect x="13.5" y="80.46" width="325" height="283" rx="21" fill="url(#tm)" />
          <rect x="22.5" y="87.43" width="307" height="271.04" rx="21" fill="url(#tc)" />
        </svg>
        {icon ? (
          <div className="ovx-head">
            <span className="ovx-head-ic">
              <KitIcon name={icon} size={48} />
            </span>
            <h2>{title}</h2>
          </div>
        ) : (
          <h2 className="ovx-title2">{title}</h2>
        )}
        <p className="ovx-body">{text}</p>
        <button className="ovx-round" aria-label="Continuar" onClick={onAction}>
          <svg viewBox="133.5 312.96 85 85" aria-hidden="true">
            <circle cx="176" cy="355.46" r="42.5" fill="#AC6123" />
            <circle cx="175.5" cy="354.96" r="37" fill="#BC6C21" className="ovx-round-in" />
            <path d={CHEV_W} fill="#fff" />
          </svg>
        </button>
        <Character g={g} kind={icon ? 'secciones' : 'explora'} />
      </div>
    </Overlay>
  );
}

// ---------- resultado (acierto o error) ----------
const ARCH_OUT = 'M 113.98 116.85 L 38.17 116.85 C 26.59 116.85 17.20 126.24 17.20 137.82 L 17.20 322.74 C 17.20 334.32 26.59 343.71 38.17 343.71 L 320.75 343.71 C 332.33 343.71 341.72 334.32 341.72 322.74 L 341.72 137.82 C 341.72 126.24 332.33 116.85 320.75 116.85 L 244.94 116.85 C 241.85 83.39 213.72 57.19 179.46 57.19 C 145.20 57.19 117.07 83.39 113.98 116.85 Z';
const ARCH_IN = 'M 120.97 122.43 L 47.17 122.43 C 35.60 122.43 26.21 131.82 26.21 143.40 L 26.21 318.73 C 26.21 330.31 35.60 339.70 47.17 339.70 L 311.78 339.70 C 323.37 339.70 332.75 330.31 332.75 318.73 L 332.75 143.40 C 332.75 131.82 323.37 122.43 311.78 122.43 L 237.91 122.43 C 237.01 90.90 211.19 65.60 179.44 65.60 C 147.69 65.60 121.86 90.90 120.97 122.43 Z';
const CHECK = 'M 198.46 241.59 C 203.14 240.53 206.17 245.32 203.5 249.12 L 181.95 273.84 C 180.72 274.91 179.42 275.19 178.01 274.28 C 176.10 270.87 169.08 265.78 167.72 262.68 C 165.82 258.34 170.80 254.38 174.75 257.14 C 176.69 258.49 177.60 261.50 179.88 262.35 C 181.70 262.05 194.73 242.44 198.46 241.59 Z';
const EQUIS = 'M 170.92 236.70 C 175.00 236.03 181.94 246.17 185.35 248.48 C 187.00 248.78 195.49 236.77 199.31 236.64 C 201.24 236.57 204.54 239.65 204.67 241.56 C 204.95 245.64 194.70 252.09 192.88 256.03 C 192.88 256.83 202.73 265.17 203.94 267.65 C 206.03 271.93 201.58 276.32 197.46 274.64 C 194.58 273.47 187.20 263.90 185.73 263.61 C 180.35 265.10 173.11 280.87 167.43 272.59 C 163.23 266.46 175.55 260.98 177.80 256.03 L 166.62 243.37 C 165.37 240.55 168.22 237.15 170.92 236.70 Z';

export function ResultCard({ g, ok, n, onAction }: { g: GameId; ok: boolean; n?: number; onAction: () => void }) {
  const m = MARCO[g];
  return (
    <Overlay bare>
      <div className={'ovx ovx-res ' + (ok ? 'is-ok' : 'is-err')} role="dialog" aria-label={ok ? 'Acierto' : 'Error'}>
        <svg className="ovx-bg" viewBox="0 0 352 426" aria-hidden="true">
          <defs>
            {grad(m, 'rm')}
            {grad(CREMA, 'rc')}
          </defs>
          <path d={ARCH_OUT} fill="url(#rm)" />
          <path d={ARCH_IN} fill="url(#rc)" />
          {ok ? (
            <g className="ovx-mark">
              <circle cx="184.59" cy="259.87" r="34.42" fill="#368E42" />
              <circle cx="184.18" cy="259.46" r="29.96" fill="#27AB3A" />
              <path d={CHECK} fill="#fff" />
            </g>
          ) : (
            <g className="ovx-mark">
              <circle cx="184.59" cy="253.75" r="34.42" fill="#C40000" />
              <circle cx="184.18" cy="253.35" r="29.96" fill="#FF410A" />
              <path d={EQUIS} fill="#fff" />
            </g>
          )}
        </svg>
        <h2 className="ovx-rtitle">{ok ? '¡Muy bien acertaste!' : '¡Muy mal erraste!'}</h2>
        <p className="ovx-rmsg" style={{ top: ok ? 296.5 : 292 }}>
          {ok ? `Ganaste + ${n} ${n === 1 ? 'saber' : 'saberes'}` : '¡Sigue intentando!'}
        </p>
        <div className="ovx-pillbox">
          <Pill label="CONTINUAR" tone="cafe" onClick={onAction} />
        </div>
        <Character g={g} kind={ok ? 'feliz' : 'animo'} />
      </div>
    </Overlay>
  );
}

// ---------- ayuda, avisos y bienvenida ----------
export function InfoCard({ g, title, text, action = 'ENTENDIDO', onAction, icon }: { g?: GameId; title: string; text: ReactNode; action?: string; onAction: () => void; icon?: string }) {
  const m = MARCO[g ?? 'gris'];
  const style = { ['--m1' as string]: m[0], ['--m2' as string]: m[1], ['--m3' as string]: m[2] } as CSSProperties;
  return (
    <Overlay onClose={onAction} bare>
      <div className={'ovi' + (g ? '' : ' gris')} style={style} role="dialog" aria-label={title}>
        <div className="ovi-in">
          {icon && (
            <span className="ovi-ic">
              <KitIcon name={icon} size={64} />
            </span>
          )}
          <h2>{title}</h2>
          <div className="ovi-tx">{text}</div>
          <Pill label={action} tone={g ? 'naranja' : action.startsWith('REG') ? 'gris' : 'naranja'} onClick={onAction} />
        </div>
      </div>
    </Overlay>
  );
}
