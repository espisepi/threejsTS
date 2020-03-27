import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SpriteMaterial } from 'three';

export class Template {

    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    private renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
        antialias: true
    });
    private controls = new OrbitControls(this.camera, this.renderer.domElement);

    constructor() {

        //this.scene.background = new THREE.Color( 0xf1f1f1 );
        //this.scene.fog = new THREE.Fog( 0xf1f1f1, 20, 100);
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera.position.z = 5;
        this.camera.position.x = 0;

        this.createLights();
        this.createOrbitControls();
        this.createObjects3D();
        this.animate();

    }

    private createLights(): void {
        
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.61 );
        hemiLight.position.set( 0, 50, 0);
        this.scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 0.54 );
        dirLight.position.set( -8, 12, 8 );
        dirLight.castShadow = true;
        dirLight.shadow.mapSize = new THREE.Vector2( 1024, 1024 );
        this.scene.add( dirLight );

    }

    private createOrbitControls(): void {
        //const controls = new OrbitControls(this.camera, this.renderer.domElement);
        const controls = this.controls;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = Math.PI / 3;
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.dampingFactor = 0.1;
        controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
        controls.autoRotateSpeed = 0.2; // 30
    }

    private createObjects3D(): void {
        this.createFloor();
    }

    private createFloor(): void {
        
        const floorGeometry = new THREE.PlaneGeometry(
            5000,
            5000,
            1,
            1
        );
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: 0xeeeeee,
            shininess: 0
        });

        const floor = new THREE.Mesh( floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;
        floor.position.y = -1;
        this.scene.add( floor );

    }

    private animate(): void {

        this.controls.update();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.animate();
        });

        this.adjustCanvasSize();

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