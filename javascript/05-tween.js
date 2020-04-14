import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from './js/three.js/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from './js/three.js/examples/jsm/geometries/DecalGeometry.js';

var renderer;
var scene;
var camera;
var controls;

function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	const fov = 45;
	const aspect = 2;
	const near = 1;
	const far = 1000;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 10;
	//camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	//camera.position.z = 5;

	controls = new OrbitControls( camera, canvas );
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.minDistance = 0.2;
	controls.maxDistance = 200;
	controls.update();

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');

	scene.add( new THREE.AmbientLight( 0x443333 ) );

	var light = new THREE.DirectionalLight( 0xffddcc, 1 );
	light.position.set( 1, 0.75, 0.5 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xccccff, 1 );
	light.position.set( - 1, 0.75, - 0.5 );
	scene.add( light );

	const loader = new THREE.TextureLoader();
	const texture = loader.load(
		'https://threejsfundamentals.org/threejs/resources/images/world.jpg'
	);
	const geometry = new THREE.SphereBufferGeometry( 1, 64, 32 );
	const material = new THREE.MeshBasicMaterial({map: texture});
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	let current = {x: -8};
	let update = () => {
		mesh.position.z = current.x;
	};
	TWEEN.removeAll();

	let tweenHead = new TWEEN.Tween(current)
		.to({x: +8}, 2000)
		.delay(500)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(update);
	
	let tweenBack = new TWEEN.Tween(current)
		.to({x: -8}, 2000)
		.delay(500)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(update);

	tweenHead.chain(tweenBack);
	tweenBack.chain(tweenHead);
	tweenHead.start();


}

function render() {
	renderer.render( scene, camera );
	controls.update();
	TWEEN.update();
	requestAnimationFrame( render );
};

function onWindowResize() {

	const windowHalfX = window.innerWidth / 2;
	const windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	//composer.setSize( window.innerWidth, window.innerHeight );

}

window.addEventListener( 'resize', onWindowResize, false );
main();
render();





// Chuletilla
// http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
// http://sole.github.io/tween.js/examples/03_graphs.html
// http://learningthreejs.com/data/tweenjs_for_smooth_animation/tweenjs_for_smooth_animation.html
// let position = {z:0};
// 	let target = {z:8};
// 	let tween = new TWEEN.Tween(position).to(target, 2000)
// 					.onUpdate(() => {
// 						mesh.position.z = position.z;
// 					})
// 					.delay(500)
// 					.easing(TWEEN.Easing.Linear.None)
// 					.start();



// Animacion infinita (concatenando dos animaciones)
// let current = {x: -8};
// 	let update = () => {
// 		mesh.position.z = current.x;
// 	};
// 	TWEEN.removeAll();

// 	let tweenHead = new TWEEN.Tween(current)
// 		.to({x: +8}, 2000)
// 		.delay(500)
// 		.easing(TWEEN.Easing.Linear.None)
// 		.onUpdate(update);
	
// 	let tweenBack = new TWEEN.Tween(current)
// 		.to({x: -8}, 2000)
// 		.delay(500)
// 		.easing(TWEEN.Easing.Linear.None)
// 		.onUpdate(update);

// 	tweenHead.chain(tweenBack);
// 	tweenBack.chain(tweenHead);
// 	tweenHead.start();
