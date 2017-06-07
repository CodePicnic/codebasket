'use strict';

var React = require('react'),
    filter = require('lodash/collection/filter'),
    xssFilters = require('xss-filters'),
    Browser;

Browser = React.createClass({
  getInitialState: function() {
    return {
      locationText: xssFilters.uriInUnQuotedAttr(this.props.item.location),
      location: xssFilters.uriInUnQuotedAttr(this.props.item.location),
      loaded: false,
      logs: []
    };
  },
  componentDidMount: function() {
    this.props.item.tabPage = this.props.item.tabPage || this;
    this.props.item.reload = this.props.item.tabPage.reload;
    this.refs.frame.src = xssFilters.uriInUnQuotedAttr(this.state.location);
  },
  componentDidUpdate: function() {
    if (this.refs.frame.src.replace(/\/$/, '') !== this.state.location.replace(/\/$/, '')) {
      this.refs.frame.src = xssFilters.uriInUnQuotedAttr(this.state.location);
    }
  },
  onKeyUpLocation: function(event) {
    if (event.keyCode === 13) {
      if (this.refs.frame.src !== this.state.locationText) {
        this.setState({ location: xssFilters.uriInUnQuotedAttr(this.state.locationText), loaded: false });
      }
    }
  },
  onChangeLocation: function(event) {
    this.setState({ locationText: xssFilters.uriInUnQuotedAttr(event.target.value) });
  },
  onLoadBrowser: function() {
    this.setState({ loaded: true });
  },
  reloadBrowser: function() {
    this.refs.frame.src = xssFilters.uriInUnQuotedAttr(this.state.location);
    this.setState({ loaded: false });
  },
  reload: function() {
    this.reloadBrowser();
  },
  render: function browserRender() {
    var item = this.props.item,
        locationText = this.state.locationText,
        loadedClass = this.state.loaded ? '' : ' loading';

    return (
      <div className="codebasket-browser">
        <nav className="codebasket-browser-navigation">
          <button type="button" name="reload" onClick={this.reloadBrowser}><i className="icon icon-refresh"></i></button>
          <input type="url" name="url" onChange={this.onChangeLocation} onKeyUp={this.onKeyUpLocation} type="url" value={locationText} />
          <a href={locationText} target="_blank" className="icon icon-external"></a>
        </nav>
        <iframe ref="frame" frameBorder="0" allowFullScreen onLoad={this.onLoadBrowser}></iframe>
      </div>
    );
  }
});

module.exports = Browser;