import { Monster } from "./monster.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 5, 60);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const flashlight = new THREE.PointLight(0xffffff, 2, 20);
scene.add(flashlight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200,200),
  new THREE.MeshStandardMaterial({ color: 0x111111 })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const ambient = new THREE.AmbientLight(0x202020);
scene.add(ambient);

let keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

let battery = 300;
let night = 1;
let nightTimer = 0;

const monster = new Monster(scene, camera);

function animate(){
  requestAnimationFrame(animate);

  const speed = 0.05;
  if(keys["w"]) camera.position.z -= speed;
  if(keys["s"]) camera.position.z += speed;
  if(keys["a"]) camera.position.x -= speed;
  if(keys["d"]) camera.position.x += speed;

  flashlight.position.copy(camera.position);

  if(battery > 0){
    battery -= 0.016;
  } else {
    flashlight.intensity = 0;
  }

  nightTimer += 0.016;
  if(nightTimer >= 600){
    night++;
    nightTimer = 0;
    monster.levelUp();
  }

  monster.update();

  document.getElementById("hud").innerText =
    `Night ${night}\nFlashlight ${Math.max(0, Math.floor(battery))}s`;

  renderer.render(scene, camera);
}

animate();