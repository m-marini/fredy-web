import React from 'react';
import { render, screen } from '@testing-library/react';
import { PredicateTable, createPredicateProps } from '../react/fredyComponents';

test('renders predicate list', () => {
  const items = [{
    id: 'description1',
    truth: 0
  }, {
    id: 'description2',
    truth: 1
  }];
  render(
    <PredicateTable predicates={items} />
  );
  const elem = screen.getByText(/description1/i)
  expect(elem).toBeInTheDocument();
});

test('convert evidences', () => {
  const items = [{
    id: 'id1',
    truth: 0
  }, {
    id: 'id2',
    truth: 0.874,
  }];
  const map = new Map([
    ['id1', 'number 1']
  ]);
  const states = createPredicateProps(items, map);
  //  expect(states).toContainEqual([{
  expect(states).toEqual([{
    id: 'id1',
    descr: 'number 1',
    truth: 0,
    level: 0,
    mapper: map
  }, {
    id: 'id2',
    descr: 'id2',
    truth: 0.874,
    level: 3,
    mapper: map
  }]);
});
