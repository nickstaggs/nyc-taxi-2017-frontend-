import React from 'react';
import { shallow } from 'enzyme';
import SubmitButton from './SubmitButton'

it('should render', () => {
    const view = shallow(<SubmitButton />);

    expect(view).toMatchSnapshot();
});