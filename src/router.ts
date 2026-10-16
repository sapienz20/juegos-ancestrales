import { useSyncExternalStore } from 'react';
import type { GameId } from './data';

// Navegación con el historial del navegador: en Android el botón "atrás" del
// teléfono vuelve a la pantalla anterior.
export type Route =
  | { name: 'splash' | 'login' | 'register' | 'ready' | 'setup' | 'welcome' | 'menu' | 'perfil' | 'misjuegos' | 'logros' | 'mediateca' | 'memoria' | 'comunidad' }
  | { name: 'map' | 'game' | 'origen' | 'creando' | 'vivencia' | 'levels' | 'logro'; g: GameId }
  | { name: 'play'; g: GameId; n: number }
  | { name: 'video'; g: GameId; part: 'origen' | 'creando' };

let route: Route = (history.state as Route) ?? { name: 'splash' };
const ls = new Set<() => void>();
const emit = () => ls.forEach((l) => l());

window.addEventListener('popstate', (e) => {
  route = (e.state as Route) ?? { name: 'menu' };
  emit();
});

if (!history.state) history.replaceState(route, '');

export function nav(r: Route) {
  route = r;
  history.pushState(r, '');
  window.scrollTo(0, 0);
  emit();
}

export function replace(r: Route) {
  route = r;
  history.replaceState(r, '');
  window.scrollTo(0, 0);
  emit();
}

export function back() {
  history.back();
}

export function useRoute() {
  return useSyncExternalStore(
    (cb) => {
      ls.add(cb);
      return () => ls.delete(cb);
    },
    () => route,
  );
}
