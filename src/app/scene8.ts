import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { random } from 'lodash';

export class Scene8 {
    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 800);
    private renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
        antialias: true
    });

    private shaderMaterial = new THREE.ShaderMaterial();

    private texture: any;
    private width: any;
    private height: any;
    private numPoints: any;

    private planoMesh!: THREE.Mesh;
    private clock = new THREE.Clock();

    constructor() {
        //this.scene.background = new THREE.Color( 0xFF0000 );
        // this.renderer.setClearColor(0xffffff, 1);
        this.createLights();
        this.createOrbitControls();
        this.createObjects3D();
        this.render();
    }

    private createLights(): void {
        const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
        this.scene.add(ambientLight);
    }

    private createOrbitControls(): void {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set( -1.5, 1.5, 6.5 );
    }

    private createObjects3D(): void {
        //this.createWavePlane();
        this.createPP();
    }

    private createPP(): void {
        const elements = new THREE.Group();
        const NUM_ELEMENTS = 50;
        for( let i = 0; i < NUM_ELEMENTS; i++) {
            const geometry = new THREE.IcosahedronGeometry(random(0.1, 0.5));
            this.camera.updateProjectionMatrix();
            this.camera.updateMatrixWorld();
            this.camera.updateWorldMatrix(true,true);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    texture: { value: new THREE.TextureLoader().load('../../assets/img/charles-unsplash.jpg') },
                    color: { value: new THREE.Color(0xffffff)},
                    viewMatrixCamera:{ type: 'm4', value: this.camera.matrixWorldInverse.clone()},
                    projectionMatrixCamera: { type: 'm4', value: this.camera.projectionMatrix.clone() },
                    modelMatrixCamera: { type: 'mat4', value: this.camera.matrixWorld.clone() },
                    savedModelMatrix:{ type: 'mat4', value: new THREE.Matrix4() },
                    projPosition: { type: 'v3', value: this.camera.position.clone() }
                },
                vertexShader: `
                    uniform mat4 savedModelMatrix;
                    uniform mat4 viewMatrixCamera;
                    uniform mat4 projectionMatrixCamera;
                    uniform mat4 modelMatrixCamera;
        
                    varying vec4 vWorldPosition;
                    varying vec3 vNormal;
                    varying vec4 vTexCoords;
        
        
                    void main() {
                    vNormal = mat3(savedModelMatrix) * normal;
                    vWorldPosition = savedModelMatrix * vec4(position, 1.0);
                    vTexCoords = projectionMatrixCamera * viewMatrixCamera * vWorldPosition;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform sampler2D texture;
                    uniform vec3 projPosition;

                    varying vec3 vNormal;
                    varying vec4 vWorldPosition;
                    varying vec4 vTexCoords;
                    
                    void main() {
                    vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;

                    vec4 outColor = texture2D(texture, uv);

                    // this makes sure we don't render also the back of the object
                    vec3 projectorDirection = normalize(projPosition - vWorldPosition.xyz);
                    float dotProduct = dot(vNormal, projectorDirection);
                    if (dotProduct < 0.0) {
                        outColor = vec4(color, 1.0);
                        //outColor = vec4(1.,0.,1.,1.);
                    }

                    gl_FragColor = outColor;
                    //gl_FragColor = vec4(1.,0.,1.,1.);
                    }
                `
            });
            const materialTest = new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
            const element = new THREE.Mesh(geometry, material);
            if( i < NUM_ELEMENTS * 0.4) {
                element.position.x = random( -0.7, 0.7 );
                element.position.y = random( -1.3, 0.5 );
                element.position.z = random( -0.3, 0.3 );
                element.scale.multiplyScalar(1.4);
            } else {
                element.position.x = random( -1.5, 1.5, true );
                element.position.y = random( -2, 2, true );
                element.position.z = random( -0.5, 0.5 );
            }
            element.rotation.x = random(0, Math.PI * 2);
            element.rotation.y = random(0, Math.PI * 2);
            element.rotation.z = random(0, Math.PI * 2);

            this.project(element);
            elements.add( element );
        }
        this.scene.add(elements);
    }

    private project(mesh: THREE.Mesh): void {
        mesh.updateMatrixWorld();
        (mesh.material as THREE.ShaderMaterial).uniforms.savedModelMatrix.value.copy(mesh.matrixWorld);
    }

    private createWavePlane(): void {
        const geometry = new THREE.PlaneGeometry( 0.4, 0.6, 256, 256 );
        const vertexShader = this.createVertexShader();
        const fragmentShader = this.createFragmentShader();
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0.0 },
                uTexture: { value: new THREE.TextureLoader().load('../../assets/img/peakyBlinderAguirolo.png') }
            },
            wireframe: true,
            side: THREE.DoubleSide
        });
        this.planoMesh = new THREE.Mesh(geometry,material);
        this.scene.add(this.planoMesh);
    }

    private createVertexShader(): string {
        return `
        precision mediump float;

        varying vec2 vUv;
        uniform float uTime;
        varying float vWave;

        //
        // Description : Array and textureless GLSL 2D/3D/4D simplex
        //               noise functions.
        //      Author : Ian McEwan, Ashima Arts.
        //  Maintainer : ijm
        //     Lastmod : 20110822 (ijm)
        //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
        //               Distributed under the MIT License. See LICENSE file.
        //               https://github.com/ashima/webgl-noise
        //

        vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
        return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
        
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
        
        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                
        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        
        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
        vUv = uv;

        vec3 pos = position;
        float noiseFreq = 3.5;
        float noiseAmp = 0.15; 
        vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
        pos.z += snoise(noisePos) * noiseAmp;
        vWave = pos.z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

        // Eliminar el efecto de wave
        // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }
        `;
    }

    private createFragmentShader(): string {
        return `
        precision mediump float;

        varying vec2 vUv;
        varying float vWave;
        uniform sampler2D uTexture;

        void main() {
            float wave = vWave * 0.2;

            float r = texture2D(uTexture, vUv).r;
            float g = texture2D(uTexture, vUv).g;
            float b = texture2D(uTexture, vUv ).b;
            vec3 texture = vec3(r, g, b);

            gl_FragColor = vec4(texture, 1.);

            // Eliminar el efecto wave en la textura
            // vec3 texture = texture2D(uTexture, vUv).rgb;
            // Efecto wave para rgb
            // vec3 texture = texture2D(uTexture, vUv + wave).rgb;
        }
        `;
    }

    private loadLeePerrySmith(): void {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( this.getPath('js/libs/draco/') );
        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        const createMaterialLeePerrySmith = () => {
            const material = new THREE.MeshNormalMaterial();
            let shaderRes;
            material.onBeforeCompile = ( shader ) => {
                shader.uniforms.time = { value: 0 };
                shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <begin_vertex>',
                    [
                        'float theta = sin( time + position.y ) / 2.0;',
                        'float c = cos( theta );',
                        'float s = sin( theta );',
                        'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
                        'vec3 transformed = vec3( position ) * m;',
                        'vNormal = vNormal * m;'
                    ].join('\n')
                );
                this.shaderMaterial = new THREE.ShaderMaterial({
                    uniforms: shader.uniforms,
                    vertexShader: shader.vertexShader,
                    fragmentShader: shader.fragmentShader
                });
                //console.log(this.shaderMaterial.uniforms.time.value);
            }
            return material;    
        }
        const onProgress = () => {};
        const onError = ( errorMessage: any ) => { console.log( errorMessage ); };


        loader.load(
            this.getPath('models/gltf/LeePerrySmith/LeePerrySmith.glb'),
            ( gltf: any ) => {

                const mesh = new THREE.Mesh(
                    gltf.scene.children[ 0 ].geometry,
                    createMaterialLeePerrySmith()
                );

                mesh.onBeforeRender = ( renderer, scene, camera, geometry, material, group ) => {
                    if(this.shaderMaterial.uniforms.time !== undefined ){
                        this.shaderMaterial.uniforms.time.value = performance.now() / 1000;
                    }
                }
                
                this.scene.add( mesh );
            },
            onProgress,
            onError
        );
        //( gltf: any ) => onLoad( gltf )
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);
        this.adjustCanvasSize();
        this.update();
        
        requestAnimationFrame(() => {
            this.render();
        });
    }

    private update(): void {
        // const tiempoTranscurrido: number = this.clock.getElapsedTime();
        // (this.planoMesh.material as THREE.ShaderMaterial)
        // .uniforms.uTime.value = tiempoTranscurrido;
        // console.log();
    }

    private adjustCanvasSize(): void {
        this.renderer.setSize( innerWidth, innerHeight );
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    // ---------------- Metodos de ayuda -----------------------
    private getPath(path: string): string {
        const rootPath = '../../node_modules/three/examples/';
        return rootPath + path;
    }

}