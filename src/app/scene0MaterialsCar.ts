import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Scene0MaterialsCar {
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
        // const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
        // this.scene.add(ambientLight);
        const light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 0.5, 1, 1 ).normalize();
		this.scene.add( light );
    }

    private createOrbitControls(): void {
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set( -1.5, 1.5, 6.5 );
    }

    private createObjects3D(): void {
        this.createShit();
    }

    private createShit(): void {

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