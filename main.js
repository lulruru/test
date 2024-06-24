// Configuration de base de Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Couleur de fond

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Position de la caméra

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Contrôles de la caméra
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// Ajout de lumières
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// Chargement du modèle GLTF
const loader = new THREE.GLTFLoader();
loader.load(
    'scene-2.glb', // Chemin vers votre modèle GLTF
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // Ajuster l'échelle du modèle si nécessaire
        model.position.set(0, 0, 0); // Ajuster la position du modèle si nécessaire
        scene.add(model);

        // Ajuster les lumières de la scène importée de Blender
        gltf.scene.traverse((node) => {
            if (node.isLight) {
                // Ajuster l'intensité des différentes lumières
                if (node instanceof THREE.DirectionalLight) {
                    node.intensity = 0.5; // Exemple : réduire l'intensité de la lumière directionnelle
                    node.castShadow = true; // Activer les ombres pour les lumières directionnelles
                    node.shadow.mapSize.width = 2048;
                    node.shadow.mapSize.height = 2048;
                    node.shadow.camera.near = 0.5;
                    node.shadow.camera.far = 50;
                } else if (node instanceof THREE.PointLight) {
                    node.intensity = 1.0; // Exemple : ajuster l'intensité de la lumière ponctuelle
                } else if (node instanceof THREE.SpotLight) {
                    node.intensity = 0.8; // Exemple : ajuster l'intensité de la lumière spot
                    node.castShadow = true; // Activer les ombres pour les lumières spot
                    node.shadow.mapSize.width = 2048;
                    node.shadow.mapSize.height = 2048;
                    node.shadow.camera.near = 0.5;
                    node.shadow.camera.far = 50;
                }
            }
            if (node.isMesh) {
                // Préserver le matériau existant
                node.material = new THREE.MeshStandardMaterial({
                    map: node.material.map,
                    color: node.material.color,
                    roughness: node.material.roughness !== undefined ? node.material.roughness : 0.5,
                    metalness: node.material.metalness !== undefined ? node.material.metalness : 0.5,
                    emissive: node.material.emissive,
                    emissiveMap: node.material.emissiveMap,
                    emissiveIntensity: node.material.emissiveIntensity
                });
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        render();
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

function render() {
    requestAnimationFrame(render);
    controls.update(); // Mettre à jour les contrôles de la caméra
    renderer.render(scene, camera);
}

render();

// Ajuster la taille du rendu en fonction de la taille de la fenêtre
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
