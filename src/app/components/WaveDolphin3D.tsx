import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import dolphinImg from "../assets/dolphin-mascot.png";

interface WaveDolphin3DProps {
  width?: number;
  height?: number;
}

// ── Body shape ───────────────────────────────────────────────────────────────
// The spine runs along +X: tail at u = 0, nose at u = 1. Radius is interpolated
// (Catmull-Rom) through hand-tuned control points so the silhouette is smooth.
const LENGTH = 1.9;
const RINGS = 72;
const SEGS = 32;
const PROFILE: [number, number][] = [
  [0.0, 0.014],
  [0.08, 0.05],
  [0.2, 0.125],
  [0.35, 0.2],
  [0.5, 0.248],
  [0.62, 0.252],
  [0.72, 0.24],
  [0.8, 0.215],
  [0.86, 0.178],
  [0.91, 0.128],
  [0.95, 0.088],
  [0.985, 0.058],
  [1.0, 0.0],
];

function catmull(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
}

const GIRTH = 1.08; // overall body chubbiness (the mascot is round and friendly)

function radiusAt(u: number): number {
  const n = PROFILE.length;
  let i = 0;
  while (i < n - 2 && u > PROFILE[i + 1][0]) i++;
  const [u1, r1] = PROFILE[i];
  const [u2, r2] = PROFILE[i + 1];
  const r0 = PROFILE[Math.max(i - 1, 0)][1];
  const r3 = PROFILE[Math.min(i + 2, n - 1)][1];
  const t = Math.min(Math.max((u - u1) / (u2 - u1), 0), 1);
  return Math.max(catmull(r0, r1, r2, r3, t), 0) * GIRTH;
}

const heightScale = (u: number) => (u > 0.9 ? 1 - (u - 0.9) * 2.0 : 1.02); // slightly flatter snout
const widthScale = (u: number) => (u > 0.9 ? 1.08 : 0.92);

/** Vertical tail-beat: tiny at the head, biggest at the tail; travels tail-ward. */
function bendAt(u: number, t: number): number {
  return 0.2 * Math.pow(1 - u, 1.7) * Math.sin(2 * Math.PI * 0.85 * u + t * 5.2);
}

function slopeAt(u: number, t: number): number {
  const du = 0.01;
  const a = Math.min(u + du, 1);
  const b = Math.max(u - du, 0);
  return Math.atan((bendAt(a, t) - bendAt(b, t)) / ((a - b) * LENGTH));
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

const COLOR_BACK = new THREE.Color("#5f7a9e");
const COLOR_FLANK = new THREE.Color("#7d96b6");
const COLOR_BELLY = new THREE.Color("#f6f9fc");
const COLOR_MAROON = new THREE.Color("#8c1d40"); // ASU maroon
const COLOR_GOLD = new THREE.Color("#ffc627"); // ASU gold

function buildBody() {
  const verts = (RINGS + 1) * (SEGS + 1);
  const positions = new Float32Array(verts * 3);
  const colors = new Float32Array(verts * 3);
  const indices: number[] = [];
  const c = new THREE.Color();

  for (let i = 0; i <= RINGS; i++) {
    const u = i / RINGS;
    // the white belly line rises toward the head so the chin and mouth area are white
    const line = -0.3 + 0.55 * smooth(0.35, 0.95, u);
    for (let j = 0; j <= SEGS; j++) {
      const phi = (j / SEGS) * Math.PI * 2;
      const up = Math.cos(phi); // +1 = back, -1 = belly
      c.copy(COLOR_BACK).lerp(COLOR_FLANK, smooth(0.6, 0.0, up)).lerp(COLOR_BELLY, smooth(line + 0.08, line - 0.16, up));
      const k = (i * (SEGS + 1) + j) * 3;
      colors[k] = c.r;
      colors[k + 1] = c.g;
      colors[k + 2] = c.b;
    }
  }
  for (let i = 0; i < RINGS; i++) {
    for (let j = 0; j < SEGS; j++) {
      const a = i * (SEGS + 1) + j;
      const b = a + SEGS + 1;
      indices.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setIndex(indices);

  const update = (t: number) => {
    for (let i = 0; i <= RINGS; i++) {
      const u = i / RINGS;
      const x = (u - 0.5) * LENGTH;
      const r = radiusAt(u);
      const by = bendAt(u, t);
      for (let j = 0; j <= SEGS; j++) {
        const phi = (j / SEGS) * Math.PI * 2;
        const k = (i * (SEGS + 1) + j) * 3;
        positions[k] = x;
        positions[k + 1] = by + r * heightScale(u) * Math.cos(phi);
        positions[k + 2] = r * widthScale(u) * Math.sin(phi);
      }
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
  };
  update(0);
  return { geometry, update };
}

// ── Fins ─────────────────────────────────────────────────────────────────────
function finGeometry(shape: THREE.Shape, depth: number): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: depth * 0.55,
    bevelThickness: depth * 0.55,
    bevelSegments: 3,
    curveSegments: 18,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

interface Bounds { x0: number; x1: number; y0: number; y1: number }

/**
 * Paints ASU maroon/gold stripes along the given edge curves onto a canvas texture.
 * ExtrudeGeometry's cap UVs are the raw shape x/y, so repeat/offset map this texture onto the fin.
 */
function stripeTexture(bounds: Bounds, edges: THREE.Vector2[][], base: THREE.Color): THREE.CanvasTexture {
  const N = 192;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = N;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(N, N);
  const c = new THREE.Color();
  const v = new THREE.Vector2();
  for (let py = 0; py < N; py++) {
    for (let px = 0; px < N; px++) {
      v.set(bounds.x0 + ((px + 0.5) / N) * (bounds.x1 - bounds.x0), bounds.y1 - ((py + 0.5) / N) * (bounds.y1 - bounds.y0));
      let d = Infinity;
      for (const edge of edges) for (const p of edge) d = Math.min(d, v.distanceTo(p));
      c.copy(base);
      c.lerp(COLOR_GOLD, smooth(0.078, 0.066, d));
      c.lerp(COLOR_MAROON, smooth(0.044, 0.032, d));
      c.convertLinearToSRGB();
      const k = (py * N + px) * 4;
      img.data[k] = c.r * 255;
      img.data[k + 1] = c.g * 255;
      img.data[k + 2] = c.b * 255;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(1 / (bounds.x1 - bounds.x0), 1 / (bounds.y1 - bounds.y0));
  tex.offset.set(-bounds.x0 / (bounds.x1 - bounds.x0), -bounds.y0 / (bounds.y1 - bounds.y0));
  return tex;
}

const curve2 = (a: [number, number], ctrl: [number, number], b: [number, number]) =>
  new THREE.QuadraticBezierCurve(new THREE.Vector2(...a), new THREE.Vector2(...ctrl), new THREE.Vector2(...b)).getPoints(30);

function dorsalShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.17, 0);
  s.quadraticCurveTo(0.1, 0.24, -0.1, 0.38);
  s.quadraticCurveTo(-0.04, 0.15, -0.23, 0);
  s.closePath();
  return s;
}

function pectoralShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.08, 0);
  s.quadraticCurveTo(0.04, -0.2, -0.18, -0.34);
  s.quadraticCurveTo(-0.05, -0.12, -0.11, 0);
  s.closePath();
  return s;
}

function flukeShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.03, 0);
  s.quadraticCurveTo(0.0, 0.2, -0.23, 0.37);
  s.quadraticCurveTo(-0.16, 0.14, -0.13, 0);
  s.quadraticCurveTo(-0.16, -0.14, -0.23, -0.37);
  s.quadraticCurveTo(0.0, -0.2, 0.03, 0);
  s.closePath();
  return s;
}

// ── Component ────────────────────────────────────────────────────────────────
/** A real, lit, textured-by-vertex 3D dolphin that swims laps around the frame. */
export function WaveDolphin3D({ width = 270, height = 210 }: WaveDolphin3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = "block";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.9, 4.2);
    camera.lookAt(0, -0.15, 0);

    // Lighting: sky/ground fill, a warm key from above-front, and a cool rim from behind.
    scene.add(new THREE.HemisphereLight(0xd6f0ff, 0x1d4a73, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(2.5, 3.5, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8fdcff, 1.6);
    rim.position.set(-3, 1.5, -2.5);
    scene.add(rim);

    const skin = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.32,
      metalness: 0.0,
      clearcoat: 0.8,
      clearcoatRoughness: 0.28,
      side: THREE.DoubleSide,
    });
    const finMaterial = (map?: THREE.Texture) =>
      new THREE.MeshPhysicalMaterial({
        color: map ? "#ffffff" : COLOR_BACK,
        map: map ?? null,
        roughness: 0.34,
        clearcoat: 0.7,
        clearcoatRoughness: 0.3,
        side: THREE.DoubleSide,
      });
    const dorsalTex = stripeTexture({ x0: -0.27, x1: 0.2, y0: -0.01, y1: 0.4 }, [curve2([-0.1, 0.38], [-0.04, 0.15], [-0.23, 0])], COLOR_BACK);
    const flukeTex = stripeTexture(
      { x0: -0.27, x1: 0.06, y0: -0.4, y1: 0.4 },
      [curve2([0.03, 0], [0.0, 0.2], [-0.23, 0.37]), curve2([0.03, 0], [0.0, -0.2], [-0.23, -0.37])],
      COLOR_BACK
    );
    const dorsalMat = finMaterial(dorsalTex);
    const flukeMat = finMaterial(flukeTex);
    const finMat = finMaterial(); // plain slate (pectoral fins)
    const eyeMat = new THREE.MeshPhysicalMaterial({ color: "#0b1620", roughness: 0.15, clearcoat: 1 });
    const glintMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const smileMat = new THREE.MeshStandardMaterial({ color: "#16324d", roughness: 0.6 });

    // Everything that makes up the dolphin lives in `dolphin`, nose along +X.
    const dolphin = new THREE.Group();
    const body = buildBody();
    dolphin.add(new THREE.Mesh(body.geometry, skin));

    const dorsal = new THREE.Mesh(finGeometry(dorsalShape(), 0.03), dorsalMat);
    dolphin.add(dorsal);

    const fluke = new THREE.Mesh(finGeometry(flukeShape(), 0.03), flukeMat);
    fluke.rotation.x = -Math.PI / 2; // lay the fluke flat (horizontal), like a real dolphin's tail
    const flukePivot = new THREE.Group();
    flukePivot.add(fluke);
    dolphin.add(flukePivot);

    const pecGeo = finGeometry(pectoralShape(), 0.026);
    const pecL = new THREE.Mesh(pecGeo, finMat);
    const pecR = new THREE.Mesh(pecGeo, finMat);
    dolphin.add(pecL, pecR);

    // Friendly face: small natural eyes, a soft smile, and a hint of pink tongue.
    const extraMats: THREE.Material[] = [];
    const mat = <T extends THREE.Material>(m: T): T => (extraMats.push(m), m);
    const scleraMat = mat(new THREE.MeshPhysicalMaterial({ color: "#1a1412", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }));
    const irisMat = mat(new THREE.MeshBasicMaterial({ color: "#4a3426" }));
    const pupilMat = mat(new THREE.MeshBasicMaterial({ color: "#090606" }));
    const highlightMat = mat(new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    const mouthMat = mat(new THREE.MeshStandardMaterial({ color: "#5a1d30", roughness: 0.5 }));
    const tongueMat = mat(new THREE.MeshPhysicalMaterial({ color: "#f08ea4", roughness: 0.35, clearcoat: 0.6 }));

    const surface = (u: number, cosPhi: number, lift = 1): THREE.Vector3 => {
      const r = radiusAt(u);
      const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
      return new THREE.Vector3((u - 0.5) * LENGTH, r * heightScale(u) * cosPhi * lift, r * widthScale(u) * sinPhi * lift);
    };
    const faceItems: THREE.Object3D[] = [];
    for (const side of [1, -1]) {
      // eye
      const eyeAt = surface(0.835, 0.4);
      eyeAt.z *= side;
      const eye = new THREE.Group();
      eye.position.copy(eyeAt);
      dolphin.add(eye);
      eye.lookAt(eyeAt.x + 0.3, eyeAt.y + 0.18, eyeAt.z + side * 0.9); // faces outward, a little forward and up

      // a small, natural dolphin eye: glossy dark ball with a soft brown iris and a tiny highlight
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.04, 28, 20), scleraMat);
      ball.scale.set(1, 1, 0.62);
      eye.add(ball);
      const disc = (radius: number, m: THREE.Material, x: number, y: number, z: number) => {
        const d = new THREE.Mesh(new THREE.CircleGeometry(radius, 32), m);
        d.position.set(x, y, z);
        eye.add(d);
        return d;
      };
      const zFront = 0.04 * 0.62 + 0.0015;
      disc(0.03, irisMat, 0, 0, zFront);
      disc(0.018, pupilMat, 0, 0, zFront + 0.0012);
      disc(0.0085, highlightMat, side * 0.011, 0.011, zFront + 0.0024);
      faceItems.push(eye);

      // open smile curling up toward the cheek
      const pts: THREE.Vector3[] = [];
      for (let n = 0; n <= 14; n++) {
        const k = n / 14;
        const u = 0.99 - k * 0.19;
        const c = -0.34 + 0.42 * smooth(0.25, 1.0, k);
        const p = surface(u, c, 1.01);
        p.z *= side;
        pts.push(p);
      }
      const mouth = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.0105, 8), mouthMat);
      dolphin.add(mouth);
      faceItems.push(mouth);

      const tongueAt = surface(0.925, -0.42, 1.0);
      tongueAt.z *= side;
      const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), tongueMat);
      tongue.scale.set(1.35, 0.42, 0.5);
      tongue.position.copy(tongueAt);
      tongue.rotation.y = side * 0.15;
      dolphin.add(tongue);
      faceItems.push(tongue);
    }

    // The orbiting rig: yaw to follow the path, with roll/pitch applied on the inner group.
    const rig = new THREE.Group();
    const lean = new THREE.Group();
    lean.add(dolphin);
    rig.add(lean);
    scene.add(rig);

    // Soft contact shadow on the "sea floor".
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 64;
    const sctx = shadowCanvas.getContext("2d")!;
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(0,12,28,0.55)");
    grad.addColorStop(1, "rgba(0,12,28,0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 0.9), shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.75;
    scene.add(shadow);

    const ORBIT = 0.9;
    const LAP_SECONDS = 12;
    const clock = new THREE.Clock();
    let raf = 0;

    const frame = () => {
      const t = clock.getElapsedTime();
      const theta = (t / LAP_SECONDS) * Math.PI * 2;

      body.update(t);

      // follow the spine with the fins
      const by = (u: number) => bendAt(u, t);
      const dorsalU = 0.5;
      dorsal.position.set(
        (dorsalU - 0.5) * LENGTH,
        by(dorsalU) + radiusAt(dorsalU) * heightScale(dorsalU) * 0.93,
        0
      );
      dorsal.rotation.z = slopeAt(dorsalU, t);

      flukePivot.position.set(-LENGTH / 2 + 0.005, by(0), 0);
      flukePivot.rotation.z = slopeAt(0.02, t) * 1.0;

      const pecU = 0.74;
      const pr = radiusAt(pecU);
      const flap = Math.sin(t * 2.4) * 0.18;
      const py = by(pecU) - pr * 0.35;
      pecR.position.set((pecU - 0.5) * LENGTH, py, pr * widthScale(pecU) * 0.85);
      pecL.position.set((pecU - 0.5) * LENGTH, py, -pr * widthScale(pecU) * 0.85);
      pecR.rotation.set(-0.85 + flap, 0, 0.35);
      pecL.rotation.set(0.85 - flap, 0, 0.35);

      faceItems.forEach((f) => (f.position.y += 0)); // eyes/smile are rigid — head barely bends

      // orbit path: swim a lap, banking into the turn with a gentle bob
      const x = Math.cos(theta) * ORBIT;
      const z = Math.sin(theta) * ORBIT * 0.85;
      const y = Math.sin(t * 2.1) * 0.12;
      rig.position.set(x, y, z);
      rig.rotation.y = -theta - Math.PI / 2;
      lean.rotation.x = 0.22; // roll toward the centre of the turn
      lean.rotation.z = Math.sin(t * 2.1 + 1) * 0.07; // pitch with the bob

      shadow.position.x = x;
      shadow.position.z = z;
      const lift = (y + 0.12) / 0.24;
      shadow.scale.setScalar(0.85 + (1 - lift) * 0.25);
      shadowMat.opacity = 0.65 + (1 - lift) * 0.25;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      [skin, finMat, dorsalMat, flukeMat, eyeMat, glintMat, smileMat, shadowMat, ...extraMats].forEach((m) => m.dispose());
      dorsalTex.dispose();
      flukeTex.dispose();
      shadowTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [width, height]);

  if (failed) {
    // No WebGL: fall back to the flat mascot art so the intro still works.
    return <img src={dolphinImg} alt="Wave the dolphin mascot" width={110} style={{ height: "auto" }} />;
  }
  return <div ref={mountRef} style={{ width, height }} aria-label="Wave the dolphin, swimming" role="img" />;
}
