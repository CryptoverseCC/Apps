import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react'
import { action } from '@storybook/addon-actions';
import Button from './index';
import Input from '../components/src/Form/Input';
import * as styles from './index.scss';

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .add('Basic', () => (
    <Input value={text('Text', 'This is the input text')}/>
  ))
  .add('Invalid', () => (
    <Input invalid/>
  ))
