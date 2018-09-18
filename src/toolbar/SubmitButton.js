import React from 'react';
import './../App.css';
import Button from '@material-ui/core/Button';

function SubmitButton(props) {

    return (
        <Button onClick={props.onClick}>
            <p>Submit</p>
        </Button>
    );
}

export default SubmitButton;