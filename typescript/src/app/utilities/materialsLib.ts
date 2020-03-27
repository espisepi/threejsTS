import * as THREE from 'three';

export class MaterialsLib {

    constructor(){}

    public leePerrySmith(): any {
        var shaderMaterial: THREE.ShaderMaterial;
        const material = new THREE.MeshNormalMaterial();
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
            shaderMaterial = new THREE.ShaderMaterial({
                uniforms: shader.uniforms,
                vertexShader: shader.vertexShader,
                fragmentShader: shader.fragmentShader
            });
        }
        return material;
        
        
    }
}