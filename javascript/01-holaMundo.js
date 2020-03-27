import * as THREE from './js/three.js/build/three.module.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls( camera, renderer.domElement );

var planeGeometry = new THREE.PlaneBufferGeometry(
    50,
    50,
    50);
var planeMaterial = new THREE.MeshBasicMaterial( {
	color: 0x500000
});
var planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( planeMesh );

animate();

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
};

