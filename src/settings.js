import React, {useState, useContext, useRef} from 'react';
import SettingsContext from './settings-context';


const Settings = () => {
    const context = useContext(SettingsContext);
    const {controls} = context;

    const initialState = {}

    for(let i = 0; i < controls.length; i++) {
        initialState[controls[i].name] = controls[i]
    }

    const [state, setState] = useState({
        update: 0,
        controls
    });

    

    const updateField = (e) => {
        e.persist();
        //need to get the key data from the target value, so we can update things like the keycode and letter
        setState(prevState => {
            for(let i = 0; i < prevState.controls.length; i++) {
                if (e.target !== null && prevState.controls[i].name === e.target.dataset.name) {
                    prevState.controls[i].key = e.key;
                    prevState.controls[i].keycode = e.keyCode 
                }
            }
            return {update: prevState.update + 1, controls: prevState.controls};
        });
    }

    const focusField = (e) => {
        e.persist();
        
        setState(prevState => {
            for(let i = 0; i < prevState.controls.length; i++) {
                if (e.target !== null && prevState.controls[i].name === e.target.dataset.name) {
                    prevState.controls[i].key = "";
                    prevState.controls[i].keycode = 0 
                }
            }
            return {update: prevState.update + 1, controls: prevState.controls};
        });

    }

    return (
        <div id="settingspage">
            {state.update}
            {state.controls.map((control, i) => {
                return (
                    <div key={control.name} style={{'display':"block"}}>
                        <div>
                            {control.label}
                        </div>
                        <div data-name={control.name} tabIndex={-1} onClick={focusField} onKeyDown={updateField}>{control.key ? control.key : "empty"}</div>
                    </div>
                )
            })}
        </div>
    )
}


export default Settings;