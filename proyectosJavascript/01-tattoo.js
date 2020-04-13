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

var textureLoader = new THREE.TextureLoader();
var humanMesh;

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


	loadLeePerrySmith();

	// const loader = new THREE.TextureLoader();
	// const texture = loader.load(
	// 	'https://threejsfundamentals.org/threejs/resources/images/world.jpg'
	// );
	// const geometry = new THREE.SphereBufferGeometry( 1, 64, 32 );
	// const material = new THREE.MeshBasicMaterial({map: texture});
	// const mesh = new THREE.Mesh(geometry, material);
	// scene.add(mesh);

	

}

function loadLeePerrySmith() {
	const loader = new GLTFLoader();
	loader.load( 'js/three.js/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb', function ( gltf ) {

		humanMesh = gltf.scene.children[ 0 ];
		humanMesh.material = new THREE.MeshPhongMaterial( {
			specular: 0x111111,
			map: textureLoader.load( 'js/three.js/examples/models/gltf/LeePerrySmith/Map-COL.jpg' ),
			specularMap: textureLoader.load( 'js/three.js/examples/models/gltf/LeePerrySmith/Map-SPEC.jpg' ),
			normalMap: textureLoader.load( 'js/three.js/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
			shininess: 25
		} );

		scene.add( humanMesh );
		humanMesh.scale.set( 1, 1, 1 );

		loadDecalsGeometry();
	});

}

function loadDecalsGeometry() {
	const tattooTexture = textureLoader.load('tatuaje.png');
	const decalMaterial = new THREE.MeshPhongMaterial({
		map: tattooTexture
	});
	const decalGeometry = new DecalGeometry( 
		humanMesh,
		new THREE.Vector3(0,0,0),
		new THREE.Euler( 0, 1, 1.57, 'XYZ' ),
		new THREE.Vector3(5,5,5)
	);
	const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
	scene.add( decalMesh );
}

function render() {
	renderer.render( scene, camera );
	controls.update();
	//TWEEN.update();
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
