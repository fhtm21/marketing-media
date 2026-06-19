import React, { useState, useEffect, useRef } from 'react';
import { WEATHER_EVENTS } from '../data/weatherEvents.js';
import { MARKET_PHASES } from '../engine/phases.js';
import { calcMarketScore, isMarketTargetBeaten } from '../engine/scoring.js';
import { SOUNDS } from '../engine/synthPlay.js';
import { useThreeJS } from '../hooks/useThreeJS.js';
import InsightModal from './InsightModal.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const WEATHER_ICONS = { normal: '🌤️', storm: '⛈️', sun: '☀️', aurora: '🌌', fissure: '🧊' };

const MARKET_INSIGHT = `Perusahaan e-commerce besar menggunakan pricing engine berbasis data real-time. Di BINUS @Bekasi Business IT, kamu akan mempelajari cara membangun sistem ERP serupa, menganalisis log database, dan merancang jalur customer analytics.`;

/** Price sensitivity curve — returns demand factor [0–1] given ratio vs ideal */
const getDemandFactor = (retailPrice, weather) => {
  if (retailPrice <= weather.wholesaleCost) return 1;
  const ratio = (retailPrice - weather.wholesaleCost) / (weather.idealRetailPrice - weather.wholesaleCost + 0.01);
  return Math.max(0.05, 1 - ratio * 0.85);
};

// ─── Price Sensitivity Mini-Chart ─────────────────────────────────────────────

function PriceSensitivityChart({ retailPrice, weather }) {
  const min   = weather.wholesaleCost;
  const max   = weather.wholesaleCost * 4;
  const steps = 12;
  const bars  = Array.from({ length: steps }, (_, i) => {
    const price = min + (i / (steps - 1)) * (max - min);
    return {
      price: Math.round(price),
      demand: getDemandFactor(price, weather),
      isSelected: Math.abs(price - retailPrice) < (max - min) / steps / 2,
      isIdeal: Math.abs(price - weather.idealRetailPrice) < (max - min) / steps / 2,
    };
  });

  return (
    <div>
      <div style={{ fontSize: 9, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
        📈 Price → Demand Curve
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60 }}>
        {bars.map((b, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              height: `${Math.max(4, b.demand * 52)}px`,
              background: b.isSelected
                ? 'rgba(56,189,248,.9)'
                : b.isIdeal
                  ? 'rgba(74,222,128,.7)'
                  : 'rgba(56,189,248,.22)',
              boxShadow: b.isSelected ? '0 0 8px rgba(56,189,248,.6)' : 'none',
              transition: 'height .2s ease',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 8, color: '#334155', fontFamily: 'monospace' }}>
        <span>${min}</span>
        <span style={{ color: '#4ade80' }}>~${weather.idealRetailPrice} ★</span>
        <span>${max}</span>
      </div>
      <div style={{ marginTop: 6, fontSize: 10, color: '#38bdf8', fontWeight: 700, textAlign: 'center' }}>
        Current: <strong style={{ fontFamily: 'monospace' }}>${retailPrice}</strong> → Est. demand&nbsp;
        <strong style={{ color: getDemandFactor(retailPrice, weather) > 0.7 ? '#4ade80' : getDemandFactor(retailPrice, weather) > 0.4 ? '#fbbf24' : '#f87171' }}>
          {Math.round(getDemandFactor(retailPrice, weather) * 100)}%
        </strong>
      </div>
    </div>
  );
}

// ─── Profit History Chart ─────────────────────────────────────────────────────

function ProfitChart({ historicalData }) {
  if (historicalData.length === 0) return null;
  const max = Math.max(...historicalData.map(d => Math.abs(d.profit)), 1);
  return (
    <div>
      <div style={{ fontSize: 9, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
        📊 P&L History
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 64, position: 'relative' }}>
        {/* zero line */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'rgba(255,255,255,.08)', transform: 'translateY(-50%)' }} />
        {historicalData.map((d, i) => {
          const h = Math.max(4, (Math.abs(d.profit) / max) * 28);
          const isProfit = d.profit >= 0;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              {isProfit ? (
                <>
                  <div style={{ height: '50%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', height: `${h}px`, borderRadius: '4px 4px 0 0', background: 'rgba(74,222,128,.7)', boxShadow: '0 0 6px rgba(74,222,128,.3)' }} />
                  </div>
                  <div style={{ height: '50%' }} />
                </>
              ) : (
                <>
                  <div style={{ height: '50%' }} />
                  <div style={{ height: '50%', display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ width: '100%', height: `${h}px`, borderRadius: '0 0 4px 4px', background: 'rgba(239,68,68,.6)' }} />
                  </div>
                </>
              )}
              <div style={{ fontSize: 7.5, color: '#475569', fontFamily: 'monospace', position: 'absolute', bottom: 0, textAlign: 'center' }}>D{d.day}</div>
            </div>
          );
        })}
        {/* Empty slots */}
        {Array.from({ length: 5 - historicalData.length }).map((_, i) => (
          <div key={`e${i}`} style={{ flex: 1 }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * MarketTycoon — Module 1: Penguin Market Tycoon 3D.
 * 5-day arctic fish market simulation with Three.js 3D scene.
 * Desktop: split layout (controls left, scene/info right).
 *
 * @param {{ onExit: ()=>void, onComplete: (score:number)=>void }} props
 */
export default function MarketTycoon({ onExit, onComplete }) {
  const { threeLoaded } = useThreeJS();

  const [dayIndex, setDayIndex]     = useState(0);
  const [cash, setCash]             = useState(100);
  const [stock, setStock]           = useState(0);
  const [retailPrice, setRetailPrice] = useState(10);
  const [phase, setPhase]           = useState(MARKET_PHASES.PLANNING);
  const [salesReport, setSalesReport] = useState({ sold: 0, revenue: 0, spoilage: 0, profit: 0 });
  const [historicalData, setHistoricalData] = useState([]);
  const [simSold, setSimSold]       = useState(0);
  const [simRevenue, setSimRevenue] = useState(0);
  const [speechBubbles, setSpeechBubbles] = useState([]);
  const [showInsight, setShowInsight] = useState(false);
  const [isDesktop, setIsDesktop]   = useState(() => window.innerWidth >= 800);

  const mountRef          = useRef(null);
  const rendererRef       = useRef(null);
  const animFrameRef      = useRef(null);
  const simSoldRef        = useRef(0);
  const simRevenueRef     = useRef(0);
  const simStockRef       = useRef(0);
  const speechBubblesRef  = useRef([]);
  const finishCalledRef   = useRef(false);

  const weather    = WEATHER_EVENTS[dayIndex];
  const maxAfford  = Math.floor(cash / weather.wholesaleCost);
  const buyingCap  = Math.min(weather.maxWholesaleStock, maxAfford);
  const costToday  = stock * weather.wholesaleCost;
  const ratio      = costToday > 0 ? simRevenue / costToday : 0;

  // Responsive
  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // Auto-set sensible defaults per day
  useEffect(() => {
    setRetailPrice(Math.round(weather.idealRetailPrice));
    setStock(Math.min(10, buyingCap));
  }, [dayIndex]); // eslint-disable-line

  const adjustStock = (delta) => {
    const next = stock + delta;
    if (next >= 0 && next <= buyingCap) setStock(next);
  };

  // ─── Three.js 3D Simulation ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== MARKET_PHASES.SIMULATING || !threeLoaded || !mountRef.current) return;
    const THREE = window.THREE;
    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const bgMap = { normal: 0x1e293b, storm: 0x0f172a, sun: 0x451a03, aurora: 0x020617, fissure: 0x111827 };
    scene.background = new THREE.Color(bgMap[weather.type] || 0x0f172a);
    scene.fog = new THREE.FogExp2(bgMap[weather.type] || 0x0f172a, weather.type === 'storm' ? 0.08 : 0.045);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100);
    let theta = 0.5, phi = 0.3;
    const R = 7;
    const updateCam = () => {
      camera.position.set(R * Math.sin(theta) * Math.cos(phi), 1.2 + R * Math.sin(phi), R * Math.cos(theta) * Math.cos(phi));
      camera.lookAt(0, 0.4, 0);
    };
    updateCam();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Camera drag
    let dragging = false, prevX = 0, prevY = 0;
    const onDown = (e) => { dragging = true; prevX = e.touches?.[0]?.clientX ?? e.clientX; prevY = e.touches?.[0]?.clientY ?? e.clientY; };
    const onMove = (e) => {
      if (!dragging) return;
      const cx = e.touches?.[0]?.clientX ?? e.clientX;
      const cy = e.touches?.[0]?.clientY ?? e.clientY;
      theta -= (cx - prevX) * 0.006;
      phi = Math.max(0.05, Math.min(Math.PI / 2.2, phi + (cy - prevY) * 0.006));
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
    scene.add(new THREE.AmbientLight(ambColors[weather.type] || 0xbae6fd, weather.type === 'sun' ? 0.85 : 0.55));
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.3);
    sunLight.position.set(6, 8, 4); sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024; sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
    const fillLight = new THREE.PointLight(0x38bdf8, 0.4, 20);
    fillLight.position.set(-4, 2, 4);
    scene.add(fillLight);

    // Sky / atmosphere
    const skyGroup = new THREE.Group();
    scene.add(skyGroup);
    if (weather.type === 'normal') {
      const cg = new THREE.SphereGeometry(0.55, 6, 5);
      const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
      for (let i = 0; i < 6; i++) {
        const cloud = new THREE.Mesh(cg, cm);
        cloud.position.set(Math.random() * 10 - 5, 3 + Math.random() * 2, -4 - Math.random() * 5);
        cloud.scale.set(1 + Math.random(), 0.6, 1);
        skyGroup.add(cloud);
      }
    } else if (weather.type === 'aurora') {
      const colors = [0x10b981, 0x8b5cf6, 0x06b6d4, 0x0ea5e9];
      colors.forEach((c, i) => {
        const rg = new THREE.PlaneGeometry(18, 3, 28, 1);
        const rm = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.22, side: THREE.DoubleSide });
        const r = new THREE.Mesh(rg, rm);
        r.position.set(0, 4 + i * 0.8, -7 - i * 1.5);
        skyGroup.add(r);
        skyGroup.userData[`ribbon_${i}`] = r;
      });
    } else if (weather.type === 'storm') {
      // Dark cloud layers
      const dg = new THREE.SphereGeometry(1.2, 5, 4);
      const dm = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 1, flatShading: true, transparent: true, opacity: 0.8 });
      for (let i = 0; i < 4; i++) {
        const cloud = new THREE.Mesh(dg, dm);
        cloud.position.set(Math.random() * 12 - 6, 2.5 + Math.random(), -4 - Math.random() * 3);
        cloud.scale.set(1.5, 0.7, 1);
        skyGroup.add(cloud);
      }
    }

    // Ground (ice)
    const iceMat = new THREE.MeshStandardMaterial({
      color: weather.type === 'sun' ? 0x93c5fd : 0xdbeafe,
      roughness: 0.1, metalness: 0.15,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(28, 28), iceMat);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
    scene.add(ground);

    // Icebergs
    [[-5.5, -5.5, 3.5], [5.5, -6.5, 4.5], [-7, 3, 2.5], [7, 5, 3.5], [0, -8, 2.2]].forEach(([x, z, h]) => {
      const m = new THREE.Mesh(
        new THREE.ConeGeometry(1.8, h, 5),
        new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.25, flatShading: true, transparent: true, opacity: 0.88 })
      );
      m.position.set(x, h / 2 - 0.3, z);
      m.castShadow = true;
      scene.add(m);
    });

    // Market stall
    const stall = new THREE.Group();
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.65, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x5c2e0b, roughness: 0.8, metalness: 0.1 })
    );
    counter.position.y = 0.325; counter.castShadow = true; stall.add(counter);
    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.06, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 })
    );
    canopy.position.set(0, 1.7, 0.35); canopy.rotation.x = 0.08; stall.add(canopy);
    // Canopy poles
    [-0.9, 0.9].forEach(xOff => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.7, 6),
        new THREE.MeshStandardMaterial({ color: 0x475569 })
      );
      pole.position.set(xOff, 0.85, -0.1);
      stall.add(pole);
    });
    // Display items on counter
    const fishGeo = new THREE.SphereGeometry(0.1, 5, 4);
    const fishMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.5 });
    const displayCount = Math.min(stock, 8);
    for (let i = 0; i < displayCount; i++) {
      const fish = new THREE.Mesh(fishGeo, fishMat);
      fish.position.set(-0.55 + (i % 4) * 0.35, 0.7, -0.12 + Math.floor(i / 4) * 0.24);
      fish.scale.set(1, 0.6, 1.6);
      stall.add(fish);
    }
    stall.position.set(0, 0, -0.5);
    scene.add(stall);

    // Penguin builder
    const buildPenguin = (isShopkeeper = false) => {
      const g = new THREE.Group();
      const bodyMat = new THREE.MeshStandardMaterial({ color: isShopkeeper ? 0x1e293b : 0x0f172a, roughness: 0.5 });
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.33, 0.7, 8), bodyMat);
      body.position.y = 0.35; body.castShadow = true; g.add(body);
      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.7 }));
      belly.geometry.scale(1, 1.1, 0.22); belly.position.set(0, 0.35, 0.23); g.add(belly);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), bodyMat);
      head.position.y = 0.8; head.castShadow = true; g.add(head);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.14, 5), new THREE.MeshStandardMaterial({ color: 0xf97316 }));
      beak.geometry.rotateX(Math.PI / 2); beak.position.set(0, 0.8, 0.21); g.add(beak);
      // Eyes
      [-0.08, 0.08].forEach(xOff => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 5, 5), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        eye.position.set(xOff, 0.85, 0.19); g.add(eye);
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.02, 4, 4), new THREE.MeshStandardMaterial({ color: 0x020617 }));
        pupil.position.set(xOff, 0.85, 0.215); g.add(pupil);
      });
      const flipperGeo = new THREE.BoxGeometry(0.055, 0.3, 0.11);
      const flipperMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
      const lf = new THREE.Mesh(flipperGeo, flipperMat);
      lf.position.set(-0.33, 0.35, 0); lf.rotation.z = 0.22; g.add(lf); g.userData.lf = lf;
      const rf = new THREE.Mesh(flipperGeo, flipperMat);
      rf.position.set(0.33, 0.35, 0); rf.rotation.z = -0.22; g.add(rf); g.userData.rf = rf;
      if (isShopkeeper) {
        const apron = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.24, 0.02), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
        apron.position.set(0, 0.22, 0.24); g.add(apron);
        const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.17, 0.2, 8), new THREE.MeshStandardMaterial({ color: 0xfbbf24 }));
        hat.position.y = 1.02; g.add(hat);
      }
      return g;
    };

    const shopkeeper = buildPenguin(true);
    shopkeeper.position.set(0, 0.01, -0.85);
    scene.add(shopkeeper);

    // Weather particles
    const pCount = weather.type === 'storm' ? 350 : 140;
    const pGeo = new THREE.BufferGeometry();
    const pPos = [], pVel = [];
    for (let i = 0; i < pCount; i++) {
      pPos.push(Math.random() * 14 - 7, Math.random() * 7, Math.random() * 12 - 6);
      pVel.push(weather.type === 'storm' ? -0.07 : 0, -0.022 - Math.random() * 0.018, 0);
    }
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.75 }));
    scene.add(particles);

    // Customer penguins
    const purchaseProbability = Math.max(0.08, getDemandFactor(retailPrice, weather));
    const customerCount = Math.min(weather.maxDemand, Math.round(weather.maxDemand * weather.baseDemandFactor));
    const customers = [];
    for (let i = 0; i < customerCount; i++) {
      const mesh = buildPenguin(false);
      mesh.position.set(6 + i * 2.4, 0.01, 0.5 + (i % 3) * 0.6 - 0.3);
      mesh.rotation.y = -Math.PI / 2;
      scene.add(mesh);
      customers.push({
        mesh, speed: 1.3 + Math.random() * 0.7,
        phase: 'walking', targetX: 0.9 + (Math.random() * 0.3 - 0.15),
        decided: false,
        willBuy: Math.random() < purchaseProbability,
        decisionTimer: 0,
      });
    }

    const coins = [];
    finishCalledRef.current = false;
    simSoldRef.current = 0; simRevenueRef.current = 0; simStockRef.current = stock;
    speechBubblesRef.current = [];
    setSimSold(0); setSimRevenue(0); setSpeechBubbles([]);

    const DURATION = 11000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / DURATION;
      const t = Date.now();

      // Shopkeeper bob + wave
      shopkeeper.position.y = 0.01 + Math.sin(t * 0.003) * 0.022;
      shopkeeper.userData.lf && (shopkeeper.userData.lf.rotation.z = 0.22 + Math.sin(t * 0.005) * 0.18);
      shopkeeper.userData.rf && (shopkeeper.userData.rf.rotation.z = -0.22 - Math.sin(t * 0.005) * 0.18);

      // Aurora wave
      if (weather.type === 'aurora') {
        [0, 1, 2, 3].forEach(ri => {
          const r = skyGroup.userData[`ribbon_${ri}`];
          if (r) {
            const arr = r.geometry.attributes.position.array;
            for (let i = 0; i < arr.length; i += 3) arr[i + 1] = Math.sin(arr[i] * 0.35 + t * 0.0018 + ri * 0.8) * 0.3;
            r.geometry.attributes.position.needsUpdate = true;
          }
        });
      }

      // Particles
      const pa = particles.geometry.attributes.position.array;
      for (let i = 0; i < pa.length; i += 3) {
        pa[i] += pVel[i]; pa[i + 1] += pVel[i + 1];
        if (pa[i + 1] < 0) { pa[i + 1] = 7; pa[i] = Math.random() * 14 - 7; }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Customers
      const bubbleList = [];
      customers.forEach(c => {
        if (c.phase === 'walking') {
          c.mesh.position.x -= 0.03 * c.speed;
          c.mesh.rotation.y = -Math.PI / 2;
          c.mesh.position.y = 0.01 + Math.abs(Math.sin(t * 0.02 + c.speed * 10)) * 0.03;
          if (c.mesh.position.x <= c.targetX) {
            c.mesh.position.x = c.targetX;
            c.mesh.rotation.y = Math.PI;
            c.phase = 'at_stall';
            c.decisionTimer = t;
          }
        } else if (c.phase === 'at_stall' && !c.decided) {
          if (t - c.decisionTimer > 900) {
            c.decided = true;
            if (c.willBuy && simStockRef.current > 0) {
              simStockRef.current--;
              simSoldRef.current++;
              simRevenueRef.current += retailPrice;
              setSimSold(simSoldRef.current);
              setSimRevenue(simRevenueRef.current);
              const coin = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 0.03, 8),
                new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.05, metalness: 0.9 })
              );
              coin.position.set(c.mesh.position.x, 0.75, c.mesh.position.z);
              scene.add(coin); coins.push(coin);
              speechBubblesRef.current.push({ id: Math.random(), type: 'buy', text: '😋 YUM!', pos: c.mesh.position.clone(), spawnTime: t });
              SOUNDS.coin();
            } else {
              const msg = simStockRef.current === 0 ? '😡 SOLD OUT!' : '💸 TOO PRICEY!';
              speechBubblesRef.current.push({ id: Math.random(), type: 'refuse', text: msg, pos: c.mesh.position.clone(), spawnTime: t });
            }
            c.phase = 'leaving';
          }
        } else if (c.phase === 'leaving') {
          c.mesh.position.x -= 0.03 * c.speed;
          c.mesh.rotation.y = -Math.PI / 2;
        }
      });

      // Coins float
      for (let i = coins.length - 1; i >= 0; i--) {
        coins[i].position.y += 0.038; coins[i].rotation.y += 0.07;
        if (coins[i].position.y > 2.5) { scene.remove(coins[i]); coins.splice(i, 1); }
      }

      // Speech bubbles projection
      speechBubblesRef.current.forEach((b, idx) => {
        const age = t - b.spawnTime;
        if (age > 1800) { speechBubblesRef.current.splice(idx, 1); return; }
        const v = b.pos.clone(); v.y += 1.0 + age * 0.0002; v.project(camera);
        const opacity = age < 200 ? age / 200 : age > 1400 ? (1800 - age) / 400 : 1;
        bubbleList.push({ id: b.id, type: b.type, text: b.text, x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H, opacity });
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
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
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
      try { if (rendererRef.current?.domElement && parent.contains(rendererRef.current.domElement)) parent.removeChild(rendererRef.current.domElement); } catch { /* safe */ }
      renderer.dispose();
    };
  }, [phase, threeLoaded]); // eslint-disable-line

  // ─── Game actions ─────────────────────────────────────────────────────────

  const finishDay = (sold, revenue, leftover) => {
    const spoilage = weather.type !== 'sun' ? Math.floor(leftover * 0.4) : leftover;
    const profit = revenue - (stock * weather.wholesaleCost);
    setCash(c => c + revenue);
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

  const restart = () => {
    setDayIndex(0); setCash(100); setStock(0);
    setHistoricalData([]); setPhase(MARKET_PHASES.PLANNING);
  };

  const finalScore = calcMarketScore(cash);
  const targetBeaten = isMarketTargetBeaten(cash);

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, #020c1b 0%, #050f1e 100%)',
      fontFamily: "'Nunito', sans-serif", color: '#fff',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes MT_fade   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes MT_pulse  { 0%,100%{opacity:.55} 50%{opacity:1} }
        @keyframes MT_live   { 0%,100%{box-shadow:0 0 6px rgba(56,189,248,.2)} 50%{box-shadow:0 0 20px rgba(56,189,248,.5)} }
        input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #38bdf8; cursor: pointer; box-shadow: 0 0 10px rgba(56,189,248,.6); border: 2px solid #020c1b; }
        input[type=range]::-webkit-slider-runnable-track { height: 5px; border-radius: 5px; background: rgba(56,189,248,.15); border: 1px solid rgba(56,189,248,.2); }
        .MT_btn { transition: transform .16s, filter .16s, box-shadow .16s; border: none; cursor: pointer; }
        .MT_btn:hover:not(:disabled) { filter: brightness(1.12); transform: translateY(-1px); }
        .MT_btn:active:not(:disabled){ transform: scale(.95); }
        .MT_btn:disabled { opacity: .4; cursor: not-allowed; }
        .MT_stat { background: rgba(7,21,37,.7); border: 1px solid rgba(56,189,248,.1); border-radius: 10px; padding: 10px 14px; }
      `}</style>

      {/* ══ HEADER ══ */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isDesktop ? '12px 24px' : '10px 14px',
        background: 'rgba(2,12,27,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(56,189,248,0.1)', flexShrink: 0, zIndex: 20, gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🏪</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1.5 }}>Market Tycoon 3D</div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              {WEATHER_ICONS[weather.icon]} {weather.name}
            </div>
          </div>
        </div>

        {/* Day + Cash */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Day</div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: '#e0f2fe' }}>
              {dayIndex + 1} <span style={{ color: '#334155' }}>/5</span>
            </div>
          </div>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.08)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Cash</div>
            <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: '#4ade80' }}>${cash}</div>
          </div>
        </div>

        <button className="MT_btn" onClick={onExit} style={{
          fontFamily: "'Nunito', sans-serif", padding: '6px 13px',
          background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 8, fontSize: 10, color: '#64748b', fontWeight: 700,
        }}>✕ Exit</button>
      </header>

      {/* Day progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,.04)', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${(dayIndex / 5) * 100}%`, background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', transition: 'width .6s ease' }} />
      </div>

      {/* ══════════════════════ PLANNING ══════════════════════ */}
      {phase === MARKET_PHASES.PLANNING && (
        <div style={{ flex: 1, display: 'flex', flexDirection: isDesktop ? 'row' : 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* ── Left controls ── */}
          <div style={{
            width: isDesktop ? 360 : '100%',
            flexShrink: 0, overflowY: 'auto',
            padding: isDesktop ? '20px 20px 20px 24px' : '14px',
            display: 'flex', flexDirection: 'column', gap: 14,
            borderRight: isDesktop ? '1px solid rgba(56,189,248,.08)' : 'none',
            borderBottom: isDesktop ? 'none' : '1px solid rgba(56,189,248,.08)',
            animation: 'MT_fade .4s ease',
          }}>

            {/* Weather card */}
            <div style={{ background: 'rgba(7,21,37,.8)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 14, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 34 }}>{WEATHER_ICONS[weather.icon] || '🌤️'}</div>
                <div>
                  <div style={{ fontSize: 8, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 3 }}>Market Forecast</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#e0f2fe' }}>{weather.name}</div>
                </div>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 12px', background: 'rgba(2,12,27,.35)', padding: '8px 10px', borderRadius: 8 }}>
                {weather.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {[
                  { label: 'Wholesale', value: `$${weather.wholesaleCost}`, color: '#fbbf24' },
                  { label: 'Max Stock', value: `${weather.maxWholesaleStock}`, color: '#e0f2fe' },
                  { label: 'Ideal Price', value: `$${weather.idealRetailPrice}`, color: '#4ade80' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: 'rgba(2,12,27,.5)', borderRadius: 9, padding: '8px 6px', border: '1px solid rgba(255,255,255,.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: 7.5, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color, fontFamily: 'monospace' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory adjuster */}
            <div style={{ background: 'rgba(7,21,37,.6)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 14, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: .5 }}>Buy Inventory</div>
                  <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>@${weather.wholesaleCost}/unit · Budget: <span style={{ color: '#fbbf24', fontWeight: 700 }}>${cash}</span></div>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: '#fbbf24' }}>Total: ${costToday}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2,12,27,.4)', borderRadius: 10, padding: '10px 12px', border: '1px solid rgba(56,189,248,.08)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[-5, -1].map(d => (
                    <button key={d} className="MT_btn" onClick={() => adjustStock(d)} disabled={stock <= 0}
                      style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.2)', color: '#e0f2fe', fontWeight: 800, fontSize: 12, fontFamily: 'monospace' }}>
                      {d}
                    </button>
                  ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 26, fontWeight: 800, color: '#38bdf8' }}>{stock}</div>
                  <div style={{ fontSize: 7.5, color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>units</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[1, 5].map(d => (
                    <button key={d} className="MT_btn" onClick={() => adjustStock(d)} disabled={stock >= buyingCap}
                      style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.2)', color: '#e0f2fe', fontWeight: 800, fontSize: 12, fontFamily: 'monospace' }}>
                      +{d}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button className="MT_btn" onClick={() => setStock(0)} style={{ flex: 1, padding: '6px', fontSize: 9, color: '#64748b', background: 'rgba(2,12,27,.5)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 7, fontWeight: 700 }}>
                  Clear
                </button>
                <button className="MT_btn" onClick={() => setStock(buyingCap)} style={{ flex: 1, padding: '6px', fontSize: 9, color: '#38bdf8', background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.2)', borderRadius: 7, fontWeight: 700 }}>
                  Max ({buyingCap})
                </button>
              </div>
            </div>

            {/* Price slider */}
            <div style={{ background: 'rgba(7,21,37,.6)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 14, padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: .5 }}>Retail Price</div>
                  <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>Tune for weather demand</div>
                </div>
                <div style={{ background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.25)', borderRadius: 9, padding: '5px 12px' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: '#38bdf8' }}>${retailPrice}</span>
                </div>
              </div>
              <input
                type="range"
                min={weather.wholesaleCost}
                max={weather.wholesaleCost * 4}
                value={retailPrice}
                onChange={e => setRetailPrice(Number(e.target.value))}
                style={{ accentColor: '#38bdf8' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: '#334155', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>
                <span>Min ${weather.wholesaleCost}</span>
                <span style={{ color: '#4ade80' }}>★ Ideal ${weather.idealRetailPrice}</span>
                <span>Max ${weather.wholesaleCost * 4}</span>
              </div>
            </div>

            <button className="MT_btn" onClick={startSim} disabled={stock === 0} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: '#020c1b',
              background: stock === 0 ? 'rgba(255,255,255,.06)' : 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
              padding: '15px', borderRadius: 13, textTransform: 'uppercase', letterSpacing: 1.2,
              boxShadow: stock > 0 ? '0 8px 28px rgba(14,165,233,.35)' : 'none',
              color: stock === 0 ? '#334155' : '#020c1b',
            }}>
              {stock === 0 ? 'Buy stock to open market' : `Open Day ${dayIndex + 1} Simulation →`}
            </button>
          </div>

          {/* ── Right info panel ── */}
          {isDesktop && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, animation: 'MT_fade .5s ease' }}>
              {/* Price sensitivity chart */}
              <div style={{ background: 'rgba(7,21,37,.7)', border: '1px solid rgba(56,189,248,.12)', borderRadius: 14, padding: '16px' }}>
                <PriceSensitivityChart retailPrice={retailPrice} weather={weather} />
              </div>

              {/* Market tips */}
              <div style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(56,189,248,.12)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>💼 Business Strategy</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: '📦', title: 'Inventory Risk', text: 'Unsold stock spoils (40% loss on normal days, 100% on sunny days). Don\'t over-buy!' },
                    { icon: '💰', title: 'Pricing Psychology', text: 'Price too high → customers leave. Price too low → leaves money on the table.' },
                    { icon: '🌡️', title: 'Weather Dynamics', text: `Today's ideal price: $${weather.idealRetailPrice}. Demand peaks near this price point.` },
                  ].map(({ icon, title, text }) => (
                    <div key={title} style={{ display: 'flex', gap: 10, background: 'rgba(2,12,27,.3)', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(56,189,248,.06)' }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 3 }}>{title}</div>
                        <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.6 }}>{text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profit history */}
              {historicalData.length > 0 && (
                <div style={{ background: 'rgba(7,21,37,.7)', border: '1px solid rgba(56,189,248,.12)', borderRadius: 14, padding: '16px' }}>
                  <ProfitChart historicalData={historicalData} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ SIMULATING ══════════════════════ */}
      {phase === MARKET_PHASES.SIMULATING && (
        <div style={{ flex: 1, display: 'flex', flexDirection: isDesktop ? 'row' : 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* ── Left stats sidebar ── */}
          <div style={{
            width: isDesktop ? 260 : '100%',
            flexShrink: 0,
            background: 'rgba(5,15,30,.8)',
            borderRight: isDesktop ? '1px solid rgba(56,189,248,.08)' : 'none',
            borderBottom: isDesktop ? 'none' : '1px solid rgba(56,189,248,.08)',
            padding: isDesktop ? '20px 16px' : '10px 14px',
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 2, animation: 'MT_pulse 1.5s infinite' }}>
                ● Live Simulation
              </div>
              <div style={{ fontSize: 10, color: '#334155' }}>Drag to orbit camera</div>
            </div>

            {[
              { label: 'Investment', value: `$${costToday}`, color: '#e0f2fe', icon: '💸' },
              { label: 'Sold', value: `${simSold} / ${stock}`, color: '#e0f2fe', icon: '🐟' },
              { label: 'Revenue', value: `$${simRevenue}`, color: '#4ade80', icon: '💰' },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className="MT_stat" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 8.5, color: '#475569', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{icon} {label}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color }}>{value}</div>
                </div>
              </div>
            ))}

            {/* Profitability bar */}
            <div className="MT_stat">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 9, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                <span>Profitability</span>
                <span style={{ color: ratio >= 1 ? '#4ade80' : ratio > 0.5 ? '#fbbf24' : '#f87171' }}>
                  {ratio >= 1 ? 'Profit ✓' : ratio > 0.5 ? 'Near BEP' : 'Loss'}
                </span>
              </div>
              <div style={{ height: 7, background: 'rgba(56,189,248,.08)', borderRadius: 7, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 7, transition: 'width .4s ease',
                  width: `${Math.min(100, Math.max(4, ratio * 100))}%`,
                  background: ratio >= 1 ? '#10b981' : ratio > 0.5 ? '#f59e0b' : '#ef4444',
                }} />
              </div>
            </div>
          </div>

          {/* ── 3D Scene ── */}
          <div style={{ flex: 1, position: 'relative', background: '#0a1628' }}>
            {threeLoaded ? (
              <>
                <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
                {/* Speech bubbles overlay */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                  {speechBubbles.map(b => (
                    <div key={b.id} style={{
                      position: 'absolute', left: b.x, top: b.y,
                      transform: 'translate(-50%, -100%)',
                      opacity: b.opacity,
                      padding: '5px 12px', borderRadius: 16, fontSize: 11, fontWeight: 800,
                      background: b.type === 'buy' ? '#10b981' : '#dc2626',
                      color: '#fff', whiteSpace: 'nowrap',
                      boxShadow: `0 4px 16px ${b.type === 'buy' ? 'rgba(16,185,129,.5)' : 'rgba(220,38,38,.4)'}`,
                    }}>
                      {b.text}
                    </div>
                  ))}
                </div>
                {/* Camera hint */}
                <div style={{
                  position: 'absolute', bottom: 12, right: 14,
                  fontSize: 9, color: 'rgba(148,163,184,.5)', fontWeight: 700,
                  background: 'rgba(2,12,27,.5)', padding: '4px 10px', borderRadius: 20,
                  pointerEvents: 'none',
                }}>
                  🖱 Drag to orbit
                </div>
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, border: '3px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'MT_pulse .7s linear infinite' }} />
                <p style={{ fontSize: 10, color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Loading 3D Engine…</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════ REPORT ══════════════════════ */}
      {phase === MARKET_PHASES.REPORT && (
        <div style={{ flex: 1, display: 'flex', flexDirection: isDesktop ? 'row' : 'column', overflow: 'hidden', minHeight: 0, animation: 'MT_fade .4s ease' }}>

          {/* ── Left ledger ── */}
          <div style={{
            width: isDesktop ? 380 : '100%',
            flexShrink: 0, overflowY: 'auto',
            padding: isDesktop ? '24px 20px 24px 24px' : '16px',
            display: 'flex', flexDirection: 'column', gap: 16,
            borderRight: isDesktop ? '1px solid rgba(56,189,248,.08)' : 'none',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>
                Daily P&L Report
              </h3>
              <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>Day {dayIndex + 1} analytics complete</p>
            </div>

            {/* Ledger */}
            <div style={{ background: 'rgba(7,21,37,.8)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 14, padding: '16px' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                Operations Cash Book
              </div>
              {[
                { label: 'Units sold', value: `${salesReport.sold} / ${stock}`, color: '#e0f2fe' },
                { label: 'Total revenue', value: `+$${salesReport.revenue}`, color: '#4ade80' },
                { label: 'Inventory cost', value: `-$${stock * weather.wholesaleCost}`, color: '#f87171' },
                { label: 'Spoilage loss', value: `-${salesReport.spoilage} units`, color: '#fb923c' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.06)', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 8, color: '#475569', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Today's P&L</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: salesReport.profit >= 0 ? '#4ade80' : '#f87171', fontFamily: 'monospace' }}>
                    {salesReport.profit >= 0 ? `+$${salesReport.profit}` : `-$${Math.abs(salesReport.profit)}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 8, color: '#475569', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>Running Cash</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>${cash}</div>
                </div>
              </div>
            </div>

            <button className="MT_btn" onClick={nextDay} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: '#e0f2fe',
              background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.25)',
              padding: '14px', borderRadius: 13, textTransform: 'uppercase', letterSpacing: 1,
              boxShadow: '0 4px 16px rgba(14,165,233,.1)',
            }}>
              {dayIndex < 4 ? `Day ${dayIndex + 2} →` : 'Finalize Operations →'}
            </button>
          </div>

          {/* ── Right analytics ── */}
          {isDesktop && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {historicalData.length > 0 && (
                <div style={{ background: 'rgba(7,21,37,.7)', border: '1px solid rgba(56,189,248,.12)', borderRadius: 14, padding: '20px' }}>
                  <ProfitChart historicalData={historicalData} />
                </div>
              )}
              <div style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(56,189,248,.12)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>📚 Analytics Insight</div>
                <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>
                  {salesReport.profit > 0
                    ? `Great day! You sold ${salesReport.sold} units at $${retailPrice} each, covering wholesale cost of $${weather.wholesaleCost}/unit with healthy margin.`
                    : `Revenue of $${salesReport.revenue} didn't cover your $${stock * weather.wholesaleCost} inventory cost. Consider adjusting pricing or stock quantity to match demand.`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════ GAMEOVER ══════════════════════ */}
      {phase === MARKET_PHASES.GAMEOVER && (
        <div style={{ flex: 1, overflowY: 'auto', animation: 'MT_fade .5s ease' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', padding: isDesktop ? '36px 24px' : '16px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 10 }}>🏆</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 6px' }}>
                Operations Complete!
              </h2>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>5-Day Arctic Market Simulation Finished</p>
            </div>

            <div style={{ background: 'rgba(7,21,37,.8)', border: '1px solid rgba(56,189,248,.2)', borderRadius: 18, padding: '22px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>Final Capital</div>
              <div style={{ fontFamily: 'monospace', fontSize: 40, fontWeight: 800, color: '#fbbf24', marginBottom: 4 }}>${cash}</div>
              <div style={{ fontSize: 9, color: '#334155', marginBottom: 16 }}>Target: $150</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {historicalData.map((d, i) => (
                  <div key={i} style={{
                    background: d.profit >= 0 ? 'rgba(16,185,129,.08)' : 'rgba(239,68,68,.08)',
                    border: `1px solid ${d.profit >= 0 ? 'rgba(16,185,129,.2)' : 'rgba(239,68,68,.15)'}`,
                    borderRadius: 10, padding: '8px 12px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>Day {d.day}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 800, color: d.profit >= 0 ? '#4ade80' : '#f87171' }}>
                      {d.profit >= 0 ? '+' : ''}{d.profit > 0 ? `$${d.profit}` : `-$${Math.abs(d.profit)}`}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 10, padding: '10px 16px', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>XP Earned:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4ade80', fontSize: 18 }}>+{finalScore} XP</span>
              </div>

              <div style={{
                padding: '12px 14px', borderRadius: 10, fontSize: 11, lineHeight: 1.7,
                background: targetBeaten ? 'rgba(16,185,129,.08)' : 'rgba(245,158,11,.08)',
                border: `1px solid ${targetBeaten ? 'rgba(16,185,129,.2)' : 'rgba(245,158,11,.2)'}`,
                color: targetBeaten ? '#6ee7b7' : '#fcd34d',
              }}>
                {targetBeaten
                  ? '🎉 Outstanding! Your dynamic pricing strategy maximized revenue across all 5 weather conditions.'
                  : '💡 Room to improve. Anticipate weather-driven demand and adjust inventory & pricing for each scenario.'}
              </div>
            </div>

            <div style={{ background: 'rgba(14,165,233,.05)', border: '1px solid rgba(56,189,248,.12)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>📚 E-Commerce Insight</div>
              <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{MARKET_INSIGHT}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="MT_btn" onClick={() => setShowInsight(true)} style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: '#020c1b',
                background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
                padding: '15px', borderRadius: 14, textTransform: 'uppercase', letterSpacing: 1.2,
                boxShadow: '0 8px 28px rgba(14,165,233,.35)',
              }}>
                Collect Reward & Return to Map 🗺️
              </button>
              <button className="MT_btn" onClick={restart} style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#64748b',
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                padding: '12px', borderRadius: 12,
              }}>
                Retry Simulation
              </button>
            </div>
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
