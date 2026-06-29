import { useState, useEffect } from 'react';

const THREE_JS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

/**
 * useThreeJS — Hook untuk lazy-load Three.js dari CDN.
 * Cek apakah `window.THREE` sudah tersedia, jika tidak, inject script tag.
 * Cleanup otomatis tidak dilakukan karena Three.js bersifat global singleton.
 *
 * @returns {{ threeLoaded: boolean }}
 */
export function useThreeJS() {
  const [threeLoaded, setThreeLoaded] = useState(() => !!window.THREE);

  useEffect(() => {
    if (window.THREE) {
      setThreeLoaded(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${THREE_JS_CDN}"]`);
    if (existingScript) {
      // Script sudah ada, tunggu sampai selesai load
      const onLoad = () => setThreeLoaded(true);
      existingScript.addEventListener('load', onLoad);
      return () => existingScript.removeEventListener('load', onLoad);
    }

    const script = document.createElement('script');
    script.src = THREE_JS_CDN;
    script.async = true;
    script.onload = () => setThreeLoaded(true);
    script.onerror = () => console.error('[useThreeJS] Gagal memuat Three.js dari CDN.');
    document.head.appendChild(script);
  }, []);

  return { threeLoaded };
}
