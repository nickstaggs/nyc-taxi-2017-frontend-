import React from 'react';
import { shallow } from 'enzyme';
import App from './App';

it('view should render correctly without props', () => {
  const view = shallow(<App/>);

  expect(view).toMatchSnapshot();
});

