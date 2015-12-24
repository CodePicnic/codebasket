'use strict';

var React = require('react'),
    TabsContainer = require('./tabs_container'),
    ToolBarButton = require('./toolbar_button'),
    Brand = require('./brand'),
    Sidebar = require('./sidebar'),
    UsersList = require('./users_list'),
    App;

App = React.createClass({
  getInitialState: function() {
    return this.props.codeBasket.uiOptions;
  },
  toggleSidebar: function() {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  },
  render: function() {
    var codeBasket = this.props.codeBasket,
        sidebarActions = codeBasket.sidebarActions.map(function(sidebarAction, index) {
          return (
            <ToolBarButton onClick={sidebarAction.action} title={sidebarAction.title} className={sidebarAction.icon} key={index} />
          );
        }),
        brand,
        hasUsersList = (codeBasket.users !== undefined),
        registerLink,
        connectedUsersList;

    if (codeBasket.brand) {
      brand = (<Brand brand={codeBasket.brand} />);
    }

    if (!codeBasket.currentUser) {
      registerLink = (
        <a href="#" className="md-trigger" data-modal="modal-9">Register now to save your changes</a>
      );
    }

    if (hasUsersList) {
      connectedUsersList = <UsersList currentUser={codeBasket.currentUser} users={codeBasket.users} />;
    }

    return (
      <main className="console-container">
        <section className="console-wrapper">
          <aside className={'console-sidebar-container' + (this.state.isSidebarVisible ? ' visible' : '')}>
            <nav className="console-sidebar-actions">
              {sidebarActions}
            </nav>
            <Sidebar app={codeBasket} items={codeBasket.sidebarItems} parentView={this} />
          </aside>
          <TabsContainer items={codeBasket.items} app={codeBasket} parentView={this} />
        </section>
        <footer className="console-footer">
          {brand}
          <span className="console-footer-permanent-status">{registerLink}</span>
          {connectedUsersList}
          <span className="console-footer-status"></span>
          <progress className={'console-footer-progress' + (this.state.isProgressBarVisible ? ' visible' : '')} max="100"></progress>
        </footer>
        <section className="console-modal-overlay console-container-add">
          <h2 className="console-modal-title">Select new file type</h2>
          <ul className="console-container-modes-list"></ul>
          <ul className="console-container-libraries-list"></ul>
        </section>
      </main>
    );
  }
});

module.exports = App;