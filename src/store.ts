import { useSyncExternalStore } from 'react';
import { GAMES, GameId } from './data';

// Todo se guarda en el teléfono (localStorage). En Android, Capacitor conserva estos datos
// entre sesiones. Más adelante se puede reemplazar por un servidor sin cambiar las pantallas.

export type Account = { name: string; birth: string; pueblo: string; rol: string; email: string; pass: string };

export type MemoryItem = { id: string; title: string; subtitle: string; date: string; text?: string; photo?: string; audio?: string };
export type Post = { id: string; text: string; game: string; date: string; likes: number };

export type UserData = {
  avatar: number;
  nickname: string;
  pueblo: string;
  profileDone: boolean;
  done: Record<GameId, number[]>;
  seen: string[];
  memoria: MemoryItem[];
  posts: Post[];
  likes: string[];
};

type State = { accounts: Record<string, Account>; session: string | null; users: Record<string, UserData> };

const KEY = 'juegos-ancestrales-v1';

const emptyUser = (pueblo = 'Nasa'): UserData => ({
  avatar: 1,
  nickname: 'Colibrí Azul',
  pueblo,
  profileDone: false,
  done: { bodoquera: [], trompo: [], palmo: [], zumbambico: [] },
  seen: [],
  memoria: [],
  posts: [],
  likes: [],
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* almacenamiento no disponible */
  }
  return { accounts: {}, session: null, users: {} };
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* sin espacio o bloqueado: la app sigue funcionando en memoria */
  }
}

function set(next: State) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function useStore() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

export function currentUser(s: State = state): UserData | null {
  return s.session ? s.users[s.session] ?? null : null;
}

export function currentAccount(s: State = state): Account | null {
  return s.session ? s.accounts[s.session] ?? null : null;
}

export function updateUser(fn: (u: UserData) => UserData) {
  if (!state.session) return;
  const u = state.users[state.session] ?? emptyUser();
  set({ ...state, users: { ...state.users, [state.session]: fn(u) } });
}

async function hash(text: string) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'p:' + btoa(unescape(encodeURIComponent(text)));
  }
}

const norm = (s: string) => s.trim().toLowerCase();

export async function register(a: Omit<Account, 'pass'> & { pass: string }): Promise<string | null> {
  const key = norm(a.email);
  if (state.accounts[key]) return 'Ya existe una cuenta con ese correo. Ingresa con tu contraseña.';
  const account: Account = { ...a, email: key, pass: await hash(a.pass) };
  set({
    ...state,
    accounts: { ...state.accounts, [key]: account },
    users: { ...state.users, [key]: emptyUser(a.pueblo) },
    session: key,
  });
  return null;
}

export async function login(user: string, pass: string): Promise<string | null> {
  const key = norm(user);
  const acc = state.accounts[key] ?? Object.values(state.accounts).find((a) => norm(a.name) === key);
  if (!acc) return 'No encontramos esa cuenta en este teléfono. Toca REGÍSTRATE para crearla.';
  if (acc.pass !== (await hash(pass))) return 'La contraseña no coincide. Inténtalo de nuevo.';
  set({ ...state, session: acc.email, users: { ...state.users, [acc.email]: state.users[acc.email] ?? emptyUser(acc.pueblo) } });
  return null;
}

export function logout() {
  set({ ...state, session: null });
}

// ---- progreso ----
export const TOTAL_LEVELS = GAMES.length * 6;

export function levelUnlocked(u: UserData, g: GameId, n: number) {
  return n === 1 || u.done[g].includes(n - 1) || u.done[g].includes(n);
}

export function completeLevel(g: GameId, n: number) {
  updateUser((u) => (u.done[g].includes(n) ? u : { ...u, done: { ...u.done, [g]: [...u.done[g], n].sort() } }));
}

export function saberes(u: UserData, g?: GameId) {
  const ids = g ? [g] : (Object.keys(u.done) as GameId[]);
  return ids.reduce((sum, id) => sum + u.done[id].reduce((a, b) => a + b, 0), 0);
}

export function levelsDone(u: UserData) {
  return (Object.keys(u.done) as GameId[]).reduce((a, id) => a + u.done[id].length, 0);
}

export function markSeen(key: string) {
  updateUser((u) => (u.seen.includes(key) ? u : { ...u, seen: [...u.seen, key] }));
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
