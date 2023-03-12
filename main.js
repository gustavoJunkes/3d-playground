import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(200, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#background')
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.setX(-62.127505436151495)
camera.position.setY(37.706810552645706)
camera.position.setZ(-26.0112337865994)

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
miniSphere.position.setX(30)
miniSphere.position.setY(0)
// scene.add( miniSphere );



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

var miniSphereZIndex = -29;
var xLessThanZero = false;

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.0001;
  sphere.rotation.y += 0.001;

  console.log("-----------")
  console.log(camera.position.x)
  console.log(camera.position.y)
  console.log(camera.position.z)

  camera.position.x += 0.1
  // camera.position.y += 0.1
  // camera.position.z += 0.1

  if (miniSphere.position.x < 0) {
    xLessThanZero = true;
  }
  
  if (miniSphereZIndex <= -30) {
    xLessThanZero = false;
  }

  if (xLessThanZero && miniSphere.position.z > -30) {
    miniSphereZIndex -= 0.6;
  } else {
    miniSphereZIndex += 0.6;
  }  
  miniSphere.position.x = resolveMiniSphereOrbit(30, miniSphereZIndex, xLessThanZero)
  miniSphere.position.z = miniSphereZIndex;

  orbitControls.update();

  renderer.render(scene, camera);
}

animate()

function resolveMiniSphereOrbit(radius, z, isXLessThanZero) {
  // radius square minus z square = x square
  const radiusSquare = Math.pow(radius, 2); 
  const zSquare = Math.pow(z, 2);

  var result = (radiusSquare - zSquare).toFixed(19);

  if (z <= -30) {
    xLessThanZero = false;
  } 
  
  // transform to positive and to negative again
  if (result < 0) {
    result = Math.abs(result);
    var toReturn = Math.sqrt(result);
    
    return toReturn * -1;    
  }
  return isXLessThanZero ? Math.sqrt(result).toFixed(15) * -1 : Math.sqrt(result).toFixed(15); // The root square of result
}
