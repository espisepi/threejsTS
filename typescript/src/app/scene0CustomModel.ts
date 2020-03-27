import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SpriteMaterial } from 'three';

export class Scene0CustomModel {

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

    private chairModel: any;
    private activeOption = 'legs';
    private TRAY = document.getElementById('js-tray-slide');
    private colors = [
        {
            texture: 'assets/img/wood_.jpg',
            size: [2, 2, 2],
            shininess: 60
        },
        {
            texture: 'assets/img/fabric_.jpg',
            size: [4, 4, 4],
            shininess: 0
        },
        {
            texture: 'assets/img/pattern_.jpg',
            size: [8, 8, 8],
            shininess: 10
        },  
        {
            texture: 'assets/img/denim_.jpg',
            size: [3, 3, 3],
            shininess: 0
        },
        {
            texture: 'assets/img/quilt_.jpg',
            size: [6, 6, 6],
            shininess: 0 
        },  
        {
            color: '131417'
        },
        {
            color: '374047' },
          
          {
            color: '5f6e78' },
          
          {
            color: '7f8a93' },
          
          {
            color: '97a1a7' },
          
          {
            color: 'acb4b9' },
          
          {
            color: 'DF9998' },
          
          {
            color: '7C6862' },
          
          {
            color: 'A3AB84' },
          
          {
            color: 'D6CCB1' },
          
          {
            color: 'F8D5C4' },
          
          {
            color: 'A3AE99' },
          
          {
            color: 'EFF2F2' },
          
          {
            color: 'B0C5C1' },
          
          {
            color: '8B8C8C' },
          
          {
            color: '565F59' },
          
          {
            color: 'CB304A' },
          
          {
            color: 'FED7C8' },
          
          {
            color: 'C7BDBD' },
          
          {
            color: '3DCBBE' },
          
          {
            color: '264B4F' },
          
          {
            color: '389389' },
          
          {
            color: '85BEAE' },
          
          {
            color: 'F2DABA' },
          
          {
            color: 'F2A97F' },
          
          {
            color: 'D85F52' },
          
          {
            color: 'D92E37' },
          
          {
            color: 'FC9736' },
          
          {
            color: 'F7BD69' },
          
          {
            color: 'A4D09C' },
          
          {
            color: '4C8A67' },
          
          {
            color: '25608A' },
          
          {
            color: '75C8C6' },
          
          {
            color: 'F5E4B7' },
          
          {
            color: 'E69041' },
          
          {
            color: 'E56013' },
          
          {
            color: '11101D' },
          
          {
            color: '630609' },
          
          {
            color: 'C9240E' },
          
          {
            color: 'EC4B17' },
          
          {
            color: '281A1C' },
          
          {
            color: '4F556F' },
          
          {
            color: '64739B' },
          
          {
            color: 'CDBAC7' },
          
          {
            color: '946F43' },
          
          {
            color: '66533C' },
          
          {
            color: '173A2F' },
          
          {
            color: '153944' },
          
          {
            color: '27548D' },
          
          {
            color: '438AAC' }];


    private INITIAL_MTL = new THREE.MeshPhongMaterial({
        color: 0xf1f1f1,
        shininess: 10
    });
    private INITIAL_MAP = [
        { childID: "back", mtl: this.INITIAL_MTL },
        { childID: "base", mtl: this.INITIAL_MTL },
        { childID: "cushions", mtl: this.INITIAL_MTL },
        { childID: "legs", mtl: this.INITIAL_MTL },
        { childID: "supports", mtl: this.INITIAL_MTL },
    ];
    

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
        this.createGUI();
        this.createFloor();
    }

    private createModel(): void {

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( this.getPath('js/libs/draco/') );

        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        loader.load(
            'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb',
            ( gltf: any ) => {

                const theModel = gltf.scene;
                theModel.traverse(( o: any ) => {
                    o.castShadow = true;
                    o.receiveShadow = true;
                });
                theModel.scale.set( 2, 2, 2 );
                theModel.position.y = -1;
                theModel.rotation.y = Math.PI;

                for (let object of this.INITIAL_MAP) {
                    this.initColor(theModel, object.childID, object.mtl );
                }

                this.scene.add( theModel );
                this.chairModel = theModel;
                this.LOADER?.remove();

            },
            () => {},
            ( error ) => { console.log(error); }
        );

    }

    private initColor(parent: any, type: any, mtl: any): void {
        parent.traverse( ( o:any ) => {
            if ( o.isMesh ) {
                if ( o.name.includes(type) ) {
                    o.material = mtl;
                    o.nameID = type;
                }
            }
        });
    }

    private createGUI(): void {

        const buildColors = ( colors: any ) => {

            colors.forEach( ( element:any, index: any, array: any, thisArg: any ) => {

                let swatch = document.createElement( 'div' );
                swatch.classList.add( 'tray__swatch' );

                if ( element.texture ) {
                    swatch.style.backgroundImage = 'url(' + element.texture + ')' ;
                } else {
                    swatch.style.background = '#' + element.color;
                }

                swatch.setAttribute( 'data-key', index );
                this.TRAY?.append( swatch );

            });
        }
        buildColors(this.colors);

        // div con las opciones => addEventListener( 'click', selectOption);
        const options = document.querySelectorAll(".option");
        const selectOption = ( e:any ) => {
            let option = e.target;
            this.activeOption = e.target.dataset.option;
            options.forEach( ( element:any, index: any, array: any ) => {
                element.classList.remove('--is-active');
            });
            option.classList.add('--is-active');
        }
        options.forEach( ( element:any, index: any, array: any ) => {
            element.addEventListener( 'click', selectOption);
        });

        // div con el color => addEventListener( 'click', selectSwatch);
        const selectSwatch = (e:any) => {
            let color = this.colors[parseInt(e.target.dataset.key)];
            let new_mtl;

            if ( color.texture ) {

                let texture = new THREE.TextureLoader().load( color.texture );
                texture.repeat.set( color.size[0], color.size[1] );
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;

                new_mtl = new THREE.MeshPhongMaterial({
                    map: texture,
                    shininess: color.shininess ? color.shininess : 10
                });

            } else {

                new_mtl = new THREE.MeshPhongMaterial({
                    color: parseInt( '0x' + color.color ),
                    shininess: color.shininess ? color.shininess : 10
                });

            }

            this.setMaterial(this.chairModel, this.activeOption, new_mtl);

        }

        const swatches = document.querySelectorAll(".tray__swatch");
        swatches.forEach( ( element:any, index: any, array: any ) => {
            element.addEventListener( 'click', selectSwatch);
        });
        
    }

    private setMaterial( parent:any, type: any, newMaterial: any ): void {
        parent.traverse( ( o:any ) => {
            if ( o.isMesh && o.nameID != null ) {
                if ( o.nameID == type ) {
                    o.material = newMaterial;
                }
            }
        });
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

        if ( this.chairModel != null && this.loaded == false ) {
            this.initialRotation();
        }

    }

    private initialRotation(): void {
        this.initRotate++;
        if (this.initRotate <= 120 ) {
            this.chairModel.rotation.y += Math.PI / 60;
        } else {
            this.loaded = true;
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