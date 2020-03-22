import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SpriteMaterial } from 'three';

export class Scene0CustomModelDynamic {

    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    private renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
        antialias: true
    });
    private controls = new OrbitControls(this.camera, this.renderer.domElement);

    private LOADER = document.getElementById('js-loader');
    private loaded = false;
    private initRotate = 0;

    private TRAY = document.getElementById('js-tray-slide');
    private mixer!: THREE.AnimationMixer;
    private clock = new THREE.Clock();
    

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
        this.createModel();
        this.createFloor();
    }

    private createModel(): void {

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( this.getPath('js/libs/draco/') );

        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        loader.load(
            'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb',
            ( gltf: any ) => {
  
                const stacy_texture = new THREE.TextureLoader().load(
                  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy.jpg'
                );
                stacy_texture.flipY = false;
                const stacy_material = new THREE.MeshPhongMaterial({
                  map: stacy_texture,
                  color: 0xffffff,
                  skinning: true
                });

                const theModel = gltf.scene;
                theModel.traverse(( o: any ) => {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.material = stacy_material;
                });
                theModel.scale.set( 2, 2, 2 );
                theModel.position.y = -1;
                theModel.rotation.y = Math.PI;

                this.mixer = new THREE.AnimationMixer( theModel );
                const clips = gltf.animations;
                console.log(clips);
                const clip = THREE.AnimationClip.findByName( clips, 'jump');
                const action = this.mixer.clipAction( clip );
                action.play();

                // clips.forEach((clip:any) => {
                //   this.mixer.clipAction( clip ).play();
                // });

                this.scene.add( theModel );
                this.LOADER?.remove();

            },
            () => {},
            ( error ) => { console.log(error); }
        );

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

        if (this.mixer) {
          this.mixer.update(this.clock.getDelta());
        }

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