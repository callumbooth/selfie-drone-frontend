import React, { useState, useEffect, useContext } from "react";
import io from 'socket.io-client';
import SettingsContext from './settings-context';
import Settings from './settings';

const socket = io('http://localhost:6767');

const View = () => {

    const context = useContext(SettingsContext);
    const [state, setState] = useState({
        showSettings: false,
        mouse: {
            x: 0,
            y: 0
        },
        streamon: false,
        connected: false,
        commands: [],
        inAir: false
    });

    const [droneState, setDroneState] = useState(null)
    console.log(state);
    useEffect(() => {
        if (state.commands) {
            createCommand();
        }
        
    }, [state.commands])

    const handleKeyDown = (e) => {
        e.preventDefault();

        let command = getCommandFromKeycode(e.keyCode);

        if (!command) {
            return false;
        }
        
        if (!e.repeat) {
            if (command === "TOGGLE_SETTINGS") {
                toggleSettings();
            } else {
                setState(prevState => {
                    return {commands: [...prevState.commands, command]}
                });
            }
        }
    }

    const handleKeyUp = (e) => {
        e.preventDefault();

        let command = getCommandFromKeycode(e.keyCode);
        
        if (!command || command === "TOGGLE_SETTINGS") {
            return;
        }
        
        let cmdIndex = state.commands.indexOf(command);

        if (command) {
            setState(prevState => {
                return {
                    commands: [...prevState.commands.slice(0, cmdIndex), ...prevState.commands.slice(cmdIndex + 1)]
                }
            });
        }
    }

    const toggleSettings = () => {
        setState(prevState => ({
            ...prevState,
            showSettings: !prevState.showSettings
        }));
    }

    const getCommandFromKeycode = (keycode) => {

        const { controls } = context;

        const setting = controls.filter((control) => {
            if(control.keycode === keycode) {
                return control;
            } else {
                return false;
            }
        });

        if (setting.length === 0 || !setting[0].command) {
            return false;
        }

        return setting[0].command;
    }

    const addSpeedModifier = (speed) => {
        const {commands} = state;
        const {sensitivity} = context;

        if (commands.indexOf("shift") !== -1) {
            speed = speed * sensitivity.sprint;
            if (speed > 100) {
                speed = 100;
            }
        } else if (commands.indexOf("ctrl") !== -1) {
            speed = speed * sensitivity.walk;
        }

        return speed;
    }

    const createCommand = () => {
        const {commands} = state;

        if (commands.indexOf("emergency") !== -1) {
            context.sendCommand("emergancy");
        } else if (commands.indexOf("land/takeoff") !== -1) {
            if (state.inAir) {
                context.sendCommand("land");
            } else {
                context.sendCommand("takeoff");
            }
            
            socket.once('status', (status) => {
                console.log(status);
                if (status === "ok") {
                    setState(prevState => {
                        return {inAir: !prevState.inAir}
                    });
                }
            });
            
        } else if(commands.indexOf("streamon/off") !== -1) {
            if (state.streamon) {
                context.sendCommand("streamoff");
            } else {
                context.sendCommand("streamon");
            }
            
            socket.once('status', (status) => {
                if (status === "ok") {
                    setState(prevState => {
                        return {streamon: !prevState.streamon}
                    });
                }
            })
            
        } else if(commands.length !== 0) {
            let isRc = false;
            let a = 0;
            let b = 0;
            let c = 0;
            let d = 0;
            const sensitivity = context.sensitivity;
            if (commands.indexOf("right") !== -1) {
                a = a + sensitivity.a;
                a = addSpeedModifier(a);
                isRc = true;
            }
            if (commands.indexOf("left") !== -1) {
                a = a - sensitivity.a;
                a = addSpeedModifier(a);
                isRc = true;
            }
            if (commands.indexOf("forward") !== -1) {
                b = b + sensitivity.b;
                b = addSpeedModifier(b);
                isRc = true;
            }
            if (commands.indexOf("backward") !== -1) {
                b = b - sensitivity.b;
                b = addSpeedModifier(b);
                isRc = true;
            }
            if (commands.indexOf("up") !== -1) {
                c = c + sensitivity.c;
                c = addSpeedModifier(c);
                isRc = true;
            }
            if (commands.indexOf("down") !== -1) {
                c = c - sensitivity.c;
                c = addSpeedModifier(c);
                isRc = true;
            }
            if (commands.indexOf("cw") !== -1) {
                d = d + sensitivity.d;
                d = addSpeedModifier(d);
                isRc = true;
            }
            if (commands.indexOf("ccw") !== -1) {
                d = d - sensitivity.d;
                d = addSpeedModifier(d);
                isRc = true;
            }

            if (isRc) {
                let rcCommand = `rc ${a} ${b} ${c} ${d}`;
                context.sendCommand(rcCommand);
            }
        } else {
            context.sendCommand("rc 0 0 0 0");
        }
    }

    // const handleMouseMove = (e) => {
    //     if (state.mouse.x > e.screenX) {
    //         console.log("left");
    //     } else {
    //         console.log("right");
    //     }

    //     if (state.mouse.y > e.screenY) {
    //         console.log('up');
    //     } else {
    //         console.log('down');
    //     }

    //     setState({
    //         mouse: {
    //             x: e.screenX,
    //             y: e.screenY
    //         }
    //     })
    // }

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

    
    console.log(state.commands);
    const {showSettings} = state;
    return (
        <React.Fragment>
            {showSettings ?  <Settings /> : null}
            <div className="App" tabIndex={-1} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                <header className="App-header">
                    Drone front end
                </header>
                <div className="connected">
                    {state.connected ? 'Connected' :  'Disconnected'}
                </div>
                <div className="droneState">
                    {droneState ? droneState.bat : ''}
                </div>
                
                <div className="enterManualMode"  /*onMouseMove={this.handleMouseMove}*/>
                    Click me to enter flight mode
                </div>
                <div className="droneControls">
                    <button onClick={() => context.sendCommand("battery?")}>Check battery</button>
                </div>
            </div>
        </React.Fragment>
    );

}

export default View;
