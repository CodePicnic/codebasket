'use strict';

var React = require('react'),
    Brand = require('./brand'),
    UsersList = require('./users_list'),
    Footer;

Footer = React.createClass({
  render: function() {
    var brand = codeBasket.brand ? <Brand brand={codeBasket.brand} width={userDefinedSidebarSize + 1} /> : undefined,
        hasUsersList = (this.props.users !== undefined),
        usersList = (hasUsersList ? <UsersList currentUser={this.props.currentUser} users={this.props.users} /> : undefined);

    return (
      <footer className={'console-footer' + (this.props.isFullScreen ? ' collapsed' : '')}>
        {brand}
        <span className="console-footer-permanent-status" title={this.props.permanentStatus}>{this.props.permanentStatus}</span>
        {usersList}
        <span className="console-footer-status" title={this.props.status}>{this.props.status}</span>
        <progress className={'console-footer-progress' + (this.props.isProgressBarVisible ? ' visible' : '')} max="100"></progress>
      </footer>
    );
  }
});

module.exports = Footer;