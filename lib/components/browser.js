'use strict';

var React = require('react'),
    ToolBarButton = require('./toolbar_button'),
    MessagePolymorphic = require('./message_polymorphic'),
    Browser;

Browser = React.createClass({
  getInitialState: function() {
    return {
      locationText: this.props.item.location,
      location: this.props.item.location,
      loaded: false,
      logs: []
    };
  },
  onKeyUpLocation: function(event) {
    if (event.keyCode === 13) {
      if (this.refs.browser.src !== this.state.locationText) {
        this.setState({ location: this.state.locationText, loaded: false });
      }
    }
  },
  onChangeLocation: function(event) {
    this.setState({ locationText: event.target.value });
  },
  onLoadBrowser: function() {
    this.setState({ loaded: true });
  },
  componentDidMount: function() {
    this.props.item.tabPage = this.props.item.tabPage || this;
    this.refs.browser.src = this.state.location;
  },
  componentDidUpdate: function() {
    if (this.refs.browser.src.replace(/\/$/, '') !== this.state.location.replace(/\/$/, '')) {
      this.refs.browser.src = this.state.location;
    }
  },
  reloadBrowser: function() {
    this.refs.browser.src = this.state.location;
    this.setState({ loaded: false });
  },
  renderLog: function(content, index) {
    return <MessagePolymorphic key={index} content={content} />;
  },
  clearLog: function() {
    this.state.logs.length = 0;
    this.setState({ logs: this.state.logs });
  },
  render: function() {
    var item = this.props.item,
        locationText = this.state.locationText,
        loadedClass = this.state.loaded ? '' : ' loading',
        hiddenClass = (this.state.logs.length === 0) ? ' hidden' : '';

    return (
      <div className={'console-tabpage console-browser' + (item.isActive ? ' active' : '')}>
        <div className="console-browser-location-bar-container">
          <input ref="location" className="console-browser-location-bar" onChange={this.onChangeLocation} onKeyUp={this.onKeyUpLocation} type="url" value={locationText} />
          <nav className="console-browser-buttons">
            <ToolBarButton onClick={this.reloadBrowser} title="Reload" className="fa-repeat" />
          </nav>
        </div>
        <iframe ref="browser" className={'console-browser' + loadedClass} onLoad={this.onLoadBrowser}></iframe>
        <ToolBarButton onClick={this.clearLog} title="Clear" className="fa-ban" />
        <ul className={'console-browser-logs' + hiddenClass}>{this.state.logs.map(this.renderLog)}</ul>
      </div>
    );
  }
});

module.exports = Browser;