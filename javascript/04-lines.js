import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';
import { MTLLoader } from './js/three.js/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from './js/three.js/examples/jsm/loaders/OBJLoader.js';

var renderer;
var scene;
var camera;
var controls;

function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 500 );
	camera.position.z = 100;
	camera.lookAt(0,0,0);

	controls = new OrbitControls( camera, canvas );

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');

	const light = new THREE.AmbientLight( 0x404040 );
	scene.add(light);

	const points = [];
	points.push( new THREE.Vector3(-10, 0, 0) );
	points.push( new THREE.Vector3( 0, 10, 0 ) );
	points.push( new THREE.Vector3( 10, 0, 0 ) );

	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	const material = new THREE.LineBasicMaterial({color: 0x0000ff});
	const mesh = new THREE.Mesh(geometry,material);
	scene.add(mesh);



	

}

function map(value, istart, istop, ostart, ostop) {
	return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function render() {
	renderer.render( scene, camera );
	controls.update();
	adjustCanvasSize();
	//TWEEN.update();
	requestAnimationFrame( render );
};

function adjustCanvasSize() {
	renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

main();
render();



























// Por culpa de este metodo se veia pixelado
// function onWindowResize() {
// 	const windowHalfX = window.innerWidth / 2;
// 	const windowHalfY = window.innerHeight / 2;
// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	//composer.setSize( window.innerWidth, window.innerHeight );
// }
// window.addEventListener( 'resize', onWindowResize, false );


// Plano con eje z alterado
// PlaneBufferGeometry(width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
	// var geometry = new THREE.PlaneBufferGeometry( 100, 100, 100, 100 );
	// var vertices = geometry.attributes.position.array;
	// for ( let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3 ) {
	// 	// x0,y0,z0,x1,y1,z1,x2,y2,z2... Cada 3 tenemos un nuevo x,y,z
	// 	// j = x0, x1, x2.. en cada iteracion
	// 	vertices[j+2] = Math.cos(Math.sqrt( ( j * j ) + ( (j+1) * (j+1) ) ) );
	// }
	// geometry.computeVertexNormals();
	// var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true,  side: THREE.DoubleSide} );
	// var mesh = new THREE.Mesh( geometry, material );
	// scene.add(mesh);