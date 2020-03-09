import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class LightLearn {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
  private readonly renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });

  constructor() {

    this.camera.position.set(0, 10, 20);

    {
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new THREE.Color('rgb(0,0,0)'));
    }

    {
    const controls = new OrbitControls( this.camera, this.renderer.domElement);
    controls.target.set(0, 5, 0);
    controls.update();
    }

    // const axesHelper = new THREE.AxesHelper(5);
    // this.scene.add(axesHelper);

    // ------------- MESHES ------------------------------------

    {
    const planeGeo = new THREE.PlaneBufferGeometry(40, 40);
    const planeMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color('rgb(100,0,0)'),
      side: THREE.DoubleSide
      });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI * -.5;
    this.scene.add(planeMesh);
    }

    {
    const cubeGeo = new THREE.BoxBufferGeometry(4,4,4);
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    cubeMesh.position.set(4 + 1, 4 / 2, 0);
    this.scene.add(cubeMesh);
    }

    {
    const sphereGeo = new THREE.SphereBufferGeometry(3, 32, 16);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    sphereMesh.position.set(-3 - 1, -3 + 8, 0);
    this.scene.add(sphereMesh);
    }

    // ------------- Lights ------------------------------------
    
    {
      const light = new THREE.PointLight(0xFFFFFF, 1);
      light.position.set(0, 10, 0);
      light.power = 20;
      light.decay = 0.2;
      light.distance = Infinity;
      this.scene.add(light);
      // const helper = new THREE.PointLightHelper(light);
      // this.scene.add(helper);
    }

    // {
    // const light = new THREE.AmbientLight(0xFFFFFF, 1);
    // this.scene.add(light);
    // }

    // {
    // const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    // light.position.set(0, 10, 0);
    // light.target.position.set(-5, 0, 0);
    // this.scene.add(light);
    // this.scene.add(light.target);
    // }

    // {
    // const light = new THREE.SpotLight(0xFFFFFF, 1);
    // light.position.set(0, 10, 0);
    // this.scene.add(light);
    // this.scene.add(light.target);
    // const helper = new THREE.SpotLightHelper(light);
    // this.scene.add(helper);
    // }
    

    this.render();
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());

    this.adjustCanvasSize();
    //this.brick.rotateY(0.03);
  }
}
