'use strict';

var React = require('react'),
    UsersList;

UsersList = React.createClass({
  render: function() {
    var currentUser = this.props.currentUser,
        usersList;

    usersList = this.props.users.map(function(user) {
      return (
        <li className="console-footer-connected-user" data-id={user.id}>
          <span className="user-color" style={'background-color: ' + user.color}></span>
          {user.name}
        </li>
      );
    });

    return (
      <div className="console-footer-connected-users-wrapper">
        <span>Connected users:</span>
        <div className="console-footer-connected-users" data-id={currentUser.id}>
          <span className="user-color" style={'background-color: ' + currentUser.color}></span>
          {currentUser.name}
        </div>
        <ul className="console-footer-connected-users-list">{usersList}</ul>
      </div>
    );
  }
});

module.exports = UsersList;