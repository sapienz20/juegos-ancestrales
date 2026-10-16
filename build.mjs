// Compila la app en la carpeta dist/ (la que Capacitor empaqueta en el APK).
import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, rmSync } from 'node:fs';

const watch = process.argv.includes('--watch');
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
cpSync('public', 'dist', { recursive: true });
cpSync('index.html', 'dist/index.html');

const opts = {
  entryPoints: { app: 'src/main.tsx' },
  bundle: true,
  minify: !watch,
  sourcemap: watch,
  target: 'es2020',
  outdir: 'dist',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': watch ? '"development"' : '"production"' },
  logLevel: 'info',
};

if (watch) {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: 'dist', port: 5173 });
  console.log(`Abre http://localhost:${port}`);
} else {
  await esbuild.build(opts);
}
