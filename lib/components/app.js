'use strict';

var React = require('react'),
    SplitPane = require('react-split-pane'),
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
  componentDidMount: function() {
    this.props.codeBasket.view = this.props.codeBasket.view || this;
    this.props.codeBasket.view.sidebar = this.props.codeBasket.view.sidebar || this.refs.sidebar;
    this.props.codeBasket.sidebar = this.props.codeBasket.sidebar || this.refs.sidebar;

    var readyEvent = global.document.createEvent('CustomEvent');
    readyEvent.initCustomEvent('codebasket:ready', true, true, {
      codeBasket: this.props.codeBasket
    });

    global.dispatchEvent(readyEvent);
  },
  toggleSidebar: function() {
    if (this.state.isSidebarVisible) {
      this.hideSidebar();
    }
    else {
      this.showSidebar();
    }
  },
  showSidebar: function() {
    var sidebarParent = this.refs['sidebar-container'].parentElement;

    sidebarParent.classList.add('with-transition');
    sidebarParent.style.width = '200px';

    this.setState({ isSidebarVisible: true });

    setTimeout(function() {
      sidebarParent.classList.remove('with-transition');
    }, 710);
  },
  hideSidebar: function() {
    var sidebarParent = this.refs['sidebar-container'].parentElement;

    sidebarParent.classList.add('with-transition');
    sidebarParent.style.width = '0px';

    this.setState({ isSidebarVisible: false });

    setTimeout(function() {
      sidebarParent.classList.remove('with-transition');
    }, 710);
  },
  toggleFullScreen: function() {
    var resizer = this.refs['main'].querySelector('.Resizer');

    if (resizer) {
      resizer.classList.toggle('hidden');
    }

    if (this.state.isFullScreen) {
      this.showSidebar();
    }
    else {
      this.hideSidebar();
    }

    this.setState({ isFullScreen: !this.state.isFullScreen });
  },
  render: function() {
    var codeBasket = this.props.codeBasket,
        sidebarActions = codeBasket.sidebarActions.map(function(sidebarAction, index) {
          return (
            <ToolBarButton onClick={sidebarAction.action} title={sidebarAction.title} className={sidebarAction.icon + ' sidebar-action-' + sidebarAction.id} key={index} />
          );
        }),
        brand,
        hasUsersList = (codeBasket.users !== undefined),
        registerLink,
        usersList;

    if (codeBasket.brand) {
      brand = (<Brand brand={codeBasket.brand} />);
    }

    if (!codeBasket.currentUser || (codeBasket.currentUser && codeBasket.currentUser.isTemporary)) {
      registerLink = (
        <a href="#" className="md-trigger" data-modal="modal-9">Register now to save your changes</a>
      );
    }

    if (hasUsersList) {
      usersList = <UsersList currentUser={codeBasket.currentUser} users={codeBasket.users} />;
    }

    var size = (this.state.isSidebarVisible ? 200 : 1);

    return (
      <main ref="main" className="console-container">
        <div className="console-container-wrapper">
          <section className="console-wrapper">
            <SplitPane split="vertical" minSize={200} defaultSize={size}>
              <aside className="console-sidebar-container" ref="sidebar-container">
                <nav className="console-sidebar-actions">
                  {sidebarActions}
                </nav>
                <Sidebar ref="sidebar" app={codeBasket} items={codeBasket.sidebarItems} parentView={this} />
              </aside>
              <TabsContainer items={codeBasket.items} app={codeBasket} parentView={this} />
            </SplitPane>
          </section>
          <footer className={'console-footer' + (this.state.isFullScreen ? ' collapsed' : '')}>
            {brand}
            <span className="console-footer-permanent-status">{registerLink}</span>
            {usersList}
            <span className="console-footer-status">{codeBasket.status}</span>
            <progress className={'console-footer-progress' + (this.state.isProgressBarVisible ? ' visible' : '')} max="100"></progress>
          </footer>
        </div>
      </main>
    );
  }
});

module.exports = App;