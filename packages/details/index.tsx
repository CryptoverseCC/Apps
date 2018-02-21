import React, { Component, Children, ReactElement } from 'react';
import classnames from 'classnames';
import { Provider } from 'mobx-react';

import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import { WidgetSettings, withWidgetSettings } from '@linkexchange/widget-settings';

import Header from './containers/Header';
import DetailsLists from './containers/DetailsLists';
import DetailsAccordion from './containers/DetailsAccordion';
import { IDefaultBoostLinkWrapperProps } from './components/LinksList';

import LinksStore from './linksStore';

interface IProps {
  widgetSettings: WidgetSettings;
  className?: string;
  standaloneMode?: boolean;
}

interface IState {
  mobileOrTablet: boolean;
}

import * as style from './widgetDetails.scss';

class Details extends Component<IProps, IState> {
  linksStore: LinksStore;

  constructor(props: IProps) {
    super(props);
    this.linksStore = new LinksStore(props.widgetSettings);
    this.state = {
      mobileOrTablet: mobileOrTablet(),
    };
  }

  componentDidMount() {
    this.linksStore.fetchLinks();
  }

  render() {
    const { children, className, standaloneMode } = this.props;
    const { mobileOrTablet } = this.state;

    const childrenArray = Children.toArray(children);

    const headerElement = childrenArray.find((c: ReactElement<any>) => c.type === Header);
    const header = headerElement
      ? React.cloneElement(headerElement as ReactElement<any>, {
          openInNewWindowHidden: standaloneMode,
          onOpenInSeparateWindow: this._onOpenInSeparateWindowClick,
        })
      : null;

    const listsElement = childrenArray.find((c: ReactElement<any>) => c.type === Lists);
    const lists = listsElement
      ? React.cloneElement(listsElement as ReactElement<any>, {
          mobileOrTablet,
        })
      : null;
    const restChildren = childrenArray.filter((c) => !(c === headerElement || c === listsElement));

    return (
      <Provider links={this.linksStore}>
        <div className={classnames(style.self, className)}>
          {header}
          <div className={style.details}>{lists}</div>
          {restChildren}
        </div>
      </Provider>
    );
  }

  _onOpenInSeparateWindowClick = () => {
    openLinkexchangeUrl('/direct/details/', this.props.widgetSettings);
  };
}

const DetailsWithWidgetSettings = withWidgetSettings(Details);

interface IListsProps {
  mobileOrTablet?: boolean;
  boostLinkComponent?: React.ComponentType<IDefaultBoostLinkWrapperProps>;
}

export const Lists = ({ mobileOrTablet, ...restProps }: IListsProps) =>
  !mobileOrTablet ? <DetailsLists {...restProps} /> : <DetailsAccordion />;

export { default as Header } from './containers/Header';
export { DetailsWithWidgetSettings as Details };
export { IDefaultBoostLinkWrapperProps } from './components/LinksList';
