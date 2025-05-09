// Declare basic variables
let scene, camera, renderer;

init();
animate();

// Initialize Three.js scene
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Sky blue background

  // Set up camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5; // Set camera distance from the scene

  // Create the renderer and link it to the canvas element
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
  renderer.setSize(window.innerWidth, window.innerHeight); // Make it full screen

  // Add a rotating cube (just for demo)
  const geometry = new THREE.BoxGeometry(); // Create a cube shape
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green material
  const cube = new THREE.Mesh(geometry, material); // Combine geometry and material
  scene.add(cube); // Add the cube to the scene

  // Handle window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Render the scene and animate
function animate() {
  requestAnimationFrame(animate); // Calls animate() continuously

  // Rotate the cube for animation
  scene.children[0].rotation.x += 0.01;
  scene.children[0].rotation.y += 0.01;

  // Render the scene from the camera's perspective
  renderer.render(scene, camera);
}
