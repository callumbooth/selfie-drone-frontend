import React, { Component } from "react";
import io from 'socket.io-client';
import ControlsContext from './controlsProvider';
import "./App.css";

const socket = io('http://localhost:6767');

class App extends Component {
    constructor() {
        super();
        this.state = {
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
            controlLayout: "default",
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

        if (!isRepeat && command) {
            this.setState(prevState => {
                return {commands: [...prevState.commands, command]}
            }, () => {
                console.log(this.state.commands);
                this.createCommand();
            })
        }
        
        
    }

    handleKeyUp = (e) => {
        e.preventDefault();
        let command = this.getCommandFromKeycode(e.keyCode);
        
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

    getCommandFromKeycode(keycode) {
        const controlLayout = this.state.controlLayout;

        let command = null;
        switch(keycode) {
            case this.state.controls[controlLayout].strafeLeft: {
                command = 'left';
                break;
            }
            case this.state.controls[controlLayout].forward: {
                command = 'forward';
                break;
            }
            case this.state.controls[controlLayout].strafeRight: {
                command = 'right';
                break;
            }
            case this.state.controls[controlLayout].backward: {
                command = 'backward'
                break;
            }
            case this.state.controls[controlLayout].up: {
                command = 'up'
                break;
            }
            case this.state.controls[controlLayout].down: {
                command = 'down';
                break;
            }
            case this.state.controls[controlLayout].turnRight: {
                command = 'cw'
                break;
            }
            case this.state.controls[controlLayout].turnLeft: {
                command = 'ccw'
                break;
            }
            case this.state.controls[controlLayout].land:
            case this.state.controls[controlLayout].takeOff: {
                //need some logic to handle if switch bettwen the two commands
                console.log('landing/taking off');
                command = "land/takeoff";
                break;
            }
            case this.state.controls[controlLayout].recordOn:
            case this.state.controls[controlLayout].recordOff: {
                //need some logic to handle if switch bettwen the two commands
                command = "streamon/off";
                break;
            }
            case this.state.controls[controlLayout].emergency: {
                command = "emergency";
                break;
            }
            case this.state.controls[controlLayout].sprint: {
                command = "shift";
                break;
            }
            case this.state.controls[controlLayout].walk: {
                command = "ctrl";
                break;
            }
        }
        return command;
    }

    addSpeedModifier(speed) {
        const commands = this.state.commands;
        const sensitivityLayout = this.state.sensitivityLayout;
        const sensitivity = this.state.sensitivity;

        if (commands.indexOf("shift") !== -1) {
            speed = speed * sensitivity[sensitivityLayout].sprint;
            if (speed > 100) {
                speed = 100;
            }
        } else if (commands.indexOf("ctrl") !== -1) {
            speed = speed * sensitivity[sensitivityLayout].walk;
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
            const sensitivity = this.state.sensitivity[sensitivityLayout];
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
            <div className="App">
                {showSettings ?  <Settings /> : null}
                <header className="App-header">
                    Drone front end
                </header>
                <div className="connected">
                    {this.state.connected ? 'Connected' :  'Disconnected'}
                </div>
                <div className="droneState">
                    {this.state.droneData ? this.state.droneData.bat : ''}
                </div>
                
                <div className="enterManualMode" tabIndex={-1} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} /*onMouseMove={this.handleMouseMove}*/>
                    Click me to enter flight mode
                </div>
                <div className="droneControls">
                    <button onClick={() => this.sendCommand("battery?")}>Check battery</button>
                </div>
            </div>
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

App.contextType = ControlsContext;

export default App;
