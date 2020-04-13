import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';

var renderer;
var scene;
var camera;
var controls;

function main() {
	const canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	//const tweenManager = new tweenManager();

	const fov = 60;
	const aspect = 2;
	const near = 0.1;
	const far = 10;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 2.5;

	controls = new OrbitControls( camera, canvas );
	controls.enableDamping = true;
	controls.enablePan = false;
	controls.minDistance = 1.2;
	controls.maxDistance = 4;
	controls.update();

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');

// 	const loader = new THREE.TextureLoader();
// 	const texture = loader.load(
// 		'https://threejsfundamentals.org/threejs/resources/images/world.jpg'
// 	);
// 	const geometry = new THREE.SphereBufferGeometry( 1, 64, 32 );
// 	const material = new THREE.MeshBasicMaterial({map: texture});
// 	const mesh = new THREE.Mesh(geometry, material);
// 	scene.add(mesh);

	

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

// ------------ Obtencion de los datos COVID ----------

async function loadFile( url ) {
	const req = await fetch( url );
	return req.text();
}

function parseData( text ) {
  	const settings = {};
  	let maxValue = 0;
	text.split('\n').forEach( ( line ) => {
		const dataSplit = line.trim().split(',');
 		settings[dataSplit[1]] = dataSplit[ dataSplit.length - 1 ];
 		if(parseFloat(maxValue) < parseFloat(dataSplit[ dataSplit.length - 1 ] )){
 			maxValue = dataSplit[ dataSplit.length - 1 ];
 		}
	});
	settings['maxValue'] = maxValue;
	return settings;
}

function drawData( settings ) {
	const keyValues = Object.entries(settings);

    var axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
   
   	const geometry = new THREE.BoxBufferGeometry( 0.2, 0.2, 0.2 );
   	const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
   	const count = keyValues.length - 1;
	const cube = new THREE.InstancedMesh( geometry, material, count );
	//const cube = new THREE.Mesh( geometry, material, count );
	const transform = new THREE.Object3D();
	const amount = parseInt( window.location.search.substr( 1 ) ) || 10;
	const offset = ( amount - 1 ) / 2;

	const maxValue = settings['Madrid'];
	for(let i = 1; i < keyValues.length - 1; i++) {
		transform.scale.set(0.2, keyValues[i][1] / maxValue, 0.2);
		transform.position.set( ( (i) / (keyValues.length - 1)), 1, 1 );
		transform.updateMatrix();

	    cube.setMatrixAt( i, transform.matrix );
	}

	scene.add(cube);
	drawText();

}

function drawText() {
	const loader = new THREE.FontLoader();

	loader.load( 'js/three.js/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

	var geometry = new THREE.TextGeometry( 'Hello three.js!', {
		font: font,
		size: 80,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );
	const textGeo = new THREE.BufferGeometry().fromGeometry( geometry );
	const textMesh = new THREE.Mesh( textGeo, new THREE.MeshBasicMaterial({color:0xff0000}) );
	scene.add(textMesh);
} );

	// geometry.computeBoundingBox();
	// geometry.computeVertexNormals();
	
}

// function drawData( settings ) {

//     var axesHelper = new THREE.AxesHelper( 5 );
//     scene.add( axesHelper );
    
// 	const keyValues = Object.entries(settings);
// 	var points = [];
// 	const maxValue = settings['Madrid'];
// 	for(let i = 1; i < keyValues.length - 1; i++) {
// 		//console.log(keyValues[i][0]);
// 		points.push( new THREE.Vector3( i / (keyValues.length - 1), keyValues[i][1] / maxValue , 0 ) );
// 	}
// 	var geometry = new THREE.BufferGeometry().setFromPoints( points );
// 	var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
//     var line = new THREE.Line( geometry, material );
//     scene.add(line);

// }


// -------------- Ejecucion del programa --------------
window.addEventListener( 'resize', onWindowResize, false );
main();
loadFile('https://raw.githubusercontent.com/datadista/datasets/master/COVID%2019/ccaa_covid19_fallecidos.csv')
	.then(parseData)
	.then(drawData);
render();