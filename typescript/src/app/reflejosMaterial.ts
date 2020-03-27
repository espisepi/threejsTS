import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class ReflejosMaterial {
    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
    private renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
        antialias: true
    });

    constructor() {

        this.camera.position.set(0, 10, 20);

        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new THREE.Color('rgb(0,0,0)'));

        const cubeGeo = new THREE.BoxBufferGeometry(8,8,8);
        const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
        const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
        cubeMesh.position.set(4 + 1, 4 / 2, 0);
        this.scene.add(cubeMesh);

        const planeGeo = new THREE.PlaneBufferGeometry(40, 40);
        const planeMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color('rgb(100,0,0)'),
        side: THREE.DoubleSide
        });
        const planeMesh = new THREE.Mesh(planeGeo, planeMat);
        planeMesh.rotation.x = Math.PI * -.5;
        this.scene.add(planeMesh);

        const light = new THREE.AmbientLight(0xFFFFFF, 1);
        light.castShadow = true;
        this.scene.add(light);

        const controls = new OrbitControls( this.camera, this.renderer.domElement);
        controls.target.set(0, 5, 0);
        controls.update();

        this.render();
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);

        this.adjustCanvasSize();
        this.updateAnimation();

        requestAnimationFrame(() => this.render());
    }

    private updateAnimation(): void {
        // Aqui se actualizan las variables para cada frame
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

}