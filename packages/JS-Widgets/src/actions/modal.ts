import { actionCreatorFactory } from 'typescript-fsa';

const acf = actionCreatorFactory('modal');

export const modalActions = {
  open: acf<{ modalName?: string, modalProps?: any }>('OPEN'),
  close: acf('CLOSE'),
};
