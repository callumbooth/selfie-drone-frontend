const controlsSettings = {
    forward: 87,
    strafeLeft: 65,
    strafeRight: 68,
    backward: 83,
    turnLeft: 37,
    turnRight: 39,
    up: 38,
    down: 40,
    land: 32,
    takeOff: 32,
    recordOn: 82,
    recordOff: 82,
    emergency: 27,
    sprint: 16,
    walk: 17
}

export default ControlsContext = React.createContext(controlsSettings);
