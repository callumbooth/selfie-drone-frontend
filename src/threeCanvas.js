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
        // var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 3000);

        //SCENE
        const scene = new THREE.Scene();

        //LIGHTS
        const light = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(light);
        
        const light1 = new THREE.PointLight(0xffffff, 0.5);
        scene.add(light1);

        //OBJECT
        let geometry = new THREE.CubeGeometry(200, 50, 150);
        let material = new THREE.MeshLambertMaterial({color: 0xeeeeeee});
        const droneModel = new THREE.Mesh(geometry, material);
        droneModel.position.set(0, 0, -500);

        scene.add(droneModel);

        const renderScene = () => {
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

        const angleToRadians = (angle) => {
            return angle * (Math.PI / 180); 
        }

        const animate = () => {
            droneModel.rotation.x = angleToRadians(props.data.pitch)
            droneModel.rotation.y = angleToRadians(props.data.yaw) * -1;
            droneModel.rotation.z = angleToRadians(props.data.roll);

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
