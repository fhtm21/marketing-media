import React, { useState, useEffect, useRef } from 'react';
import { WEATHER_EVENTS } from '../data/weatherEvents.js';
import { MARKET_PHASES } from '../engine/phases.js';
import { calcMarketScore, isMarketTargetBeaten } from '../engine/scoring.js';
import { SOUNDS } from '../engine/synthPlay.js';
import { useThreeJS } from '../hooks/useThreeJS.js';
import InsightModal from './InsightModal.jsx';

const WEATHER_ICONS = {
  normal: '🌤️',
  storm: '⛈️',
  sun: '☀️',
  aurora: '🌌',
  fissure: '🧊',
};

const MARKET_INSIGHT = `Perusahaan e-commerce besar menggunakan pricing engine berbasis data real-time. Di BINUS @Bekasi Business IT, kamu akan mempelajari cara membangun sistem ERP serupa, menganalisis log database, dan merancang jalur customer analytics.`;

/**
 * MarketTycoon — Module 1: Penguin Market Tycoon 3D.
 * Simulasi 5 hari manajemen kios ikan arktik dengan Three.js 3D scene.
 *
 * Phase machine: planning → simulating → report → gameover
 *
 * @param {{ onExit:()=>void, onComplete:(score:number)=>void }} props
 */
export default function MarketTycoon({ onExit, onComplete }) {
  const { threeLoaded } = useThreeJS();
  const [dayIndex, setDayIndex] = useState(0);
  const [cash, setCash] = useState(100);
  const [stock, setStock] = useState(0);
  const [retailPrice, setRetailPrice] = useState(10);
  const [phase, setPhase] = useState(MARKET_PHASES.PLANNING);
  const [salesReport, setSalesReport] = useState({ sold: 0, revenue: 0, spoilage: 0, profit: 0 });
  const [historicalData, setHistoricalData] = useState([]);
  const [simSold, setSimSold] = useState(0);
  const [simRevenue, setSimRevenue] = useState(0);
  const [speechBubbles, setSpeechBubbles] = useState([]);
  const [showInsight, setShowInsight] = useState(false);

  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const animFrameRef = useRef(null);
  const simSoldRef = useRef(0);
  const simRevenueRef = useRef(0);
  const simStockRef = useRef(0);
  const speechBubblesRef = useRef([]);
  const finishCalledRef = useRef(false);

  const weather = WEATHER_EVENTS[dayIndex];
  const maxAffordable = Math.floor(cash / weather.wholesaleCost);
  const buyingCap = Math.min(weather.maxWholesaleStock, maxAffordable);

  // Auto-set sensible defaults per day
  useEffect(() => {
    setRetailPrice(Math.round(weather.wholesaleCost * 2));
    setStock(Math.min(10, buyingCap));
  }, [dayIndex]);

  const adjustStock = (delta) => {
    const next = stock + delta;
    if (next >= 0 && next <= buyingCap) setStock(next);
  };

  // ── Three.js 3D Simulation ──
  useEffect(() => {
    if (phase !== MARKET_PHASES.SIMULATING || !threeLoaded || !mountRef.current) return;
    const THREE = window.THREE;
    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const bgMap = { normal: 0x1e293b, storm: 0x0f172a, sun: 0x451a03, aurora: 0x020617, fissure: 0x111827 };
    scene.background = new THREE.Color(bgMap[weather.type] || 0x0f172a);
    scene.fog = new THREE.FogExp2(bgMap[weather.type] || 0x0f172a, weather.type === 'storm' ? 0.08 : 0.05);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    let theta = 0.5, phi = 0.35;
    const R = 6.5;
    const updateCam = () => {
      camera.position.set(R * Math.sin(theta) * Math.cos(phi), 1.2 + R * Math.sin(phi), R * Math.cos(theta) * Math.cos(phi));
      camera.lookAt(0, 0.4, 0);
    };
    updateCam();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Camera drag
    let dragging = false, prevX = 0, prevY = 0;
    const onDown = (e) => { dragging = true; prevX = e.touches ? e.touches[0].clientX : e.clientX; prevY = e.touches ? e.touches[0].clientY : e.clientY; };
    const onMove = (e) => {
      if (!dragging) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      theta -= (cx - prevX) * 0.007;
      phi = Math.max(0.05, Math.min(Math.PI / 2.3, phi + (cy - prevY) * 0.007));
      prevX = cx; prevY = cy; updateCam();
    };
    const onUp = () => { dragging = false; };
    const parent = mountRef.current;
    parent.addEventListener('mousedown', onDown);
    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseup', onUp);
    parent.addEventListener('touchstart', onDown, { passive: true });
    parent.addEventListener('touchmove', onMove, { passive: true });
    parent.addEventListener('touchend', onUp);

    // Lighting
    const ambColors = { normal: 0xbae6fd, storm: 0x64748b, sun: 0xfde047, aurora: 0x10b981, fissure: 0x334155 };
    scene.add(new THREE.AmbientLight(ambColors[weather.type] || 0xbae6fd, weather.type === 'sun' ? 0.9 : 0.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(5, 7, 3); sun.castShadow = true;
    scene.add(sun);

    // Sky elements
    const skyGroup = new THREE.Group();
    scene.add(skyGroup);
    if (weather.type === 'normal') {
      const cg = new THREE.SphereGeometry(0.5, 5, 5);
      const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
      for (let i = 0; i < 5; i++) {
        const cloud = new THREE.Group();
        cloud.add(new THREE.Mesh(cg, cm));
        cloud.position.set(Math.random() * 8 - 4, 3 + Math.random() * 1.5, -4 - Math.random() * 4);
        skyGroup.add(cloud);
      }
    } else if (weather.type === 'aurora') {
      const colors = [0x10b981, 0x8b5cf6, 0x06b6d4];
      const ribbons = colors.map((c, i) => {
        const rg = new THREE.PlaneGeometry(15, 3, 24, 1);
        const rm = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.28, side: THREE.DoubleSide });
        const r = new THREE.Mesh(rg, rm);
        r.position.set(0, 3.8, -6 - i * 2);
        skyGroup.add(r);
        return r;
      });
      skyGroup.userData.ribbons = ribbons;
    }

    // Ground
    const groundMat = new THREE.MeshStandardMaterial({ color: weather.type === 'sun' ? 0x93c5fd : 0xe0f2fe, roughness: 0.15, metalness: 0.1 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(25, 25), groundMat);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
    scene.add(ground);

    // Icebergs
    [[-5.5, -5.5, 3.5], [5.5, -6.5, 4.5], [-7, 3, 2.5], [7, 5, 3.5]].forEach(([x, z, h]) => {
      const m = new THREE.Mesh(
        new THREE.ConeGeometry(2, h, 5),
        new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.3, flatShading: true, transparent: true, opacity: 0.9 })
      );
      m.position.set(x, h / 2 - 0.2, z);
      scene.add(m);
    });

    // Stall
    const stall = new THREE.Group();
    const counter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 0.8), new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.8 }));
    counter.position.y = 0.35; counter.castShadow = true; stall.add(counter);
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 1.0), new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 }));
    canopy.position.set(0, 1.65, 0.3); canopy.rotation.x = 0.1; stall.add(canopy);
    stall.position.set(0, 0, -0.4);
    scene.add(stall);

    // Penguin builder
    const buildPenguin = (isShopkeeper = false) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.72, 8), new THREE.MeshStandardMaterial({ color: isShopkeeper ? 0x1e293b : 0x0f172a, roughness: 0.5 }));
      body.position.y = 0.36; body.castShadow = true; g.add(body);
      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }));
      belly.geometry.scale(1, 1.1, 0.25); belly.position.set(0, 0.36, 0.24); g.add(belly);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.16, 5), new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 }));
      beak.geometry.rotateX(Math.PI / 2); beak.position.set(0, 0.52, 0.29); g.add(beak);
      const flipperGeo = new THREE.BoxGeometry(0.06, 0.32, 0.12);
      const flipperMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const lf = new THREE.Mesh(flipperGeo, flipperMat);
      lf.position.set(-0.34, 0.36, 0); lf.rotation.z = 0.25; g.add(lf); g.userData.lf = lf;
      const rf = new THREE.Mesh(flipperGeo, flipperMat);
      rf.position.set(0.34, 0.36, 0); rf.rotation.z = -0.25; g.add(rf); g.userData.rf = rf;
      if (isShopkeeper) {
        const apron = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.25, 0.02), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        apron.position.set(0, 0.22, 0.26); g.add(apron);
      }
      return g;
    };

    const shopkeeper = buildPenguin(true);
    shopkeeper.position.set(0, 0.01, -0.75); shopkeeper.scale.setScalar(1.15);
    scene.add(shopkeeper);

    // Weather particles
    const pCount = weather.type === 'storm' ? 300 : 120;
    const pGeo = new THREE.BufferGeometry();
    const pPos = [], pVel = [];
    for (let i = 0; i < pCount; i++) {
      pPos.push(Math.random() * 12 - 6, Math.random() * 6, Math.random() * 10 - 5);
      pVel.push(weather.type === 'storm' ? -0.06 : 0, -0.025 - Math.random() * 0.015, 0);
    }
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.7 }));
    scene.add(particles);

    // Customer penguins
    const purchaseProbability = Math.max(0.08, retailPrice <= weather.idealRetailPrice
      ? 0.95
      : 1.0 - ((retailPrice - weather.idealRetailPrice) / weather.idealRetailPrice) * 1.5);
    const customerCount = Math.min(weather.maxDemand, Math.round(weather.maxDemand * weather.baseDemandFactor));
    const customers = [];
    for (let i = 0; i < customerCount; i++) {
      const mesh = buildPenguin(false);
      mesh.position.set(5.5 + i * 2.2, 0.01, 0.4);
      mesh.rotation.y = -Math.PI / 2;
      scene.add(mesh);
      customers.push({ mesh, speed: 1.4 + Math.random() * 0.6, phase: 'walking', targetX: 0.8, decided: false, willBuy: Math.random() < purchaseProbability, decisionTimer: 0 });
    }

    const coins = [];
    finishCalledRef.current = false;
    simSoldRef.current = 0; simRevenueRef.current = 0; simStockRef.current = stock;
    speechBubblesRef.current = [];
    setSimSold(0); setSimRevenue(0); setSpeechBubbles([]);

    const DURATION = 10000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / DURATION;

      // Shopkeeper bob
      if (shopkeeper) {
        shopkeeper.position.y = 0.01 + Math.sin(Date.now() * 0.003) * 0.02;
        if (shopkeeper.userData.lf) shopkeeper.userData.lf.rotation.z = 0.25 + Math.sin(Date.now() * 0.005) * 0.15;
        if (shopkeeper.userData.rf) shopkeeper.userData.rf.rotation.z = -0.25 - Math.sin(Date.now() * 0.005) * 0.15;
      }

      // Aurora wave
      if (weather.type === 'aurora' && skyGroup.userData.ribbons) {
        skyGroup.userData.ribbons.forEach((r, ri) => {
          const arr = r.geometry.attributes.position.array;
          for (let i = 0; i < arr.length; i += 3) arr[i + 1] = Math.sin(arr[i] * 0.4 + Date.now() * 0.002 + ri) * 0.25;
          r.geometry.attributes.position.needsUpdate = true;
        });
      }

      // Particles
      const pa = particles.geometry.attributes.position.array;
      for (let i = 0; i < pa.length; i += 3) {
        pa[i] += pVel[i]; pa[i + 1] += pVel[i + 1];
        if (pa[i + 1] < 0) { pa[i + 1] = 6; pa[i] = Math.random() * 12 - 6; }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Customers
      const bubbleList = [];
      customers.forEach((c) => {
        if (c.phase === 'walking') {
          c.mesh.position.x -= 0.035 * c.speed;
          c.mesh.rotation.z = Math.sin(Date.now() * 0.015) * 0.1;
          if (c.mesh.position.x <= c.targetX) { c.mesh.position.x = c.targetX; c.mesh.rotation.z = 0; c.phase = 'at_stall'; c.decisionTimer = Date.now(); }
        } else if (c.phase === 'at_stall' && !c.decided) {
          if (Date.now() - c.decisionTimer > 800) {
            c.decided = true;
            if (c.willBuy && simStockRef.current > 0) {
              simStockRef.current--; simSoldRef.current++; simRevenueRef.current += retailPrice;
              setSimSold(simSoldRef.current); setSimRevenue(simRevenueRef.current);
              const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.1, metalness: 0.8 }));
              coin.position.set(c.mesh.position.x, 0.7, c.mesh.position.z);
              scene.add(coin); coins.push(coin);
              speechBubblesRef.current.push({ id: Math.random(), type: 'buy', text: '😋 YUM!', pos: c.mesh.position.clone(), spawnTime: Date.now() });
              SOUNDS.coin();
            } else {
              speechBubblesRef.current.push({ id: Math.random(), type: 'refuse', text: simStockRef.current === 0 ? '😡 HABIS!' : '💸 MAHAL!', pos: c.mesh.position.clone(), spawnTime: Date.now() });
              SOUNDS.wrong();
            }
            c.phase = 'leaving';
          }
        } else if (c.phase === 'leaving') {
          c.mesh.position.x -= 0.035 * c.speed;
        }
      });

      // Coins float up
      for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].position.y += 0.035; coins[i].rotation.y += 0.05;
        if (coins[i].position.y > 2.2) { scene.remove(coins[i]); coins.splice(i, 1); }
      }

      // Speech bubbles projection
      speechBubblesRef.current.forEach((b, idx) => {
        const age = Date.now() - b.spawnTime;
        if (age > 1600) { speechBubblesRef.current.splice(idx, 1); return; }
        const v = b.pos.clone(); v.y += 0.8 + age * 0.0003; v.project(camera);
        const opacity = age < 200 ? age / 200 : age > 1200 ? (1600 - age) / 400 : 1;
        bubbleList.push({ id: b.id, type: b.type, text: b.text, x: (v.x * 0.5 + 0.5) * W, y: (-(v.y) * 0.5 + 0.5) * H, opacity });
      });
      setSpeechBubbles([...bubbleList]);

      renderer.render(scene, camera);

      if (progress < 1.0) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else if (!finishCalledRef.current) {
        finishCalledRef.current = true;
        finishDay(simSoldRef.current, simRevenueRef.current, simStockRef.current);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return;
      const nw = mountRef.current.clientWidth, nh = mountRef.current.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      parent.removeEventListener('mousedown', onDown);
      parent.removeEventListener('mousemove', onMove);
      parent.removeEventListener('mouseup', onUp);
      parent.removeEventListener('touchstart', onDown);
      parent.removeEventListener('touchmove', onMove);
      parent.removeEventListener('touchend', onUp);
      try { if (rendererRef.current?.domElement) parent.removeChild(rendererRef.current.domElement); } catch { /* safe */ }
      renderer.dispose();
    };
  }, [phase, threeLoaded]);

  const finishDay = (sold, revenue, leftover) => {
    const spoilage = weather.type !== 'sun' ? Math.floor(leftover * 0.4) : leftover;
    const profit = revenue - (stock * weather.wholesaleCost);
    const endCash = cash + revenue;
    setCash(endCash);
    setSalesReport({ sold, revenue, spoilage, profit });
    setHistoricalData(prev => [...prev, { day: dayIndex + 1, profit }]);
    setPhase(MARKET_PHASES.REPORT);
  };

  const startSim = () => {
    setCash(c => c - stock * weather.wholesaleCost);
    setPhase(MARKET_PHASES.SIMULATING);
  };

  const nextDay = () => {
    if (dayIndex < 4) { setDayIndex(d => d + 1); setPhase(MARKET_PHASES.PLANNING); }
    else { setPhase(MARKET_PHASES.GAMEOVER); }
  };

  const restart = () => { setDayIndex(0); setCash(100); setStock(0); setHistoricalData([]); setPhase(MARKET_PHASES.PLANNING); };

  const finalScore = calcMarketScore(cash);
  const targetBeaten = isMarketTargetBeaten(cash);
  const costToday = stock * weather.wholesaleCost;
  const ratio = costToday > 0 ? simRevenue / costToday : 0;

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#020c1b', overflowY: 'auto', fontFamily: "'Nunito', sans-serif",
      position: 'relative', color: '#fff',
    }}>
      <style>{`
        @keyframes MT_fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes MT_pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        input[type=range] { -webkit-appearance:none; appearance:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:#38bdf8; cursor:pointer; box-shadow:0 0 8px rgba(56,189,248,.5); }
        input[type=range]::-webkit-slider-runnable-track { height:4px; border-radius:4px; background:rgba(56,189,248,.2); }
        .MT_btn { transition:transform .18s,filter .18s; border:none; cursor:pointer; }
        .MT_btn:hover { filter:brightness(1.12); transform:translateY(-1px); }
        .MT_btn:active { transform:scale(.96); }
        .MT_btn:disabled { opacity:.35; cursor:not-allowed; transform:none; filter:none; }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '1px solid rgba(56,189,248,.12)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏪</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Market Tycoon 3D
          </span>
        </div>
        <button className="MT_btn" onClick={onExit} style={{
          fontFamily: "'Nunito', sans-serif", padding: '5px 12px',
          background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)',
          borderRadius: 8, fontSize: 10, color: '#94a3b8', fontWeight: 700,
        }}>
          Keluar ✕
        </button>
      </div>

      {/* ── PLANNING ── */}
      {phase === MARKET_PHASES.PLANNING && (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, animation: 'MT_fade .4s ease both' }}>
          {/* Day + Cash header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(7,21,37,.8)', border: '1px solid rgba(56,189,248,.12)',
            borderRadius: 12, padding: '10px 14px',
          }}>
            <div>
              <p style={{ fontSize: 8, color: '#0ea5e9', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>Hari Simulasi</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: '#e0f2fe', margin: '2px 0 0' }}>Hari {dayIndex + 1} dari 5</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Kas Tersisa</p>
              <p style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: '#4ade80', margin: '2px 0 0' }}>${cash}</p>
            </div>
          </div>

          {/* Weather card */}
          <div style={{
            background: 'rgba(7,21,37,.8)', border: '1px solid rgba(56,189,248,.15)',
            borderRadius: 14, padding: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 28 }}>{WEATHER_ICONS[weather.icon] || '🌤️'}</div>
              <div>
                <p style={{ fontSize: 8, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>Prakiraan Pasar</p>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#e0f2fe', margin: '2px 0 0' }}>{weather.name}</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, margin: '0 0 10px', background: 'rgba(2,12,27,.4)', padding: '8px 10px', borderRadius: 8 }}>
              {weather.desc}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, textAlign: 'center' }}>
              {[
                { label: 'Biaya Grosir', value: `$${weather.wholesaleCost}`, color: '#fbbf24' },
                { label: 'Stok Maks', value: `${weather.maxWholesaleStock}`, color: '#e0f2fe' },
                { label: 'Harga Ideal', value: `$${weather.idealRetailPrice}`, color: '#4ade80' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: 'rgba(2,12,27,.5)', borderRadius: 8, padding: '6px 4px', border: '1px solid rgba(255,255,255,.05)' }}>
                  <p style={{ fontSize: 7, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 2px' }}>{label}</p>
                  <p style={{ fontSize: 12, fontWeight: 800, color, margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stock adjuster */}
          <div style={{ background: 'rgba(7,21,37,.6)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: .5, margin: 0 }}>Beli Inventaris</p>
                <p style={{ fontSize: 9, color: '#64748b', margin: '2px 0 0' }}>@${weather.wholesaleCost}/unit · Budget: <span style={{ color: '#fbbf24' }}>${cash}</span></p>
              </div>
              <p style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800, margin: 0 }}>Total: ${stock * weather.wholesaleCost}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2,12,27,.5)', borderRadius: 10, padding: '8px 10px', border: '1px solid rgba(56,189,248,.1)' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[-5, -1].map(d => (
                  <button key={d} className="MT_btn" onClick={() => adjustStock(d)} disabled={stock <= 0}
                    style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)', color: '#e0f2fe', fontWeight: 800, fontSize: 12, fontFamily: 'monospace' }}>
                    {d}
                  </button>
                ))}
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: '#38bdf8', margin: 0 }}>{stock}</p>
                <p style={{ fontSize: 7, color: '#475569', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Unit</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 5].map(d => (
                  <button key={d} className="MT_btn" onClick={() => adjustStock(d)} disabled={stock >= buyingCap}
                    style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)', color: '#e0f2fe', fontWeight: 800, fontSize: 12, fontFamily: 'monospace' }}>
                    +{d}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <button className="MT_btn" onClick={() => setStock(0)} style={{ flex: 1, padding: '5px', fontSize: 9, color: '#64748b', background: 'rgba(2,12,27,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 6, fontWeight: 700 }}>Kosongkan</button>
              <button className="MT_btn" onClick={() => setStock(buyingCap)} style={{ flex: 1, padding: '5px', fontSize: 9, color: '#38bdf8', background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.2)', borderRadius: 6, fontWeight: 700 }}>Maks ({buyingCap})</button>
            </div>
          </div>

          {/* Price slider */}
          <div style={{ background: 'rgba(7,21,37,.6)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: .5, margin: 0 }}>Harga Jual Eceran</p>
                <p style={{ fontSize: 9, color: '#64748b', margin: '2px 0 0' }}>Atur markup dengan cermat untuk menarik pelanggan.</p>
              </div>
              <div style={{ background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)', borderRadius: 8, padding: '4px 10px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: '#38bdf8' }}>${retailPrice}</span>
              </div>
            </div>
            <input
              type="range"
              min={weather.wholesaleCost}
              max={weather.wholesaleCost * 4}
              value={retailPrice}
              onChange={(e) => setRetailPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#475569', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>
              <span>Min (${weather.wholesaleCost})</span>
              <span>Ideal (~${weather.idealRetailPrice})</span>
              <span>Maks (${weather.wholesaleCost * 4})</span>
            </div>
          </div>

          <button
            className="MT_btn"
            onClick={startSim}
            disabled={stock === 0}
            style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: '#020c1b',
              background: stock === 0 ? '#1e293b' : 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
              padding: '14px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1,
            }}
          >
            {stock === 0 ? 'Beli stok untuk mulai' : `Buka Simulator Hari ${dayIndex + 1} →`}
          </button>
        </div>
      )}

      {/* ── SIMULATING ── */}
      {phase === MARKET_PHASES.SIMULATING && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px', gap: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 9, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 2, margin: 0, animation: 'MT_pulse 1.5s infinite' }}>
              Live 3D Arktik Sandbox Mode
            </p>
            <p style={{ fontSize: 10, color: '#64748b', margin: '4px 0 0' }}>Drag/swipe pada scene untuk memutar kamera!</p>
          </div>

          <div style={{ flex: 1, minHeight: 280, borderRadius: 16, overflow: 'hidden', border: '2px solid rgba(56,189,248,.15)', position: 'relative', background: '#0f172a' }}>
            {threeLoaded
              ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
                  {/* Speech bubbles */}
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                    {speechBubbles.map(b => (
                      <div key={b.id} style={{
                        position: 'absolute', left: b.x, top: b.y,
                        transform: 'translate(-50%, -100%)',
                        opacity: b.opacity,
                        padding: '4px 10px', borderRadius: 14, fontSize: 11, fontWeight: 800,
                        background: b.type === 'buy' ? '#10b981' : '#ef4444',
                        color: b.type === 'buy' ? '#020c1b' : '#fff',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(0,0,0,.3)',
                      }}>
                        {b.text}
                      </div>
                    ))}
                  </div>
                </div>
              )
              : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, border: '3px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'MT_pulse .8s linear infinite' }} />
                  <p style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Memuat 3D Engine...</p>
                </div>
              )
            }
          </div>

          {/* Live stats */}
          <div style={{ background: 'rgba(2,12,27,.8)', border: '1px solid rgba(56,189,248,.12)', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
            {[
              { label: 'Investasi', value: `$${costToday}`, color: '#e0f2fe' },
              { label: 'Terjual', value: `${simSold}/${stock}`, color: '#e0f2fe' },
              { label: 'Pendapatan', value: `$${simRevenue}`, color: '#4ade80' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 7.5, color: '#475569', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color, margin: 0 }}>{value}</p>
              </div>
            ))}
          </div>
          {/* Profit bar */}
          <div style={{ background: 'rgba(2,12,27,.6)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 10, padding: '8px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              <span>Profitabilitas</span>
              <span style={{ color: ratio >= 1 ? '#4ade80' : ratio > 0.5 ? '#fbbf24' : '#f87171' }}>
                {ratio >= 1 ? 'Profit ✓' : ratio > 0.5 ? 'Mendekati BEP' : 'Rugi'}
              </span>
            </div>
            <div style={{ height: 6, background: 'rgba(56,189,248,.1)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 6,
                width: `${Math.min(100, Math.max(5, ratio * 100))}%`,
                background: ratio >= 1 ? '#10b981' : ratio > 0.5 ? '#f59e0b' : '#ef4444',
                transition: 'width .4s ease',
              }} />
            </div>
          </div>
        </div>
      )}

      {/* ── REPORT ── */}
      {phase === MARKET_PHASES.REPORT && (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, animation: 'MT_fade .4s ease both' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>📊</div>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 2px' }}>Laporan Keuangan Harian</h3>
            <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>Analitik Hari {dayIndex + 1} selesai diproses.</p>
          </div>

          <div style={{ background: 'rgba(7,21,37,.8)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 14, padding: '14px' }}>
            <p style={{ fontSize: 8, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 10px', borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: 8 }}>Buku Kas Operasional</p>
            {[
              { label: 'Volume terjual', value: `${salesReport.sold} / ${stock} unit`, color: '#e0f2fe' },
              { label: 'Total pendapatan', value: `+$${salesReport.revenue}`, color: '#4ade80' },
              { label: 'Biaya pembelian stok', value: `-$${stock * weather.wholesaleCost}`, color: '#f87171' },
              { label: 'Stok busuk (kerugian)', value: `-${salesReport.spoilage} unit`, color: '#fb923c' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#64748b' }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,.06)' }}>
              <div>
                <p style={{ fontSize: 8, color: '#475569', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Untung/Rugi Hari Ini</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: salesReport.profit >= 0 ? '#4ade80' : '#f87171', margin: '2px 0 0' }}>
                  {salesReport.profit >= 0 ? `+$${salesReport.profit}` : `-$${Math.abs(salesReport.profit)}`}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 8, color: '#475569', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>Kas Terkini</p>
                <p style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: '#fbbf24', margin: '2px 0 0' }}>${cash}</p>
              </div>
            </div>
          </div>

          {/* Mini bar chart */}
          <div style={{ background: 'rgba(7,21,37,.5)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 12, padding: '10px 14px' }}>
            <p style={{ fontSize: 8, color: '#475569', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 8px' }}>Performa Kumulatif</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 48, paddingBottom: 4 }}>
              {historicalData.map((d, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div style={{ width: 16, borderRadius: '4px 4px 0 0', height: `${Math.max(6, Math.min(36, (d.profit / 80) * 36))}px`, background: d.profit >= 0 ? '#10b981' : '#ef4444' }} />
                  <span style={{ fontSize: 7.5, color: '#475569', fontFamily: 'monospace', marginTop: 2 }}>D{d.day}</span>
                </div>
              ))}
              {Array.from({ length: 5 - historicalData.length }).map((_, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, opacity: .2 }}>
                  <div style={{ width: 16, height: 4, background: '#1e293b', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: 7.5, color: '#1e293b', fontFamily: 'monospace', marginTop: 2 }}>D{historicalData.length + i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="MT_btn" onClick={nextDay} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: '#e0f2fe',
            background: 'rgba(56,189,248,.12)', border: '1px solid rgba(56,189,248,.25)',
            padding: '13px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {dayIndex < 4 ? `Lanjut ke Hari ${dayIndex + 2} →` : 'Finalisasi Laporan Kinerja →'}
          </button>
        </div>
      )}

      {/* ── GAMEOVER ── */}
      {phase === MARKET_PHASES.GAMEOVER && (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, animation: 'MT_fade .5s ease both' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>Audit Operasional Selesai!</h3>
            <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>Simulasi e-commerce selesai dengan sukses.</p>
          </div>

          <div style={{ background: 'rgba(7,21,37,.8)', border: '1px solid rgba(56,189,248,.2)', borderRadius: 16, padding: '18px', textAlign: 'center' }}>
            <p style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 2, margin: '0 0 4px' }}>Modal Akhir</p>
            <p style={{ fontFamily: 'monospace', fontSize: 32, fontWeight: 800, color: '#fbbf24', margin: '0 0 2px' }}>${cash}</p>
            <p style={{ fontSize: 9, color: '#475569', margin: '0 0 14px' }}>Target performa: $150</p>

            <div style={{ background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 10, padding: '8px 16px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>XP Diperoleh:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4ade80', fontSize: 16 }}>+{finalScore} XP</span>
            </div>

            <div style={{
              padding: '10px 12px', borderRadius: 10, fontSize: 11, lineHeight: 1.6,
              background: targetBeaten ? 'rgba(16,185,129,.08)' : 'rgba(245,158,11,.08)',
              border: `1px solid ${targetBeaten ? 'rgba(16,185,129,.2)' : 'rgba(245,158,11,.2)'}`,
              color: targetBeaten ? '#6ee7b7' : '#fcd34d',
            }}>
              {targetBeaten
                ? '🎉 Luar biasa! Model margin dinamismu sukses memaksimalkan keuntungan.'
                : '💡 Ada ruang untuk berkembang. Antisipasi faktor cuaca untuk meningkatkan performa!'}
            </div>
          </div>

          <div style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 12, padding: '12px 14px' }}>
            <p style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 6px' }}>📚 E-Commerce Insight</p>
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{MARKET_INSIGHT}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="MT_btn" onClick={() => setShowInsight(true)} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: '#020c1b',
              background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
              padding: '14px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Kumpulkan Reward & Kembali ke Peta 🗺️
            </button>
            <button className="MT_btn" onClick={restart} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#64748b',
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              padding: '11px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1,
            }}>
              Ulangi Simulasi
            </button>
          </div>
        </div>
      )}

      {/* Insight Modal */}
      <InsightModal
        isOpen={showInsight}
        moduleTitle="Penguin Market Tycoon"
        concept="E-Commerce & Analytics"
        insightText={MARKET_INSIGHT}
        scoreXP={finalScore}
        onContinue={() => { setShowInsight(false); onComplete(finalScore); }}
      />
    </div>
  );
}
