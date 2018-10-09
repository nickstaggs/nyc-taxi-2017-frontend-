import React from 'react';
import { shallow } from 'enzyme';
import ZoneCard from './ZoneCard';

it('should render', () => {
    const view = shallow(<ZoneCard/>);

    expect(view).toMatchSnapshot();
});