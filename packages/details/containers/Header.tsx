import React from 'react';
import { connect } from 'react-redux';

import { IWidgetState } from '@linkexchange/ducks/widget';

import WidgetSummary from '../components/WidgetSummary';

const mapStateToProps = ({ widget }: { widget: IWidgetState}) => ({ widgetSettings: widget });

export default connect(mapStateToProps)(WidgetSummary);
