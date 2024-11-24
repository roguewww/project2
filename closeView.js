import * as THREE from "three";
import { gsap } from "gsap";
import { activeView } from "./state.js";
import { removeMiddleViewMouseMoveListener } from "./middleView.js";

// Global variables for random values of each clickable object
export const objectStates = {
    "Sphere002_Baked": null,
    "xiadele_Line2029219858008_Baked": null,
    "立方体011_Baked": null,
    "gui-jia_Baked": null,
    "000_0_0_Baked5": null,
};

// Map object names to their corresponding video sources
const objectVideos = {
    "Sphere002_Baked": "bones.webm",
    "xiadele_Line2029219858008_Baked": "bones.webm",
    "立方体011_Baked": "bones.webm",
    "gui-jia_Baked": "bones.webm",
    "000_0_0_Baked": "bones.webm",
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

            if (objectVideos[intersectedObject.name]) { // Check if the object has a corresponding video
                const randomValue = Math.round(Math.random());
                objectStates[intersectedObject.name] = randomValue;

                // Play the associated video for the clicked object
                playVideo(objectVideos[intersectedObject.name], intersectedObject.name);
            }
        }
    }

    function playVideo(src, objectName) {
        const videoContainer = document.getElementById("videoContainer");
        const videoPlayer = document.getElementById("videoPlayer");
        const closeButton = document.getElementById("closeButton");
    
        videoPlayer.src = src;
        videoContainer.style.display = "flex";
        
        // Clear any previous onended handler
        videoPlayer.onended = null;
    
        // Set a new onended handler for the current video
        videoPlayer.onended = () => {
            showImage(objectName); // Show image only when the video ends
        };
    
        closeButton.onclick = () => {
            videoPlayer.pause();
            videoContainer.style.display = "none";
            const imageContainer = document.getElementById("imageContainer");
            imageContainer.style.display = "none"; // Hide the image if close button is clicked
        };
    }
    
    function showImage(objectName) {
        const imageContainer = document.getElementById("imageContainer");
        const imageElement = document.getElementById("displayImage");
        const imageSrc = objectStates[objectName] === 0 ? "good.jpg" : "bad.jpg";
        imageElement.src = imageSrc;
    
        // Display the image container with a fade-in effect
        imageContainer.style.display = "flex";
        imageElement.style.opacity = 0;
        gsap.to(imageElement, { opacity: 1, duration: 1 });
    
    }
}