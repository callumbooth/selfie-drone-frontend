import React, {Fragment, useState, useContext} from 'react';
import SettingsContext from './settings-context';


const Settings = () => {
    const context = useContext(SettingsContext);
    const {controls} = context;

    const initialState = {}

    for(let i = 0; i < controls.length; i++) {
        initialState[controls[i].name] = controls[i]
    }

    const [state, setState] = useState(initialState);

    const updateField = (e) => {
        //need to get the key data from the target value, so we can update things like the keycode and letter
        
        const newSetting = {
            name: e.target.name,
            key: e.target.value
        }

        setState({
            ...state,
            [e.target.name]: newSetting
        })
    }

    const focusField = (e) => {
        const newSetting = {
            name: e.target.name,
            key: ""
        }
        setState({
            ...state,
            [e.target.name]: newSetting
        })
    }
    return (
        <Fragment>
            {console.log(state)}
            <form onSubmit={(e) => {
                e.preventDefault();
                console.log(state);
            }}>
                {controls.map((control, i) => {
                    return (
                        <div key={control.name} style={{'display':"block"}}>
                            <label htmlFor={control.name}>
                                {control.label}
                            </label>
                            <input type="text" name={control.name} value={state[control.name].key} maxLength={1} onChange={updateField} onFocus={focusField} />
                        </div>
                    )
                })}
                <input type="submit" />
            </form>
        </Fragment>
    )
}


export default Settings;