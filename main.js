// Basic setup for Three.js and Cannon.js
let scene, camera, renderer, bullets = [], enemies = [], ui, health = 100, score = 0, ammo = 10;
let world, cannonMaterial, bulletSpeed = 0.2, enemySpeed = 0.05;

init();
animate();

// Initialize the game scene
function init() {
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Light sky blue
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.6, 5);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Physics setup with Cannon.js
  world = new CANNON.World();
  world.gravity.set(0, -9.82, 0); // Gravity

  cannonMaterial = new CANNON.Material();

  // UI setup
  ui = document.createElement('div');
  ui.id = 'ui';
  document.body.appendChild(ui);

  // Event listener for shooting
  window.addEventListener('click', shootBullet);

  // Create floor
  const floorGeo = new THREE.PlaneGeometry(50, 50);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Add some enemies
  for (let i = 0; i < 5; i++) {
    createEnemy();
  }
  
  // Resizing handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Create a new enemy
function createEnemy() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(geometry, material);
  enemy.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
  scene.add(enemy);
  enemies.push(enemy);

  // Create Cannon.js physics body
  const enemyShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
  const enemyBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(enemy.position.x, enemy.position.y, enemy.position.z),
    material: cannonMaterial
  });
  enemyBody.addShape(enemyShape);
  world.addBody(enemyBody);
}

// Create a bullet
function shootBullet() {
  if (ammo <= 0) return; // No ammo left

  const bulletGeometry = new THREE.SphereGeometry(0.1);
  const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
  bullet.position.copy(camera.position);
  scene.add(bullet);

  const bulletDirection = new THREE.Vector3();
  camera.getWorldDirection(bulletDirection);

  bullets.push({ mesh: bullet, direction: bulletDirection });

  ammo--; // Decrease ammo
}

// Update bullet movement
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    bullet.mesh.position.add(bullet.direction.multiplyScalar(bulletSpeed));

    // Remove bullet if it goes too far
    if (bullet.mesh.position.length() > 100) {
      scene.remove(bullet.mesh);
      bullets.splice(i, 1);
      i--;
    }

    // Check for collisions with enemies
    enemies.forEach((enemy, index) => {
      if (bullet.mesh.position.distanceTo(enemy.position) < 1) {
        scene.remove(enemy);
        enemies.splice(index, 1);
        createEnemy(); // Create a new enemy
        score += 10; // Increase score
      }
    });
  }
}

// Update enemy movement
function updateEnemies() {
  enemies.forEach((enemy) => {
    enemy.position.z += enemySpeed;
    if (enemy.position.z > 25) {
      enemy.position.z = -25; // Reset position when out of bounds
    }
  });
}

// Animate the game
function animate() {
  requestAnimationFrame(animate);

  world.step(1 / 60); // Update physics world

  updateBullets();
  updateEnemies();

  // Render the scene
  renderer.render(scene, camera);

  // Update UI
  ui.innerHTML = `
    Health: ${health}<br />
    Score: ${score}<br />
    Ammo: ${ammo}
  `;
}
