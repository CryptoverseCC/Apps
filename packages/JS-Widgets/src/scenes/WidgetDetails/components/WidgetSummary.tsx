import { h } from 'preact';
import * as classnames from 'classnames';

import Icon from '../../../components/Icon';
import Button from '../../../components/Button';
import EthereumLogo from '../../../components/EthereumLogo';
import TextWithLabel from '../../../components/TextWithLabel';

import * as style from './widgetSummary.scss';

interface IWidgetSummaryProps {
  title: string;
  description: string;
  impression: string;
  publisherNote: string;
  onAddClick(): void;
  onOpenInSeparateWindow(): void;
}

const WidgetSummary = ({ title, description, publisherNote, impression, onAddClick,
  onOpenInSeparateWindow }: IWidgetSummaryProps) => (
  <div class={style.self}>
    <div class="row">
      <EthereumLogo class={style.logo}/>
      <div>
        <div class="row">
          <h2>{title}</h2>
          <button onClick={onOpenInSeparateWindow} class={style.openInNewWindow}>
            <Icon name="external-link"/> New window
          </button>
        </div>
        <p>{description}</p>
      </div>
      <Button
        style={{ marginLeft: 'auto', padding: '0.5em' }}
        onClick={onAddClick}
      >
        ⊕ Add New Link
      </Button>
    </div>
    <div class={classnames(style.boxes, 'row')}>
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="eye" /> Impressions</span>}
        text={impression}
      />
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="link-intact" /> Source Domain</span>}
        text="http://userfeeds.io(HC)"
      />
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="envelope-open" /> Contact</span>}
        text={publisherNote}
      />
      <TextWithLabel
        class={style.box}
        label={<span><Icon name="calendar" /> Valid till</span>}
        text="05/06/2018(HC)"
      />
    </div>
  </div>
);

export default WidgetSummary;
