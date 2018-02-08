import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import Button from './index';
import Input from '../components/src/Form/Input';
import * as styles from './index.scss';
import { CopyFromMM } from '@linkexchange/copy-from-mm';

storiesOf('Input', module)
  .addDecorator(withKnobs)
  .add('Basic', () => (
    <div style={{ width: '300px' }}>
      <Input value={text('Text', 'This is the input text')} />
    </div>
  ))
  .add('Invalid', () => (
    <div style={{ width: '300px' }}>
      <Input error={text('Error Text', 'This input has an error')} />
    </div>
  ))
  .add('WithMMButton', () => (
    <div style={{ width: '300px' }}>
      <Input
        value={text('Text', 'This is the input text')}
        error={text('Error', '')}
        append={(className) => (
          <CopyFromMM
            className={className}
            onClick={action('Copy from MM!')}
            web3State={{
              enabled: boolean('Metamask Button Enabled', true),
              reason: text('Metamask Button Disabled Reason', 'Reason'),
            }}
          />
        )}
      />
    </div>
  ))
  .add('Multiline', () => (
    <div style={{ width: '300px' }}>
      <Input
        value={text('Text', 'This is the input text')}
        error={text('Error', '')}
        multiline
      />
    </div>
  ));
