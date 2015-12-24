'use strict';

var React = require('react'),
    ToolBarButton = require('./toolbar_button'),
    Browser;

Browser = React.createClass({
  getInitialState: function() {
    return { location: this.props.item.location }
  },
  onKeyUpLocation: function(event) {
    if (event.keyCode === 13) {
      this.setState({ location: event.target.value });
    }
  },
  onChangeLocation: function(event) {
    this.setState({ location: event.target.value });
  },
  onLoadBrowser: function() {
    // console.log(arguments);
  },
  componentDidMount: function() {
    this.refs.browser.src = this.state.location;
  },
  componentDidUpdate: function() {
    if (this.refs.browser.src !== this.state.location) {
      this.refs.browser.src = this.state.location;
    }
  },
  reloadBrowser: function() {
    this.refs.browser.src = this.state.location;
  },
  render: function() {
    var item = this.props.item,
        location = this.state.location;

    return (
      <div className={'console-tabpage console-browser' + (item.isActive ? ' active' : '')}>
        <div className="console-browser-location-bar-container">
          <input ref="location" className="console-browser-location-bar" onChange={this.onChangeLocation} onKeyUp={this.onKeyUpLocation} type="url" value={location} />
          <nav className="console-browser-buttons">
            <ToolBarButton onClick={this.reloadBrowser} title="Reload" className="fa-repeat" />
          </nav>
        </div>
        <iframe ref="browser" className="console-browser" onLoad={this.onLoadBrowser}></iframe>
        <ToolBarButton onClick={this.clearLog} title="Clear" className="fa-ban" />
        <ul className="console-container-log hidden"></ul>
      </div>
    );
  }
});

module.exports = Browser;