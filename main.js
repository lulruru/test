// Configuration de base de Three.js
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Couleur de fond

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Position de la caméra

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Contrôles de la caméra
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// Chargement du modèle GLTF
const loader = new THREE.GLTFLoader();
loader.load(
    'scene-2.gltf', // Chemin vers votre modèle GLTF
    function (gltf) {
        const model = gltf.scene;
        model.scale.set(1, 1, 1); // Ajuster l'échelle du modèle si nécessaire
        model.position.set(0, 0, 0); // Ajuster la position du modèle si nécessaire
        scene.add(model);

        // Ajouter les lumières de la scène exportées de Blender
        gltf.scene.traverse((node) => {
            if (node.isLight) {
                // Ajuster l'intensité des différentes lumières
                if (node instanceof THREE.DirectionalLight) {
                    node.intensity = 0.5; // Exemple : réduire l'intensité de la lumière directionnelle
                } else if (node instanceof THREE.PointLight) {
                    node.intensity = 1.0; // Exemple : ajuster l'intensité de la lumière ponctuelle
                } else if (node instanceof THREE.SpotLight) {
                    node.intensity = 0.8; // Exemple : ajuster l'intensité de la lumière spot
                }
                scene.add(node);
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


