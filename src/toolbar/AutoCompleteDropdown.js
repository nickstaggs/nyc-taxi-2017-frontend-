import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';

function renderInput(inputProps) {
    const { InputProps, classes, ref, ...other } = inputProps;

    return (
        <TextField
            InputProps={{
                inputRef: ref,
                classes: {
                    root: classes.inputRoot,
                },
                ...InputProps,
            }}
            {...other}
        />
    );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem !== null ? selectedItem.label : '').indexOf(suggestion.label) > -1;

    return (
        <MenuItem
            {...itemProps}
            key={suggestion.locationId}
            selected={isHighlighted}
            component="div"
            style={{
                fontWeight: isSelected ? 500 : 400,
                fontFamily: 'inherit',
                padding: '5px'
            }}>
            {truncateString(suggestion.label)}
        </MenuItem>
    );
}
renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};

function getSuggestions(inputValue, suggestions) {
    let count = 0;

    return suggestions.filter(suggestion => {
        const keep =
            (!inputValue || suggestion.label.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
            count < 5;

        if (keep) {
            count += 1;
        }

        return keep;
    });
}

const truncateString = (str) => {
    if (typeof (str) === "string") {
        if (str.length > 12) {
            str = str.substring(0, 9) + "...";
        }
    }
    return str;
}


const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 0,
        width: '39%'
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
        fontFamily: 'inherit'
    },
});

class AutoCompleteDropdown extends React.Component {

    state = {selection: this.props.selection}

    componentDidMount() {
        const zonesUrl = process.env.REACT_APP_API_URL + "/zones/";
        fetch(zonesUrl)
            .then(res => res.json())
            .then(
                zones => {
                    var zoneNameKeys = zones.map(zone => {
                        return {locationId: zone.locationId, label: zone.zone};
                    });

                    zoneNameKeys.unshift({locationId: 0, label: 'Any'})

                    this.setState({zones: zoneNameKeys});
                },
                error => {
                    this.setState({error: error});
                }
            );
    }

    componentDidUpdate(prevProps) {
        if (this.props.selection !== prevProps.selection) {
            this.setState({ selection: this.props.selection });
        }
    }

    renderLoading() {
        return <div>Loading...</div>;
    }

    renderError() {
        return <div>I'm sorry please try again.</div>;
    }

    changeSelection = (item) => {
        this.props.updateSelection(item);
    }

    renderAutoCompleteDropdown() {
        const { classes, label} = this.props;
        const floatDir = label === "Pickup" ? "Left" : "Right";

        return (
            <div className={classes.root + " float" + floatDir}>
                <Downshift  selectedItem={this.props.selection} 
                            itemToString={(item) => { return (item == null ? '' : truncateString(item.label)); }} 
                            onSelect={(selectedItem, state) => this.changeSelection(selectedItem)}>
                    {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
                        <div className={classes.container}>
                            {renderInput({
                                fullWidth: true,
                                classes,
                                InputProps: getInputProps({
                                    placeholder: label,
                                    id: 'integration-downshift-simple',
                                }),
                            })}
                            {isOpen ? (
                                <Paper className={classes.paper} square>
                                    {getSuggestions(inputValue, this.state.zones).map((suggestion, index) =>
                                        renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: getItemProps({ item: suggestion}),
                                            highlightedIndex,
                                            selectedItem,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    )}
                </Downshift>
            </div>
        );
    }

    render() {
        return this.renderAutoCompleteDropdown();
    }
}

AutoCompleteDropdown.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AutoCompleteDropdown);