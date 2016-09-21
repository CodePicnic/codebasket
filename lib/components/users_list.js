'use strict';

var React = require('react'),
    UsersList;

UsersList = React.createClass({
  // getInitialState: function() {},
  // getDefaultProps: function() {},
  componentDidMount: function() {},
  renderUser: function(user, index) {
    return <li key={index}>{user.name}</li>;
  },
  render: function usersListRender() {
    return (
      <nav className="codebasket-dropdown">
        <span>{this.props.users.length} connected users</span>
        <ul className="codebasket-dropdown-list">
          {this.props.users.map(this.renderUser)}
        </ul>
      </nav>
    );
  }
});

module.exports = UsersList;