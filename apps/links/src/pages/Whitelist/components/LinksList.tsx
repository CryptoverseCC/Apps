import React from 'react';
import * as style from './linksList.scss';
import BoldText from '@userfeeds/apps-components/src/BoldText';
import A from '@userfeeds/apps-components/src/A';
import Button from '@userfeeds/apps-components/src/NewButton';
import Icon from '@userfeeds/apps-components/src/Icon';

interface ILink {
  title: string;
  description: string;
  link: string;
  totalSpent: string;
  onClick: () => any;
  id: string;
  whitelisted: boolean;
}

const LinksList = (props: { links: ILink[] }) => {
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
              <p style={{ color: '#89939F', margin: 0 }}>{link.description}</p>
              <A href={link.link}>{link.link}</A>
            </td>
            <td style={{ width: '140px' }}>
              <b>{link.totalSpent}</b>
            </td>
            {!link.whitelisted && (
              <td style={{ width: '200px', textAlign: 'right' }}>
                <Button color="success" onClick={link.onClick}>
                  <Icon name="check" /> Accept
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LinksList;
