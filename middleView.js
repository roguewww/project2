// middleView.js
import * as THREE from "three";
import { activeView, mouseMoveListenerAdded, setMouseMoveListenerAdded } from "./state.js";
import { gsap } from "gsap";

function createOnMouseMove(camera) {
  return function onMouseMove(event) {
    if (activeView !== 'middle') {
      console.log(`onMouseMove function exited because activeView is: ${activeView}`);
      return;
    }

    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // 定义lookAt的坐标范围
    const minX = -330, maxX = 365;
    const minY = 5, maxY = 15;
    const minZ = -40, maxZ = -20;

    // 根据鼠标位置计算新的lookAt坐标
    const lookAtX = THREE.MathUtils.clamp(mouseX * 200, minX, maxX);
    const lookAtY = THREE.MathUtils.clamp(10 + mouseY * 10, minY, maxY);
    const lookAtZ = THREE.MathUtils.clamp(-30 + mouseX * 10, minZ, maxZ);

    // 更新相机的lookAt位置
    camera.lookAt(new THREE.Vector3(lookAtX, lookAtY, lookAtZ));
  };
}

export function middleView(camera) {
  console.log('middleView function called');
  if (activeView !== 'middle') {
    console.log(`middleView function exited because activeView is: ${activeView}`);
    return;
  }

  alert("middle");
  const duration = 500; // 调整动画持续时间（毫秒）
  const start = Date.now();
  const initialPosition = camera.position.clone();
  const initialLookAt = new THREE.Vector3();
  camera.getWorldDirection(initialLookAt).add(camera.position);
  const targetPosition = new THREE.Vector3(0, 10, 27); // 目标相机的位置
  const targetLookAt = new THREE.Vector3(0, 10, -30); // 目标模型的位置

  const animateCamera = () => {
    const elapsed = Date.now() - start;
    const t = Math.min(elapsed / duration, 1);
    camera.position.lerpVectors(initialPosition, targetPosition, t);
    const currentLookAt = initialLookAt.clone().lerp(targetLookAt, t);
    camera.lookAt(currentLookAt); // 确保相机始终面向目标位置

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
          // 保存事件监听器函数以便之后移除
          camera.onMouseMoveHandler = onMouseMove;
        }
      }, 1000); // 等待一秒（1000毫秒）
    }
  };

  animateCamera();
  
}

export function removeMiddleViewMouseMoveListener(camera) {
  if (mouseMoveListenerAdded && camera.onMouseMoveHandler) {
    window.removeEventListener('mousemove', camera.onMouseMoveHandler);
    setMouseMoveListenerAdded(false);
    console.log('Removed mousemove event listener');
  }
}
