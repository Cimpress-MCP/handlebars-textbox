import React from 'react';

import { storiesOf } from '@storybook/react';

import HandlebarsTextBox from '../src/index'
import './styles.css'

const value = '{{#people}} Hi {{#eq name "Victor"}}{{replace value "_" " "}} {{lastname}} !{{/eq}}{{/people}}';

storiesOf('HandlebarsTextBox', module)
  .add('No styled', () => <HandlebarsTextBox value={value} onChange={() => { }} />)
  .add('Big text small editor scrolls horizontally', () => <HandlebarsTextBox value={value} onChange={() => { }} className='smallTextBox' />);