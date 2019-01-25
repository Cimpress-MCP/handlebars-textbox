import React from 'react';

import { storiesOf } from '@storybook/react';

import HandlebarsTextBox from '../src/index'
import './styles.css'

const value = '{{#people}} Hi {{#eq name "Victor"}}{{replace value "_" " "}} {{lastname}} !{{/eq}}{{/people}} ';

storiesOf('HandlebarsTextBox', module)
  .add('No styled', () => <HandlebarsTextBox value={value} onChange={() => { }} />)
  .add('Big text with small editor scrolls horizontally', () => <HandlebarsTextBox value={value} onChange={() => { }} className='smallTextBox' />)
  .add('Editors hhave the same height', () => <div style={{display: 'inline-flex'}}>
    <HandlebarsTextBox value={'Hi user'} onChange={() => { }} className='smallTextBox' />
    <HandlebarsTextBox value={'Hi {{user}}'} onChange={() => { }} className='smallTextBox' />
  </div>
  );