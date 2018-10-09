import React from 'react';
import { shallow } from 'enzyme';
import Map from './Map';

it('should render normal map when choropleth data is null', () => {
    const view = shallow(<Map chloroplethData={null} dropoffSelection={null} pickupSelection={null} />);

    expect(view).toMatchSnapshot();
});

it('should return a .03 opacity when the value is less than .03', () => {
    const wrapper = shallow(<Map chloroplethData={null} dropoffSelection={null} pickupSelection={null} />);

    expect(wrapper.instance().calculateOpacity(0, 1)).toBe(.03);
});

it('should return the .6 opacity when the value is .6', () => {
    const wrapper = shallow(<Map chloroplethData={null} dropoffSelection={null} pickupSelection={null} />);

    expect(wrapper.instance().calculateOpacity(6, 10)).toBe(.6);
});