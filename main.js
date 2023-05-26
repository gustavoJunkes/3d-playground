import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background')
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );

// GEOMETRY

// sphere
var geometry = new THREE.SphereGeometry( 15, 32, 16 );

const planetTexture = new THREE.TextureLoader().load('planet-1.jpg')
const normalTexture = new THREE.TextureLoader().load('normal.jpg')

var material = new THREE.MeshStandardMaterial( { map: planetTexture, normalMap: normalTexture} );
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

geometry = new THREE.SphereGeometry( 2, 32, 16 );
const miniSphere = new THREE.Mesh( geometry, material );
miniSphere.position.setX(100)
miniSphere.position.setY(0)
scene.add( miniSphere );


const geometry2 = new THREE.CapsuleGeometry( 1, 1, 4, 8 );
const material2 = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
const ship = new THREE.Mesh( geometry2, material2 );

ship.position.setZ(50)

scene.add( ship );

camera.position.setX(ship.position.x)
camera.position.setY(ship.position.y)
camera.position.setZ(ship.position.z + 20)

const ambientLight = new THREE.AmbientLight(0xFFFFFF)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xFFFFFF)
scene.add(pointLight)

// const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(gridHelper)

const orbitControls = new OrbitControls(camera, renderer.domElement)

const background = new THREE.TextureLoader().load('space-5.jpg')
scene.background = background;

function addStars() {
  const geometry = new THREE.SphereGeometry( 0.25, 24, 24 );
  const material = new THREE.MeshStandardMaterial( { color: 0xFFFFFF } );
  const star = new THREE.Mesh( geometry, material );

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(300));

  star.position.set(x, y, z)
  scene.add( star );
}

Array(1000).fill().forEach(() => addStars())

let miniSpherePositionAngle = 0;

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.0001;
  sphere.rotation.y += 0.001;
 

  // camera.position.x += 0.1
  // camera.position.y += 0.1
  // camera.position.z += 0.1

  increaseMiniSpherePositionAngle();
  calculateMiniSpherePosition(30, miniSpherePositionAngle);

  renderer.render(scene, camera);
}

animate()

function calculateMiniSpherePosition(radius, currentAngle) {
  miniSphere.position.x = radius * Math.cos(currentAngle);
  miniSphere.position.z = radius * Math.sin(currentAngle);
}

function increaseMiniSpherePositionAngle() {
  if (miniSpherePositionAngle == 360) {
    miniSpherePositionAngle = 0;
  } else {
    miniSpherePositionAngle = miniSpherePositionAngle + 0.02;
  }
}

document.addEventListener("keydown", (key) => controlShip(key))

function controlShip(key) {

  console.log(key)

  if (key.code == 'ArrowUp') {
    ship.position.z -= 2
  }

  if (key.code == 'ArrowDown') {
    ship.position.z += 2;
  }

  if (key.code == 'ArrowLeft') {
    ship.position.x -= 2;
    // camera.rotation.y += 1
  }

  if (key.code == 'ArrowRight') {
    ship.position.x += 2;
  }
 

  camera.position.setX(ship.position.x)
  camera.position.setY(ship.position.y)
  camera.position.setZ(ship.position.z + 20)


}
