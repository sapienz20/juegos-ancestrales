import { useEffect, useRef, useState } from 'react';

// Reduce una foto para guardarla en el teléfono sin ocupar mucho espacio.
export function shrinkImage(file: File, max = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.78));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(file);
  });
}

// Grabación de voz con el micrófono del teléfono.
export function useRecorder(maxSecs = 60) {
  const [state, setState] = useState<'idle' | 'rec' | 'done' | 'denied'>('idle');
  const [secs, setSecs] = useState(0);
  const [url, setUrl] = useState<string | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const timer = useRef<number>();

  const stop = () => {
    clearInterval(timer.current);
    if (rec.current && rec.current.state !== 'inactive') rec.current.stop();
  };

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
        const fr = new FileReader();
        fr.onload = () => {
          setUrl(fr.result as string);
          setState('done');
        };
        fr.readAsDataURL(blob);
      };
      rec.current = mr;
      mr.start();
      setSecs(0);
      setState('rec');
      timer.current = window.setInterval(() => {
        setSecs((s) => {
          if (s + 1 >= maxSecs) stop();
          return s + 1;
        });
      }, 1000);
    } catch {
      setState('denied');
    }
  };

  const reset = () => {
    setUrl(null);
    setState('idle');
    setSecs(0);
  };

  useEffect(() => () => stop(), []);
  return { state, secs, url, start, stop, reset };
}

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
