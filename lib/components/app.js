'use strict';

var React = require('react'),
    TabsContainer = require('./tabs_container'),
    ToolBarButton = require('./toolbar_button'),
    Brand = require('./brand'),
    UsersList = require('./users_list'),
    App;

App = React.createClass({
  getInitialState: function() {
    return { isSidebarVisible: true, isProgressBarVisible: false };
  },
  toggleSidebar: function() {
    this.setState({ isSidebarVisible: !this.state.isSidebarVisible });
  },
  render: function() {
    var codeBasket = this.props.codeBasket,
        brand = codeBasket.brand || { href: 'http://codepicnic.com/?utm_medium=embed&utm_source=codepicnic.com&utm_campaign=console', image: 'https://s3.amazonaws.com/production.pym.herokuapp/brands/logos/000/000/006/small/codepicnic_logo.png?1424137485' },
        isCollaborative = (codeBasket.currentMode === 'collaborative' || codeBasket.currentMode === 'streaming'),
        registerLink,
        connectedUsersList;

    if (codeBasket.isUserRegistered) {
      registerLink = (
        <a href="#" className="md-trigger" data-modal="modal-9">Register now to save your changes</a>
      );
    }

    if (isCollaborative) {
      connectedUsersList = <UsersList currentUser={codeBasket.currentUser} users={codeBasket.connectedUsers} />;
    }

    return (
      <main className="console-container with-location-bar with-sidebar with-footer">
        <section className="console-wrapper">
          <aside className={'console-sidebar-container' + (this.state.isSidebarVisible ? ' visible' : '')}>
            <nav className="console-sidebar-actions">
              <ToolBarButton onClick={this.addFile} title="Add file" className="with-plus fa-file" />
              <ToolBarButton onClick={this.addFolder} title="Add folder" className="with-plus fa-folder" />
              <ToolBarButton onClick={this.reload} title="Reload files" className="fa-refresh" />
            </nav>
            <dl className="console-sidebar sidebar-empty"></dl>
          </aside>
          <TabsContainer items={codeBasket.items} app={codeBasket} parentView={this} />
        </section>
        <footer className="console-footer">
          <Brand brand={brand} />
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