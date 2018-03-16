import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react';
import Input from '@linkexchange/components/src/Form/Input';
import { CopyFromMM } from '@linkexchange/copy-from-mm';
import { action } from '@storybook/addon-actions';
import Checkbox from '@linkexchange/components/src/Form/Checkbox';

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
            enabled={boolean('Metamask Button Enabled', true)}
            reason={text('Metamask Button Disabled Reason', 'Reason')}
          />
        )}
      />
    </div>
  ))
  .add('Multiline', () => (
    <div style={{ width: '300px' }}>
      <Input value={text('Text', 'This is the input text')} error={text('Error', '')} multiline />
    </div>
  ))
  .add('Currency', () => (
    <div style={{ width: '300px' }}>
      <Input
        value={text('Text', '0.322')}
        error={text('Error', '')}
        bold={boolean('Bold', true)}
        primary={boolean('Primary', true)}
        currency={text('Currency', 'eth')}
        append={(className) => (
          <CopyFromMM
            className={className}
            onClick={action('Copy from MM!')}
            enabled={boolean('Metamask Button Enabled', true)}
            reason={text('Metamask Button Disabled Reason', 'Reason')}
          />
        )}
      />
    </div>
  ))
  .add('Checkbox', () => (
    <Checkbox checked={boolean('checked')} label="Check me out!" onClick={action('clicked checked!')} />
  ));
