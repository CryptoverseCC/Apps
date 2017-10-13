import React, { Component } from 'react';
import * as style from './whitelist.scss';
import Paper from '@userfeeds/apps-components/src/Paper';
import BoldText from '@userfeeds/apps-components/src/BoldText';
import Link from '@userfeeds/apps-components/src/Link';
import Pill from '../../../../widgets/src/pages/Configurator/components/Pill';
import A from './components/A';
import Icon from '@userfeeds/apps-components/src/Icon';

const Button = ({ children, ...props }) => {
  const decoratedChildren = React.Children.map(children, (child) => {
    return child && child.props && child.props.type === 'Icon'
      ? React.cloneElement(child, { className: style.ButtonIcon })
      : child;
  });
  return (
    <button className={style.Button}>
      <div className={style.ButtonInnerWrapper}>{decoratedChildren}</div>
    </button>
  );
};

export default class Creator extends Component<{}, {}> {
  render() {
    return (
      <div className={style.self}>
        <Paper className={style.container}>
          <div className={style.head}>
            <h2 className={style.header}>
              Waiting for approval
              <Pill className={style.counter}>3</Pill>
            </h2>
            <div className={style.sort}>
              <BoldText>SORTED BY</BoldText> Total Spent
            </div>
          </div>

          <div className={style.body}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '12px 20px' }}>
                    <BoldText>Sent by</BoldText>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px' }}>
                    <BoldText>Content</BoldText>
                  </th>
                  <th style={{ textAlign: 'left', padding: '12px 20px' }}>
                    <BoldText>Total spent</BoldText>
                  </th>
                </tr>
              </thead>
              <tbody style={{ textAlign: 'left', fontSize: '14px' }}>
                <tr>
                  <td style={{ padding: '12px 20px' }}>
                    <A href="https://etherscan.io/address/0x0">0x0000000000000000000</A>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <b>Creative outdoor</b>
                    <p style={{ color: '#89939F', margin: 0 }}>
                      Over the last few months, usage of the content content content content content
                      content content
                    </p>
                    <A>www.linkplace.com</A>
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    <b>1.5 ETH</b>
                  </td>
                  <td style={{ padding: '12px 20px', minWidth: '200px' }}>
                    <Button>
                      <Icon name="check" />Accept
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Paper>
      </div>
    );
  }
}
