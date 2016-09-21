'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
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
  componentDidMount: function() {
    this.props.item.tabPage = this.props.item.tabPage || this;
    this.refs.frame.src = this.state.location;
  },
  componentDidUpdate: function() {
    if (this.refs.frame.src.replace(/\/$/, '') !== this.state.location.replace(/\/$/, '')) {
      this.refs.frame.src = this.state.location;
    }
  },
  reloadBrowser: function() {
    this.refs.frame.src = this.state.location;
    this.setState({ loaded: false });
  },
  render: function browserRender() {
    return (
      <div className="codebasket-browser">
        <nav className="codebasket-browser-navigation">
          <input type="url" name="url" value="" />
          <button type="button" name="reload"><i className="fa fa-refresh"></i></button>
        </nav>
        <iframe ref="frame" src="https://www.youtube.com/embed/H6wj2weYizI" frameBorder="0" allowFullScreen></iframe>
      </div>
    );
  }
});

module.exports = Browser;