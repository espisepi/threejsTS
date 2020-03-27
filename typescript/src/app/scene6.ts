import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Scene6 {
    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 800);
    private renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
        antialias: true
    });

    private shaderMaterial = new THREE.ShaderMaterial();

    constructor() {
        //this.scene.background = new THREE.Color( 0xFF0000 );
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
        this.customAttributesExample();
        this.createShit();
        this.loadLeePerrySmith();
    }

    private customAttributesExample(): void {

        const vertexShader = `
            uniform float amplitude;

			attribute float displacement;

			varying vec3 vNormal;
			varying vec2 vUv;

			void main() {

				vNormal = normal;
				vUv = ( 0.5 + amplitude ) * uv + vec2( amplitude );

				vec3 newPosition = position + amplitude * normal * vec3( displacement );
				gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

			}
        `;

        const fragmentShader = `
            varying vec3 vNormal;
			varying vec2 vUv;

			uniform vec3 color;
			uniform sampler2D colorTexture;

			void main() {

				vec3 light = vec3( 0.5, 0.2, 1.0 );
				light = normalize( light );

				float dProd = dot( vNormal, light ) * 0.5 + 0.5;

				vec4 tcolor = texture2D( colorTexture, vUv );
				vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );

				gl_FragColor = gray * vec4( vec3( dProd ) * vec3( color ), 1.0 );

			}
        `;

        const uniforms = {
            "amplitude": { value: 1.0 },
            "color": { value: new THREE.Color( 0xff2200 ) },
            "colorTexture": { value: new THREE.TextureLoader()
                .load( this.getPath("textures/water.jpg") ) }
        };
        uniforms[ "colorTexture" ].value.wrapS = uniforms[ "colorTexture" ].value.wrapT = THREE.RepeatWrapping;

        const shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        } );

        const radius = 50, segments = 128, rings = 64;
        const geometry = new THREE.SphereBufferGeometry( radius, segments, rings );
        const displacement = new Float32Array( geometry.attributes.position.count );
        const noise = new Float32Array( geometry.attributes.position.count );
        for( let i = 0; i < displacement.length; i++) {
            noise[ i ] = Math.random() * 5;
        }
        geometry.setAttribute(
            'displacement',
            new THREE.BufferAttribute( displacement, 1) );
        const sphere = new THREE.Mesh( geometry, shaderMaterial );
        sphere.name = 'sphere';
        sphere.onBeforeRender = () => {
            let time = Date.now() * 0.01;
            sphere.rotation.y = sphere.rotation.z = 0.01 * time;

            uniforms[ "amplitude" ].value = 2.5 * Math.sin( sphere.rotation.y * 0.125 );
            uniforms[ "color" ].value.offsetHSL( 0.0005, 0, 0 );

            for( let i = 0; i < displacement.length; i++ ) {
                displacement[ i ] = Math.sin( 0.1 * i + time );
                noise[ i ] += 0.5 * ( 0.5 - Math.random() );
                noise[ i ] = THREE.MathUtils.clamp( noise[i], - 5, 5 );
                displacement[ i ] += noise[ i ];
            }
        }
        this.scene.add( sphere );
    }

    private createShit(): void {

        // const shaderLib = THREE.ShaderLib;

        // const pointShader = shaderLib.points;
        // //console.log(pointShader);

        // const cuboMaterial = new THREE.ShaderMaterial({
        //     uniforms: pointShader.uniforms,
        //     vertexShader: pointShader.vertexShader,
        //     fragmentShader: pointShader.fragmentShader
        // });
        // cuboMaterial.uniforms.scale.value = 5;

        // console.log(cuboMaterial);

        const cubo = new THREE.Mesh(
            new THREE.BoxBufferGeometry( 5, 5 ),
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
        );
        this.scene.add(cubo);

        const plano = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 5, 5 ),
            new THREE.MeshBasicMaterial({
                color: 0xffff00
            })
        );
        plano.rotation.x = -Math.PI / 2;
        plano.position.y = -5;
        plano.renderOrder = 2;
        this.scene.add( plano );
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
        
        requestAnimationFrame(() => {
            this.update();
            this.render();
        });
    }

    private update(): void {
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