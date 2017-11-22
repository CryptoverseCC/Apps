import React, { Component } from 'react';

import BoldText from '@linkexchange/components/src/BoldText';
import A from '@linkexchange/components/src/A';
import Button from '@linkexchange/components/src/NewButton';
import Icon from '@linkexchange/components/src/Icon';
import MetaFox from '../../../../images/metafox.png';

import TransactionProvider from './TransactionProvider';

import { TWhitelistableClickableLink } from '../';

import * as style from './linksList.scss';

interface ILinksListProps {
  links: TWhitelistableClickableLink[];
}

const LinksList = (props: ILinksListProps) => {
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
              <b>{link.total}</b>
            </td>
            {!link.whitelisted && (
              <td style={{ width: '200px', textAlign: 'right' }}>
                <TransactionProvider
                  id={link.id}
                  renderReady={(onClick) => (
                    <Button color="ready" onClick={onClick}>
                      <Icon name="check" /> Accept
                    </Button>
                  )}
                  renderPending={() => <Button color="pending">Pending</Button>}
                  renderMetaPending={() => (
                    <Button color="metaPending">
                      <img src={MetaFox} displayName="Icon" style={{ height: '2em' }} /> Metamask...
                    </Button>
                  )}
                  renderError={() => <Button color="error">Failed :(</Button>}
                  renderSuccess={() => <Button color="success">Success</Button>}
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LinksList;
