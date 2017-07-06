import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState, IWidgetState } from './reducers';
import { modalActions } from './actions/modal';

import Modal from './components/modal';
import Button from './components/button';
import TextWithLabel from './components/textWithLabel';

import { openUserfeedsUrl } from './utils/openUserfeedsUrl';

const mapStateToProps = ({ widget }: IRootState) => ({
  ...widget,
});

const mapDispatchToProps = (dispatch) => ({
  onClose: (widgetState: IWidgetState) => {
    openUserfeedsUrl('apps/links/#/status/', widgetState);
    dispatch(modalActions.close());
  },
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type IThankYouModalProps = typeof State2Props & typeof Dispatch2Props & { linkId: string; };

const ThankYouModal = (props: IThankYouModalProps) => {
  const { onClose, ...widgetProps } = props;

  return (
    <div>
      <TextWithLabel label="Publisher note" text={widgetProps.publisherNote} />
      <Button onClick={() => onClose(widgetProps)}>Link Status</Button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ThankYouModal);
