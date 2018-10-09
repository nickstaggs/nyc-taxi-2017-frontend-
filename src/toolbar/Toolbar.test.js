import React from 'react';
import { shallow } from 'enzyme';
import Toolbar from './Toolbar';

it('should render', () => {
    const view = shallow(<Toolbar/>);

    expect(view).toMatchSnapshot();
});