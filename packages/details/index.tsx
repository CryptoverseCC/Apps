import React, { Component, Children, ReactElement } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import classnames from 'classnames';

import { isType } from '@linkexchange/utils';
import { ILink } from '@linkexchange/types/link';
import { mobileOrTablet } from '@linkexchange/utils/userAgent';
import { openLinkexchangeUrl } from '@linkexchange/utils/openLinkexchangeUrl';

import Intercom from '@linkexchange/components/src/Intercom';

import { IWidgetState } from '@linkexchange/ducks/widget';
import { loadTokenDetails } from '@linkechange/token-details-provider/duck';

import Header from './containers/Header';
import DetailsLists from './containers/DetailsLists';
import DetailsAccordion from './containers/DetailsAccordion';

import { fetchLinks } from './duck';

const mapStateToProps = ({ widget }: { widget: IWidgetState }) => ({ widgetSettings: widget });

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadTokenDetails,
  fetchLinks,
}, dispatch);

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type TWidgetDetailsProps = typeof State2Props &
  typeof Dispatch2Props & {
    onAddLink(): void;
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
    const {
      children,
      onAddLink,
      className,
      standaloneMode,
    } = this.props;
    const { mobileOrTablet } = this.state;

    const childrenArray = Children.toArray(children);

    const header = React.cloneElement(
      childrenArray.find(((c: ReactElement<any>) => c.type === Header)) as ReactElement<any>,
      {
        onAddClick: onAddLink,
        openInNewWindowHidden: standaloneMode,
        onOpenInSeparateWindow: this._onOpenInSeparateWindowClick,
      },
    );

    const details = React.cloneElement(
      childrenArray.find((c: ReactElement<any>) => c.type === Lists) as ReactElement<any>,
      { mobileOrTablet },
    );

    return (
      <div className={classnames(style.self, className)}>
        {header}
        <div className={style.details}>
          {details}
        </div>
      </div>
    );
  }

  _onOpenInSeparateWindowClick = () => {
    openLinkexchangeUrl('apps/#/details/', this.props.widgetSettings);
  }
}

const ConnectedDetails = connect(mapStateToProps, mapDispatchToProps)(Details);

export const Lists = ({ mobileOrTablet }) => !mobileOrTablet ? <DetailsLists /> : <DetailsAccordion />;
export { default as Header } from './containers/Header';
export { ConnectedDetails as Details };
