import React from 'react';
import { connect } from 'react-redux';

import { IWidgetState } from '@linkexchange/ducks/widget';

const mapStateToProps = ({ widget }: { widget: IWidgetState }) => ({ widgetSettings: widget });

const Dashboard = () => (
  <h4>Dashboard</h4>
);

export default connect(mapStateToProps)(Dashboard);
