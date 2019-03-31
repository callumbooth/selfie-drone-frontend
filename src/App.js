import React, { useState, useEffect, useContext } from "react";
import SettingsContext from './settings-context';
import ThreeModel from './threeCanvas';
import View from './view';
import socket from './socket';
import "./App.css";

const App = () => {

    const context = useContext(SettingsContext);

    const [droneState, setDroneState] = useState({
        pitch: 0,
        yaw: 0,
        roll: 0
    });

    useEffect(() => {
        socket.on("status", (status) => {
            console.log(status);
            context.setConnected(true);
        });
        
        socket.on('dronestate', (state) => {
            setDroneState(state);
        });

        socket.on('dronestream', (stream) => {
            console.log(stream);
        });
    }, []);

    // useEffect(() => {
    //     setInterval(() => {
    //         setDroneState(prevState => {
    //             return {
    //                 pitch: prevState.pitch + 1,
    //                 yaw: prevState.yaw,
    //                 roll: prevState.roll
    //             }
    //         })
    //     }, 16)
        
    // }, []);
    

    const battery = droneState ? droneState.bat : false;
    return (
        <React.Fragment>
            <View battery={battery} />
            <ThreeModel data={droneState}/>
        </React.Fragment>
    );

}

export default App;
