import React from 'react';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default function Gltf() {

  return <group ref={group => {
    if(group && !group.children.length && !group._loader) {
      group._loader = new GLTFLoader();
      group._loader.load(
        // resource URL
        '/raw/3D/scene.gltf',
        // called when the resource is loaded
        function ( gltf ) {

          gltf.scene.scale.set(10,10,10);
          group.add( gltf.scene );
          delete group._loader;

          gltf.animations; // Array<THREE.AnimationClip>
          gltf.scene; // THREE.Group
          gltf.scenes; // Array<THREE.Group>
          gltf.cameras; // Array<THREE.Camera>
          gltf.asset; // Object

        },
        // called while loading is progressing
        function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {

          console.log( 'An error happened' );

        }
      );
    }
  }} />;


}
