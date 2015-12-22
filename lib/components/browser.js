'use strict';

var React = require('react'),
    ToolBarButton = require('./toolbar_button'),
    Browser;

Browser = React.createClass({
  render: function() {
    var item = this.props.item;

    return (
      <div className={'console-tabpage console-browser' + (item.isActive ? ' active' : '')}>
        <div className="console-browser-location-bar-container">
          <input className="console-browser-location-bar" type="url" />
          <nav className="console-browser-location-buttons-container">
            <a href="#" className="console-container-button console-container-reload">
              <i className="fa fa-repeat"></i>
            </a>
          </nav>
        </div>
        <iframe className="console-browser" src={item.location}></iframe>
        <ToolBarButton onClick={this.clearLog} title="Clear" className="fa-ban" />
        <ul className="console-container-log"></ul>
      </div>
    );
  }
});

module.exports = Browser;