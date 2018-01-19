import React, { Component } from 'react';

import { fromWeiToString } from '@linkexchange/utils/balance';
import TransactionProvider, { TStatus } from '@linkexchange/transaction-provider';
import { ITokenDetails, withTokenDetails } from '@linkexchange/token-details-provider';

import A from '@linkexchange/components/src/A';
import Icon from '@linkexchange/components/src/Icon';
import Button from '@linkexchange/components/src/NewButton';
import BoldText from '@linkexchange/components/src/BoldText';

import core from '@userfeeds/core/src';
import web3 from '@linkexchange/utils/web3';

import { TWhitelistableClickableLink } from '../';

import * as style from './linksList.scss';

interface ILinksListProps {
  tokenDetails: ITokenDetails;
  links: TWhitelistableClickableLink[];
}

class LinksList extends Component<ILinksListProps> {

  render() {
    const props = this.props;

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
          {props.links.map((link) => (
            <tr key={link.id}>
              <td>
                <b>{link.title}</b>
                <p style={{ color: '#89939F', margin: 0 }}>{link.summary}</p>
                <A href={link.target}>{link.target}</A>
              </td>
              <td style={{ width: '140px' }}>
                <b>{fromWeiToString(link.total, props.tokenDetails.decimals)}</b>
              </td>
              {!link.whitelisted && (
                <td style={{ width: '200px', textAlign: 'right' }}>
                  <TransactionProvider
                    initialStatus={this._getInitialStatus(link.id)}
                    startTransaction={() => this._whitelistLink(link.id)}
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

  _whitelistLink = (linkId: string) => {
    const claim = {
      claim: { target: linkId },
    };

    const promiEvent = core.ethereum.claims.sendClaimWithoutValueTransfer(web3, claim);

    promiEvent.then(({ promiEvent }) => {
      promiEvent.on('transactionHash', (transactionHash) => {
        sessionStorage.setItem(linkId, `${transactionHash}:pending`);
      });
      promiEvent.on('receipt', (receipt) => {
        sessionStorage.setItem(linkId, `${receipt.transactionHash}:success`);
      });
    });

    return promiEvent;
  }

  _getInitialStatus = (linkId: string): TStatus => {
    const transaction = sessionStorage.getItem(linkId);
    if (!transaction) {
      return 'ready';
    }
    const [transactionId, status] = transaction.split(':');

    return status as TStatus;
  }
}

export default withTokenDetails(LinksList);
