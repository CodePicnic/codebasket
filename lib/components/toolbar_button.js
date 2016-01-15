'use strict';

var React = require('react'),
    ToolBarButton;

ToolBarButton = React.createClass({
  render: function() {
    // return (
    //   <a className="console-container-sidebar-button" id="console-sidebar-reload-files" href="#" title="Reload files"><i className="fa fa-refresh"></i></a>
    // );
    var className = ('console-container-button tooltip fa ' + this.props.className),
        title = this.props.title,
        id = this.props.id,
        onClick = this.props.onClick;

    return (<i className={className} id={id} title={title} onClick={onClick}></i>);
  }
});

module.exports = ToolBarButton;