import React, { useState, useEffect, useContext } from "react";
import io from 'socket.io-client';
import SettingsContext from './settings-context';
import Settings from './settings';
import ThreeModel from './3dModel';
import View from './view';
import "./App.css";

const socket = io('http://localhost:6767');

const App = () => {

    const context = useContext(SettingsContext);

    const [droneState, setDroneState] = useState(null)

    useEffect(() => {
        socket.on("status", (status) => {
            console.log(status);
            setState({
                connected: true
            });
        });
        
        socket.on('dronestate', (state) => {
            setDroneState(null);
        });

        socket.on('dronestream', (stream) => {
            console.log(stream);
        });
    }, []);

    return (
        <React.Fragment>
            <View />
            <ThreeModel data={droneState}/>
        </React.Fragment>
    );

}

export default App;
