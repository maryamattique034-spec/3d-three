import * as THREE from 'three';

// 1. Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Mesh & Material
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 3. Tracks Setup
const blue = new THREE.Color('blue');
const pink = new THREE.Color('pink');

// Track 1: Color Track
const colorTrack = new THREE.ColorKeyframeTrack(
  '.material.color',
  [0, 1, 2],
  [...blue.toArray(), ...pink.toArray(), ...blue.toArray()]
);

// Track 2: Scale Track
const scaleTrack = new THREE.VectorKeyframeTrack(
  '.scale', 
  [0, 1, 2], 
  [1, 1, 1,  1.5, 1.5, 1.5,  1, 1, 1]
);

// Track 3: Visibility Track (Corrected)
// const blinkTrack = new THREE.BooleanKeyframeTrack(
//   '.visible', 
//   [0, 1, 2], 
//   [true, false, true]
// );

// 4. Clip Setup (Combining all tracks into a single clip)
const clip = new THREE.AnimationClip('combinedAnim', 2, [colorTrack, scaleTrack]);

// 5. Mixer Setup
const mixer = new THREE.AnimationMixer(cube);
const action = mixer.clipAction(clip);
action.play();

// 6. Animate Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}
animate();


// light 
// const light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

// White directional light at half intensity shining from the top.
// const directionalLight = new THREE.DirectionalLight( 0xff1834, 0.9 );
// scene.add( directionalLight );


// const light = new THREE.PointLight( 0xff0000, 2, 100 );
// light.position.set( 100, 50, 50 );
// scene.add( light );


// const spotLight = new THREE.SpotLight( 0xffffff );
// spotLight.position.set( 100, 1000, 100 );
// spotLight.map = new THREE.TextureLoader().load( url );
// spotLight.castShadow = true;
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 2000;
// spotLight.shadow.camera.fov = 10;












// import * as THREE from 'three';

// // 1. Scene
// const scene = new THREE.Scene();

// // 2. Camera (field of view, aspect ratio, near, far)
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.z = 3; //move the camera back so we can see the cube

// // 3. Renderer
// const renderer = new THREE.WebGLRenderer({ antialias: true }); //smooth edges
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Geometry + Material = Mesh
// const geometry = new THREE.BoxGeometry(2, 2, 2,12);
// const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube); // necessary to add the cube to the scene, otherwise it won't be visible

// // Light
// const light = new THREE.DirectionalLight(0xffffff, 3);
// light.position.set(2, 3, 4);
// scene.add(light);




// function animate() {
//   requestAnimationFrame(animate); // call animate() again and again
 
//   cube.rotation.z += 0.01;
//   cube.rotation.y += 0.01;
//   cube.rotation.z += 0.01;

//   renderer.render(scene, camera); // draw the scene
// }
// animate();





// camera.position.set(0, 0, 5); // x=0, y=5 , z=10 (back side)
// camera.lookAt(0, 0, 0);








// new THREE.VectorKeyframeTrack(
//   '.position',
//   [1, 1, 2],
//   [0,0,0,    3,3,3,    3,0,0]
// //  ^t=0      ^t=1      ^t=2
// );


// Animation
// const moveTrack = new THREE.VectorKeyframeTrack(
//   '.position', [0, 1, 2], [-2,0,0,  2,0,0,  -2,0,0]
// );


// const mixer = new THREE.AnimationMixer(cube);
// const action = mixer.clipAction(clip);
// action.setLoop(THREE.LoopRepeat, Infinity);
// action.play();

// const clock = new THREE.Clock();




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



