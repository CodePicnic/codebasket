'use strict';

var React = require('react'),
    UsersList;

UsersList = React.createClass({
  getInitialState: function() {
    return { isOpened: false };
  },
  toggleList: function() {
    this.setState({ isOpened: !this.state.isOpened });
  },
  renderUser: function(user, index) {
    return (
      <li key={index}>
        <span className='codebasket-color-dot' style={{backgroundColor: user.color}}></span>
        {user.name}
      </li>
    );
  },
  render: function usersListRender() {
    return (
      <nav className='codebasket-dropdown'>
        <span onClick={this.toggleList}>{this.props.users.length} connected users</span>
        <ul className={'codebasket-dropdown-list' + (this.state.isOpened ? ' opened' : '') }>
          {this.props.users.map(this.renderUser)}
        </ul>
      </nav>
    );
  }
});

module.exports = UsersList;