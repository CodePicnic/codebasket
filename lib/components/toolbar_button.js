'use strict';

var React = require('react'),
    ToolBarButton;

ToolBarButton = React.createClass({
  render: function() {
    var className = ('console-container-button tooltip fa icon ' + this.props.className),
        title = this.props.title,
        id = this.props.id,
        onClick = this.props.onClick;

    return (<i className={className} id={id} title={title} onClick={onClick}></i>);
  }
});

module.exports = ToolBarButton;