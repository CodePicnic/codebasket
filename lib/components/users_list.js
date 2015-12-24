'use strict';

var React = require('react'),
    UsersList;

UsersList = React.createClass({
  getInitialState: function() {
    return { isUsersListVisible: false }
  },
  toggleUsersList: function() {
    this.setState({ isUsersListVisible: !this.state.isUsersListVisible });
  },
  render: function() {
    var currentUser = this.props.currentUser || { name: 'Unregistered', color: '#dadada' },
        usersList;

    usersList = this.props.users.map(function(user, index) {
      return (
        <li className="console-footer-user" key={index}>
          <span className="user-color" style={{ backgroundColor: user.color }}></span>
          {user.name}
        </li>
      );
    });

    return (
      <div className="console-footer-users-wrapper">
        <span className="console-footer-users-label">Connected users:</span>
        <div className="console-footer-user" onClick={this.toggleUsersList}>
          <span className="user-color" style={{ backgroundColor: currentUser.color }}></span>
          {currentUser.name}
        </div>
        <ul className={'console-footer-users-list' + (this.state.isUsersListVisible ? ' visible' : '')}>{usersList}</ul>
      </div>
    );
  }
});

module.exports = UsersList;