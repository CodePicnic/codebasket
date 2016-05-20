'use strict';

var React = require('react'),
    map = require('lodash/collection/map'),
    filter = require('lodash/collection/filter'),
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
    this.tabsContainer = this.refs.tabsContainer;

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
  hideOptionsList: function(event) {
    if (this.refs.tabsContainer && this.refs.tabsContainer.isMounted() && !event.target.classList.contains('icon-cog')) {
      this.refs.tabsContainer.setState({ isOptionsListVisible: false });
    }
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
  onChangeSidebarSize: function(size) {
    var sidebarSizeChangeEvent = global.document.createEvent('CustomEvent');
    sidebarSizeChangeEvent.initCustomEvent('codebasket:sidebarsizechange', true, true, {
      codeBasket: this.props.app,
      size: size
    });

    global.dispatchEvent(sidebarSizeChangeEvent);
  },
  renderSidebarAction: function renderSidebarAction(sidebarAction, index) {
    return (
      <ToolBarButton onClick={sidebarAction.action} title={sidebarAction.title} className={sidebarAction.icon + ' sidebar-action-' + (sidebarAction.id || index)} key={index} />
    );
  },
  renderTabsContainer: function renderTabsContainer() {
    var codeBasket = this.props.codeBasket,
        itemsInTopPane = filter(codeBasket.items, function(item) {
          return item.pane === undefined || item.pane === 'top';
        }),
        itemsInBottomPane = filter(codeBasket.items, function(item) { return item.pane === 'bottom'; });

    if (itemsInBottomPane.length === 0) {
      return <TabsContainer ref="tabsContainer" items={itemsInTopPane} app={codeBasket} parentView={this} />;
    }
    else {
      return (
        <SplitPane split="horizontal" minSize={200} defaultSize={200}>
          <TabsContainer ref="tabsContainer" items={itemsInTopPane} app={codeBasket} parentView={this} />
          <TabsContainer simple={true} items={itemsInBottomPane} app={codeBasket} parentView={this} />
        </SplitPane>
      );
    }
  },
  render: function() {
    var codeBasket = this.props.codeBasket,
        userDefinedSidebarSize = (this.state.sidebarSize === undefined) ? 200 : this.state.sidebarSize,
        sidebarSize = (this.state.isSidebarVisible ? userDefinedSidebarSize : 0.1),
        sidebarActions = map(codeBasket.sidebarActions, this.renderSidebarAction),
        brand = codeBasket.brand ? <Brand brand={codeBasket.brand} width={userDefinedSidebarSize + 1} /> : undefined,
        hasUsersList = (codeBasket.users !== undefined),
        usersList = (hasUsersList ? <UsersList currentUser={codeBasket.currentUser} users={codeBasket.users} /> : undefined),
        permanentStatus = codeBasket.permanentStatus || '';

    return (
      <main ref="main" className="console-container" onClick={this.hideOptionsList}>
        <div className="console-container-wrapper">
          <section className="console-wrapper">
            <SplitPane split="vertical" minSize={200} defaultSize={sidebarSize} onChange={this.onChangeSidebarSize}>
              <aside className="console-sidebar-container" ref="sidebar-container">
                <nav className="console-sidebar-actions">
                  {sidebarActions}
                </nav>
                <Sidebar ref="sidebar" app={codeBasket} items={codeBasket.sidebarItems} parentView={this} />
              </aside>
              {this.renderTabsContainer()}
            </SplitPane>
          </section>
          <footer className={'console-footer' + (this.state.isFullScreen ? ' collapsed' : '')}>
            {brand}
            <span className="console-footer-permanent-status">{permanentStatus}</span>
            {usersList}
            <span className="console-footer-status" title={codeBasket.status}>{codeBasket.status}</span>
            <progress className={'console-footer-progress' + (this.state.isProgressBarVisible ? ' visible' : '')} max="100"></progress>
          </footer>
        </div>
      </main>
    );
  }
});

module.exports = App;