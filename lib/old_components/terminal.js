'use strict';

var React = require('react'),
    ToolBarButton = require('./toolbar_button'),
    MessagePolymorphic = require('./message_polymorphic'),
    Terminal;

Terminal = React.createClass({
  getInitialState: function() {
    return { loaded: false };
  },
  onLoadTerminal: function() {
    if (this.refs.frame.src !== 'about:blank') {
      this.setState({ loaded: true });
      this.refs.frame.contentWindow.focus();
    }
  },
  componentDidMount: function() {
    this.props.item.tabPage = this.props.item.tabPage || this;
  },
  reload: function() {
    this.refs.frame.src = this.refs.frame.src;
    this.setState({ loaded: false });
  },
  render: function() {
    var item = this.props.item,
        activeClass = (item.isActive ? ' active' : ''),
        loadedClass = this.state.loaded ? '' : ' loading',
        src = item.location ? (item.location + '?id=' + item.id + '&console_id=' + item.consoleId) : 'about:blank';

    return (
      <iframe ref="frame" className={'console-tabpage' + activeClass + loadedClass} src={src} onLoad={this.onLoadTerminal}></iframe>
    );
  }
});

module.exports = Terminal;