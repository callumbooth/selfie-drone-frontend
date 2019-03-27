import React, { Component } from "react";
import io from 'socket.io-client';
import SettingsContext from './settings-context';
import Settings from './settings';
import "./App.css";

const socket = io('http://localhost:6767');

class App extends Component {
    constructor() {
        super();
        this.state = {
            showSettings: false,
            sensitivityLayout: "default",
            mouse: {
                x: 0,
                y: 0
            },
            streamon: false,
            connected: false,
            droneData: null,
            commands: [],
            inAir: false
        }
    }
    handleKeyDown = (e) => {
        e.preventDefault();
        
        let isRepeat = e.repeat;
        let command = this.getCommandFromKeycode(e.keyCode);
        
        if (!isRepeat) {
            if (command === "TOGGLE_SETTINGS") {
                this.toggleSettings();
            } else {
                this.setState(prevState => {
                    return {commands: [...prevState.commands, command]}
                }, () => {
                    console.log(this.state.commands);
                    this.createCommand();
                });
            }
        }
    }

    handleKeyUp = (e) => {
        e.preventDefault();
        let command = this.getCommandFromKeycode(e.keyCode);

        if (command !== "TOGGLE_SETTINGS") {
            return;
        }
        
        let cmdIndex = this.state.commands.indexOf(command);
        

        if (command) {
            this.setState(prevState => {
                return {
                    commands: [...prevState.commands.slice(0, cmdIndex), ...prevState.commands.slice(cmdIndex + 1)]
                }
            }, () => {
                this.createCommand();
            });
        }
    }

    toggleSettings = () => {
        this.setState(prevState => ({
            showSettings: !prevState.showSettings
        }));
    }

    getCommandFromKeycode(keycode) {

        const { controls } = this.context;

        const command = controls.filter((control) => {
            if(control.keycode === keycode) {
                return control;
            }
        });

        return command[0].command;

    }

    addSpeedModifier(speed) {
        const {commands} = this.state;
        const {sensitivity} = this.context;

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

    createCommand = () => {
        const commands = this.state.commands;

        if (commands.indexOf("emergency") !== -1) {
            socket.emit("command", "emergency");
        } else if (commands.indexOf("land/takeoff") !== -1) {
            if (this.state.inAir) {
                socket.emit('command', 'land');
            } else {
                socket.emit('command', 'takeoff');
            }
            
            socket.once('status', (status) => {
                console.log(status);
                if (status === "ok") {
                    this.setState(prevState => {
                        return {inAir: !prevState.inAir}
                    }, () => {
                        console.log(this.state.inAir); 
                    });
                }
            });
            
        } else if(commands.indexOf("streamon/off") !== -1) {
            if (this.state.streamon) {
                socket.emit("command", "streamoff");
            } else {
                socket.emit("command", "streamon");
            }
            
            socket.once('status', (status) => {
                if (status === "ok") {
                    this.setState(prevState => {
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
            const sensitivityLayout = this.state.sensitivityLayout;
            const sensitivity = this.context.sensitivity[sensitivityLayout];
            if (commands.indexOf("right") !== -1) {
                a = a + sensitivity.a;
                a = this.addSpeedModifier(a);
                isRc = true;
            }
            if (commands.indexOf("left") !== -1) {
                a = a - sensitivity.a;
                a = this.addSpeedModifier(a);
                isRc = true;
            }
            if (commands.indexOf("forward") !== -1) {
                b = b + sensitivity.b;
                b = this.addSpeedModifier(b);
                isRc = true;
            }
            if (commands.indexOf("backward") !== -1) {
                b = b - sensitivity.b;
                b = this.addSpeedModifier(b);
                isRc = true;
            }
            if (commands.indexOf("up") !== -1) {
                c = c + sensitivity.c;
                c = this.addSpeedModifier(c);
                isRc = true;
            }
            if (commands.indexOf("down") !== -1) {
                c = c - sensitivity.c;
                c = this.addSpeedModifier(c);
                isRc = true;
            }
            if (commands.indexOf("cw") !== -1) {
                d = d + sensitivity.d;
                d = this.addSpeedModifier(d);
                isRc = true;
            }
            if (commands.indexOf("ccw") !== -1) {
                d = d - sensitivity.d;
                d = this.addSpeedModifier(d);
                isRc = true;
            }

            if (isRc) {
                let rcCommand = `rc ${a} ${b} ${c} ${d}`;
                socket.emit("command", rcCommand);
            }
        } else {
            socket.emit("command", "rc 0 0 0 0");
        }
    }

    handleMouseMove = (e) => {
        if (this.state.mouse.x > e.screenX) {
            console.log("left");
        } else {
            console.log("right");
        }

        if (this.state.mouse.y > e.screenY) {
            console.log('up');
        } else {
            console.log('down');
        }

        this.setState({
            mouse: {
                x: e.screenX,
                y: e.screenY
            }
        })
    }

    sendCommand = (command) => {
        console.log('sending command: ' + command);
        socket.emit('command', command);
    }
    render() {
        const {showSettings} = this.state;
        return (
            <React.Fragment>
                {showSettings ?  <Settings /> : null}
                <div className="App" tabIndex={-1} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp}>
                    <header className="App-header">
                        Drone front end
                    </header>
                    <div className="connected">
                        {this.state.connected ? 'Connected' :  'Disconnected'}
                    </div>
                    <div className="droneState">
                        {this.state.droneData ? this.state.droneData.bat : ''}
                    </div>
                    
                    <div className="enterManualMode"  /*onMouseMove={this.handleMouseMove}*/>
                        Click me to enter flight mode
                    </div>
                    <div className="droneControls">
                        <button onClick={() => this.sendCommand("battery?")}>Check battery</button>
                    </div>
                </div>
            </React.Fragment>
            
        );
    }

    componentDidMount() {

        socket.on("status", (status) => {
            console.log(status);
            this.setState({
                connected: true
            });
        });
        
        socket.on('dronestate', (state) => {
            this.setState({
                droneData: state
            });
        });

        socket.on('dronestream', (stream) => {
            console.log(stream);
        });
          
    }
    componentWillUnmount() {
        window.removeEventListener('gamepadconnected', () => {
            this.setState({gp: null});
        });
    }
}

App.contextType = SettingsContext;

export default App;
