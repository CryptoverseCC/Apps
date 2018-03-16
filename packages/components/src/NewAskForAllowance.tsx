import React, { Component } from 'react';

import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';
import Checkbox from '@linkexchange/components/src/Form/Checkbox';

import * as style from './newAskForAllowance.scss';

interface IProps {
  goBack(): void;
  startTransaction(unlimitedApproval: boolean): Promise<any>;
}

interface IState {
  unlimited: boolean;
}

export default class NewAskForAllowance extends Component<IProps, IState> {
  state = {
    unlimited: false,
  };

  render() {
    const { goBack } = this.props;
    const { unlimited } = this.state;

    return (
      <>
        <div className={style.body}>
          <a className={style.back} onClick={goBack}>
            <Icon name="arrow-thick-left" className={style.backIcon} />
          </a>
          <h2 style={{ color: '#1B2437' }}>Tokens Access</h2>
          <p>We need a confirmation to use tokens stored on this address.</p>
          <Checkbox
            checked={unlimited}
            label="Don’t ask me again"
            onChange={(e) => this.setState({ unlimited: e.target.checked })}
          />
          <Button
            color="primary"
            size="big"
            childrenWrapperStyle={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}
            style={{ width: '100%' }}
            onClick={this._startTransaction}
          >
            Grant permission
            <div className={style.next}>
              <Icon name="arrow-thick-top" className={style.icon} />
            </div>
          </Button>
        </div>
      </>
    );
  }

  _startTransaction = () => {
    this.props.startTransaction(this.state.unlimited);
  };
}
