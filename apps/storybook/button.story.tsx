import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs/react';
import Button from '@linkexchange/components/src/NewButton';

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('Button', () => (
    <div style={{ width: '500px' }}>
      <Button
        size={select('size', {
          small: 'small',
          medium: 'medium',
          big: 'big',
        }, 'big')}
        disabled={boolean('disabled')}
        outline={boolean('outline')}
        rounded={boolean('rounded', true)}
        type="submit"
        color={select(
          'color',
          {
            primary: 'primary',
            secondary: 'secondary',
            success: 'success',
            pending: 'pending',
            metaPending: 'metaPending',
            error: 'error',
            ready: 'ready',
            empty: 'empty',
          },
          'primary',
        )}
      >
        {text('text', 'Send')}
      </Button>
    </div>
  ));
