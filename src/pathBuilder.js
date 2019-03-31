import React, {useContext} from 'react';
import settingsContext from './settings-context';
import PathCanvas from './pathCanvas';

const PathBuilder = () => {

    const context = useContext(settingsContext);

    const {commands} = context;
    return (
        <div>
            <PathCanvas />
            {commands.map(command => {
                return (
                    <button key={command}>
                        {command}
                    </button>
                )
            })}
        </div>
    )
}

export default PathBuilder;