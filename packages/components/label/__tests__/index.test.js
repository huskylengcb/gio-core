import React from 'react';
import Label from '../';
import renderer from 'react-test-renderer';

test('label', () => {
  const label = renderer.create(
    <Label>hello</Label>, {
      createNodeMock: (element) => ({
        scrollWidth: 0
      })
    }
  );
  let tree = label.toJSON();
  expect(tree).toMatchSnapshot();
});