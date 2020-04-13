import * as THREE from './js/three.js/build/three.module.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { MTLLoader } from './js/three.js/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from './js/three.js/examples/jsm/loaders/OBJLoader.js';

// document.getElementById( 'startButton' ).addEventListener( 'click', function () {
//     comenzarLaVaina();
//     document.getElementById('overlay').style = 'display:none';
    
// }, false );
var meshTween = {position: {x:0,y:0}};
comenzarLaVaina();

function comenzarLaVaina() {

var position = { x : 0, y: 300 };
var target = { x : 400, y: 50 };
var tween = new TWEEN.Tween(position).to(target, 2000);
tween.onUpdate(function(){
    meshTween.position.x = position.x;
    meshTween.position.y = position.y;
});
tween.delay(500);
tween.easing(TWEEN.Easing.Elastic.InOut)
tween.start();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var controls = new OrbitControls( camera, renderer.domElement );

var ambient = new THREE.AmbientLight( 0x050505 );
scene.add( ambient );

var directionalLight1 = new THREE.DirectionalLight( 0xffffff, 2 );
directionalLight1.position.set( 2, 1.2, 10 ).normalize();
scene.add( directionalLight1 );

var directionalLight2 = new THREE.DirectionalLight( 0xffffff, 1 );
directionalLight2.position.set( -2, 1.2, -10 ).normalize();
scene.add( directionalLight2 );

var pointLight = new THREE.PointLight( 0xffaa00, 2 );
pointLight.position.set( 2000, 1200, 10000 );
scene.add( pointLight );

var planeGeometry = new THREE.PlaneBufferGeometry(
	50,
	50,
	50);

var video = document.getElementById( 'video' );
video.playbackRate = 1.0;
//video.duration
//video.currentTime
//video.play();

document.getElementById('testButton').addEventListener('click', function () {
	if (video.playbackRate === 1.0){
	video.playbackRate = 2.0;
	} else {
		video.playbackRate = 1.0;
	}
})

var textureVideo = new THREE.VideoTexture( video );
var planeMaterial = new THREE.MeshBasicMaterial( {
	color: 0xffffff,
	map: textureVideo
});
var planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
scene.add( planeMesh );
planeMesh.position.z = -30;

// TODO: Volver a empezar siguiendo ese codigo
// https://discourse.threejs.org/t/mtl-material-not-loading-on-obj/2162
var gunGroup;
var mtlLoader = new MTLLoader();
var objLoader = new OBJLoader();
mtlLoader.setPath( 'models/beretta_M9/' );
mtlLoader.load(
	'Beretta_M9.mtl',
	function ( materials ) {
		materials.preload();
		objLoader.setMaterials( materials );
		objLoader.setPath( 'models/beretta_M9/' );
		objLoader.load(
			'Beretta_M9.obj',
			function ( object ) {
				gunGroup = object;
				gunGroup.rotation.z = - Math.PI / 2;
				scene.add(gunGroup);
			},
			function (xhr) {

			},
			function ( error ) {

			}
			);
	},
	function ( xhr ) {

	},
	function ( error ) {

	} 
);

objLoader.setPath('models/cat/');
objLoader.load(
    'cat.obj',
    function ( object ) {
    	console.log(object);
    	object.position.setScalar(new THREE.Vector3(10,10,10));
    	object.children.forEach( ( mesh ) => {
    		mesh.scale.multiplyScalar(20);
    		mesh.material = new THREE.MeshBasicMaterial({
    			color: 0xff0000
    		});
    	});
    	scene.add(object);
    },
    function ( progress ) {

    },
    function ( error ) {

    }
);


window.addEventListener( 'resize', onWindowResize, false );
animate();

function animate() {
	renderer.render( scene, camera );
	TWEEN.update();
	requestAnimationFrame( animate );
};

function onWindowResize() {

				const windowHalfX = window.innerWidth / 2;
				const windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );
				//composer.setSize( window.innerWidth, window.innerHeight );

}

}














// Miscellaneous


//import { GLTFLoader } from './js/three.js/examples/jsm/loaders/GLTFLoader.js';
//import { DRACOLoader } from './js/three.js/examples/jsm/loaders/DRACOLoader.js';
// var loader = new GLTFLoader();
// loader.setPath( 'models/beretta_M9/' );
// var dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( './js/three.js/examples/js/libs/draco/' );
// loader.setDRACOLoader( dracoLoader );

// loader.load( 'Beretta_M9.obj', function ( gltf ) {
//     console.log(gltf);
// });







// var gunGeometry;
// var loader = new OBJLoader();
// loader.load(
// 	// resource URL
// 	'models/beretta_M9/Beretta_M9.obj',
// 	function ( object ) {
//         gunGeometry = object;
// 		//scene.add( gunGeometry );
// 	},
// 	// called when loading is in progresses
// 	function ( xhr ) {

// 	},
// 	// called when loading has errors
// 	function ( error ) {

// 	}
// );

// var gunMaterial;
// var mtlLoader = new MTLLoader();
// mtlLoader.load(
//     'models/beretta_M9/Beretta_M9.mtl',
//     function ( material ) {
//     	gunMaterial = material; 	
//     },
//     function ( xhr ) {

//     },
//     function ( error ) {

//     }
// );