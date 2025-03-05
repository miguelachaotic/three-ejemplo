import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { STLExporter } from "three/addons";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer(
    {antialias: true, canvas: document.querySelector('#canvas')}
);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
//controls.rotateSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.panSpeed = 1;

function exportToSTL() {
    const exporter = new STLExporter();
    const stlData = exporter.parse(scene); // Convierte la escena a STL
    const blob = new Blob([stlData], { type: 'application/octet-stream' });

    // Crear enlace de descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo.stl';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const obj = {
    a: [1, 2, 3],
    b: "hola"
}

// Agregar botón para exportar
const button = document.createElement('button');
button.innerText = 'Exportar a STL';
button.style.position = 'absolute';
button.style.top = '10px';
button.style.left = '10px';
button.addEventListener('click', exportToSTL);
document.body.appendChild(button);


const flyControls = new FlyControls(camera, renderer.domElement);

const loader = new GLTFLoader();

// Carga el modelo
loader.load(
    'models/gta/scene.gltf', // Ruta del archivo GLTF
    (gltf) => {
        scene.add(gltf.scene); // Agregar el modelo a la escena
        console.log("Completed!");
    },
    (xhr) => {
        console.log(`Carga: ${(xhr.loaded / xhr.total) * 100}% completado`);
    },
    (error) => {
        console.error('Error al cargar el modelo:', error);
    }
);

flyControls.enableDamping = true;
flyControls.dampingFactor = 0.05;
flyControls.movementSpeed = 10;
flyControls.dragToLook = false;
flyControls.autoForward = false;

renderer.domElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
});

camera.position.z = 100;

const light = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(light);

// Animación
function animate() {
    requestAnimationFrame(animate);
    if(resizeRenderer(renderer)){
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    controls.update();
    //camera.quaternion.setFromEuler(new THREE.Euler(0, 0, 0)); // Fija la orientación inicial
    //flyControls.update(0.05);
    renderer.render(scene, camera);
}
animate();

function resizeRenderer(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio || 1;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}