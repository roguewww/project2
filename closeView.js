import * as THREE from "three";
import { gsap } from "gsap";
import { activeView } from "./state.js";
import { removeMiddleViewMouseMoveListener } from "./middleView.js";
import { globalState } from './global.js';

// 定义每个对象对应的键值映射
const objectKeys = {
    "Sphere002_Baked": "var1",
    "xiadele_Line2029219858008_Baked": "var2",
    "立方体011_Baked": "var3",
    "gui-jia_Baked": "var4",
};

// Map object names to their corresponding video sources
const objectVideos = {
    "Sphere002_Baked": "bones.webm",
    "xiadele_Line2029219858008_Baked": "bamboo.mp4",
    "立方体011_Baked": "jj.webm",
    "gui-jia_Baked": "turtle.mp4",
};

export function closeView(camera, objects) {
    if (activeView !== 'close') return;

    removeMiddleViewMouseMoveListener(camera);
    const duration = 2000;
    const start = Date.now();
    const initialPosition = camera.position.clone();
    const initialLookAt = new THREE.Vector3();
    camera.getWorldDirection(initialLookAt).add(camera.position);
    const targetPosition = new THREE.Vector3(0, 18, -7.5);
    const targetLookAt = new THREE.Vector3(0, -5, -65);

    const animateCamera = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / duration, 1);
        camera.position.lerpVectors(initialPosition, targetPosition, t);
        const currentLookAt = initialLookAt.clone().lerp(targetLookAt, t);
        camera.lookAt(currentLookAt);

        if (t < 1) {
            requestAnimationFrame(animateCamera);
        }
    };

    animateCamera();

    window.addEventListener("click", onObjectClick, false);

    function onObjectClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            const intersectedObject = intersects[0].object;

            if (objectVideos[intersectedObject.name] && objectKeys.hasOwnProperty(intersectedObject.name)) {
                const randomValue = Math.round(Math.random());
                const key = objectKeys[intersectedObject.name];

                // 更新 globalState 对象的值
                globalState[key] = randomValue;

                console.log(`Updated globalState.${key} to: ${randomValue}`);
                
                // 播放点击对象的相关视频
                playVideo(objectVideos[intersectedObject.name], intersectedObject.name, key);
            }
        }
    }

    function playVideo(src, objectName, key) {
        const videoContainer = document.getElementById("videoContainer");
        const videoPlayer = document.getElementById("videoPlayer");
        const closeButton = document.getElementById("closeButton");

        videoPlayer.src = src;
        videoContainer.style.display = "flex";

        // 清除之前的 onended 事件
        videoPlayer.onended = null;

        // 设置当前视频结束时的处理
        videoPlayer.onended = () => {
            showImage(objectName, key);
        };

        closeButton.onclick = () => {
            videoPlayer.pause();
            videoContainer.style.display = "none";
            const imageContainer = document.getElementById("imageContainer");
            imageContainer.style.display = "none"; // 如果点击了关闭按钮，则隐藏图片
        };
    }

    function showImage(objectName, key) {
        const imageContainer = document.getElementById("imageContainer");
        const imageElement = document.getElementById("displayImage");

        // 根据 globalState 对象的值设置图片路径
        const stateValue = globalState[key];
        const imageSrc = stateValue === 0 ? "good.png" : "bad.png";
        imageElement.src = imageSrc;

        // 显示图片容器并添加淡入效果
        imageContainer.style.display = "flex";
        imageElement.style.opacity = 0;
        gsap.to(imageElement, { opacity: 1, duration: 1 });

        console.log(`Showing image: ${imageSrc} for ${objectName} with state ${stateValue}`);
    }
}