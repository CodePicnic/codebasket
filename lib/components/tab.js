'use strict';

var React = require('react'),
    Tab;

Tab = React.createClass({
  render: function() {
    var item = this.props.item;

    return (
      <a href="#" className="{'console-tab' + item.isActive ? ' active' : ''}">
        <span className="console-tab-text" title={item.title}>{item.title}</span>
        <small className="console-tab-remove" title="Close">✖</small>
      </a>
    );
  }
});

module.exports = Tab;