import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState, IWidgetState } from '../../reducers';
import { modalActions } from '../../actions/modal';

import Modal from '../../components/Modal';
import Button from '../../components/Button';
import TextWithLabel from '../../components/TextWithLabel';

import { openUserfeedsUrl } from '../../utils/openUserfeedsUrl';

const mapStateToProps = ({ widget }: IRootState) => ({
  ...widget,
});

const mapDispatchToProps = (dispatch, { linkId }: { linkId: string; }) => ({
  onClose: () => dispatch((_, getState) => {
    const { widget } = getState();
    openUserfeedsUrl('apps/links/#/status/', { linkId, ...widget });
    dispatch(modalActions.close());
  }),
});

const State2Props = returntypeof(mapStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type IThankYouProps = typeof State2Props & typeof Dispatch2Props & { linkId: string; };

const ThankYou = (props: IThankYouProps) => {
  const { onClose, publisherNote } = props;

  return (
    <div>
      <TextWithLabel label="Publisher note" text={publisherNote} />
      <Button onClick={onClose}>Link Status</Button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ThankYou);
