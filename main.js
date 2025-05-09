
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

let scene, camera, renderer, world;
let bullets = [];
let targets = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lighting
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  scene.add(light);

  // Floor
  const floorGeo = new THREE.PlaneGeometry(50, 50);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Target
  const targetGeo = new THREE.BoxGeometry(1, 1, 1);
  const targetMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  for (let i = 0; i < 5; i++) {
    const target = new THREE.Mesh(targetGeo, targetMat);
    target.position.set(Math.random() * 20 - 10, 0.5, -Math.random() * 20);
    scene.add(target);
    targets.push(target);
  }

  // Mouse click shooting
  window.addEventListener('click', () => {
    const bulletGeo = new THREE.SphereGeometry(0.1);
    const bulletMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const bullet = new THREE.Mesh(bulletGeo, bulletMat);
    bullet.position.copy(camera.position);
    scene.add(bullet);

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    bullets.push({ mesh: bullet, velocity: dir.multiplyScalar(1) });
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function animate() {
  requestAnimationFrame(animate);

  bullets.forEach((b, i) => {
    b.mesh.position.add(b.velocity);
    // Remove bullets if they go too far
    if (b.mesh.position.length() > 100) {
      scene.remove(b.mesh);
      bullets.splice(i, 1);
    }

    // Hit detection (very simple)
    targets.forEach((tgt, j) => {
      if (b.mesh.position.distanceTo(tgt.position) < 0.6) {
        scene.remove(tgt);
        targets.splice(j, 1);
      }
    });
  });

  renderer.render(scene, camera);
}
