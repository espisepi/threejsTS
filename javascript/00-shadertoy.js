import * as THREE from './js/three.js/build/three.module.js';
import { BufferGeometryUtils } from './js/three.js/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from './js/three.js/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from './js/three.js/examples/jsm/libs/tween.module.min.js';
import { MTLLoader } from './js/three.js/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from './js/three.js/examples/jsm/loaders/OBJLoader.js';

var canvas;
var renderer;
var scene;
var camera;
var controls;
var uniforms;
var cubes;

function main() {
	canvas = document.querySelector('#c')
	renderer = new THREE.WebGLRenderer({canvas});
	renderer.autoClearColor = false;

	const fov = 75;
	const aspect = 2;  // the canvas default
	const near = 0.1;
	const far = 5;
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.z = 2;

	controls = new OrbitControls( camera, canvas );
	// controls.enableDamping = true;
	// controls.enablePan = false;
	// controls.minDistance = 1.2;
	// controls.maxDistance = 4;
	// controls.update();

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');

	const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  const fragmentShader = `
  #include <common>

  uniform vec3 iResolution;
  uniform float iTime;
  uniform sampler2D iChannel0;

  // By Daedelus: https://www.shadertoy.com/user/Daedelus
  // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  #define TIMESCALE 0.25 
  #define TILES 8
  #define COLOR 0.7, 1.6, 2.8

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
    float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
    
    vec2 r = mod(uv * float(TILES), 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
    
    fragColor = vec4(COLOR, 1.0) * p;
  }

  varying vec2 vUv;

  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
  `;
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;

  const loader = new THREE.TextureLoader();
  const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3(1, 1, 1) },
    iChannel0: { value: texture },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  });
  function makeInstance(geometry, x) {
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;

    return cube;
  }

  cubes = [
    makeInstance(geometry,  0),
    makeInstance(geometry, -2),
    makeInstance(geometry,  2),
  ];

}


function render(time) {
	
	time = time * 0.001 // Convert to seconds
	uniforms.iTime.value = time;
	uniforms.iResolution.value.set(canvas.width, canvas.height, 1);

	cubes.forEach((cube, ndx) => {
    	const speed = 1 + ndx * .1;
    	const rot = time * speed;
    	cube.rotation.x = rot;
    	cube.rotation.y = rot;
    });

	renderer.render( scene, camera );
	controls.update();
	adjustCanvasSize();
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


// function map(value, istart, istop, ostart, ostop) {
// return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));


// const loader = new THREE.TextureLoader();
// const texture = loader.load(
// 	'https://threejsfundamentals.org/threejs/resources/images/world.jpg'
// );
// const geometry = new THREE.SphereBufferGeometry( 1, 64, 32 );
// const material = new THREE.MeshBasicMaterial({map: texture});
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);


// const fov = 60;
// const aspect = 2;
// const near = 0.1;
// const far = 10;
// camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
// camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );
// camera.position.z = 5;





// Shader utilizado
// By iq: https://www.shadertoy.com/user/iq  
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// const fragmentShader = `
// 	#include <common>

// 	uniform vec3 iResolution;
// 	uniform float iTime;

// 	void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
// 		// Normalized pixel coordinates (from 0 to 1)
// 		vec2 uv = fragCoord / iResolution.xy;

// 		// Time varying pixel color
// 		vec3 col = 0.5 + 0.5 * cos( iTime + uv.xyx + vec3(0,2,4));
// 		//vec3 col = 0.5 + 0.5 * cos( iTime + uv.xyx * 40.0 + vec3(0,2,4));
// 		// Output to screen
// 		fragColor = vec4( col, 1.0 );
// 	}


// PLANO CON TEXTURA PROCEDURAL
// camera = new THREE.OrthographicCamera(
// 		-1, // left
// 		 1, // right
// 		 1, // top
// 		-1, // bottom
// 		-1, // near
// 		 1, // far
// 	);
// const planeGeometry = new THREE.PlaneBufferGeometry(2, 2);
// 	const fragmentShader = `
// 	#include <common>

// 	uniform vec3 iResolution;
// 	uniform float iTime;
// 	uniform sampler2D iChannel0;

// 	#define TIMESCALE 0.25
// 	#define TILES 8
// 	#define COLOR 0.7, 1.6, 2.8

// 	void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
// 		vec2 uv = fragCoord.xy / iResolution.xy;
// 		uv.x *= iResolution.x / iResolution.y;

// 		vec4 noise = texture2D(iChannel0, floor( uv * float(TILES) ) / float(TILES) );
// 		float p = 1.0 - mod( noise.r + noise.b + iTime * float(TIMESCALE), 1.0 );
// 		p = min(max(p * 3.0 - 1.8, 0.1), 2.0);

// 		vec2 r = mod(uv * float(TILES), 1.0);
// 	    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
// 	    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
	    
// 	    fragColor = vec4(COLOR, 1.0) * p;
// 	}

// 	void main() {
// 		mainImage( gl_FragColor, gl_FragCoord.xy );
// 	}
// 	`;
// 	const loader = new THREE.TextureLoader();
// 	const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');
// 	texture.minFilter = THREE.NearestFilter;
// 	texture.magFilter = THREE.NearestFilter;
// 	texture.wrapS = THREE.RepeatWrapping;
// 	texture.wrapT = THREE.RepeatWrapping;
// 	uniforms = {
// 		iTime: { value: 0 },
// 		iResolution: { value: new THREE.Vector3() },
// 		iChannel0: { value: texture }
// 	};
// 	const planeMaterial = new THREE.ShaderMaterial({
// 		fragmentShader,
// 		uniforms
// 	});
// 	const mesh = new THREE.Mesh( planeGeometry, planeMaterial );
// 	scene.add(mesh);