import React from 'react';
import { shallow } from 'enzyme';
import AutoCompleteDropdown from './AutoCompleteDropdown';

it('should render', () => {
    const view = shallow(<AutoCompleteDropdown/>);

    expect(view).toMatchSnapshot();
});