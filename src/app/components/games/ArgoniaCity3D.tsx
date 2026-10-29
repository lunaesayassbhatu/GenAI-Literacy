import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createFigure, type FigureKind } from "./ArgoniaFigure3D";

// The whole city of Argonia as a 3D scene. Drag to turn the city, scroll or pinch to zoom, click any building,
// figure or object. Everything is built from simple shapes in code (no model files), and the people are the same
// 3D figures used in the quest. Each clickable thing belongs to one hotspot id from data/argoniaCityData.ts.

interface Props {
  seen: string[];
  openId: string | null;
  showAll: boolean;
  onPick: (id: string) => void;
  /** Called with the name label of the hovered thing (or null) and the pointer position inside the canvas. */
  onHover: (id: string | null, x: number, y: number) => void;
}

const m = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, metalness: 0.03, ...extra });

const WALL = 0xf0dfc0;
const WALL_SHADE = 0xd9c39c;
const ROOFS = [0xb5502f, 0x8c1d40, 0x4a5f94];
const GLOW = 0xffd36e;

// Terraces from the top: radius, top height. Everything stands on these.
const T = [
  { r: 3.1, y: 5.8 },
  { r: 5.1, y: 4.0 },
  { r: 7.1, y: 2.3 },
  { r: 9.1, y: 0.6 },
];

const pol = (r: number, deg: number, y: number) => {
  const a = (deg * Math.PI) / 180;
  return new THREE.Vector3(Math.sin(a) * r, y, Math.cos(a) * r);
};

export function ArgoniaCity3D({ seen, openId, showAll, onPick, onHover }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const stateRef = useRef({ seen, openId, showAll });
  stateRef.current = { seen, openId, showAll };
  const cbRef = useRef({ onPick, onHover });
  cbRef.current = { onPick, onHover };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // sunset sky as a vertical gradient
    const sky = document.createElement("canvas");
    sky.width = 4;
    sky.height = 256;
    const sctx = sky.getContext("2d")!;
    const grad = sctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, "#1d1b5e");
    grad.addColorStop(0.45, "#6b3f8f");
    grad.addColorStop(0.75, "#d9708a");
    grad.addColorStop(1, "#ffd9a0");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 4, 256);
    const skyTex = new THREE.CanvasTexture(sky);
    scene.background = skyTex;
    scene.fog = new THREE.Fog(0xc9809a, 26, 60);

    const camera = new THREE.PerspectiveCamera(38, 1.5, 0.1, 200);
    camera.position.set(0, 11, 27);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 4.2, 2);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 40;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 1.5;
    controls.update();

    scene.add(new THREE.HemisphereLight(0xffe0c4, 0x3a2a5a, 1.25));
    const sun = new THREE.DirectionalLight(0xffc98a, 2.6);
    sun.position.set(14, 12, 8);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0x9a8cff, 0.8);
    fill.position.set(-10, 6, -6);
    scene.add(fill);

    const disposables: Array<{ dispose: () => void }> = [skyTex];
    const track = <G extends { dispose: () => void }>(x: G): G => { disposables.push(x); return x; };
    const mats = new Map<number, THREE.MeshStandardMaterial>();
    const mat = (color: number, extra?: Partial<THREE.MeshStandardMaterialParameters>) => {
      if (extra) return track(m(color, extra));
      let x = mats.get(color);
      if (!x) { x = track(m(color)); mats.set(color, x); }
      return x;
    };

    const world = new THREE.Group();
    scene.add(world);
    const ticks: Array<(t: number) => void> = [];
    const figures: Array<{ tick: (t: number, talking: boolean) => void; dispose: () => void }> = [];

    const box = (g: THREE.Group, w: number, h: number, d: number, color: number, x: number, y: number, z: number) => {
      const mesh = new THREE.Mesh(track(new THREE.BoxGeometry(w, h, d)), mat(color));
      mesh.position.set(x, y + h / 2, z);
      g.add(mesh);
      return mesh;
    };
    const cyl = (g: THREE.Group, rt: number, rb: number, h: number, color: number, x: number, y: number, z: number, seg = 12) => {
      const mesh = new THREE.Mesh(track(new THREE.CylinderGeometry(rt, rb, h, seg)), mat(color));
      mesh.position.set(x, y + h / 2, z);
      g.add(mesh);
      return mesh;
    };
    const cone = (g: THREE.Group, r: number, h: number, color: number, x: number, y: number, z: number, seg = 4, rot = Math.PI / 4) => {
      const mesh = new THREE.Mesh(track(new THREE.ConeGeometry(r, h, seg)), mat(color));
      mesh.position.set(x, y + h / 2, z);
      mesh.rotation.y = rot;
      g.add(mesh);
      return mesh;
    };
    const windows = (g: THREE.Group, w: number, h: number, d: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const x = -w / 2 + ((i + 0.5) * w) / n;
        const win = new THREE.Mesh(track(new THREE.BoxGeometry(0.16, 0.22, 0.04)), mat(GLOW, { emissive: new THREE.Color(GLOW), emissiveIntensity: 0.7 }));
        win.position.set(x, h * 0.6, d / 2 + 0.02);
        g.add(win);
      }
    };
    const house = (w: number, h: number, d: number, roof: number, wall = WALL) => {
      const g = new THREE.Group();
      box(g, w, h, d, wall, 0, 0, 0);
      cone(g, Math.max(w, d) * 0.78, h * 0.7, roof, 0, h, 0);
      box(g, 0.2, 0.34, 0.04, 0x5b3a2a, 0, 0, d / 2 + 0.02);
      windows(g, w, h, d, w > 0.9 ? 2 : 1);
      return g;
    };
    const flag = (g: THREE.Group, x: number, y: number, z: number, color: number) => {
      cyl(g, 0.025, 0.025, 0.7, 0x5b4030, x, y, z, 6);
      const f = new THREE.Mesh(track(new THREE.BoxGeometry(0.4, 0.22, 0.02)), mat(color));
      f.position.set(x + 0.2, y + 0.55, z);
      g.add(f);
      ticks.push((t) => { f.rotation.y = Math.sin(t * 3) * 0.25; });
    };
    const lantern = (g: THREE.Group, x: number, y: number, z: number) => {
      const l = new THREE.Mesh(track(new THREE.SphereGeometry(0.07, 8, 8)), mat(GLOW, { emissive: new THREE.Color(GLOW), emissiveIntensity: 1.2 }));
      l.position.set(x, y, z);
      g.add(l);
    };
    const person = (kind: FigureKind, pos: THREE.Vector3, face: number, scale = 0.42) => {
      const f = createFigure(kind);
      f.root.scale.setScalar(scale * 1.35);
      f.root.position.copy(pos);
      f.root.rotation.y = face;
      world.add(f.root);
      figures.push(f);
      return f.root;
    };
    // faceOut: rotation that makes something at angle `deg` face away from the centre
    const out = (deg: number) => (deg * Math.PI) / 180;

    // ── ground: rock, terraces, ramps ─────────────────────
    const rock = new THREE.Mesh(track(new THREE.ConeGeometry(15, 7, 28)), mat(0x5a4660));
    rock.position.set(0, -2.6, 0);
    world.add(rock);
    const rock2 = new THREE.Mesh(track(new THREE.ConeGeometry(12, 6, 24)), mat(0x76586a));
    rock2.position.set(0, -1.2, -1.5);
    world.add(rock2);
    T.forEach((t, i) => {
      const h = i === 0 ? t.y : T[i].y;
      const geo = track(new THREE.CylinderGeometry(t.r, t.r + 0.18, h + 0.4, 48));
      const mesh = new THREE.Mesh(geo, [mat(0x7a6670), mat(i === 3 ? 0x9bbb62 : 0xd8c498), mat(0x4a3a4a)]);
      mesh.position.y = (h - 0.4) / 2;
      world.add(mesh);
    });
    const ramp = (rIn: number, yHi: number, rOut: number, yLo: number, deg: number) => {
      const dx = rOut - rIn, dy = yHi - yLo;
      const len = Math.hypot(dx, dy) + 0.2;
      const g = new THREE.Group();
      const slab = new THREE.Mesh(track(new THREE.BoxGeometry(1.0, 0.1, len)), mat(0xe8d6b0));
      slab.position.set(0, (yHi + yLo) / 2, (rIn + rOut) / 2);
      slab.rotation.x = Math.atan2(dy, dx);
      g.add(slab);
      g.rotation.y = out(deg);
      world.add(g);
    };
    ramp(3.0, T[0].y, 5.4, T[1].y, 18);
    ramp(5.0, T[1].y, 7.4, T[2].y, -22);
    ramp(7.0, T[2].y, 9.4, T[3].y, 14);
    ramp(8.9, 0.6, 11.2, 0.12, -6);

    // ── lake ──────────────────────────────────────────────
    const lakeMat = track(new THREE.MeshStandardMaterial({ color: 0x3e7cb8, roughness: 0.25, metalness: 0.1, flatShading: true }));
    const lake = new THREE.Mesh(track(new THREE.CylinderGeometry(6.3, 6.3, 0.2, 40)), lakeMat);
    lake.scale.set(1.35, 1, 0.8);
    lake.position.set(-1.5, 0.02, 14);
    world.add(lake);
    const ground = new THREE.Mesh(track(new THREE.CircleGeometry(26, 40)), mat(0x7f9a5c));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.04;
    world.add(ground);

    // ── clouds ────────────────────────────────────────────
    const cloudMat = track(new THREE.MeshStandardMaterial({ color: 0xfff1f2, transparent: true, opacity: 0.88, flatShading: true, roughness: 1 }));
    const cloud = (x: number, y: number, z: number, s: number) => {
      const g = new THREE.Group();
      [[0, 0, 0, 1], [0.9, -0.1, 0.2, 0.75], [-0.9, -0.15, 0.1, 0.7], [0.3, 0.3, -0.3, 0.65]].forEach(([cx, cy, cz, cs]) => {
        const p = new THREE.Mesh(track(new THREE.IcosahedronGeometry(cs, 1)), cloudMat);
        p.position.set(cx, cy, cz);
        p.scale.y = 0.6;
        g.add(p);
      });
      g.position.set(x, y, z);
      g.scale.setScalar(s);
      world.add(g);
      ticks.push((t) => { g.position.x = x + Math.sin(t * 0.15 + x) * 0.8; });
    };
    cloud(-9, 9.5, -3, 1.4);
    cloud(9, 10, -4, 1.2);
    cloud(-3, T[0].y + 1.0, -2.6, 1.0);
    cloud(3.2, T[0].y + 0.9, -2.8, 0.9);
    cloud(-14, 6, -9, 1.8);

    // ── clickable groups ──────────────────────────────────
    const spots = new Map<string, { anchor: THREE.Vector3; marker: THREE.Mesh; ring: THREE.Mesh }>();
    const spotGroup = (id: string, anchor: THREE.Vector3) => {
      const g = new THREE.Group();
      g.userData.id = id;
      world.add(g);
      const marker = new THREE.Mesh(track(new THREE.SphereGeometry(0.22, 16, 16)), track(new THREE.MeshStandardMaterial({ color: 0xffc627, emissive: new THREE.Color(0xffc627), emissiveIntensity: 0.9 })));
      const ring = new THREE.Mesh(track(new THREE.TorusGeometry(0.34, 0.035, 8, 28)), track(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })));
      ring.rotation.x = Math.PI / 2;
      marker.position.copy(anchor);
      ring.position.copy(anchor);
      marker.userData.id = id;
      ring.userData.skip = true;
      world.add(marker, ring);
      spots.set(id, { anchor, marker, ring });
      return g;
    };
    const place = (g: THREE.Group, pos: THREE.Vector3, faceDeg: number) => {
      g.position.copy(pos);
      g.rotation.y = out(faceDeg);
    };

    // Palace (top)
    {
      const g = spotGroup("palace", new THREE.Vector3(0, T[0].y + 4.4, 0.6));
      const top = T[0].y + 0.25;
      const c = new THREE.Group();
      box(c, 2.6, 0.9, 1.3, WALL, 0, 0, 0);
      box(c, 1.1, 1.8, 1.0, WALL, 0, 0, 0);
      cone(c, 0.85, 1.1, 0x8c1d40, 0, 1.8, 0);
      [-1.45, 1.45].forEach((x) => { cyl(c, 0.38, 0.4, 2.0, WALL, x, 0, 0, 12); cone(c, 0.52, 0.9, 0x8c1d40, x, 2.0, 0, 12, 0); flag(c, x, 2.9, 0, 0xffc627); });
      for (let i = -3; i <= 3; i++) box(c, 0.2, 0.18, 0.2, WALL, i * 0.36, 0.9, 0.55);
      windows(c, 2.6, 1.4, 1.3, 4);
      box(c, 0.5, 0.7, 0.05, 0x4a1d2e, 0, 0, 0.66);
      flag(c, 0, 2.9, 0, 0xffc627);
      lantern(c, -0.4, 0.8, 0.7); lantern(c, 0.4, 0.8, 0.7);
      c.position.set(0, top, -0.4);
      g.add(c);
      person("queen", new THREE.Vector3(0.9, top, 1.7), out(10));
      ticks.push((t) => { c.position.y = top + Math.sin(t * 0.8) * 0.04; });
    }
    // Pigeon loft
    {
      const g = spotGroup("pigeon-loft", pol(2.0, -52, T[0].y + 2.5));
      const loft = new THREE.Group();
      box(loft, 0.8, 1.5, 0.8, WALL, 0, 0, 0);
      cone(loft, 0.7, 0.7, 0x4a5f94, 0, 1.5, 0);
      for (let i = 0; i < 3; i++) box(loft, 0.14, 0.14, 0.04, 0x3a2d3d, -0.22 + i * 0.22, 1.0 - (i % 2) * 0.3, 0.42);
      place(loft, pol(2.0, -52, T[0].y + 0.1), -52);
      g.add(loft);
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(track(new THREE.SphereGeometry(0.1, 8, 8)), mat(0xffffff));
        b.scale.set(1.5, 0.8, 0.9);
        g.add(b);
        ticks.push((t) => { b.position.set(loft.position.x + Math.sin(t * 0.7 + i * 2.1) * 1.1, T[0].y + 2.8 + Math.sin(t * 1.6 + i) * 0.1, loft.position.z + Math.cos(t * 0.7 + i * 2.1) * 1.1); b.rotation.y = -t * 0.7 - i * 2.1; });
      }
    }
    // Eastgate bastion with the gatekeeper
    {
      const g = spotGroup("eastgate", pol(2.3, 48, T[0].y + 2.1));
      const b = new THREE.Group();
      box(b, 1.5, 1.3, 0.9, 0x9aa0aa, 0, 0, 0);
      for (let i = 0; i < 5; i++) box(b, 0.2, 0.2, 0.2, 0x9aa0aa, -0.6 + i * 0.3, 1.3, 0.3);
      box(b, 0.5, 0.8, 0.06, 0x2a1d2e, 0, 0, 0.47);
      lantern(b, -0.65, 0.9, 0.5); lantern(b, 0.65, 0.9, 0.5);
      flag(b, 0, 1.5, 0, 0x4a5f94);
      place(b, pol(2.3, 48, T[0].y + 0.1), 48);
      g.add(b);
      person("gatekeeper", pol(2.3, 40, T[0].y + 0.1).add(new THREE.Vector3(0, 0, 0.75)), out(30), 0.36);
    }
    // Hooded rider leaving on the north road (a horse made of blocks)
    {
      const g = spotGroup("north-rider", pol(2.5, 98, T[0].y + 1.6));
      const h = new THREE.Group();
      box(h, 0.9, 0.38, 0.32, 0x4a3326, 0, 0.45, 0);
      box(h, 0.22, 0.5, 0.22, 0x4a3326, 0.5, 0.65, 0);
      box(h, 0.34, 0.2, 0.2, 0x4a3326, 0.7, 1.05, 0);
      [[-0.32, -0.1], [-0.32, 0.1], [0.32, -0.1], [0.32, 0.1]].forEach(([x, z]) => box(h, 0.08, 0.5, 0.08, 0x3a281e, x, 0, z));
      box(h, 0.26, 0.5, 0.26, 0x2a1f33, -0.05, 0.85, 0);
      const hood = new THREE.Mesh(track(new THREE.SphereGeometry(0.16, 10, 10)), mat(0x2a1f33));
      hood.position.set(-0.05, 1.5, 0);
      h.add(hood);
      place(h, pol(2.5, 98, T[0].y + 0.1), 98 + 90);
      h.rotation.y = out(98) + Math.PI / 2 * 0 + 0.0;
      g.add(h);
      ticks.push((t) => { h.position.y = T[0].y + 0.1 + Math.abs(Math.sin(t * 2.4)) * 0.03; });
    }
    // Town square: the rumor board
    {
      const g = spotGroup("rumor-board", pol(3.9, 0, T[1].y + 2.0));
      const b = new THREE.Group();
      box(b, 0.08, 1.2, 0.08, 0x5b3a22, -0.7, 0, 0); box(b, 0.08, 1.2, 0.08, 0x5b3a22, 0.7, 0, 0);
      box(b, 1.6, 0.9, 0.1, 0x7a5230, 0, 0.5, 0);
      box(b, 1.45, 0.75, 0.04, 0xe8d6b0, 0, 0.57, 0.06);
      [[-0.5, 0.95, 0xffffff], [-0.1, 1.0, 0xffe7a8], [0.3, 0.92, 0xffd0c0], [0.55, 1.05, 0xffffff], [-0.4, 0.72, 0xffe7a8], [0.1, 0.7, 0xffffff], [0.5, 0.74, 0xffd0c0]].forEach(([x, y, c]) => box(b, 0.22, 0.2, 0.02, c as number, x as number, (y as number) - 0.15, 0.1));
      place(b, pol(3.9, 0, T[1].y + 0.1), 0);
      g.add(b);
      person("prince", pol(3.9, 10, T[1].y + 0.1).add(new THREE.Vector3(1.1, 0, 0.3)), out(-10), 0.32);
      person("princess", pol(3.9, -12, T[1].y + 0.1).add(new THREE.Vector3(-1.1, 0, 0.3)), out(15), 0.32);
    }
    // Codex workshop with waterwheel and engineer
    {
      const g = spotGroup("workshop", pol(4.0, -48, T[1].y + 2.3));
      const w = new THREE.Group();
      box(w, 1.6, 1.0, 1.1, WALL, 0, 0, 0);
      cone(w, 1.2, 0.8, 0xb5502f, 0, 1.0, 0);
      cyl(w, 0.14, 0.16, 0.9, 0x6f7480, 0.5, 1.0, -0.2);
      box(w, 0.4, 0.6, 0.06, 0x4a2f1f, 0, 0, 0.56);
      windows(w, 1.6, 1.0, 1.1, 2);
      const wheel = new THREE.Group();
      const rim = new THREE.Mesh(track(new THREE.TorusGeometry(0.55, 0.06, 6, 20)), mat(0x6a4a2c));
      wheel.add(rim);
      for (let i = 0; i < 6; i++) {
        const sp = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, 1.1, 0.05)), mat(0x8a5a2e));
        sp.rotation.z = (i * Math.PI) / 6;
        wheel.add(sp);
      }
      wheel.position.set(-0.95, 0.65, 0);
      wheel.rotation.y = Math.PI / 2;
      w.add(wheel);
      ticks.push((t) => { wheel.rotation.x = t * 0.9; });
      const smoke = new THREE.Mesh(track(new THREE.SphereGeometry(0.16, 8, 8)), track(new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.5 })));
      w.add(smoke);
      ticks.push((t) => { const k = (t * 0.4) % 1; smoke.position.set(0.5 + k * 0.4, 2.0 + k * 1.0, -0.2); smoke.scale.setScalar(0.6 + k); (smoke.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - k); });
      place(w, pol(4.0, -48, T[1].y + 0.1), -48);
      g.add(w);
      person("engineer", pol(4.2, -36, T[1].y + 0.1).add(new THREE.Vector3(0.2, 0, 0.9)), out(-5), 0.36);
      const codex = createFigure("codex");
      codex.root.scale.setScalar(0.3);
      codex.root.position.copy(pol(4.2, -58, T[1].y + 0.1).add(new THREE.Vector3(-0.5, 0, 0.9)));
      world.add(codex.root);
      figures.push(codex);
    }
    // University hall with clock tower and professor
    {
      const g = spotGroup("university", pol(4.0, 48, T[1].y + 2.6));
      const u = new THREE.Group();
      box(u, 2.0, 0.95, 1.1, WALL, 0, 0, 0);
      cone(u, 1.45, 0.7, 0x4a5f94, 0, 0.95, 0);
      for (let i = 0; i < 5; i++) cyl(u, 0.06, 0.06, 0.9, 0xfbf1da, -0.8 + i * 0.4, 0, 0.6, 8);
      box(u, 0.6, 1.8, 0.6, WALL, 0.55, 0.95, -0.1);
      cone(u, 0.5, 0.7, 0x8c1d40, 0.55, 2.75, -0.1);
      const clock = new THREE.Mesh(track(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 20)), mat(0xfff8e6));
      clock.rotation.x = Math.PI / 2;
      clock.position.set(0.55, 2.3, 0.23);
      u.add(clock);
      box(u, 0.4, 0.55, 0.05, 0x4a2f1f, -0.1, 0, 0.58);
      place(u, pol(4.0, 48, T[1].y + 0.1), 48);
      g.add(u);
      person("professor", pol(4.3, 33, T[1].y + 0.1).add(new THREE.Vector3(0, 0, 0.9)), out(0), 0.36);
    }
    // Market
    {
      const g = spotGroup("market", pol(6.1, -34, T[2].y + 1.9));
      const mk = new THREE.Group();
      [[-1.0, 0xc43a3a, 0xff6a4a], [0, 0xe0a526, 0xf2b632], [1.0, 0x3a78c4, 0x7fb34a]].forEach(([x, c, fruit]) => {
        const s = new THREE.Group();
        box(s, 0.76, 0.5, 0.45, 0x8a5a2e, 0, 0, 0);
        [-0.34, 0.34].forEach((px) => cyl(s, 0.025, 0.025, 1.1, 0x5b3a22, px, 0, 0.2, 6));
        box(s, 0.95, 0.12, 0.7, c as number, 0, 1.0, 0.1);
        for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(track(new THREE.SphereGeometry(0.08, 8, 8)), mat(fruit as number)); f.position.set(-0.22 + i * 0.22, 0.58, 0.05); s.add(f); }
        s.position.x = x as number;
        mk.add(s);
      });
      place(mk, pol(6.1, -34, T[2].y + 0.1), -34);
      g.add(mk);
      person("princess", pol(6.0, -24, T[2].y + 0.1).add(new THREE.Vector3(0.1, 0, 0.9)), out(0), 0.32);
    }
    // Scribes' hall
    {
      const g = spotGroup("scribes-hall", pol(6.1, 36, T[2].y + 1.9));
      const s = new THREE.Group();
      box(s, 2.0, 0.95, 1.1, WALL, 0, 0, 0);
      cone(s, 1.45, 0.8, 0xb5502f, 0, 0.95, 0);
      windows(s, 2.0, 0.95, 1.1, 4);
      box(s, 0.4, 0.55, 0.05, 0x4a2f1f, 0, 0, 0.58);
      const scroll = new THREE.Mesh(track(new THREE.CylinderGeometry(0.1, 0.1, 0.7, 10)), mat(0xf3e6c4));
      scroll.rotation.z = Math.PI / 2;
      scroll.position.set(0, 1.0, 0.7);
      s.add(scroll);
      place(s, pol(6.1, 36, T[2].y + 0.1), 36);
      g.add(s);
      person("prince", pol(6.2, 24, T[2].y + 0.1).add(new THREE.Vector3(0, 0, 0.95)), out(0), 0.32);
    }
    // Great lake with a boat
    {
      const g = spotGroup("lake", new THREE.Vector3(-1.5, 2.4, 14.4));
      const boat = new THREE.Group();
      box(boat, 0.9, 0.18, 0.34, 0x6a4a2c, 0, 0, 0);
      cyl(boat, 0.02, 0.02, 0.9, 0x5b4030, 0, 0.18, 0, 6);
      const sail = new THREE.Mesh(track(new THREE.ConeGeometry(0.32, 0.8, 3)), mat(0xf6efe0));
      sail.position.set(0, 0.7, 0);
      sail.rotation.y = Math.PI / 2;
      boat.add(sail);
      boat.position.set(-1.5, 0.12, 14.4);
      g.add(boat);
      ticks.push((t) => { boat.position.x = -1.5 + Math.sin(t * 0.3) * 1.6; boat.position.y = 0.12 + Math.sin(t * 1.6) * 0.03; boat.rotation.z = Math.sin(t * 1.3) * 0.05; });
      // reeds on the shore
      for (let i = 0; i < 8; i++) cyl(g, 0.02, 0.03, 0.4, 0x5f8a52, -5.5 + i * 0.4, 0, 11 + (i % 2) * 0.2, 5);
    }

    // ── decorative village on the bottom terrace, pines, windmill ──────
    for (let i = 0; i < 14; i++) {
      const deg = -80 + i * 11.5 + (i % 2) * 2;
      const r = 8.1 + (i % 3) * 0.1;
      const hs = house(0.55 + (i % 3) * 0.12, 0.45 + (i % 2) * 0.12, 0.5, ROOFS[i % 3], i % 2 ? WALL_SHADE : WALL);
      hs.position.copy(pol(r, deg, T[3].y + 0.1));
      hs.rotation.y = out(deg);
      world.add(hs);
    }
    for (let i = 0; i < 9; i++) {
      const deg = -70 + i * 17;
      const r = 6.2 + (i % 2) * 0.3;
      const y = T[2].y + 0.1;
      const hs = house(0.5, 0.42, 0.45, ROOFS[(i + 1) % 3]);
      if (Math.abs(deg + 34) < 14 || Math.abs(deg - 36) < 14) continue;
      hs.position.copy(pol(r + 0.5, deg, y));
      hs.rotation.y = out(deg);
      world.add(hs);
    }
    for (let i = 0; i < 7; i++) {
      const deg = -75 + i * 25;
      if (Math.abs(deg + 48) < 18 || Math.abs(deg) < 10 || Math.abs(deg - 48) < 18) continue;
      const hs = house(0.55, 0.45, 0.5, ROOFS[i % 3], WALL_SHADE);
      hs.position.copy(pol(4.6, deg, T[1].y + 0.1));
      hs.rotation.y = out(deg);
      world.add(hs);
    }
    const pine = (x: number, y: number, z: number, s: number) => {
      const p = new THREE.Group();
      cyl(p, 0.06, 0.08, 0.3, 0x5b4030, 0, 0, 0, 6);
      cone(p, 0.38, 0.8, 0x2f6b52, 0, 0.25, 0, 7, 0);
      cone(p, 0.28, 0.7, 0x3f8564, 0, 0.7, 0, 7, 0);
      p.position.set(x, y, z);
      p.scale.setScalar(s);
      world.add(p);
    };
    for (let i = 0; i < 16; i++) {
      const deg = -100 + i * 13;
      pine(...(pol(9.9 + (i % 3) * 0.6, deg, 0.1).toArray() as [number, number, number]), 1.2 + (i % 3) * 0.3);
    }
    for (let i = 0; i < 8; i++) pine(...(pol(2.7, 130 + i * 14, T[0].y + 0.1).toArray() as [number, number, number]), 1.0);
    // windmill and farm fields on the east shore
    {
      const wm = new THREE.Group();
      cyl(wm, 0.35, 0.5, 1.6, WALL, 0, 0, 0, 10);
      cone(wm, 0.42, 0.5, 0x8c1d40, 0, 1.6, 0, 10, 0);
      const blades = new THREE.Group();
      for (let i = 0; i < 4; i++) {
        const bl = new THREE.Mesh(track(new THREE.BoxGeometry(0.12, 1.3, 0.03)), mat(0xf3e6c4));
        bl.position.y = 0.65;
        const arm = new THREE.Group();
        arm.rotation.z = (i * Math.PI) / 2;
        arm.add(bl);
        blades.add(arm);
      }
      blades.position.set(0, 1.35, 0.45);
      wm.add(blades);
      ticks.push((t) => { blades.rotation.z = t * 0.5; });
      wm.position.set(11.2, 0, 5.2);
      world.add(wm);
      [0, 1, 2].forEach((i) => {
        const f = new THREE.Mesh(track(new THREE.BoxGeometry(3.2, 0.06, 1.3)), mat([0x8fb55a, 0xd6b94f, 0xa07e46][i]));
        f.position.set(11.6, 0.03, 8.0 + i * 1.5);
        f.rotation.y = -0.15;
        world.add(f);
      });
    }

    // ── interaction ───────────────────────────────────────
    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const idOf = (obj: THREE.Object3D | null): string | null => {
      let o: THREE.Object3D | null = obj;
      while (o) {
        if (o.userData.id) return o.userData.id as string;
        o = o.parent;
      }
      return null;
    };
    // figures near a hotspot belong to it: look up by the nearest spot anchor
    const spotFromHit = (hit: THREE.Intersection): string | null => {
      const direct = idOf(hit.object);
      if (direct) return direct;
      let best: string | null = null;
      let bd = 2.2;
      spots.forEach((s, id) => {
        const d = hit.point.distanceTo(new THREE.Vector3(s.anchor.x, hit.point.y, s.anchor.z));
        if (d < bd) { bd = d; best = id; }
      });
      return best;
    };
    const pick = (e: PointerEvent): { id: string | null; x: number; y: number } => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(pointer, camera);
      const hits = ray.intersectObjects(world.children, true).filter((h) => !h.object.userData.skip && h.object !== rock && h.object !== rock2 && h.object !== ground && h.object !== lake);
      // plain terrace cylinders are scenery; cylinders that belong to a clickable group still count
      const first = hits.find((h) => ((h.object as THREE.Mesh).isMesh && (h.object as THREE.Mesh).geometry.type !== "CylinderGeometry") || idOf(h.object));
      const hit = first ?? null;
      return { id: hit ? spotFromHit(hit) : null, x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    let downX = 0, downY = 0;
    const onDown = (e: PointerEvent) => { downX = e.clientX; downY = e.clientY; };
    const onUp = (e: PointerEvent) => {
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 5) return;
      const { id } = pick(e);
      if (id) cbRef.current.onPick(id);
    };
    let lastHover: string | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.buttons) return;
      const { id, x, y } = pick(e);
      renderer.domElement.style.cursor = id ? "pointer" : "grab";
      if (id !== lastHover || id) { lastHover = id; cbRef.current.onHover(id, x, y); }
    };
    const onLeave = () => { lastHover = null; cbRef.current.onHover(null, 0, 0); };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerleave", onLeave);
    renderer.domElement.style.cursor = "grab";

    const resize = () => {
      const w = mount.clientWidth || 600;
      const h = mount.clientHeight || 400;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(mount);

    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      const t = reduce ? 0 : clock.getElapsedTime();
      ticks.forEach((f) => f(t));
      figures.forEach((f) => f.tick(t, false));
      const { seen: sn, openId: op, showAll: sa } = stateRef.current;
      spots.forEach((s, id) => {
        const isSeen = sn.includes(id);
        const active = id === op;
        const vis = sa || isSeen || active;
        s.marker.visible = vis;
        s.ring.visible = vis;
        const mmat = s.marker.material as THREE.MeshStandardMaterial;
        mmat.color.set(isSeen ? 0x22c55e : 0xffc627);
        mmat.emissive.set(isSeen ? 0x22c55e : 0xffc627);
        const bob = reduce ? 0 : Math.sin(t * 2 + s.anchor.x) * 0.1;
        s.marker.position.y = s.anchor.y + bob;
        s.ring.position.y = s.anchor.y + bob;
        s.ring.scale.setScalar(isSeen ? 0.8 : 1 + (reduce ? 0 : Math.sin(t * 3) * 0.12));
        s.marker.scale.setScalar(active ? 1.5 : 1);
      });
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerleave", onLeave);
      controls.dispose();
      figures.forEach((f) => f.dispose());
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center text-center p-6" style={{ color: "rgba(255,255,255,0.8)" }}>
        Your browser can't show the 3D city. Switch to the picture view above.
      </div>
    );
  }
  return <div ref={mountRef} className="w-full h-full" role="img" aria-label="3D model of the city of Argonia. Drag to turn it, scroll to zoom, click buildings and people." />;
}
