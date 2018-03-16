import React, { Component } from 'react';

import { fromWeiToString } from '@linkexchange/utils/balance';
import TransactionProvider, { TStatus } from '@linkexchange/transaction-provider';

import A from '@linkexchange/components/src/A';
import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';
import BoldText from '@linkexchange/components/src/BoldText';

import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';

import * as style from './linksList.scss';
import { inject, observer } from 'mobx-react';
import { IWeb3Store } from '@linkexchange/web3-store';
import { IRemoteLink } from '@linkexchange/types/link';

interface ILinksListProps {
  links: IRemoteLink[];
  web3Store?: IWeb3Store;
  waitingForApproval?: boolean;
}

@inject('web3Store')
@observer
export default class LinksList extends Component<ILinksListProps> {
  private whitelistLink = async (linkId: string) => {
    const claim = { claim: { target: linkId } };
    const claimRequest = await this.props.web3Store!.sendClaim(claim);
    claimRequest.promiEvent
      .on('transactionHash', (transactionHash) => {
        sessionStorage.setItem(linkId, `${transactionHash}:pending`);
      })
      .on('receipt', (receipt) => {
        sessionStorage.setItem(linkId, `${receipt.transactionHash}:success`);
      });
    return claimRequest;
  };

  private getInitialStatus = (linkId: string): TStatus => {
    const transaction = sessionStorage.getItem(linkId);
    if (!transaction) {
      return 'ready';
    }
    const [transactionId, status] = transaction.split(':');

    return status as TStatus;
  };

  render() {
    const { links, waitingForApproval } = this.props;
    const { decimals } = this.props.web3Store!;
    return (
      <table className={style.Table}>
        <thead>
          <tr>
            <th>
              <BoldText>Content</BoldText>
            </th>
            <th>
              <BoldText>Total spent</BoldText>
            </th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td>
                <b>{link.title}</b>
                <p style={{ color: '#89939F', margin: 0 }}>{link.summary}</p>
                <A href={link.target}>{link.target}</A>
              </td>
              <td style={{ width: '140px' }}>
                <b>{fromWeiToString(link.total, decimals!)}</b>
              </td>
              {waitingForApproval && (
                <td style={{ width: '200px', textAlign: 'right' }}>
                  <TransactionProvider
                    initialStatus={this.getInitialStatus(link.id)}
                    startTransaction={() => this.whitelistLink(link.id)}
                    renderReady={() => (
                      <Button color="ready">
                        <Icon name="check" /> Accept
                      </Button>
                    )}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
