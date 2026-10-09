// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// // import { Timer } from 'three/addons/misc/Timer.js';

// // The scene is the container for everything you want to show
// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x222222); // dark grey, so it's not pure black

// // The camera is your eye
// const camera = new THREE.PerspectiveCamera(
//   60,                              // field of view in degrees
//   window.innerWidth / window.innerHeight, // aspect ratio
//   0.1,                             // near: anything closer than this is invisible
//   100                              // far: anything farther than this is invisible
// );
// camera.position.set(0, 2, 5);      // x, y, z: a bit up and back
// camera.lookAt(0, 1, 0);            // look slightly above the floor

// // The renderer draws the scene onto a <canvas>
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement); // put the canvas on the page

// // Light: without light, most materials look black
// scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));

// // DEBUG CUBE: if you see this, your setup works and only the model is the problem
// const testCube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshStandardMaterial({ color: 0xff3333 })
// );
// testCube.position.set(-3, 0.5, 0);
// scene.add(testCube);

// scene.add(new THREE.AxesHelper(1));
// scene.add(new THREE.GridHelper(10, 10));

// // Timer gives us "delta" = seconds since the last frame
// // const timer = new THREE.Timer();
// const clock = new THREE.Clock();

// // mixer starts empty. We create it after the model loads.
// let mixer;

// const loader = new GLTFLoader();
// loader.load(
//   '/RobotExpressive.glb',                    // file inside the public folder (note the leading slash)

//   (gltf) => {                      // runs when loading succeeds
//     const model = gltf.scene;      // the 3D object itself
//     scene.add(model);

//     console.log('Model loaded:', model);
//     console.log('Animations found:', gltf.animations.map(c => c.name));
//     model.position.set(0, -1, 0);
//     model.rotation.y = Math.PI* 0.3;
//     model.scale.setScalar(0.9);
//     // model.visible = false; // hide the model for now, so we can see the test cube

//     mixer = new THREE.AnimationMixer(model);   // mixer is tied to this model

//     if (gltf.animations.length > 0) {
//       const action = mixer.clipAction(gltf.animations[10]); // first clip
//       action.play();
//     } else {
//       console.warn('This model has no animations');
//     }
//   },

//   undefined,                       // progress callback (we don't need it)

//   (error) => {                     // runs when loading fails
//     console.error('Failed to load model:', error);
//   }
// );

// // Animation loop: runs about 60 times per second
// function animate() {
//   requestAnimationFrame(animate);  // ask the browser to call animate() again next frame

//   // timer.update(timestamp);         // first update the timer with the current time
//   const delta = clock.getDelta();  // time since the last frame, in seconds
//   if (mixer) mixer.update(delta);  // advance the animation; without this nothing moves

//   // testCube.rotation.y += delta;    // spinning cube proves the loop works
//   testCube.rotation.y += delta;
//   testCube.position.y = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.5;
//   testCube.scale.set(1, 0.5, 1);

//   renderer.render(scene, camera);  // draw one frame
// }
// animate();

// // Keep the canvas correct if the window is resized
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix(); // required after changing the camera's aspect
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });



// // testCube.visible = false;

// // model.position.set(2, 0.5, 1);

// // model.scale.setScalar(1);









// model with multiple animations, loaded from a glTF file

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { Timer } from 'three/addons/misc/Timer.js';

// The scene is the container for everything you want to show
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222); // dark grey, so it's not pure black

// The camera is your eye
const camera = new THREE.PerspectiveCamera(
  60,                              // field of view in degrees
  window.innerWidth / window.innerHeight, // aspect ratio
  0.2,                             // near: anything closer than this is invisible
  100                              // far: anything farther than this is invisible
);
camera.position.set(0, 2, 5);      // x, y, z: a bit up and back
camera.lookAt(0, 1, 0);            // look slightly above the floor

// The renderer draws the scene onto a <canvas>
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // put the canvas on the page

// Light: without light, most materials look black
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));

// DEBUG CUBE: if you see this, your setup works and only the model is the problem
const testCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff3333 })
);
testCube.position.set(-3, 0.5, 0);
scene.add(testCube);

scene.add(new THREE.AxesHelper(1));
scene.add(new THREE.GridHelper(10, 10));

// Timer gives us "delta" = seconds since the last frame
// const timer = new THREE.Timer();
const clock = new THREE.Clock();

// mixer starts empty. We create it after the model loads.
let mixer;

let modelRoot;
let actions = {};
let currentAction;

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const loader = new GLTFLoader();


async function runChoreography() {
  while (true) {
    playClip('Idle');
    await animateNumber(modelRoot.rotation, 'y', Math.PI / 2, 1.2);

    playClip('Walking');
    await wait(2500);

    await animateNumber(camera.position, 'z', 3.5, 1);
    playClip('Wave');
    await wait((actions['Wave']?.getClip().duration ?? 2) * 1000);

    playClip('Idle');
    await animateNumber(modelRoot.rotation, 'y', 0, 1);
    await animateNumber(camera.position, 'z', 5, 1);
  }
}


function playClip(name) {
  const nextAction = actions[name];

  if (!nextAction) {
    console.warn(`Animation not found: ${name}`);
    return;
  }

  if (nextAction === currentAction) return;

  currentAction?.fadeOut(0.25);
  nextAction.reset().fadeIn(0.25).play();
  currentAction = nextAction;
}


function animateNumber(object, property, target, duration) {
  return new Promise((resolve) => {
    const start = object[property];
    const startTime = clock.elapsedTime;

    function update() {
      const progress = Math.min(
        (clock.elapsedTime - startTime) / duration,
        1
      );
      const eased = progress * progress * (3 - 2 * progress);

      object[property] = THREE.MathUtils.lerp(start, target, eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        resolve();
      }
    }

    update();
  });
}

loader.load(
  '/RobotExpressive.glb',                    // file inside the public folder (note the leading slash)

  (gltf) => {                      // runs when loading succeeds
    const model = gltf.scene;      // the 3D object itself
    // scene.add(model);
    modelRoot = new THREE.Group();
    scene.add(modelRoot);

    // to change the color of the model, we need to traverse its hierarchy and find all meshes
    // model.traverse((part) => {
    //   if (!part.isMesh) return;

    //   const materials = Array.isArray(part.material)
    //     ? part.material
    //     : [part.material];

    //   materials.forEach((material) => {
    //     if (material.color) {
    //       material.color.set(0x33affff); // blue tint
    //     }
    //   });
    // });

    modelRoot.add(model);

    console.log('Model loaded:', model);
    console.log('Animations found:', gltf.animations.map(c => c.name));

    console.table(
      gltf.animations.map((clip, index) => ({
        index,
        name: clip.name,
        duration: clip.duration
      }))
    );
    model.position.set(0, -1, 0);
    model.rotation.y = Math.PI* 0.3;
    model.scale.setScalar(0.9);
    // model.visible = false; // hide the model for now, so we can see the test cube

    // mixer = new THREE.AnimationMixer(model);   // mixer is tied to this model

    // if (gltf.animations.length > 0) {
    //   const action = mixer.clipAction(gltf.animations[10]); // first clip
    //   action.play();
    // } else {
    //   console.warn('This model has no animations');
    // }

    mixer = new THREE.AnimationMixer(model);

    actions = Object.fromEntries(
      gltf.animations.map((clip) => [clip.name, mixer.clipAction(clip)])
    );

    runChoreography();
  },

  undefined,                       // progress callback (we don't need it)

  (error) => {                     // runs when loading fails
    console.error('Failed to load model:', error);
  }
);

// Animation loop: runs about 60 times per second
function animate() {
  requestAnimationFrame(animate);  // ask the browser to call animate() again next frame

  // timer.update(timestamp);         // first update the timer with the current time
  const delta = clock.getDelta();  // time since the last frame, in seconds
  if (mixer) mixer.update(delta);  // advance the animation; without this nothing moves

  // testCube.rotation.y += delta;    // spinning cube proves the loop works
  testCube.rotation.y += delta;
  testCube.position.y = 0.5 + Math.sin(clock.elapsedTime * 2) * 0.5;
  testCube.scale.set(1, 0.5, 1);

  renderer.render(scene, camera);  // draw one frame
}
animate();

// Keep the canvas correct if the window is resized
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // required after changing the camera's aspect
  renderer.setSize(window.innerWidth, window.innerHeight);
});


camera.lookAt(0, 1, 0);


// testCube.visible = false;

// model.position.set(2, 0.5, 1);

// model.scale.setScalar(1);


























// import * as THREE from 'three';

// // ----------------------------------------------------
// // 1. Basic Scene, Camera, Renderer & Clock Setup
// // ----------------------------------------------------
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const clock = new THREE.Clock();

// // Initialize Renderer and append to HTML document
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Move camera back so the cube becomes visible
// camera.position.z = 5;

// // Handle window resizing
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// // ----------------------------------------------------
// // A. FILELOADER: Fetching a JSON configuration file
// // ----------------------------------------------------
// const fileLoader = new THREE.FileLoader();
// fileLoader.setResponseType('json');

// fileLoader.load(
//   '/data/config.json',
//   (gameConfig) => {
//     console.log('Game Settings Loaded:', gameConfig);
//   },
//   undefined,
//   (error) => {
//     console.error('Failed to load configuration file:', error);
//   }
// );

// // ----------------------------------------------------
// // B. AUDIOLOADER: Playing background audio
// // ----------------------------------------------------
// const listener = new THREE.AudioListener();
// camera.add(listener);

// const backgroundSound = new THREE.Audio(listener);
// const audioLoader = new THREE.AudioLoader();

// audioLoader.load(
//   '/audio/background_music.mp3',
//   (audioBuffer) => {
//     backgroundSound.setBuffer(audioBuffer);
//     backgroundSound.setLoop(true);
//     backgroundSound.setVolume(0.4);

//     // Play audio after user interaction to bypass browser autoplay policy
//     window.addEventListener('click', () => {
//       if (!backgroundSound.isPlaying) {
//         backgroundSound.play();
//       }
//     });
//   },
//   undefined,
//   (error) => {
//     console.error('Failed to fetch audio file:', error);
//   }
// );

// // ----------------------------------------------------
// // C. ANIMATIONLOADER & CUBE SETUP
// // ----------------------------------------------------
// // Create a visible mesh first
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// const animLoader = new THREE.AnimationLoader();
// let mixer;

// animLoader.load(
//   '/models/character.json',
//   (clips) => {
//     if (clips && clips.length > 0) {
//       mixer = new THREE.AnimationMixer(cube);
//       const action = mixer.clipAction(clips[0]);
//       action.play();
//     }
//   },
//   undefined,
//   (error) => {
//     console.error('Failed to load animation file:', error);
//   }
// );

// // ----------------------------------------------------
// // Animation & Render Loop
// // ----------------------------------------------------
// function animate() {
//   requestAnimationFrame(animate);

//   const delta = clock.getDelta();
//   if (mixer) mixer.update(delta);

//   // Rotate cube slightly for visual feedback if no animation clip is loaded
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   cube.rotation.z += 0.01;

//   // Render the scene from the perspective of the camera
//   renderer.render(scene, camera);
// }

// animate();