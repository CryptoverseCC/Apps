import React, { Component, Children, ReactElement } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import classnames from 'classnames';

import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import Intercom from '@linkexchange/components/src/Intercom';

import { IWidgetState } from '@linkexchange/ducks/widget';
import { loadTokenDetails } from '@linkechange/token-details-provider/duck';

import Header from './containers/Header';
import DetailsLists from './containers/DetailsLists';
import DetailsAccordion from './containers/DetailsAccordion';
import { IDefaultBoostLinkWrapperProps } from './components/LinksList';

import { fetchLinks } from './duck';

const mapStateToProps = ({ widget }: { widget: IWidgetState }) => ({
  widgetSettings: widget,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadTokenDetails,
  fetchLinks,
}, dispatch);

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TWidgetDetailsProps = typeof State2Props &
  typeof Dispatch2Props & {
    className?: string;
    standaloneMode?: boolean;
  };

interface IDetailsState {
  mobileOrTablet: boolean;
}

import * as style from './widgetDetails.scss';

class Details extends Component<TWidgetDetailsProps, IDetailsState> {
  constructor(props: TWidgetDetailsProps) {
    super(props);
    this.state = {
      mobileOrTablet: mobileOrTablet(),
    };
  }

  componentDidMount() {
    this.props.fetchLinks();
    this.props.loadTokenDetails();
  }

  render() {
    const { children, className, standaloneMode } = this.props;
    const { mobileOrTablet } = this.state;

    const childrenArray = Children.toArray(children);

    const headerElement = childrenArray.find(
      (c: ReactElement<any>) => c.type === Header,
    );
    const header = headerElement
      ? React.cloneElement(headerElement as ReactElement<any>, {
          openInNewWindowHidden: standaloneMode,
          onOpenInSeparateWindow: this._onOpenInSeparateWindowClick,
        })
      : null;

    const listsElement = childrenArray.find(
      (c: ReactElement<any>) => c.type === Lists,
    );
    const lists = listsElement
      ? React.cloneElement(listsElement as ReactElement<any>, {
          mobileOrTablet,
        })
      : null;

    return (
      <div className={classnames(style.self, className)}>
        {header}
        <div className={style.details}>{lists}</div>
        <Intercom
          settings={{ app_id: 'xdam3he4', ...this.props.widgetSettings }}
        />
      </div>
    );
  }

  _onOpenInSeparateWindowClick = () => {
    openLinkexchangeUrl('apps/#/details/', this.props.widgetSettings);
  }
}

const ConnectedDetails = connect(mapStateToProps, mapDispatchToProps)(Details);

interface IListsProps {
  mobileOrTablet?: boolean;
  boostLinkComponent?: React.ComponentType<IDefaultBoostLinkWrapperProps>;
}

export const Lists = ({ mobileOrTablet, ...restProps }: IListsProps) =>
  !mobileOrTablet ? <DetailsLists {...restProps} /> : <DetailsAccordion />;

export { default as Header } from './containers/Header';
export { ConnectedDetails as Details };
export { IDefaultBoostLinkWrapperProps } from './components/LinksList';
