import React from 'react';

import { storiesOf } from '@storybook/react';

import HandlebarsTextBox from '../src/index'
import './styles.css'

const value = '{{#people}} Hi {{#eq name "Victor"}}{{replace value "_" " "}} {{lastname}} !{{/eq}}{{/people}}';

storiesOf('HandlebarsTextBox', module)
  .add('Empty', () => <HandlebarsTextBox value={''} onChange={() => { }} className='smallTextBox' />)
  .add('No styled', () => <HandlebarsTextBox value={value} onChange={() => { }} />)
  .add('Big text with small editor scrolls horizontally', () => <HandlebarsTextBox value={value} onChange={() => { }} className='smallTextBox' />)
  .add('Editors have the same height', () => <div>
    <HandlebarsTextBox value={'Hi user'} onChange={() => { }} className='smallTextBox' />
    <HandlebarsTextBox value={'Hi {{user}}'} onChange={() => { }} className='smallTextBox' style={{float: 'left'}}/>
  </div>
  );