import React, { useEffect, useRef } from 'react'
import JSMpeg from '@cycjimmy/jsmpeg-player';
import socket from './socket'
import './App.css'

const App = () => {
  const videoRef = useRef(null)

  useEffect(() => {
    var canvas = videoRef.current
    var url = 'ws://' + document.location.hostname + ':6768/stream'
    var player = new JSMpeg.Player(url, { canvas: canvas })
  }, [])

  useEffect(() => {
    socket.on('status', (status) => {
      console.log('status', status)
    })

    socket.on('dronestate', (state) => {
      console.log('state', state)
    })

    socket.emit('command', 'streamon')
  }, [])

  return (
    <>
      <div>video goes here</div>
      <canvas ref={videoRef} id='video-canvas'></canvas>
    </>
  )
}

export default App
