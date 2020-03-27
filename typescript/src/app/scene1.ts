import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Stats from 'three/examples/jsm/libs/stats.module';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
//import { DRACOLoader } from ''
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { Loader } from 'three';

export class Scene1 {
    private scene = new THREE.Scene();
    private camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 800);
    private renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
        antialias: true
    });

    private mixers: Array<THREE.AnimationMixer> = [];
    private clock = new THREE.Clock();

    constructor() {
        const rootPath = '../../node_modules/three/examples/';
        const container = document.querySelector('main-canvas');

        this.scene.background = new THREE.Color( 0x8FBCD4 );
        this.camera.position.set( -1.5, 1.5, 6.5 );
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.gammaFactor = 2.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;
        //old: this.renderer.setClearColor(new THREE.Color('rgb(0,0,0)'));

        const controls = new OrbitControls( this.camera, this.renderer.domElement);

        
        const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );
        const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
        mainLight.position.set( 10, 10, 10);
        this.scene.add(ambientLight);
        this.scene.add(mainLight);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('../../node_modules/three/examples/js/libs/draco/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        const onLoad = ( gltf: any, position: any) => {

            const model = gltf.scene.children[0];
            model.name = 'ferrari';
            model.position.copy( position );

            const mixer = new THREE.AnimationMixer(model);
            this.mixers.push(mixer);
            const animation = gltf.animations[0];
            const action = mixer.clipAction(animation);
            action.play();

            // const texture = new THREE.TextureLoader().load(
            //     rootPath + 'models/gltf/ferrari_ao.png'
            // );
            // const shadow = new THREE.Mesh(
            //     new THREE.PlaneBufferGeometry( 0.655 * 4, 1.3 * 4),
            //     new THREE.MeshBasicMaterial( {
            //         map: texture, opacity: 0.7, transparent: true
            //     } )
            // );
            // shadow.rotation.x = - Math.PI / 2;
            // shadow.renderOrder = 2;
            // model.add( shadow );

            model.scale.x = 0.03;
            model.scale.y = 0.03;
            model.scale.z = 0.03;

            this.scene.add(model);
        };

        const onProgress = () => {};
        const onError = ( errorMessage: any ) => { console.log(errorMessage); };

        const parrotPosition = new THREE.Vector3( 0, 0, 2.5 );
        loader.load(
            rootPath + 'models/gltf/parrot.glb',
            (gltf: any) => onLoad( gltf, parrotPosition ),
            onProgress,
            onError 
            );

        const flamingoPosition = new THREE.Vector3( 7.5, 0, -10 );
        loader.load(
            rootPath + 'models/gltf/flamingo.glb',
            (gltf: any) => onLoad( gltf, flamingoPosition ),
            onProgress,
            onError 
            );
        
        const storkPosition = new THREE.Vector3( 0, -2.5, -10 );
        loader.load(
            rootPath + 'models/gltf/stork.glb',
            (gltf: any) => onLoad( gltf, storkPosition ),
            onProgress,
            onError 
            );

      

        this.render();

        }
        // const cubeGeo = new THREE.BoxBufferGeometry(4,4,4);
        // const cubeMat = new THREE.MeshPhongMaterial({
        //     color: new THREE.Color('rgb(100,100,0)')
        // });
        // const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
        // cubeMesh.position.set(4 + 1, 4 / 2, 0);
        // this.scene.add(cubeMesh);

        // const planeGeo = new THREE.PlaneBufferGeometry(40, 40);
        // const planeMat = new THREE.MeshPhongMaterial({
        // color: new THREE.Color('rgb(0,100,100)'),
        // side: THREE.DoubleSide
        // });
        // const planeMesh = new THREE.Mesh(planeGeo, planeMat);
        // planeMesh.rotation.x = Math.PI * -.5;
        // this.scene.add(planeMesh);

        // const light = new THREE.AmbientLight(0xFFFFFF, 1);
        // light.castShadow = true;
        // this.scene.add(light);

    private update(): void {
        const delta = this.clock.getDelta();
        for ( const mixer of this.mixers ) {
            mixer.update( delta );
        }
    }

    private render(): void {
        this.renderer.render(this.scene, this.camera);

        this.adjustCanvasSize();

        requestAnimationFrame(() => {
            this.update();
            this.render();
        });
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }


}

    // ------------- Metodos auxiliares ----------------------
    // private initMaterials() {
    //     this.materialsLib = {
    //         main: [
    //             new THREE.MeshStandardMaterial( {
    //                 color: 0xff4400, metalness: 1.0, roughness: 0.2, name: 'orange'
    //             } ),
    //             new THREE.MeshStandardMaterial( {
    //                 color: 0x001166, metalness: 1.0, roughness: 0.2, name: 'blue'
    //             } ),
    //             new THREE.MeshStandardMaterial( {
    //                 color: 0x990000, metalness: 1.0, roughness: 0.2, name: 'red'
    //             } ),
    //             new THREE.MeshStandardMaterial( {
    //                 color: 0x000000, metalness: 1.0, roughness: 0.4, name: 'black'
    //             } ),
    //             new THREE.MeshStandardMaterial( {
    //                 color: 0xffffff, metalness: 0.1, roughness: 0.2, name: 'white'
    //             } ),
    //             new THREE.MeshStandardMaterial( {
    //                 color: 0xffffff, metalness: 1.0, roughness: 0.2, name: 'metallic'
    //             } )
    //         ],

    //         glass: [
    //             new THREE.MeshPhysicalMaterial( {
    //                 color: 0xffffff, metalness: 0, roughness: 0, transparent: true, name: 'clear'
    //             } ),
    //             new THREE.MeshPhysicalMaterial( {
    //                 color: 0x000000, metalness: 0, roughness: 0, transparent: true, name: 'smoked'
    //             } ),
    //             new THREE.MeshPhysicalMaterial( {
    //                 color: 0x001133, metalness: 0, roughness: 0, transparent: true, name: 'blue'
    //             } ) 
    //         ],
    //     };
    // }

    // private initMaterialSelectionMenus() {
    //         const addOption = ( name: any, menu: any) => {
    //             const option = document.createElement('option');
    //             option.text = name;
    //             option.value = name;
    //             menu.add( option );
    //         }
    //         this.materialsLib.main.forEach(
    //             ( material: any ) => {
    //                 addOption( material.name, bodyMatSelect );
    //             }
    //         );
    // }

    // const ferrariPath = '../../node_modules/three/examples/models/gltf/ferrari.glb';
    //     const carParts = {
    //         body: new Array(),
    //         rims: new Array(),
    //         glass: new Array()
    //     };
    //     const grid= [];
    //     const wheels = [];
    //     gltfLoader.load(
    //         ferrariPath,
    //         (gltf) => {
    //             const carModel = gltf.scene.children[0];
    //             const texture = new THREE.TextureLoader().load(rootPath+'models/gltf/ferrari_ao.png');
    //             const shadow = new THREE.Mesh(
    //                 new THREE.PlaneBufferGeometry( 0.655 * 4, 1.3 * 4 ),
    //                 new THREE.MeshBasicMaterial({
    //                     map: texture, opacity: 0.7, transparent: true
    //                 })
    //             );
    //             shadow.rotation.x = -Math.PI / 2;
    //             shadow.renderOrder = 2;
    //             carModel.add( shadow );

    //             this.scene.add(carModel);

    //             carParts.body.push( carModel.getObjectByName('body') );
    //             carParts.rims.push(
    //                 carModel.getObjectByName('rim_fl'),
    //                 carModel.getObjectByName('rim_fr'),
    //                 carModel.getObjectByName('rim_rr'),
    //                 carModel.getObjectByName('rim_rl'),
    //                 carModel.getObjectByName('trim'),
    //                 );
    //             carParts.glass.push(
    //                 carModel.getObjectByName('glass'),
    //             );

    //             wheels.push(
    //                 carModel.getObjectByName('wheel_fl'),
    //                 carModel.getObjectByName('wheel_fr'),
    //                 carModel.getObjectByName('wheel_rl'),
    //                 carModel.getObjectByName('wheel_rr')
    //             );

    //             // const bodyMat = this.materialsLib.main[ 0 ];
    //             // const rimMat = this.materialsLib.main[ 0 ];
    //             // const glassMat = this.materialsLib.main[ 0 ];

    //             // carParts.body.forEach( part => part.material = bodyMat );
    //             // carParts.rims.forEach( part => part.material = rimMat );
    //             // carParts.glass.forEach( part => part.material = glassMat );

    //         }
    //     );
















/*
------ Ayudas ------- 

 load textures: ../../node_modules/three/examples/textures

*/