import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Scene5 {
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
        this.createShit();
        this.loadLeePerrySmith();
    }

    private createShit(): void {
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

        const cubo = new THREE.Mesh(
            new THREE.BoxBufferGeometry( 5, 5 ),
            new THREE.MeshBasicMaterial({ color: 0xFF0000 })
        );
        this.scene.add(cubo);
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
        //this.materialLeePerrySmith.uniforms.time.value = performance.now() / 1000;
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