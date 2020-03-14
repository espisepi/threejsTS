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

    private chairModel: any;
    private TRAY = document.getElementById('js-tray-slide');
    private colors = [
        {
            texture: 'assets/img/wood_.jpg',
            size: [2, 2, 2],
            shininess: 60
        },
        {
            color: '131417'
        }
    ];
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
        const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.z = 5;
        this.camera.position.x = 0;
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

            },
            () => {},
            ( error ) => { console.log(error); }
        );

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

            this.setMaterial(this.chairModel, 'legs', new_mtl);

        }

        const swatches = document.querySelectorAll(".tray__swatch");
        swatches.forEach( ( element:any, index: any, array: any ) => {
            element.addEventListener( 'click', selectSwatch);
        });
        
    }

    private selectWatch( e:any ): void {
        
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
            color: 0xff0000,
            shininess: 0
        });

        const floor = new THREE.Mesh( floorGeometry, floorMaterial);
        floor.rotation.x = -0.5 * Math.PI;
        floor.receiveShadow = true;
        floor.position.y = -1;
        this.scene.add( floor );

    }

    private animate(): void {

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

}