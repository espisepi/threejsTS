import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from './js/three.js/examples/jsm/loaders/GLTFLoader.js';
import { DecalGeometry } from './js/three.js/examples/jsm/geometries/DecalGeometry.js';

var canvas;
var renderer;
var scene;
var camera;
var controls;

var uniforms;

function main() {
	canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	const fov = 45;
	const aspect = 2;
	const near = 1;
	const far = 1000;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 2;
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

	// const loader = new THREE.TextureLoader();
	// const texture = loader.load(
	// 	'https://threejsfundamentals.org/threejs/resources/images/world.jpg'
	// );
	// const geometry = new THREE.SphereBufferGeometry( 1, 64, 32 );
	// const material = new THREE.MeshBasicMaterial({map: texture});
	// const mesh = new THREE.Mesh(geometry, material);
	// scene.add(mesh);

	loadPrincipalImage();
}

function loadPrincipalImage() {
	const fragmentShader = `
	#include <common>

	uniform vec3 iResolution;
	uniform float iTime;
	uniform sampler2D iChannel0;
	uniform sampler2D iChannel1;

	// By Daedelus: https://www.shadertoy.com/user/Daedelus
	// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
	#define TIMESCALE 0.25 
	#define TILES 8
	#define COLOR 0.7, 1.6, 2.8

	void mainImage( out vec4 fragColor, in vec2 fragCoord )
	{
	vec2 uv = fragCoord.xy / iResolution.xy;
	uv.x *= iResolution.x / iResolution.y;

	vec4 depthImage = texture2D(iChannel1, uv);
	vec4 originalImage = texture2D(iChannel0, uv + iTime * depthImage.r);
	
	fragColor = vec4(originalImage.rgb, 1.0);

	//vec4 originalImage = texture2D(iChannel0, uv);
	}

	varying vec2 vUv;

	void main() {
	mainImage(gl_FragColor, vUv * iResolution.xy);

	// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mod.xhtml
	}
	`;
	const vertexShader = `
	varying vec2 vUv;
	uniform sampler2D iChannel0;
	void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

	//vec4 noise = texture2D(iChannel0, uv);
	//noise.x = 0.0;
	//noise.y = 0.0;
	//gl_Position = projectionMatrix * modelViewMatrix * vec4( position + noise.xyz, 1.0 );
	}
	`;

	const loader = new THREE.TextureLoader();
	const texture = loader.load('original.jpg');
	texture.minFilter = THREE.NearestFilter;
	texture.magFilter = THREE.NearestFilter;
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	const depthTexture = loader.load('capa.jpg');
	depthTexture.minFilter = THREE.NearestFilter;
	depthTexture.magFilter = THREE.NearestFilter;
	depthTexture.wrapS = THREE.RepeatWrapping;
	depthTexture.wrapT = THREE.RepeatWrapping;
	uniforms = {
	iTime: { value: 0 },
	iResolution:  { value: new THREE.Vector3(1, 1, 1) },
	iChannel0: { value: texture },
	iChannel1: { value: depthTexture }
	};
	const material = new THREE.ShaderMaterial({
	vertexShader,
	fragmentShader,
	uniforms,
	});
	const geometry = new THREE.PlaneBufferGeometry(3, 1, 20, 20);
	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
}

function render( time ) {
	time = time * 0.001 // Convert to seconds
	uniforms.iTime.value = time;
	uniforms.iResolution.value.set(canvas.width, canvas.height, 1);

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







// const fragmentShader = `
// 	#include <common>

// 	uniform vec3 iResolution;
// 	uniform sampler2D originalImage;

// 	varying vec2 vUv;

// 	void mainImage( out vec4 fragColor, in vec2 fragCoord )
// 	{
// 		vec2 uv = fragCoord.xy / iResolution.xy;
// 		uv.x *= iResolution.x / iResolution.y;
//      //vec4 orig = texture2D(originalImage, uv);
// 		//originalImage = texture2D(originalImage, uv);
// 		fragColor = vec4(1.0, 0.0, 0.0, 1.0);
// 	}

// 	void main() {
// 		mainImage(gl_FragColor, vUv * iResolution.xy);
// 	}
// 	`;
// 	const vertexShader = `

// 	uniform sampler2D originalImage;
// 	varying vec2 vUv;

// 	void main() {
// 		vUv = uv;
// 		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
// 	}
// 	`;

// 	const loader = new THREE.TextureLoader();
// 	const originalImage = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');
// 	originalImage.minFilter = THREE.NearestFilter;
// 	originalImage.magFilter = THREE.NearestFilter;
// 	originalImage.wrapS = THREE.RepeatWrapping;
// 	originalImage.wrapT = THREE.RepeatWrapping;
// 	uniforms = {
// 	iResolution:  { value: new THREE.Vector3(1, 1, 1) },
// 	originalImage: { value: originalImage },
// 	};
// 	const material = new THREE.ShaderMaterial({
// 	vertexShader,
// 	fragmentShader,
// 	uniforms,
// 	});
// 	const geometry = new THREE.PlaneBufferGeometry(1, 1, 20, 20);
// 	const mesh = new THREE.Mesh(geometry, material);
// 	scene.add(mesh);