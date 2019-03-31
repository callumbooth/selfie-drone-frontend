import React, { useEffect, useRef } from "react";
import * as THREE from "three";


const ThreeCanvas = (props) => {
    const mount = useRef(null);
    useEffect(() => {
        let width = mount.current.clientWidth;
        let height = mount.current.clientHeight;
        let frameId;

        //RENDERER
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(0xffffff);
        renderer.setSize(width, height);

        //CAMERA
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 3000);

        //SCENE
        const scene = new THREE.Scene();

        //LIGHTS
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);
        
        const light1 = new THREE.PointLight(0xffffff, 0.5);
        scene.add(light1);

        //OBJECT
        // let material = new THREE.LineBasicMaterial({color: 0xff0000});
        // let geometry = new THREE.Geometry();
        // geometry.vertices.push(new THREE.Vector3( -20, 0, 0) );
        // geometry.vertices.push(new THREE.Vector3( 0, 20, 0) );
        // geometry.vertices.push(new THREE.Vector3( 20, 0, 0) );

        // const line = new THREE.Line(geometry, material);
        // line.position.set(0, 0, -500);

        // scene.add(line);

        //OBJECT
        let geometry = new THREE.CubeGeometry(200, 50, 150);
        let material = new THREE.MeshLambertMaterial({color: 0xeeeeeee});
        const droneModel = new THREE.Mesh(geometry, material);
        droneModel.position.set(0, 0, -500);

        scene.add(droneModel);

        const renderScene = () => {
            //controls.update();
            renderer.render(scene, camera);
        };

        const handleResize = () => {
            width = mount.current.clientWidth;
            height = mount.current.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderScene();
        };

        const animate = () => {

            renderScene();
            frameId = window.requestAnimationFrame(animate);
        };

        const start = () => {
            if (!frameId) {
                frameId = requestAnimationFrame(animate);
            }
        };

        const stop = () => {
            cancelAnimationFrame(frameId);
            frameId = null;
        };

        mount.current.appendChild(renderer.domElement);
        window.addEventListener("resize", handleResize);
        start();

        return () => {
            stop();
            window.removeEventListener("resize", handleResize);
            mount.current.removeChild(renderer.domElement);

            scene.remove(droneModel);
            geometry.dispose();
            material.dispose();
        };
    }, [props.data]);
    return (
        <div
            className="threeCanvas"
            style={{ width: "400px", height: "300px" }}
            ref={mount}
        />
    );
};

export default ThreeCanvas;
