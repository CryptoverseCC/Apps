import { h } from 'preact';
import { connect } from 'preact-redux';
import { returntypeof } from 'react-redux-typescript';

import { IRootState } from './reducers';
import { modalActions } from './actions/modal';

import AddLink from './components/addLink';

const mapsStateToProps = ({ widget }: IRootState) => ({
  context: widget.context,
});

const mapDispatchToProps = (dispatch) => ({
  onSuccess: (linkId: string) => dispatch(modalActions.open({
    modalName: 'thankYou',
    modalProps: { linkId },
  })),
  onError: () => dispatch(modalActions.close()),
});

const State2Props = returntypeof(mapsStateToProps);
const Dispatch2Props = returntypeof(mapDispatchToProps);

type IAddLinkModal = typeof State2Props & typeof Dispatch2Props;

const AddLinkModal = ({ context, onSuccess, onError }: IAddLinkModal) => {
  return (
    <AddLink context={context} onSuccess={onSuccess} onError={onError} />
  );
};

export default connect(mapsStateToProps, mapDispatchToProps)(AddLinkModal);
