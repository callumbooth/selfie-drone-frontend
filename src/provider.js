import React from 'react';
import SettingsContext from './settings-context';

const settings = {
    controls: [
        {
            keycode: 87,
            label: "Forward",
            command: "forward"
        },
        {
            keycode: 65,
            label: "Strafe Left",
            command: "left"
        },
        {
            keycode: 68,
            label: "Strafe Right",
            command: "right"
        },
        {
            keycode: 83,
            label: "Backward",
            command: "backward"
        },
        {
            keycode: 37,
            label: "Rotate left",
            command: "ccw"
        },
        {
            keycode: 39,
            label: "Rotate right",
            command: "cw"
        },
        {
            keycode: 38,
            label: "Up",
            command: "up"
        },
        {
            keycode: 40,
            label: "Down",
            command: "down"
        },
        {
            keycode: 32,
            label: "Land",
            command: "land/takeoff"
        },
        {
            keycode: 32,
            label: "Take Off",
            command: "land/takeoff"
        },
        {
            keycode: 82,
            label: "Start Recording",
            command: "streamon/off"
        },
        {
            keycode: 82,
            label: "Stop Recording",
            command: "streamon/off"
        },
        {
            keycode: 69,
            label: "Emergancy Stop",
            command: "emergancy"
        },
        {
            keycode: 16,
            label: "Sprint",
        },
        {
            keycode: 17,
            label: "Walk"
        },
        {
            keycode: 27,
            label: "Settings",
            command: "TOGGLE_SETTINGS"
        } 
    ],
    sensitivity: {
        default: {
            a: 50,
            b: 50,
            c: 50,
            d: 50,
            sprint: 2,
            walk: 0.5
        }
    },
}

const Provider = (props) => {
    return (
        <SettingsContext.Provider value={settings}>
            {props.children}
        </SettingsContext.Provider>
    )
}

export default Provider;