import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';


let scene, camera, renderer, composer, model, raycaster, mouse;
const objects = [];
const lookAtTarget = new THREE.Vector3(0, 10, -29.870);


init();
animate();

function init() {
  const container = document.createElement('div');
  container.className = 'three-container';
  document.body.appendChild(container);

  // Scene
  scene = new THREE.Scene();

  // Grid Helper
  const gridHelper = new THREE.GridHelper(100, 100); // 参数分别是大小和步数
  scene.add(gridHelper);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true; // 启用阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用柔和阴影
  renderer.toneMapping = THREE.ReinhardToneMapping; // 设置色调映射
  renderer.toneMappingExposure = 1; // 增加曝光
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // Camera
  // const lookAtTarget = new THREE.Vector3(0.555, 10, -29.870);
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 10, 11.47);
  camera.rotation.set(0, 0, 0);
  camera.lookAt(lookAtTarget);

  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/'); // 设置 Draco 解码器路径


  // Load GLB model
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load('scene.glb', function(gltf) {
    model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        console.log(child.name); // 输出模型名称到控制台
        child.castShadow = true;
        child.receiveShadow = true;
        objects.push(child); // Add mesh to objects array
      }
    });
   
    scene.add(model);
  }, undefined, function(error) {
    console.error(error);
  });

  // Postprocessing
  composer = new EffectComposer(renderer);

  // Render pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Gamma correction pass
  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gammaCorrectionPass);

  // FXAA pass
  const fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * pixelRatio);
  fxaaPass.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * pixelRatio);
  composer.addPass(fxaaPass);

  // Handle window resize
  window.addEventListener('resize', onWindowResize, false);

  // Mouse click event listener
  window.addEventListener('click', onMouseClick, false);

  // Button event listeners
  document.getElementById('pos-x-increase-button').addEventListener('click', () => moveCamera('x', 1));
  document.getElementById('pos-y-increase-button').addEventListener('click', () => moveCamera('y', 1));
  document.getElementById('pos-z-increase-button').addEventListener('click', () => moveCamera('z', 1));
  document.getElementById('rot-x-increase-button').addEventListener('click', () => moveLookAt('x', 5));
  document.getElementById('rot-y-increase-button').addEventListener('click', () => moveLookAt('y', 5));
  document.getElementById('rot-z-increase-button').addEventListener('click', () => moveLookAt('z', 5));

  document.getElementById('pos-x-decrease-button').addEventListener('click', () => moveCamera('x', -1));
  document.getElementById('pos-y-decrease-button').addEventListener('click', () => moveCamera('y', -1));
  document.getElementById('pos-z-decrease-button').addEventListener('click', () => moveCamera('z', -1));
  document.getElementById('rot-x-decrease-button').addEventListener('click', () => moveLookAt('x', -5));
  document.getElementById('rot-y-decrease-button').addEventListener('click', () => moveLookAt('y', -5));
  document.getElementById('rot-z-decrease-button').addEventListener('click', () => moveLookAt('z', -5));

  // Initial update of camera info
  updateCameraInfo();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
  // Normalize mouse coordinates to [-1, 1]
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    console.log(intersectedObject); // 输出被点击对象的名称

    // Check if the clicked object is the specific model
    if (intersectedObject.name === 'zhuozil') {
      const targetPosition = new THREE.Vector3(3.1, 0.78, -0.88); // 设定摄像头的新位置
      
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Render scene with composer
  composer.render();

  // Update camera info javascript
  updateCameraInfo();
}

function moveCamera(axis, amount) {
  camera.position[axis] += amount;
  updateCameraInfo();
}


function moveLookAt(axis, amount) {
  lookAtTarget[axis] += amount;
  camera.lookAt(lookAtTarget);
  updateCameraInfo();
}

function rotateCamera(axis, degrees) {
  camera.rotation[axis] += THREE.MathUtils.degToRad(degrees);
  updateCameraInfo();
}

function updateCameraInfo() {
  const position = camera.position;
  const rotation = camera.rotation;
  const lookAtPosition = lookAtTarget;
  document.getElementById('camera-position').innerText = `Position: x=${position.x.toFixed(2)}, y=${position.y.toFixed(2)}, z=${position.z.toFixed(2)}`;
  document.getElementById('camera-rotation').innerText = `LookAt: x=${lookAtPosition.x.toFixed(2)}, y=${lookAtPosition.y.toFixed(2)}, z=${lookAtPosition.z.toFixed(2)}`;
  
}