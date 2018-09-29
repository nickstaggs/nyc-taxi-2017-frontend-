import React from 'react';
import './../App.css';
import Button from '@material-ui/core/Button';

const styles = {
    fontFamily: 'inherit'
}

function SubmitButton(props) {

    return (
        <Button style={styles} onClick={props.onClick}>
            <p>Submit</p>
        </Button>
    );
}

export default SubmitButton;