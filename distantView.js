import * as THREE from "three";
import { gsap } from "gsap";
export function distantView(camera) {
    const duration = 500; // 调整动画持续时间（毫秒）
    const start = Date.now();
    const initialPosition = camera.position.clone();
    const initialLookAt = new THREE.Vector3();
    camera.getWorldDirection(initialLookAt).add(camera.position);
    const targetPosition = new THREE.Vector3(0, 10, 65); //目标相机的位置
    const targetLookAt = new THREE.Vector3(0, 15, -30); // 目标模型的位置
    
    // const targetLookAt2 = new THREE.Vector3(-2.3, 1, -0.7); // 目标模型的位置
  
    const animateCamera = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      camera.position.lerpVectors(initialPosition, targetPosition, t);
      const currentLookAt = initialLookAt.clone().lerp(targetLookAt, t);
      camera.lookAt(currentLookAt); // 确保相机始终面向目标位置
  
      if (t < 1) {
        requestAnimationFrame(animateCamera);
      } 
    //   else {
    //     // 摄像头到达指定位置后延迟显示弹窗
    //     setTimeout(() => {
    //       const infoDiv = document.getElementById("info-container");
    //       gsap.to(infoDiv, { duration: 0.5, opacity: 1, display: 'block' });
  
    //       // 添加全局点击事件监听器
    //       const handleClickOutside = (event) => {
    //         if (!infoDiv.contains(event.target)) {
    //           gsap.to(infoDiv, {
    //             duration: 0.5, opacity: 0, onComplete: () => {
    //               infoDiv.style.display = "none";
    //               // 回到初始位置
    //               animateCameraBack();
    //             }
    //           });
    //           document.removeEventListener('click', handleClickOutside);
    //         }
    //       };
    //       document.addEventListener('click', handleClickOutside);
    //     }, 250); // 延迟250毫秒
    //   }
    };
    animateCamera();
  
    
  }
  