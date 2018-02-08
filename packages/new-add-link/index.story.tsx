import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react'
import { action } from '@storybook/addon-actions';
import Button from './index';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => (
    <Button onClick={action('button-click')}>{text('Button Text', 'text')}</Button>
  ))
  .add('with some emoji', () => (
    <Button>😀 😎 👍 💯</Button>
  ));
