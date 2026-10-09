import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ---------- Setup ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.8));
const sun = new THREE.DirectionalLight(0xffffff, 3);
sun.position.set(3, 5, 4);
scene.add(sun);

scene.add(new THREE.GridHelper(20, 20));

// ---------- Loading bar (HTML) ----------
const status = document.createElement('div');
status.style.cssText =
  'position:fixed;top:10px;left:10px;color:white;font:16px monospace;z-index:10';
status.textContent = 'Loading...';
document.body.appendChild(status);

// ---------- LoadingManager ----------
const manager = new THREE.LoadingManager();
manager.onProgress = (url, loaded, total) => {
  status.textContent = `Loading ${loaded}/${total}: ${url}`;
};
manager.onLoad = () => { status.textContent = 'Ready! Move the mouse to look around'; };
manager.onError = (url) => {
  status.textContent = 'ERROR: ' + url + ' nahi mili (public/ folder check karo)';
};

const textureLoader = new THREE.TextureLoader(manager);
const gltfLoader = new GLTFLoader(manager);

// ---------- Helper:fit the model ----------
function fitModel(model, targetSize = 3) {
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const scale = targetSize / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));
  model.position.y += (size.y * scale) / 2;   // move the model up so it sits on the ground
}

// ---------- Mixer (for animation) ----------
let mixer = null;
const clock = new THREE.Clock();

// ---------- load everything ----------
async function init() {
  try {
    // 2D: image on plane
    const photo = await textureLoader.loadAsync('/character.png');
    photo.colorSpace = THREE.SRGBColorSpace;

    const ratio = photo.image.height / photo.image.width;   // aspect ratio
    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4 * ratio),
      new THREE.MeshBasicMaterial({ map: photo, side: THREE.DoubleSide })
    );
    frame.position.set(-4, 2.5, 0);
    scene.add(frame);

    // 3D: model
    const gltf = await gltfLoader.loadAsync('/RobotExpressive.glb');
    const robot = gltf.scene;
    fitModel(robot, 3);
    robot.position.x += 1;
    scene.add(robot);

    console.log('Clips:', gltf.animations.map((c) => c.name));

    // run Animation  (Idle or first clip)
    mixer = new THREE.AnimationMixer(robot);
    const clip =
      THREE.AnimationClip.findByName(gltf.animations, 'Dance') || gltf.animations[0];
    if (clip) mixer.clipAction(clip).play();
  } catch (err) {
    console.error('Load error:', err);
    status.textContent = 'Error: check console (F12)';
  }
}
init();

// ---------- Loop ----------
function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  controls.update();
  renderer.render(scene, camera);
}
animate();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});