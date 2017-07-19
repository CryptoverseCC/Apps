import { h } from 'preact';

import Paper from '../../../components/Paper';
import AddLinkForm from '../../../components/AddLink';

import * as style from './addLink.scss';

interface IAddLinkProps {
  context: string;
  onSuccess(): void;
  onError(): void;
}

const AddLink = ({ context, onSuccess, onError }: IAddLinkProps) => (
  <div class={style.self}>
    <Paper class={style.paperContainer}>
      <AddLinkForm context={context} onSuccess={onSuccess} onError={onError} />
    </Paper>
  </div>
);

export default AddLink;
