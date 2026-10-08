import * as THREE from 'three';

// 1. Scene
const scene = new THREE.Scene();

// 2. Camera (field of view, aspect ratio, near, far)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5; //move the camera back so we can see the cube

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Geometry + Material = Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // necessary to add the cube to the scene, otherwise it won't be visible

// Light
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 3, 4);
scene.add(light);


function animate() {
  requestAnimationFrame(animate); // call animate() again and again

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera); // draw the scene
}
animate();


// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });


// cube.position.set(1, 0, 1);   // x=2, y=0, z=0 (right side)
// cube.scale.set(2, 2, 2);      // y direction mein double lamba
// cube.rotation.y = Math.PI / 4; // 45 degree


// // Sphere: (radius, widthSegments, heightSegments)
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.7, 32, 32),
//   new THREE.MeshStandardMaterial({ color: 0xff4466 })
// );
// sphere.position.x = -2.5;
// scene.add(sphere);

// // Torus (donut): (radius, tubeThickness, radialSegments, tubularSegments)
// const torus = new THREE.Mesh(
//   new THREE.TorusGeometry(0.6, 0.25, 16, 60),
//   new THREE.MeshStandardMaterial({ color: 0xffcc00 })
// );
// torus.position.x = 2.5;
// scene.add(torus);

// // Cone: (radius, height, radialSegments)
// const cone = new THREE.Mesh(
//   new THREE.ConeGeometry(0.9, 2.5, 32),
//   new THREE.MeshStandardMaterial({ color: 0x4dd688 })
// );
// cone.position.y = 2;
// scene.add(cone);


// // AmbientLight: no direction, just light up everything, no shadows
// const ambient = new THREE.AmbientLight(0xffffff, 0.9);
// scene.add(ambient);

// // PointLight: like bulb , from one point to all directions , will create shadows
// const point = new THREE.PointLight(0xff8800, 50, 20);
// point.position.set(-3, 2, 2);
// scene.add(point);


// const axes = new THREE.AxesHelper(1);   // laal=X, hara=Y, neela=Z
// scene.add(axes);

// const grid = new THREE.GridHelper(10, 10); // zameen ki grid
// scene.add(grid);

// const lightHelper = new THREE.PointLightHelper(point, 0.3); // light ki jagah dikhata hai
// scene.add(lightHelper);

// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // file ke sabse upar

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // smooth, halka sa slide hota hai
// controls.enableZoom = false;

// // animate() ke andar:
// controls.update();



