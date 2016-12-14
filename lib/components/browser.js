'use strict';

var React = require('react'),
    filter = require('lodash/collection/filter'),
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
  componentDidMount: function() {
    this.props.item.tabPage = this.props.item.tabPage || this;
    this.refs.frame.src = this.state.location;
  },
  componentDidUpdate: function() {
    if (this.refs.frame.src.replace(/\/$/, '') !== this.state.location.replace(/\/$/, '')) {
      this.refs.frame.src = this.state.location;
    }
  },
  onKeyUpLocation: function(event) {
    if (event.keyCode === 13) {
      if (this.refs.frame.src !== this.state.locationText) {
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
  reloadBrowser: function() {
    this.refs.frame.src = this.state.location;
    this.setState({ loaded: false });
  },
  render: function browserRender() {
    var item = this.props.item,
        locationText = this.state.locationText,
        loadedClass = this.state.loaded ? '' : ' loading';

    return (
      <div className="codebasket-browser">
        <nav className="codebasket-browser-navigation">
          <input type="url" name="url" value="" onChange={this.onChangeLocation} onKeyUp={this.onKeyUpLocation} type="url" value={locationText} />
          <button type="button" name="reload" onClick={this.reloadBrowser}><i className="icon icon-refresh"></i></button>
        </nav>
        <iframe ref="frame" frameBorder="0" allowFullScreen onLoad={this.onLoadBrowser}></iframe>
      </div>
    );
  }
});

module.exports = Browser;