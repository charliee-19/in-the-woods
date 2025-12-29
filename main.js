import { Monster } from "./monster.js";

let scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 60);

let camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let light = new THREE.PointLight(0xffffff, 2, 20);
scene.add(light);

let floor = new THREE.Mesh(
  new THREE.PlaneGeometry(200,200),
  new THREE.MeshStandardMaterial({color:0x111111})
);
floor.rotation.x = -Math.PI/2;
scene.add(floor);

let keys = {};
document.addEventListener("keydown", e=>keys[e.key]=true);
document.addEventListener("keyup", e=>keys[e.key]=false);

let battery = 300;
let night = 1;
let nightTimer = 0;

let monster = new Monster(scene, camera);

function animate(){
  requestAnimationFrame(animate);

  let speed = 0.05;
  if(keys["w"]) camera.position.z -= speed;
  if(keys["s"]) camera.position.z += speed;
  if(keys["a"]) camera.position.x -= speed;
  if(keys["d"]) camera.position.x += speed;

  light.position.copy(camera.position);

  if(battery>0){
    battery -= 0.016;
  } else light.intensity = 0;

  nightTimer += 0.016;
  if(nightTimer >= 600){
    night++;
    nightTimer=0;
    monster.levelUp(night);
  }

  monster.update();

  document.getElementById("hud").innerText =
   `Night ${night}\nFlashlight ${Math.floor(battery)}s`;

  renderer.render(scene,camera);
}

animate();
