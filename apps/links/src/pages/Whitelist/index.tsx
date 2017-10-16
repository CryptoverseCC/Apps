import React, { Component } from 'react';
import * as style from './whitelist.scss';
import Paper from '@userfeeds/apps-components/src/Paper';
import Link from '@userfeeds/apps-components/src/Link';
import Pill from '../../../../widgets/src/pages/Configurator/components/Pill';
import {
  Field,
  Title,
  Description,
  RadioGroup,
} from '../../../../widgets/src/pages/Configurator/components/Field';
import { input as fieldInput } from '../../../../widgets/src/pages/Configurator/components/field.scss';
import Input from '../../../../widgets/src/pages/Configurator/components/Input';
import Asset from '../../../../widgets/src/pages/Configurator/components/Asset';
import LinksList from './components/LinksList';

interface IState {
  recipientAddress: string;
  whitelistId: string;
  asset: {
    token: string;
    network: string;
  };
}

interface IProps {
  location: any;
}

export default class Creator extends Component<IProps, IState> {
  render() {
    const asset = {
      token: 'ETH',
      network: 'ethereum',
    };
    const links = [
      {
        sentBy: '0x0',
        title: 'Creative outdoor',
        description: 'Over the last few months',
        link: 'http://abc.pl',
        totalSpent: '1.5 ETH',
        onClick: () => {},
      },
    ];

    return (
      <div className={style.self}>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>Input the data for your whitelist</h2>
          </div>
          <div className={style.body} style={{ padding: '20px' }}>
            <Field>
              <Title>Recipient Address</Title>
              <Input type="text" value="123" onChange={() => {}} />
            </Field>
            <Field>
              <Title>Whitelist Address</Title>
              <Input type="text" value="123" onChange={() => {}} />
            </Field>
            <Field>
              <Title>Choose token</Title>
              <div className={fieldInput}>
                <Asset asset={asset} onChange={() => {}} />
              </div>
            </Field>
          </div>
        </Paper>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>
              Waiting for approval
              <Pill className={style.counter}>3</Pill>
            </h2>
          </div>
          <div className={style.body}>
            <LinksList links={links} />
          </div>
        </Paper>
      </div>
    );
  }
}
