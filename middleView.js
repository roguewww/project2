// middleView.js
import * as THREE from "three";
import { activeView, mouseMoveListenerAdded, setMouseMoveListenerAdded } from "./state.js";
import { gsap } from "gsap";
import {
  PerspectiveCameraForResizableWindow,
  handleCameraRotation,
  handleMouseMovement,
} from "./CameraWithMouseRotation.js";

// 摄像机的角度状态类
class CameraOrientationState {
  constructor() {
    this.pitchAngle = 0;
    this.yawAngle = 0;
    this.startingPitchAngleForCurrentCoordinates = 0;
    this.startingYawAngleForCurrentCoordinates = 0;
    this.previousPitchAngle = 0;
    this.previousYawAngle = 0;
    this.lastMouseMoveTime = 0;
    this.movementDuration = 100; // 持续时间
  }
}

const cameraOrientationState = new CameraOrientationState(); // 实例化状态

// 鼠标移动事件处理函数
function createOnMouseMove(camera) {
  return function onMouseMove(event) {
    if (activeView !== 'middle') {
      console.log(`onMouseMove function exited because activeView is: ${activeView}`);
      return;
    }

    // 将鼠标位置转换为范围 [-1, 1]
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // 使用 handleMouseMovement 更新摄像机角度状态
    handleMouseMovement(mouseX, mouseY, cameraOrientationState);
  };
}

export function middleView(camera) {
  console.log('middleView function called');
  if (activeView !== 'middle') {
    console.log(`middleView function exited because activeView is: ${activeView}`);
    return;
  }

  const duration = 500; // 动画持续时间（毫秒）
  const start = Date.now();
  const initialPosition = camera.position.clone();
  const initialLookAt = new THREE.Vector3();
  camera.getWorldDirection(initialLookAt).add(camera.position);
  const targetPosition = new THREE.Vector3(0, 10, 27); // 目标摄像机位置
  const targetLookAt = new THREE.Vector3(0, 10, -30); // 目标物体位置

  const animateCamera = () => {
    const elapsed = Date.now() - start;
    const t = Math.min(elapsed / duration, 1);
    camera.position.lerpVectors(initialPosition, targetPosition, t);
    const currentLookAt = initialLookAt.clone().lerp(targetLookAt, t);
    camera.lookAt(currentLookAt); // 确保相机面向目标

    if (t < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      setTimeout(() => {
        if (!mouseMoveListenerAdded) {
          const onMouseMove = createOnMouseMove(camera);
          // 添加鼠标移动事件监听器
          console.log('Adding mousemove event listener');
          window.addEventListener('mousemove', onMouseMove);
          setMouseMoveListenerAdded(true);
          // 保存事件监听器以便移除
          camera.onMouseMoveHandler = onMouseMove;
        }
      }, 1000); // 延时1秒
    }
  };

  animateCamera();

  // 使用 handleCameraRotation 来平滑地旋转摄像机
  const render = () => {
    handleCameraRotation(camera, cameraOrientationState);
    requestAnimationFrame(render);
  };

  render(); // 开始摄像机旋转的渲染循环
}

export function removeMiddleViewMouseMoveListener(camera) {
  if (mouseMoveListenerAdded && camera.onMouseMoveHandler) {
    window.removeEventListener('mousemove', camera.onMouseMoveHandler);
    setMouseMoveListenerAdded(false);
    console.log('Removed mousemove event listener');
  }
}