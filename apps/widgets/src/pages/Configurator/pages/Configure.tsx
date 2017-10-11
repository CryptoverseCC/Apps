import React, { Component } from 'react';
import classnames from 'classnames';
import Input from '../components/Input';
import Radio from '../components/Radio';
import { input as fieldInput } from '../components/field.scss';
import { Field, Title, Description, RadioGroup } from '../components/Field';
import { PictographRectangle, PictographLeaderboard } from '../components/Pictograph';
import Icon from '@userfeeds/apps-components/src/Icon';
import NewToken from '../components/sections/NewToken';
import Dropdown from '@userfeeds/apps-components/src/Dropdown';
import Button from '@userfeeds/apps-components/src/Button';

export default class Configurator extends Component<{}, {}> {
  render() {
    return (
      <div>
        <h1>Create widget</h1>
        <p style={{ marginBottom: '10px' }}>
          Provide essential information to get your widget up and running!
        </p>
        <Field>
          <Title>Userfeed Address</Title>
          <Description>Add description here about userfeed address</Description>
          <Input type="text" className={fieldInput} />
        </Field>
        <Field>
          <Title>Whitelist</Title>
          <Description>Add description here about whitelist identifier</Description>
          <Input type="text" className={fieldInput} />
        </Field>
        <Field>
          <Title>Title</Title>
          <Description>Add description here about title</Description>
          <Input type="text" className={fieldInput} />
        </Field>
        <Field>
          <Title>Description</Title>
          <Description>Add description here about description</Description>
          <Input type="text" className={fieldInput} multiline />
        </Field>
        <Field>
          <Title>Declared Amount of Impressions</Title>
          <Description>Add description here about declared amount of impressions</Description>
          <RadioGroup radioWidth="175px">
            <Radio>N/A</Radio>
            <Radio checked>100 - 1.000</Radio>
            <Radio>1.001 - 10.000</Radio>
            <Radio>10.001 - 100.000</Radio>
            <Radio>100.001 - 1 milion</Radio>
            <Radio>1 milion - ∞</Radio>
          </RadioGroup>
        </Field>
        <Field>
          <Title>Preferred Contact Method</Title>
          <Input type="email" className={fieldInput} />
        </Field>
        <Field>
          <Title>Select Size</Title>
          <RadioGroup radioWidth="270px">
            <Radio>
              <PictographLeaderboard />
            </Radio>
            <Radio checked>
              <PictographRectangle />
            </Radio>
          </RadioGroup>
        </Field>
        <Field>
          <Title>Select Type</Title>
          <RadioGroup radioWidth="175px">
            <Radio checked>
              <span>Text</span>
              <Icon name="text" />
            </Radio>
            <Radio disabled soon>
              <span>Image</span>
              <Icon name="image" />
            </Radio>
            <Radio disabled soon>
              <span>Video</span>
              <Icon name="video" />
            </Radio>
          </RadioGroup>
        </Field>
        <Field>
          <Title>Choose token</Title>
          <Description>I think it would be nice to put here a short description</Description>
          <div className={fieldInput}>
            <NewToken
              network="ethereum"
              token="eth"
              onNetworkChange={() => {}}
              onTokenChange={() => {}}
            />
          </div>
        </Field>
        <Field>
          <Title>Choose algorithm</Title>
          <Description>Add description here about algorithms</Description>
          <div className={fieldInput}>
            <Dropdown
              disabled
              placeholder="Algorithm"
              value={'links'}
              onChange={() => {}}
              options={[{ value: 'links', label: 'Ad Ether / total ether - time' }]}
            />
          </div>
        </Field>
        <Button
          style={{
            width: '100%',
            marginTop: '30px',
            height: '60px',
            borderRadius: '3px',
          }}
        >
          Create my widget!
        </Button>
      </div>
    );
  }
}
