import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// 3D figures for the Argonia quest: low-poly "toy" characters and the codex machine.
// Everything is built from three.js primitives (no image or model files), in the same way as the 3D Wave dolphin.
// Each figure idles (gentle bob and sway), can "talk" (little nods), and can be dragged to turn it around.

export type FigureKind =
  | "queen"
  | "king"
  | "princess"
  | "prince"
  | "engineer"
  | "professor"
  | "gatekeeper"
  | "codex";

const FALLBACK_EMOJI: Record<FigureKind, string> = {
  queen: "👑",
  king: "🤴",
  princess: "👸",
  prince: "🧑‍🎓",
  engineer: "🛠️",
  professor: "🎓",
  gatekeeper: "🚪",
  codex: "📜",
};

const LABEL: Record<FigureKind, string> = {
  queen: "The Queen",
  king: "The King",
  princess: "The Princess",
  prince: "The Prince",
  engineer: "The Engineer",
  professor: "The Professor",
  gatekeeper: "Ysolde, the Gatekeeper",
  codex: "The codex machine",
};

interface Look {
  robe: number;
  trim: number;
  skin: number;
  hair: number;
  hairStyle: "long" | "short" | "bob" | "bun" | "gray" | "hood";
  wideRobe?: boolean;
  crown?: boolean;
  beard?: boolean;
  glasses?: boolean;
  overalls?: number;
  slim?: boolean;
  helmet?: boolean;
}

const LOOKS: Record<Exclude<FigureKind, "codex">, Look> = {
  queen: { robe: 0x8c1d40, trim: 0xffc627, skin: 0xf0c8a8, hair: 0xb8431f, hairStyle: "long", wideRobe: true, crown: true },
  king: { robe: 0x35508a, trim: 0xffc627, skin: 0xe9bf9b, hair: 0x4a3322, hairStyle: "short", crown: true, beard: true },
  princess: { robe: 0xa3244b, trim: 0xffc627, skin: 0xf0c8a8, hair: 0x4a3322, hairStyle: "bob" },
  prince: { robe: 0x5a6d8f, trim: 0xd9c9a3, skin: 0xf0c8a8, hair: 0xb8431f, hairStyle: "short", slim: true },
  engineer: { robe: 0x6f7a86, trim: 0x2a4f8f, skin: 0xe2b48f, hair: 0x6e6a66, hairStyle: "bun", overalls: 0x2a4f8f },
  professor: { robe: 0x6a4a35, trim: 0xd9c9a3, skin: 0xe9bf9b, hair: 0x8a8a8a, hairStyle: "gray", glasses: true },
  gatekeeper: { robe: 0x4a5560, trim: 0xb0b8c0, skin: 0xd8a47f, hair: 0x2b2118, hairStyle: "hood", helmet: true },
};

const flat = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.75, metalness: 0.05, ...extra });

export interface Built {
  root: THREE.Group;
  /** called every frame with the elapsed time (seconds) and whether the figure is "talking". */
  tick: (t: number, talking: boolean) => void;
  dispose: () => void;
}

function buildPerson(look: Look): Built {
  const root = new THREE.Group();
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];
  const g = <T extends THREE.BufferGeometry>(geo: T) => { geos.push(geo); return geo; };
  const m = (color: number, extra?: Partial<THREE.MeshStandardMaterialParameters>) => { const mm = flat(color, extra); mats.push(mm); return mm; };
  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  const robeM = m(look.robe);
  const trimM = m(look.trim, { metalness: 0.35, roughness: 0.5 });
  const skinM = m(look.skin, { roughness: 0.85 });
  const hairM = m(look.hair, { roughness: 0.9 });
  const darkM = m(0x1d1626, { flatShading: false });

  const body = new THREE.Group();
  root.add(body);

  // robe / dress
  const wide = look.wideRobe ? 0.62 : look.slim ? 0.38 : 0.48;
  const top = look.slim ? 0.24 : 0.3;
  add(body, g(new THREE.CylinderGeometry(top, wide, 1.0, 14)), robeM, 0, 0.5, 0);
  add(body, g(new THREE.TorusGeometry(wide - 0.005, 0.03, 6, 20)), trimM, 0, 0.04, 0).rotation.x = Math.PI / 2; // hem
  add(body, g(new THREE.TorusGeometry(top + 0.02, 0.025, 6, 18)), trimM, 0, 0.98, 0).rotation.x = Math.PI / 2; // collar

  if (look.overalls) {
    const ov = m(look.overalls);
    add(body, g(new THREE.BoxGeometry(0.42, 0.55, 0.06)), ov, 0, 0.55, top + 0.12);
    add(body, g(new THREE.BoxGeometry(0.06, 0.4, 0.05)), ov, -0.13, 0.9, top + 0.1);
    add(body, g(new THREE.BoxGeometry(0.06, 0.4, 0.05)), ov, 0.13, 0.9, top + 0.1);
  }

  // head
  const head = new THREE.Group();
  head.position.set(0, 1.27, 0);
  body.add(head);
  add(body, g(new THREE.CylinderGeometry(0.08, 0.09, 0.14, 8)), skinM, 0, 1.06, 0); // neck
  add(head, g(new THREE.SphereGeometry(0.27, 20, 16)), skinM);
  // face
  const eyeG = g(new THREE.SphereGeometry(0.036, 10, 8));
  add(head, eyeG, darkM, -0.095, 0.03, 0.245);
  add(head, eyeG, darkM, 0.095, 0.03, 0.245);
  add(head, g(new THREE.SphereGeometry(0.035, 8, 6)), m(look.skin, { roughness: 0.8 }), 0, -0.03, 0.27); // nose
  const smile = add(head, g(new THREE.TorusGeometry(0.06, 0.012, 6, 12, Math.PI)), darkM, 0, -0.1, 0.235);
  smile.rotation.z = Math.PI;
  const blush = m(0xf08a8a, { transparent: true, opacity: 0.35, flatShading: false });
  add(head, g(new THREE.SphereGeometry(0.04, 8, 6)), blush, -0.16, -0.04, 0.2).scale.set(1, 0.6, 0.3);
  add(head, g(new THREE.SphereGeometry(0.04, 8, 6)), blush, 0.16, -0.04, 0.2).scale.set(1, 0.6, 0.3);

  // hair / headwear
  const cap = (r: number, theta: number) => g(new THREE.SphereGeometry(r, 18, 12, 0, Math.PI * 2, 0, theta));
  if (look.hairStyle === "short" || look.hairStyle === "gray") {
    const c = add(head, cap(0.292, Math.PI * 0.47), hairM, 0, 0.01, -0.01);
    c.rotation.x = -0.2;
    if (look.hairStyle === "gray") {
      add(head, g(new THREE.SphereGeometry(0.06, 8, 6)), hairM, -0.27, 0.02, 0);
      add(head, g(new THREE.SphereGeometry(0.06, 8, 6)), hairM, 0.27, 0.02, 0);
    }
  }
  if (look.hairStyle === "long") {
    add(head, cap(0.295, Math.PI * 0.5), hairM, 0, 0.01, -0.02).rotation.x = -0.25;
    const back = add(head, g(new THREE.CylinderGeometry(0.26, 0.16, 0.85, 12, 1, true)), hairM, 0, -0.38, -0.12);
    back.scale.z = 0.55;
    (back.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
  }
  if (look.hairStyle === "bob") {
    add(head, cap(0.295, Math.PI * 0.5), hairM, 0, 0.01, -0.02).rotation.x = -0.25;
    add(head, g(new THREE.SphereGeometry(0.1, 8, 6)), hairM, -0.24, -0.1, -0.02);
    add(head, g(new THREE.SphereGeometry(0.1, 8, 6)), hairM, 0.24, -0.1, -0.02);
    add(head, g(new THREE.SphereGeometry(0.09, 8, 6)), hairM, 0, -0.04, -0.27); // ponytail
  }
  if (look.hairStyle === "bun") {
    add(head, cap(0.292, Math.PI * 0.47), hairM, 0, 0.01, -0.01).rotation.x = -0.2;
    add(head, g(new THREE.SphereGeometry(0.11, 10, 8)), hairM, 0, 0.29, -0.08);
  }
  if (look.hairStyle === "hood") {
    const hood = add(head, cap(0.32, Math.PI * 0.5), m(0x38424c), 0, 0.01, -0.02);
    hood.rotation.x = -0.3;
    if (look.helmet) {
      add(head, g(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 6)), trimM, 0, 0.35, 0);
    }
  }
  if (look.crown) {
    const crownM = m(0xffc627, { metalness: 0.6, roughness: 0.35, emissive: 0x3a2a00 });
    add(head, g(new THREE.CylinderGeometry(0.22, 0.2, 0.1, 14, 1, true)), crownM, 0, 0.27, 0).material.side = THREE.DoubleSide;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      add(head, g(new THREE.ConeGeometry(0.04, 0.12, 6)), crownM, Math.cos(a) * 0.2, 0.36, Math.sin(a) * 0.2);
    }
  }
  if (look.beard) {
    add(head, g(new THREE.SphereGeometry(0.2, 12, 8)), hairM, 0, -0.16, 0.08).scale.set(1, 0.75, 0.8);
  }
  if (look.glasses) {
    const glassM = m(0x2a2a2a, { metalness: 0.5, flatShading: false });
    const ringG = g(new THREE.TorusGeometry(0.075, 0.012, 6, 16));
    add(head, ringG, glassM, -0.095, 0.03, 0.26);
    add(head, ringG, glassM, 0.095, 0.03, 0.26);
    add(head, g(new THREE.BoxGeometry(0.05, 0.012, 0.012)), glassM, 0, 0.04, 0.265);
  }

  // arms
  const armG = g(new THREE.CapsuleGeometry(0.075, 0.38, 4, 8));
  const handG = g(new THREE.SphereGeometry(0.08, 10, 8));
  const makeArm = (side: -1 | 1) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * (top + 0.08), 0.95, 0);
    body.add(pivot);
    add(pivot, armG, robeM, 0, -0.26, 0);
    add(pivot, handG, skinM, 0, -0.52, 0);
    return pivot;
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);

  // props held by some characters
  if (look.helmet) {
    // a ring of keys at the belt
    const ring = add(body, g(new THREE.TorusGeometry(0.07, 0.014, 6, 14)), trimM, 0.3, 0.55, 0.28);
    ring.rotation.y = 0.6;
    add(body, g(new THREE.BoxGeometry(0.025, 0.12, 0.025)), trimM, 0.3, 0.44, 0.3);
  }

  root.scale.setScalar(look.slim ? 0.98 : 1);

  return {
    root,
    tick: (t, talking) => {
      body.position.y = Math.sin(t * 1.6) * 0.018;
      head.rotation.y = Math.sin(t * 0.7) * 0.18;
      head.rotation.z = Math.sin(t * 1.1) * 0.04;
      head.rotation.x = talking ? Math.sin(t * 7) * 0.05 + 0.02 : Math.sin(t * 0.9) * 0.02;
      armL.rotation.z = -0.18 - Math.sin(t * 1.3) * 0.04 - (talking ? Math.max(0, Math.sin(t * 3.1)) * 0.25 : 0);
      armR.rotation.z = 0.18 + Math.sin(t * 1.3 + 1) * 0.04 + (talking ? Math.max(0, Math.sin(t * 2.7 + 1)) * 0.25 : 0);
    },
    dispose: () => {
      geos.forEach((x) => x.dispose());
      mats.forEach((x) => x.dispose());
    },
  };
}

/** A ready-made figure (root group + per-frame tick + dispose) for scenes that place several figures, such as the 3D city. About 1.5 units tall. */
export function createFigure(kind: FigureKind): Built {
  return kind === "codex" ? buildCodex() : buildPerson(LOOKS[kind]);
}

function buildCodex(): Built {
  const root = new THREE.Group();
  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];
  const g = <T extends THREE.BufferGeometry>(geo: T) => { geos.push(geo); return geo; };
  const m = (color: number, extra?: Partial<THREE.MeshStandardMaterialParameters>) => { const mm = flat(color, extra); mats.push(mm); return mm; };
  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };

  const wood = m(0x8a5a2e, { roughness: 0.9 });
  const darkWood = m(0x5e3b1c, { roughness: 0.9 });
  const metal = m(0x7c8591, { metalness: 0.7, roughness: 0.4 });
  const gold = m(0xffc627, { metalness: 0.7, roughness: 0.35, emissive: 0x2a1c00 });
  const paper = m(0xf5ebd7, { roughness: 1 });
  const slot = m(0x14100c, { flatShading: false });
  const gemM = m(0x6fd8ff, { emissive: 0x2aa6e6, emissiveIntensity: 1.2, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.92 });

  const box = new THREE.Group();
  root.add(box);
  add(box, g(new THREE.BoxGeometry(1.15, 0.85, 0.75)), wood, 0, 0.45, 0); // body
  // metal bands + screws
  add(box, g(new THREE.BoxGeometry(1.2, 0.08, 0.8)), metal, 0, 0.18, 0);
  add(box, g(new THREE.BoxGeometry(1.2, 0.08, 0.8)), metal, 0, 0.72, 0);
  for (const x of [-0.52, 0.52]) for (const y of [0.18, 0.72]) {
    add(box, g(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 8)), gold, x, y, 0.41).rotation.x = Math.PI / 2;
  }
  // the two slots: paper goes in on the left, the answer comes out on the right
  add(box, g(new THREE.BoxGeometry(0.34, 0.05, 0.05)), slot, -0.3, 0.5, 0.38);
  add(box, g(new THREE.BoxGeometry(0.34, 0.05, 0.05)), slot, 0.3, 0.5, 0.38);
  const inSlip = add(box, g(new THREE.BoxGeometry(0.26, 0.2, 0.01)), paper, -0.3, 0.6, 0.39);
  const outSlip = add(box, g(new THREE.BoxGeometry(0.26, 0.26, 0.01)), paper, 0.3, 0.5, 0.37);
  outSlip.rotation.x = -0.25;
  // gear on top
  const gear = new THREE.Group();
  gear.position.set(-0.28, 0.93, 0);
  box.add(gear);
  add(gear, g(new THREE.CylinderGeometry(0.17, 0.17, 0.07, 12)), metal);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const tooth = add(gear, g(new THREE.BoxGeometry(0.06, 0.07, 0.07)), metal, Math.cos(a) * 0.2, 0, Math.sin(a) * 0.2);
    tooth.rotation.y = -a;
  }
  // the gem that powers it
  const gem = add(box, g(new THREE.OctahedronGeometry(0.15)), gemM, 0.22, 1.1, 0);
  gem.scale.set(0.9, 1.25, 0.9);
  // little feet
  for (const x of [-0.45, 0.45]) for (const z of [-0.26, 0.26]) add(box, g(new THREE.BoxGeometry(0.14, 0.1, 0.14)), darkWood, x, 0.02, z);

  const glow = new THREE.PointLight(0x6fd8ff, 1.2, 3.2);
  glow.position.set(0.22, 1.1, 0.3);
  root.add(glow);

  return {
    root,
    tick: (t, talking) => {
      gear.rotation.y = t * (talking ? 1.8 : 0.7);
      gem.rotation.y = t * 1.2;
      gem.position.y = 1.1 + Math.sin(t * 2) * 0.03;
      gemM.emissiveIntensity = 1.0 + Math.sin(t * 2.4) * 0.35;
      glow.intensity = 1.0 + Math.sin(t * 2.4) * 0.35;
      // every few seconds the codex clunks and prints a slip
      const cycle = (t % 5) / 5;
      const printing = cycle > 0.55 && cycle < 0.85;
      const p = printing ? (cycle - 0.55) / 0.3 : 0;
      outSlip.position.z = 0.37 + Math.sin(p * Math.PI) * 0.12 + (cycle >= 0.85 ? 0.04 : 0);
      outSlip.position.y = 0.5 - (cycle >= 0.55 ? Math.min(1, (cycle - 0.55) / 0.3) * 0.12 : 0);
      inSlip.position.z = 0.39 - (cycle > 0.5 && cycle < 0.6 ? 0.03 : 0);
      box.position.x = printing ? Math.sin(t * 40) * 0.006 : 0;
      box.position.y = printing ? Math.abs(Math.sin(t * 40)) * 0.004 : 0;
    },
    dispose: () => {
      geos.forEach((x) => x.dispose());
      mats.forEach((x) => x.dispose());
    },
  };
}

interface Props {
  kind: FigureKind;
  width?: number;
  height?: number;
  /** nods and gestures while a character is speaking */
  talking?: boolean;
}

/** A small 3D Argonia figure. Falls back to an emoji when WebGL isn't available. */
export function ArgoniaFigure3D({ kind, width = 150, height = 190, talking = false }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const talkingRef = useRef(talking);
  const [failed, setFailed] = useState(false);
  talkingRef.current = talking;

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
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const isCodex = kind === "codex";
    const camera = new THREE.PerspectiveCamera(isCodex ? 34 : 30, width / height, 0.1, 50);
    if (isCodex) {
      camera.position.set(1.7, 1.45, 3.3);
      camera.lookAt(0, 0.62, 0);
    } else {
      camera.position.set(0, 1.2, 3.9);
      camera.lookAt(0, 0.78, 0);
    }

    scene.add(new THREE.HemisphereLight(0xfff1dc, 0x2b1d4a, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(2.5, 3.5, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb9a6ff, 1.6);
    rim.position.set(-3, 2, -2.5);
    scene.add(rim);

    const built = kind === "codex" ? buildCodex() : buildPerson(LOOKS[kind]);
    const stage = new THREE.Group();
    stage.add(built.root);
    scene.add(stage);

    // soft ground shadow
    const shadowGeo = new THREE.CircleGeometry(isCodex ? 0.85 : 0.7, 24);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    scene.add(shadow);

    // drag to turn the figure around
    let dragging = false;
    let lastX = 0;
    let spin = isCodex ? -0.5 : 0;
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; renderer.domElement.style.cursor = "grabbing"; renderer.domElement.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!dragging) return; spin += (e.clientX - lastX) * 0.012; lastX = e.clientX; };
    const up = () => { dragging = false; renderer.domElement.style.cursor = "grab"; };
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);

    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      const t = clock.getElapsedTime();
      built.tick(reduce ? 0 : t, talkingRef.current && !reduce);
      const sway = reduce || dragging ? 0 : Math.sin(t * 0.55) * 0.28;
      // the drag offset eases back toward 0 so the figure always returns to face the viewer
      if (!dragging) spin += (0 - spin) * 0.02;
      stage.rotation.y = spin + sway;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", up);
      built.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [kind, width, height]);

  if (failed) {
    return (
      <div role="img" aria-label={LABEL[kind]} style={{ width, height, display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.min(width, height) * 0.55 }}>
        {FALLBACK_EMOJI[kind]}
      </div>
    );
  }
  return <div ref={mountRef} style={{ width, height }} role="img" aria-label={`${LABEL[kind]} (3D, drag to turn)`} />;
}
