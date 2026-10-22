import { useEffect, useMemo, useRef, useState } from 'react';
import { GameId, Step, gameById } from '../data';
import { completeLevel, today, uid, updateUser } from '../store';
import { replace, nav } from '../router';
import { Btn, Header, HelpButton, Icon, Overlay, Progress, TabBar, canSpeak, speak, themeStyle } from '../ui';
import { chime, playSound, stopSound } from '../sound';
import { ResultCard } from '../overlays';
import { fmt, shrinkImage, useRecorder } from '../media';

type Check = () => boolean;
type ActProps<S extends Step> = { step: S; setCheck: (c: Check | null) => void };

// Baraja de forma estable para que el orden no cambie al volver a pintar.
function shuffled<T>(arr: T[], seed: number): number[] {
  const idx = arr.map((_, i) => i);
  let s = seed;
  for (let i = idx.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  if (idx.every((v, i) => v === i) && idx.length > 1) idx.push(idx.shift()!);
  return idx;
}

const PAIR_COLORS = ['#1e7fe5', '#e8871e', '#3a9a71', '#9b5bd4', '#d64b6f', '#0f9fb0', '#8a4f1e'];

function ReadAloud({ text }: { text: string }) {
  if (!canSpeak()) return null;
  return (
    <button className="read" onClick={() => speak(text)} aria-label="Leer en voz alta">
      <Icon name="speaker" size={18} />
    </button>
  );
}

function Bubble({ children, text }: { children: React.ReactNode; text: string }) {
  return (
    <div className="bubble">
      <p>{children}</p>
      <ReadAloud text={text} />
    </div>
  );
}

function Context({ title, text }: { title?: string; text?: string }) {
  if (!text) return null;
  return (
    <div className="ctx">
      {title && <h3>{title}</h3>}
      <p>{text}</p>
      <ReadAloud text={(title ? title + '. ' : '') + text} />
    </div>
  );
}

// ---------- actividades ----------
function Match({ step, setCheck }: ActProps<Extract<Step, { kind: 'match' }>>) {
  const [sel, setSel] = useState<number | null>(null);
  const [pairs, setPairs] = useState<Record<number, number>>({});
  const right = useMemo(() => shuffled(step.right, 7), [step]);
  useEffect(() => {
    const full = Object.keys(pairs).length === step.left.length;
    setCheck(full ? () => step.left.every((_, i) => pairs[i] === step.pairs[i]) : null);
  }, [pairs]);
  const colorOfLeft = (i: number) => (pairs[i] !== undefined ? PAIR_COLORS[Object.keys(pairs).map(Number).sort().indexOf(i) % PAIR_COLORS.length] : undefined);
  const leftOfRight = (r: number) => Object.entries(pairs).find(([, v]) => v === r)?.[0];
  const long = step.left.some((t) => t.length > 40);
  return (
    <>
      {step.hint && <p className="hint">{step.hint}</p>}
      <div className={'match' + (long ? ' long' : '')}>
        <div className="col">
          {step.left.map((t, i) => (
            <button
              key={i}
              className={'card' + (sel === i ? ' sel' : '')}
              style={colorOfLeft(i) ? { borderColor: colorOfLeft(i), boxShadow: `inset 6px 0 0 ${colorOfLeft(i)}` } : undefined}
              onClick={() => {
                if (pairs[i] !== undefined) {
                  const p = { ...pairs };
                  delete p[i];
                  setPairs(p);
                }
                setSel(sel === i ? null : i);
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="col">
          {right.map((r) => {
            const l = leftOfRight(r);
            const c = l !== undefined ? colorOfLeft(Number(l)) : undefined;
            return (
              <button
                key={r}
                className={'card alt' + (sel !== null ? ' target' : '')}
                style={c ? { borderColor: c, boxShadow: `inset -6px 0 0 ${c}` } : undefined}
                onClick={() => {
                  if (sel === null) {
                    if (l !== undefined) {
                      const p = { ...pairs };
                      delete p[Number(l)];
                      setPairs(p);
                    }
                    return;
                  }
                  const p = { ...pairs };
                  if (l !== undefined) delete p[Number(l)];
                  p[sel] = r;
                  setPairs(p);
                  setSel(null);
                }}
              >
                {step.right[r]}
              </button>
            );
          })}
        </div>
      </div>
      <p className="hint small">{sel !== null ? 'Ahora toca su pareja en la otra columna' : 'Toca un elemento de la izquierda y luego su pareja'}</p>
    </>
  );
}

function Order({ step, setCheck }: ActProps<Extract<Step, { kind: 'order' }>>) {
  const shown = useMemo(() => shuffled(step.items, 3), [step]);
  const [seq, setSeq] = useState<number[]>([]);
  useEffect(() => {
    setCheck(seq.length === step.items.length ? () => seq.every((v, i) => v === i) : null);
  }, [seq]);
  return (
    <>
      <p className="hint">Toca los pasos en el orden correcto. Toca de nuevo para quitarlo.</p>
      <div className="order">
        {shown.map((i) => {
          const pos = seq.indexOf(i);
          return (
            <button key={i} className={'step' + (pos >= 0 ? ' on' : '')} onClick={() => setSeq(pos >= 0 ? seq.filter((x) => x !== i) : [...seq, i])}>
              <span className="step-n">{pos >= 0 ? pos + 1 : ''}</span>
              <span>{step.items[i]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function Pick({ step, setCheck }: ActProps<Extract<Step, { kind: 'pick' }>>) {
  const [sel, setSel] = useState<number[]>([]);
  useEffect(() => {
    setCheck(sel.length ? () => sel.length === step.correct.length && step.correct.every((c) => sel.includes(c)) : null);
  }, [sel]);
  const toggle = (i: number) => setSel(sel.includes(i) ? sel.filter((x) => x !== i) : [...sel, i]);
  const isStory = step.title === 'Historia';
  return (
    <>
      <Context title={step.title} text={step.context} />
      {isStory && canSpeak() && (
        <button className="link-btn" onClick={() => speak(step.context ?? '')}>
          <Icon name="speaker" size={18} /> Escuchar historia
        </button>
      )}
      {step.question && <Bubble text={step.question}>{step.question}</Bubble>}
      {step.hint && <p className="hint">{step.hint}</p>}
      {step.trees ? (
        <div className="trees">
          {step.options.map((o, i) => (
            <button key={i} className={'tree' + (sel.includes(i) ? ' on' : '')} onClick={() => toggle(i)}>
              <span className="tree-img">
                <Icon name={o === 'Palma' ? 'palm' : 'tree'} size={54} />
                <small>Foto por agregar</small>
              </span>
              <span className="opt-row">
                <span className="box" />
                {o}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="opts">
          {step.options.map((o, i) => (
            <button key={i} className={'opt multi' + (sel.includes(i) ? ' on' : '')} onClick={() => toggle(i)}>
              <span className="box">{sel.includes(i) && <Icon name="check" size={14} />}</span>
              {o}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function TrueFalse({ step, setCheck }: ActProps<Extract<Step, { kind: 'tf' }>>) {
  const [ans, setAns] = useState<Record<number, boolean>>({});
  useEffect(() => {
    setCheck(Object.keys(ans).length === step.items.length ? () => step.items.every((it, i) => ans[i] === it.value) : null);
  }, [ans]);
  return (
    <>
      {step.hint && <p className="hint">{step.hint}</p>}
      <div className="tf">
        {step.items.map((it, i) => (
          <div key={i} className="tf-it">
            <div className="tf-q">
              <p>{it.text}</p>
              <ReadAloud text={it.text} />
            </div>
            <div className="tf-btns">
              <button className={'tfb f' + (ans[i] === false ? ' on' : '')} onClick={() => setAns({ ...ans, [i]: false })} aria-label="Falso">
                F
              </button>
              <button className={'tfb v' + (ans[i] === true ? ' on' : '')} onClick={() => setAns({ ...ans, [i]: true })} aria-label="Verdadero">
                V
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Classify({ step, setCheck }: ActProps<Extract<Step, { kind: 'classify' }>>) {
  const [where, setWhere] = useState<Record<number, 0 | 1>>({});
  const [sel, setSel] = useState<number | null>(null);
  const order = useMemo(() => shuffled(step.cards, 5), [step]);
  useEffect(() => {
    setCheck(Object.keys(where).length === step.cards.length ? () => step.cards.every((c, i) => where[i] === c.col) : null);
  }, [where]);
  const place = (col: 0 | 1) => {
    if (sel === null) return;
    setWhere({ ...where, [sel]: col });
    setSel(null);
  };
  const pool = order.filter((i) => where[i] === undefined);
  return (
    <>
      {step.hint && <p className="hint">{step.hint}</p>}
      <div className="pool">
        {pool.map((i) => (
          <button key={i} className={'chip card-chip' + (sel === i ? ' on' : '')} onClick={() => setSel(sel === i ? null : i)}>
            {step.cards[i].text}
          </button>
        ))}
        {!pool.length && <p className="hint small">¡Ubicaste todas las tarjetas! Toca una para moverla.</p>}
      </div>
      <div className="cls">
        {step.columns.map((name, col) => (
          <div key={col} className={'cls-col' + (sel !== null ? ' target' : '')} onClick={() => place(col as 0 | 1)} role="button" tabIndex={0}>
            <h4>{name}</h4>
            {order
              .filter((i) => where[i] === col)
              .map((i) => (
                <button
                  key={i}
                  className="chip card-chip placed"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (sel !== null) return place(col as 0 | 1);
                    const w = { ...where };
                    delete w[i];
                    setWhere(w);
                    setSel(i);
                  }}
                >
                  {step.cards[i].text}
                </button>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Label({ step, setCheck }: ActProps<Extract<Step, { kind: 'label' }>>) {
  const [at, setAt] = useState<Record<number, number>>({}); // número -> parte
  const [sel, setSel] = useState<number | null>(null);
  const names = useMemo(() => shuffled(step.parts, 11), [step]);
  useEffect(() => {
    setCheck(Object.keys(at).length === step.parts.length ? () => step.parts.every((_, i) => at[i] === i) : null);
  }, [at]);
  const used = Object.values(at);
  const spots = [
    { x: 150, y: 46 },
    { x: 70, y: 248 },
    { x: 214, y: 140 },
    { x: 118, y: 160 },
  ];
  return (
    <>
      {step.hint && <p className="hint">{step.hint}</p>}
      <div className="label-img">
        <svg viewBox="0 0 300 290" role="img" aria-label="Zumbambico con sus partes numeradas">
          <rect x="0" y="0" width="300" height="290" rx="18" fill="#f6efe2" />
          <ellipse cx="150" cy="262" rx="110" ry="14" fill="#e3d3b4" />
          <rect x="40" y="236" width="220" height="24" rx="8" fill="#a7743f" />
          <rect x="135" y="80" width="18" height="160" rx="8" fill="#9bb760" stroke="#6f8a3b" strokeWidth="3" />
          <path d="M139 120h10M139 170h10M139 210h10" stroke="#6f8a3b" strokeWidth="3" />
          <path d="M150 74 C 190 90, 210 130, 200 160" fill="none" stroke="#c9a46a" strokeWidth="4" strokeDasharray="7 5" />
          <circle cx="150" cy="58" r="26" fill="#6b3d1e" />
          <ellipse cx="141" cy="50" rx="7" ry="5" fill="#8f5a33" />
          {spots.map((p, i) => {
            const part = at[i];
            return (
              <g
                key={i}
                className={'spot' + (part !== undefined ? ' on' : '') + (sel !== null ? ' target' : '')}
                onClick={() => {
                  if (sel !== null) {
                    const a = { ...at };
                    Object.keys(a).forEach((k) => a[+k] === sel && delete a[+k]);
                    a[i] = sel;
                    setAt(a);
                    setSel(null);
                  } else if (part !== undefined) {
                    const a = { ...at };
                    delete a[i];
                    setAt(a);
                  }
                }}
              >
                <circle cx={p.x + 40} cy={p.y} r="17" />
                <text x={p.x + 40} y={p.y + 6} textAnchor="middle">
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="label-legend">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="label-row">
            <b>{i + 1}</b>
            <span>{at[i] !== undefined ? step.parts[at[i]] : '—'}</span>
          </div>
        ))}
      </div>
      <div className="pool">
        {names
          .filter((i) => !used.includes(i))
          .map((i) => (
            <button key={i} className={'chip' + (sel === i ? ' on' : '')} onClick={() => setSel(sel === i ? null : i)}>
              {step.parts[i]}
            </button>
          ))}
      </div>
    </>
  );
}

function Audio({ step, setCheck }: ActProps<Extract<Step, { kind: 'audio' }>>) {
  const [sel, setSel] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  useEffect(() => {
    setCheck(sel !== null ? () => sel === step.correct : null);
  }, [sel]);
  useEffect(() => () => stopSound(), []);
  const play = (i: number) => {
    if (playing === i) return stopSound();
    setPlaying(i);
    playSound(i, () => setPlaying((p) => (p === i ? null : p)));
  };
  return (
    <>
      {step.hint && <p className="hint">{step.hint}</p>}
      <div className="sounds">
        {Array.from({ length: step.count }, (_, i) => (
          <div key={i} className={'snd' + (sel === i ? ' on' : '') + (playing === i ? ' playing' : '')}>
            <button className="snd-play" onClick={() => play(i)} aria-label={`Reproducir sonido ${i + 1}`}>
              <Icon name={playing === i ? 'pause' : 'speaker'} size={30} />
              <span className="wave">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
            <button className="snd-pick" onClick={() => setSel(i)}>
              <span className="radio" />
              Sonido {i + 1}
            </button>
          </div>
        ))}
      </div>
      <p className="hint small">Los sonidos son de muestra; se reemplazarán por las grabaciones de la comunidad.</p>
    </>
  );
}

function OpenAnswer({ step, setCheck, onAnswer }: ActProps<Extract<Step, { kind: 'open' }>> & { onAnswer?: (a: { text: string; audio: string | null }) => void }) {
  const [text, setText] = useState('');
  const r = useRecorder(90);
  useEffect(() => {
    const ok = text.trim().length >= 10 || !!r.url;
    setCheck(ok ? () => (onAnswer?.({ text, audio: r.url }), true) : null);
  }, [text, r.url]);
  return (
    <>
      <Bubble text={step.question}>{step.question}</Bubble>
      {step.canto && (
        <div className="canto">
          <button className="link-btn" onClick={() => playSound(2)}>
            <Icon name="speaker" size={18} /> Escuchar el canto
          </button>
          <small>El canto se agregará cuando la comunidad lo grabe; por ahora suena el zumbambico.</small>
        </div>
      )}
      <OpenBox text={text} setText={setText} rec={r} />
    </>
  );
}

function OpenBox({ text, setText, rec: r }: { text: string; setText: (s: string) => void; rec: ReturnType<typeof useRecorder> }) {
  return (
    <div className={'open' + (r.state === 'rec' ? ' rec' : '')}>
      <textarea placeholder="Escribe aquí tu respuesta…" maxLength={300} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="open-bar">
        <span className="count">{text.length} / 300</span>
        {r.state === 'rec' ? (
          <button className="mic on" onClick={r.stop}>
            <Icon name="stop" size={18} /> Grabando {fmt(r.secs)}
          </button>
        ) : (
          <button className="mic" onClick={r.start}>
            <Icon name="mic" size={18} /> {r.url ? 'Grabar otra vez' : 'Responder con voz'}
          </button>
        )}
      </div>
      {r.url && r.state === 'done' && <audio controls src={r.url} className="open-audio" />}
      {r.state === 'denied' && <p className="err">No pudimos usar el micrófono. Revisa el permiso o escribe tu respuesta.</p>}
      <p className="hint small">Puedes responder con texto o con tu voz. No hay una sola respuesta correcta.</p>
    </div>
  );
}

function Mcq({ step, setCheck }: ActProps<Extract<Step, { kind: 'mcq' }>>) {
  const [sel, setSel] = useState<number | null>(null);
  useEffect(() => {
    setCheck(sel !== null ? () => sel === step.correct : null);
  }, [sel]);
  return (
    <>
      <Context title={step.title} text={step.context} />
      <Bubble text={step.question + '. ' + step.options.join('. ')}>{step.question}</Bubble>
      <div className="opts">
        {step.options.map((o, i) => (
          <button key={i} className={'opt' + (sel === i ? ' on' : '')} onClick={() => setSel(i)}>
            <span className="radio" />
            {o}
          </button>
        ))}
      </div>
    </>
  );
}

function Create({ step, setCheck, g }: ActProps<Extract<Step, { kind: 'create' }>> & { g: GameId }) {
  const game = gameById(g);
  const [mode, setMode] = useState<'write' | 'photo' | 'voice' | null>(null);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const r = useRecorder(120);
  const photoIn = useRef<HTMLInputElement>(null);
  const videoIn = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const ok = text.trim().length >= 5 || !!photo || !!r.url || !!video;
    setCheck(
      ok
        ? () => {
            updateUser((u) => ({
              ...u,
              memoria: [
                {
                  id: uid(),
                  title: `Mi ${game.short.toLowerCase()} ${photo ? 'del territorio' : ''}`.trim(),
                  subtitle: `${game.name} · Nivel 6`,
                  date: today(),
                  text: text.trim() || (video ? `Video: ${video}` : undefined),
                  photo: photo ?? undefined,
                  audio: r.url && r.url.length < 1_500_000 ? r.url : undefined,
                },
                ...u.memoria,
              ],
            }));
            return true;
          }
        : null,
    );
  }, [text, photo, r.url, video]);
  return (
    <>
      <Bubble text={step.question}>{step.question}</Bubble>
      {(step.prompt || step.detail) && (
        <div className="ctx">
          {step.prompt && <h3>{step.prompt}</h3>}
          {step.detail && <p>{step.detail}</p>}
        </div>
      )}
      <div className="modes">
        <button className={'mode' + (mode === 'write' ? ' on' : '')} onClick={() => setMode('write')}>
          <Icon name="pencil" size={28} />
          Escribir
        </button>
        <button className={'mode' + (photo ? ' on' : '')} onClick={() => photoIn.current?.click()}>
          <Icon name="image" size={28} />
          Enviar foto
        </button>
        <button className={'mode' + (mode === 'voice' || video ? ' on' : '')} onClick={() => setMode('voice')}>
          <Icon name="video" size={28} />
          Grabar
        </button>
      </div>
      <input
        ref={photoIn}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (f) setPhoto(await shrinkImage(f));
        }}
      />
      <input ref={videoIn} type="file" accept="video/*" capture="environment" hidden onChange={(e) => setVideo(e.target.files?.[0]?.name ?? null)} />
      {photo && (
        <div className="photo-prev">
          <img src={photo} alt="Tu creación" />
          <button className="link-btn" onClick={() => setPhoto(null)}>
            Quitar foto
          </button>
        </div>
      )}
      {mode === 'write' && <OpenBox text={text} setText={setText} rec={r} />}
      {mode === 'voice' && (
        <div className="ctx">
          <div className="row-btns">
            {r.state === 'rec' ? (
              <button className="mic on" onClick={r.stop}>
                <Icon name="stop" size={18} /> Grabando {fmt(r.secs)}
              </button>
            ) : (
              <button className="mic" onClick={r.start}>
                <Icon name="mic" size={18} /> Grabar voz
              </button>
            )}
            <button className="mic" onClick={() => videoIn.current?.click()}>
              <Icon name="video" size={18} /> Grabar video
            </button>
          </div>
          {r.url && <audio controls src={r.url} className="open-audio" />}
          {video && <p className="hint small">Video listo: {video}</p>}
          {r.state === 'denied' && <p className="err">No pudimos usar el micrófono. Revisa el permiso.</p>}
        </div>
      )}
      <p className="hint small">Tu creación se guarda en Memoria.</p>
    </>
  );
}

function Wip({ step, setCheck }: ActProps<Extract<Step, { kind: 'wip' }>>) {
  useEffect(() => setCheck(() => true), []);
  return (
    <div className="wip">
      <h3>En construcción</h3>
      <p>{step.message}</p>
    </div>
  );
}

// ---------- pantalla del nivel ----------
export function Play({ g, n }: { g: GameId; n: number }) {
  const game = gameById(g);
  const level = game.levels[n - 1];
  const [i, setI] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [check, setCheckState] = useState<Check | null>(null);
  const [result, setResult] = useState<null | 'ok' | 'error' | 'done'>(null);
  const step = level.steps[Math.min(i, level.steps.length - 1)];
  const setCheck = (c: Check | null) => setCheckState(() => c);

  const submit = () => {
    if (!check) return;
    const ok = check();
    chime(ok);
    if (!ok) return setResult('error');
    if (i < level.steps.length - 1) {
      setResult('ok');
      setTimeout(() => {
        setResult(null);
        setI(i + 1);
        setCheck(null);
        window.scrollTo(0, 0);
      }, 900);
    } else {
      completeLevel(g, n);
      setResult('done');
    }
  };

  const multi = level.steps.length > 1;
  const label = step.kind === 'wip' ? 'CONTINUAR' : step.kind === 'open' || step.kind === 'create' ? 'ENVIAR' : 'COMPROBAR';
  const props = { step, setCheck } as never;

  return (
    <div className="scr themed" style={themeStyle(game)}>
      <Header title={game.name.toUpperCase()} section="Retosaberes" icon="img/ic_retosaberes.png" />
      <div className="body play">
        <div className="play-top">
          <h2 className="instr">{step.instr}</h2>
          <HelpButton text={helpFor(step)} />
        </div>
        <Progress level={n} />
        {multi && (
          <div className="steps-dots">
            {level.steps.map((_, k) => (
              <i key={k} className={k < i ? 'done' : k === i ? 'on' : ''} />
            ))}
            <span>
              {step.kind === 'mcq' ? 'Pregunta' : 'Parte'} {i + 1} de {level.steps.length}
            </span>
          </div>
        )}
        <div className="act" key={`${n}-${i}-${attempt}`}>
          {step.kind === 'match' && <Match {...props} />}
          {step.kind === 'order' && <Order {...props} />}
          {step.kind === 'pick' && <Pick {...props} />}
          {step.kind === 'tf' && <TrueFalse {...props} />}
          {step.kind === 'classify' && <Classify {...props} />}
          {step.kind === 'label' && <Label {...props} />}
          {step.kind === 'audio' && <Audio {...props} />}
          {step.kind === 'open' && <OpenAnswer {...props} />}
          {step.kind === 'mcq' && <Mcq {...props} />}
          {step.kind === 'create' && <Create {...props} g={g} />}
          {step.kind === 'wip' && <Wip {...props} />}
        </div>
        <div className="play-cta">
          <Btn onClick={submit} disabled={!check} chev={false} className="check">
            {label}
          </Btn>
          {!check && <p className="hint small">{step.kind === 'open' || step.kind === 'create' ? 'Responde para continuar' : 'Elige tu respuesta para comprobar'}</p>}
        </div>
      </div>
      <TabBar active="juegos" />

      {result === 'ok' && (
        <div className="toast ok">
          <Icon name="check" size={22} /> ¡Correcto!
        </div>
      )}
      {result === 'error' && (
        <ResultCard
          g={g}
          ok={false}
          onAction={() => {
            setResult(null);
            setCheck(null);
            setAttempt((a) => a + 1);
          }}
        />
      )}
      {result === 'done' && (
        <ResultCard
          g={g}
          ok
          n={n}
          onAction={() => {
            setResult(null);
            if (n < 6) replace({ name: 'play', g, n: n + 1 });
            else replace({ name: 'logro', g });
          }}
        />
      )}
    </div>
  );
}

function helpFor(s: Step): string {
  switch (s.kind) {
    case 'match':
      return 'Toca un elemento de la columna izquierda y después su pareja en la derecha. Las parejas quedan del mismo color. Toca una pareja para deshacerla.';
    case 'order':
      return 'Toca los pasos en el orden en que se hacen. Cada paso recibe un número. Toca un paso numerado para quitarlo.';
    case 'pick':
      return 'Lee con atención y toca todas las opciones que sean correctas. Luego toca COMPROBAR.';
    case 'tf':
      return 'Lee cada frase y toca F si es falsa o V si es verdadera.';
    case 'classify':
      return 'Toca una tarjeta y luego la columna donde va. Para cambiarla, tócala dentro de la columna.';
    case 'label':
      return 'Toca un nombre y después el número de la imagen donde está esa parte.';
    case 'audio':
      return 'Toca cada parlante para escuchar el sonido. Luego elige cuál es el del zumbambico.';
    case 'open':
      return 'Escribe tu respuesta o toca "Responder con voz" para grabarla. Luego toca ENVIAR.';
    case 'mcq':
      return 'Lee la pregunta y toca la respuesta que creas correcta. Luego toca COMPROBAR.';
    case 'create':
      return 'Crea tu propia versión del juego: escríbela, envía una foto de tu dibujo o grábala. Se guarda en Memoria.';
    default:
      return 'Este nivel se está preparando con la comunidad. Toca CONTINUAR.';
  }
}

export { nav };
