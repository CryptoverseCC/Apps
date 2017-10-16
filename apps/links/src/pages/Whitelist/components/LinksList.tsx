import React from 'react';
import * as style from './linksList.scss';
import BoldText from '@userfeeds/apps-components/src/BoldText';
import A from './A';
import Button from './Button';
import Icon from '@userfeeds/apps-components/src/Icon';

interface ILink {
  sentBy: string;
  title: string;
  description: string;
  link: string;
  totalSpent: string;
  onClick: () => any;
  id: string;
}

const LinksList = (props: { links: ILink[] }) => {
  return (
    <table className={style.Table}>
      <thead>
        <tr>
          <th>
            <BoldText>Sent by</BoldText>
          </th>
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
              <A bold href={`https://etherscan.io/address/${link.sentBy}`}>
                {link.sentBy}
              </A>
            </td>
            <td>
              <b>{link.title}</b>
              <p style={{ color: '#89939F', margin: 0 }}>{link.description}</p>
              <A href={link.link}>{link.link}</A>
            </td>
            <td style={{ minWidth: '140px' }}>
              <b>{link.totalSpent}</b>
            </td>
            <td style={{ minWidth: '200px' }}>
              <Button onClick={link.onClick}>
                <Icon classname="check" /> Accept
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LinksList;
