import React, { useState, useEffect, useContext } from "react";
import SettingsContext from './settings-context';
import ThreeModel from './3dModel';
import View from './view';
import socket from './socket';
import "./App.css";

const App = () => {

    const context = useContext(SettingsContext);

    const [droneState, setDroneState] = useState(null)

    useEffect(() => {
        socket.on("status", (status) => {
            console.log(status);
            context.setConnected(true);
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
            <View  />
            <ThreeModel data={droneState}/>
        </React.Fragment>
    );

}

export default App;
