import React from 'react';
import SettingsContext from './settings-context';
import socket from './socket';

const settings = {
    commands: [
        "takeoff",
        "land",
        "up",
        "down",
        "left",
        "right",
        "forward",
        "back",
        "cw",
        "ccw",
        "flip",
        "go",
        "curve",
    ],
    controls: [
        {
            name: "Forward",
            keycode: 87,
            label: "Forward",
            command: "forward",
            key: "w"
        },
        {
            name: "StrafeLeft",
            keycode: 65,
            label: "Strafe Left",
            command: "left",
            key: "a"
        },
        {
            name: "StrafeRight",
            keycode: 68,
            label: "Strafe Right",
            command: "right",
            key: "d"
            
        },
        {
            name: "Backward",
            keycode: 83,
            label: "Backward",
            command: "backward",
            key: "s"
        },
        {
            name: "RotateLeft",
            keycode: 37,
            label: "Rotate Left",
            command: "ccw",
            key: "&larr;"
        },
        {
            name: "RotateRight",
            keycode: 39,
            label: "Rotate Right",
            command: "cw",
            key: "&rarr"
        },
        {
            name: "Up",
            keycode: 38,
            label: "Up",
            command: "up",
            key: "&uarr"
        },
        {
            name: "Down",
            keycode: 40,
            label: "Down",
            command: "down",
            key: "&darr"
        },
        {
            name: "Land",
            keycode: 32,
            label: "Land",
            command: "land/takeoff",
            key: "Space"
        },
        {
            name: "TakeOff",
            keycode: 32,
            label: "Take Off",
            command: "land/takeoff",
            key: "Space"
        },
        {
            name: "StartRecording",
            keycode: 82,
            label: "Start Recording",
            command: "streamon/off",
            key: "R"
        },
        {
            name: "StopRecording",
            keycode: 82,
            label: "Stop Recording",
            command: "streamon/off",
            key: "R"
        },
        {
            name: "EmergancyStop",
            keycode: 69,
            label: "Emergancy Stop",
            command: "emergancy",
            key: "E"
        },
        {
            name: "Sprint",
            keycode: 16,
            label: "Sprint",
            key: "Shift"
        },
        {
            name: "Walk",
            keycode: 17,
            label: "Walk",
            key: "Control"
        },
        {
            name: "Settings",
            keycode: 27,
            label: "Settings",
            command: "TOGGLE_SETTINGS",
            key: "Escape"
        } 
    ],
    sensitivity: {
        a: 50,
        b: 50,
        c: 50,
        d: 50,
        sprint: 2,
        walk: 0.5
    },
    connected: false,

    sendCommand: (command) => {
        console.log('sending command: ' + command);
        socket.emit('command', command);
    },

    setConnected: (val) => {
        settings.connected = val;
    },

    updateControls: (controls) => {
        console.log("here");
        settings.controls = controls;
    }
}

const Provider = (props) => {
    return (
        <SettingsContext.Provider value={settings}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export default Provider;