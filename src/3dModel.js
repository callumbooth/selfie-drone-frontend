import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeModel = (props) => {
    console.log(props.data);
    const mount = useRef(null)
    
    useEffect(() => {
      let width = mount.current.clientWidth
      let height = mount.current.clientHeight
      let frameId
  
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
      const cube = new THREE.Mesh(geometry, material)
  
      camera.position.z = 3;

      scene.add(cube)
      renderer.setClearColor('#000000')
      renderer.setSize(width, height)
  
      const renderScene = () => {
        renderer.render(scene, camera)
      }
  
      const handleResize = () => {
        width = mount.current.clientWidth
        height = mount.current.clientHeight
        renderer.setSize(width, height)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderScene()
      }
      
      const animate = () => {
        cube.rotation.x = props.data.x
        cube.rotation.y = props.data.y
  
        renderScene()
        frameId = window.requestAnimationFrame(animate)
      }
  
      const start = () => {
        if (!frameId) {
          frameId = requestAnimationFrame(animate)
        }
      }
  
      const stop = () => {
        cancelAnimationFrame(frameId)
        frameId = null
      }
  
      mount.current.appendChild(renderer.domElement)
      window.addEventListener('resize', handleResize)
      start()
      
      return () => {
        stop()
        window.removeEventListener('resize', handleResize)
        mount.current.removeChild(renderer.domElement)
  
        scene.remove(cube)
        geometry.dispose()
        material.dispose()
      }
    }, [props])
    
    return <div className="3dModel" style={{width: "400px", height: "400px"}} ref={mount} />
  }
  
  export default ThreeModel;