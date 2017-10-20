import React, { Component } from 'react';

interface IIntercomComponentProps {
  settings: object;
}

export default class IntercomComponent extends Component<IIntercomComponentProps, {}> {
  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    if (window.Intercom) {
      window.Intercom('reattach_activator');
      window.Intercom('update', this.props.settings);
    } else {
      const intercom: any = (...args) => intercom.c(args);
      intercom.q = [];
      intercom.c = (args) => intercom.q.push(args);

      window.Intercom = intercom;

      function load() {
        const head = document.querySelector('head');
        const script = document.createElement('script');

        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://widget.intercom.io/widget/xdam3he4';

        head!.appendChild(script);
      }

      if (document.readyState === 'complete') {
        load();
      } else {
        window.addEventListener('load', load);
      }

      window.Intercom('boot', this.props.settings);
    }
  }

  componentWillUnmount() {
    if (process.env.NODE_ENV === 'development') {
      return;
    }

    window.Intercom('shutdown');
  }

  render() {
    return null;
  }
}
