'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
    Footer;

Footer = React.createClass({
  // getInitialState: function() {},
  // getDefaultProps: function() {},
  componentDidMount: function() {},
  render: function footerRender() {
    var shouldRenderUsersList = this.props.users !== undefined,
        usersList = shouldRenderUsersList ? <UsersList users={this.props.users} /> : undefined;

    return (
      <footer className="codebasket-footer">
        <a href={this.props.brand.link} rel="noopener noreferrer" target="_blank" className="codebasket-brand">
          <img src={this.props.brand.image} />
        </a>
        <span>{this.props.permanentStatus}</span>
        <span>{this.props.status}</span>
        {usersList}
      </footer>
    );
  }
});

module.exports = Footer;