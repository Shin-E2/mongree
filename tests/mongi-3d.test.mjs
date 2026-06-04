import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

// 몽이 3D 프로토타입: Tripo glb 를 /mongi 에서 회전 + 감정 모션으로 렌더한다.
test("Mongi 3D model asset and three deps are present", () => {
  assert.equal(exists("public/models/mongi.glb"), true);

  const pkg = JSON.parse(read("package.json"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  assert.ok(deps.three, "three 의존성 필요");
  assert.ok(deps["@react-three/fiber"], "@react-three/fiber 필요");
  assert.ok(deps["@react-three/drei"], "@react-three/drei 필요");
});

test("Mongi 3D scene loads the glb, allows drag rotation, and reacts to tap", () => {
  const scenePath = "src/components/mongi/mongi-3d/mongi-3d-scene.tsx";
  assert.equal(exists(scenePath), true);

  const scene = read(scenePath);

  // glb 로드
  assert.match(scene, /useGLTF\(/);
  assert.match(scene, /\/models\/mongi\.glb/);
  // 드래그 360도 회전
  assert.match(scene, /OrbitControls/);
  // 탭 반응 (감정 모션 트리거)
  assert.match(scene, /onPointerDown/);
  assert.match(scene, /useFrame/);
  // 바운딩 박스 정규화 (Tripo 모델 중심/스케일 보정)
  assert.match(scene, /Box3/);
});

test("Mongi 3D bundle is isolated to the page via dynamic ssr:false", () => {
  const indexPath = "src/components/mongi/mongi-3d/index.tsx";
  assert.equal(exists(indexPath), true);

  const index = read(indexPath);
  assert.match(index, /dynamic\(/);
  assert.match(index, /ssr:\s*false/);
});

test("Mongi page renders the 3D character instead of the PNG stage", () => {
  const pagePath = "src/app/(dashboard)/mongi/page.tsx";
  const page = read(pagePath);

  assert.match(page, /import Mongi3D from "@\/components\/mongi\/mongi-3d"/);
  assert.match(page, /<Mongi3D\s*\/>/);
  // 캐릭터 자리에서 PNG MongiStage 는 더 이상 쓰지 않는다
  assert.doesNotMatch(page, /<MongiStage/);
});
