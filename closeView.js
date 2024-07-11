import * as THREE from "three";
import { gsap } from "gsap";
import { activeView} from "./state.js";
import { removeMiddleViewMouseMoveListener } from "./middleView.js";

export function closeView(camera, objects) {
  if (activeView !== 'close') return;
  alert("close");
  removeMiddleViewMouseMoveListener(camera);
    const duration = 2000; // 调整动画持续时间（毫秒）
    const start = Date.now();
    const initialPosition = camera.position.clone();
    const initialLookAt = new THREE.Vector3();
    camera.getWorldDirection(initialLookAt).add(camera.position);
    const targetPosition = new THREE.Vector3(0, 18, -7.5); //目标相机的位置
    const targetLookAt = new THREE.Vector3(0, -5, -65); // 目标模型的位置

    const animateCamera = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / duration, 1);
        camera.position.lerpVectors(initialPosition, targetPosition, t);
        const currentLookAt = initialLookAt.clone().lerp(targetLookAt, t);
        camera.lookAt(currentLookAt); // 确保相机始终面向目标位置

        if (t < 1) {
            requestAnimationFrame(animateCamera);
        }
    };

    animateCamera();

    // 添加点击事件监听器
    window.addEventListener("click", onObjectClick, false);

    function onObjectClick(event) {
        // Normalize mouse coordinates to [-1, 1]
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;
            // console.log(intersectedObject.name); // 输出被点击对象的名称

            // 检查是否是指定模型
            if (intersectedObject.name === '立方体011_Baked') { // 替换为你的模型名称
                alert("Clicked");
                playVideo("next.webm");
            }
        }
    }

    function playVideo(src) {
        const video = document.createElement("video");
        video.src = src; // 替换为你的视频路径
        video.controls = false;
        video.autoplay = true;
        document.body.appendChild(video);
        video.style.position = "absolute";
        video.style.width = "100%";
        video.style.top = "50%";
        video.style.left = "50%";
        video.style.transform = "translate(-50%, -50%)";
        video.style.pointerEvents = "none";
    }
}
