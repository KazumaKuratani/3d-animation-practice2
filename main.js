import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// シーンを作成
const scene = new THREE.Scene();

// カメラ設定
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 100);
camera.lookAt(0, 0, 0);

// レンダラー設定
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 球体を作成
let sphere1, sphere2, sphere3,sphere4
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
sphere1 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere1.position.set(-30, 10, 40);
scene.add(sphere1);

sphere2 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere2.position.set(-30, 10, 0);
scene.add(sphere2);

sphere3 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere3.position.set(20, 10, 40);
scene.add(sphere3);

sphere4 = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere4.position.set(20, 10, 0);
scene.add(sphere4);



// フォントをロードしてテキストを追加
const fontLoader = new FontLoader();
fontLoader.load("./src/helvetiker_bold.typeface.json", (font) => {
  const textGeometry = new TextGeometry("kazuma", {
    font: font,
    size: 10,
    height: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5,
  });

  const textMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      void main() {
        vec3 color = vec3(0.5 + 0.5 * sin(vUv.x * 10.0 + time), vUv.y, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
  
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-30,5, 17); // 球体の下に配置
  scene.add(textMesh);
});

// ライトを追加
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// カメラ操作
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// リサイズ対応
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// アニメーション
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
